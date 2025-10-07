from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List, Optional
import os
import uuid
import time
import re
import shutil

from database import get_session
from models import Media
from schemas import MediaRead

router = APIRouter(prefix="/media", tags=["Media"])

# ✅ Base directory for media uploads
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
UPLOAD_ROOT = os.path.join(PROJECT_ROOT, "projects")
os.makedirs(UPLOAD_ROOT, exist_ok=True)

STOCKS_DIR = "user_stocks"


# ----------------------------------------------------------
# 1️⃣ Utility: Build user folder
# ----------------------------------------------------------
def get_user_upload_dir(user_id: str) -> str:
    """Ensure folder exists for the user"""
    safe_user_id = re.sub(r"[^A-Za-z0-9_-]", "_", user_id)
    user_path = os.path.join(UPLOAD_ROOT, safe_user_id, STOCKS_DIR)
    os.makedirs(user_path, exist_ok=True)
    return user_path


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

    # Extract filename from path
    filename = path.split("/")[-1]

    # Build file path
    file_path = os.path.join(BASE_DIR, user_id, "user_stocks", filename)

    if not os.path.exists(file_path):
        print(f"❌ File not found for user {user_id}: {file_path}")
        raise HTTPException(status_code=404, detail="File not found")

    print(f"📤 Serving file for user '{user_id}' → {file_path}")
    return FileResponse(file_path)


# ----------------------------------------------------------
# 3️⃣ POST: Upload any media file (audio/video/photo)
# ----------------------------------------------------------
@router.post("/upload", response_model=MediaRead)
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

    print(f"✅ Uploaded [{type}] for {user_id} → {file_path}")

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

    # Delete file
    if os.path.exists(media.path):
        os.remove(media.path)
        print(f"🗑️ Deleted file: {media.path}")
    else:
        print(f"⚠️ File not found on disk: {media.path}")

    session.delete(media)
    session.commit()

    print(f"✅ Deleted media record: {media.id}")
    return {"message": f"Media {media.id} deleted successfully"}


# ----------------------------------------------------------
# 5️⃣ CLEANUP: Delete all user files + DB entries
# ----------------------------------------------------------
@router.delete("/user/{user_id}/cleanup")
def cleanup_user_media(user_id: str, session: Session = Depends(get_session)):
    """Delete all media files and DB records for a user"""
    print(f"🧹 Cleanup requested for user: {user_id}")

    # Delete files from disk
    user_dir = get_user_upload_dir(user_id)
    if os.path.exists(user_dir):
        shutil.rmtree(user_dir)
        print(f"🧽 Deleted directory: {user_dir}")

    # Delete DB records
    deleted = session.exec(select(Media).where(Media.user_id == user_id)).all()
    for media in deleted:
        session.delete(media)
    session.commit()

    print(f"✅ Cleanup complete — {len(deleted)} records removed for {user_id}")
    return {"message": f"All media deleted for {user_id}"}
