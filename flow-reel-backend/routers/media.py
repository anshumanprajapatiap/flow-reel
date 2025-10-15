from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlmodel import Session, select
import urllib.parse
from typing import List, Optional
import os
import uuid
import time
import re
import shutil
import json

from database import get_session
from models import Media
from schemas import MediaRead

from directory_util import get_user_upload_dir, get_user_dir, get_project_path

router = APIRouter(prefix="/media", tags=["Media"])


# ----------------------------------------------------------
# 2️⃣ GET: List all media (optionally filtered by project/user)
# ----------------------------------------------------------
@router.get("/", response_model=List[MediaRead])
def list_media(
    user_id: Optional[str] = None,
    project_id: Optional[str] = None,
    session: Session = Depends(get_session),
):
    """List all uploaded media files"""
    print(f"📥 Fetch request - user_id: {user_id}, project_id: {project_id}")

    query = select(Media)
    if user_id:
        query = query.where(Media.user_id == user_id)
    if project_id:
        query = query.where(Media.project_id == project_id)

    result = session.exec(query).all()
    print(f"✅ Returning {len(result)} media files")

    return result



# ----------------------------------------------------------
# 3️⃣ GET: Serve media file like user_id/audio_123.mp4
# ----------------------------------------------------------
@router.get("/")
def get_media_by_path(
    user_id: str = Query(..., description="User ID who owns the file"),
    path: str = Query(..., description="Full file path from database"),
):
    """
    Fetch a media file given user_id and stored DB path.
    Example:
      user_id=anshuman
      path=/app/projects/anshuman/user_stocks/audio_1759848121_xxx.mp4
    """

    # Decode URL-encoded path
    decoded_path = urllib.parse.unquote(path)
    print(f"🪶 Decoded path: {decoded_path}")

    # If absolute path exists → serve directly
    if os.path.isabs(decoded_path) and os.path.exists(decoded_path):
        print(f"📤 Serving absolute path → {decoded_path}")
        return FileResponse(decoded_path)

    # Otherwise, try relative path reconstruction
    filename = os.path.basename(decoded_path)
    possible_path = os.path.join(BASE_DIR, user_id, "user_stocks", filename)

    print(f"🔍 Checking relative path: {possible_path}")

    if not os.path.exists(possible_path):
        print(f"❌ File not found for user {user_id}: {possible_path}")
        raise HTTPException(status_code=404, detail="File not found")

    print(f"📤 Serving file for user '{user_id}' → {possible_path}")
    return FileResponse(possible_path)


# ----------------------------------------------------------
# 3️⃣ POST: Upload any media file (audio/video/photo)
# ----------------------------------------------------------
@router.post("/", response_model=MediaRead)
async def upload_media(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    type: str = Form(...),  # "audio", "video", or "image"
    project_id: Optional[str] = Form(None),
    session: Session = Depends(get_session),
):
    """Upload file into user_stocks/<user_id>/"""
    # Validate type
    if type not in {"audio", "video", "image"}:
        raise HTTPException(status_code=400, detail="Invalid media type")

    # Ensure user directory exists
    user_dir = get_user_upload_dir(user_id)

    # Generate unique filename
    ext = os.path.splitext(file.filename)[-1]
    timestamp = int(time.time())
    safe_name = re.sub(r"[^A-Za-z0-9_.-]", "_", file.filename)
    unique_name = f"{type}_{timestamp}_{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(user_dir, unique_name)

    # Save file
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Save metadata in DB
    new_media = Media(
        name=file.filename,
        type=type,
        user_id=user_id,
        project_id=project_id,
        path=file_path,
        created_at=timestamp,
    )
    session.add(new_media)
    session.commit()
    session.refresh(new_media)
    print(f"✅ DB entry created: {new_media.id}")

    # ✅ Update Project Metadata JSON
    if project_id:
        project_path = get_project_path(user_id, project_id)
        print(f"🧩 Project path → {project_path}")

        if not os.path.exists(project_path):
            raise HTTPException(status_code=400, detail="Project does not exist")

        try:
            # Load existing project JSON
            with open(project_path, "r") as f:
                project_data = json.load(f)
                print(f"📄 Loaded project data: keys={list(project_data.keys())}")

            # Add new media entry
            project_data.setdefault("stocks", {})
            project_data["stocks"][str(new_media.id)] = {
                "name": file.filename,
                "path": file_path,
                "media_id": str(new_media.id),
                "created_at": timestamp,
            }

            # Save back
            with open(project_path, "w") as f:
                json.dump(project_data, f, indent=2)
            print(f"✅ Updated stocks in {project_id}.json")

        except Exception as e:
            print(f"⚠️ Failed to update project JSON: {e}")
            raise HTTPException(status_code=500, detail=f"Project update failed: {e}")

    return new_media


# ----------------------------------------------------------
# 4️⃣ DELETE: Delete a single media file
# ----------------------------------------------------------
@router.delete("/{media_id}")
def delete_media(media_id: int, session: Session = Depends(get_session)):
    """Delete media from disk and DB"""
    media = session.get(Media, media_id)
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")

    print(f"🧾 Deleting media: {media_id} (type={media.type}) for user={media.user_id}")
    
    # Delete file
    if os.path.exists(media.path):
        os.remove(media.path)
        print(f"🗑️ Deleted file: {media.path}")
    else:
        print(f"⚠️ File not found on disk: {media.path}")

    # --- 2️⃣ Remove from Project JSON (if exists) ---
    if media.project_id:
        try:
            user_dir = get_user_dir(media.user_id)
            project_file = os.path.join(user_dir, f"{media.project_id}.json")

            if os.path.exists(project_file):
                with open(project_file, "r") as f:
                    project_data = json.load(f)
            
            
                print(f"Projecr Data: {project_data}")
            
                # Determine section
                # section = (
                #     "audios" if media.type == "audio" else
                #     "videos" if media.type == "video" else
                #     "stocks"
                # )
                
                section = "stocks"

                # Remove if present
                if "stocks" in project_data and str(media.id) in project_data[section]:
                    del project_data[section][str(media.id)]
                    print(f"🧹 Removed media {media.id} from project {section}")

                    # Save updated file
                    with open(project_file, "w") as f:
                        json.dump(project_data, f, indent=2)
                else:
                    print(f"⚠️ Media {media.id} not found in project JSON section {section}")
            else:
                print(f"⚠️ Project JSON not found for project_id={media.project_id}")

        except Exception as e:
            print(f"❌ Failed to update project JSON during delete: {e}")

    # --- 3️⃣ Remove from DB ---
    session.delete(media)
    session.commit()

    print(f"✅ Deleted media record: {media.id}")
    return {"message": f"Media {media.id} deleted successfully"}



# ----------------------------------------------------------
# 5️⃣ CLEANUP: Delete all user files + DB entries
# ----------------------------------------------------------
@router.delete("/user/{user_id}/cleanup")
def cleanup_user_media(user_id: str, session: Session = Depends(get_session)):
    """Delete all media files, DB records, and clean all project JSON references"""
    print(f"🧹 Cleanup requested for user: {user_id}")

    # --- 1️⃣ Delete media files ---
    user_dir = get_user_upload_dir(user_id)
    if os.path.exists(user_dir):
        shutil.rmtree(user_dir)
        print(f"🧽 Deleted directory: {user_dir}")

    # --- 2️⃣ Remove all DB records ---
    all_media = session.exec(select(Media).where(Media.user_id == user_id)).all()
    for media in all_media:
        # Clean project JSON
        if media.project_id:
            try:
                project_file = os.path.join(get_user_dir(user_id), f"{media.project_id}.json")
                if os.path.exists(project_file):
                    with open(project_file, "r") as f:
                        project_data = json.load(f)

                    # section = (
                    #     "audios" if media.type == "audio" else
                    #     "videos" if media.type == "video" else
                    #     "stocks"
                    # )
                    
                    section = "stocks"

                    if section in project_data and str(media.id) in project_data[section]:
                        del project_data[section][str(media.id)]

                        with open(project_file, "w") as f:
                            json.dump(project_data, f, indent=2)
                        print(f"🧹 Removed {media.id} from {section} in {project_file}")
            except Exception as e:
                print(f"⚠️ Error cleaning project JSON: {e}")

        session.delete(media)
        session.commit()
        print(f"✅ Cleanup complete — {len(all_media)} records removed for {user_id}")
        return {"message": f"All media deleted for {user_id}"}


