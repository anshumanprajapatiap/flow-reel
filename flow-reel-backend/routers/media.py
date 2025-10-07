from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
import os
import uuid
import time
import re
import shutil

from database import get_session
# from models import Media
# from schemas import MediaRead

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
    query = select(Media)
    if user_id:
        query = query.where(Media.user_id == user_id)
    if project_id:
        query = query.where(Media.project_id == project_id)
    return session.exec(query).all()


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
# 4️⃣ DELETE: Delete a media file
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

    session.delete(media)
    session.commit()
    return {"message": "Media deleted successfully"}


# ----------------------------------------------------------
# 5️⃣ CLEANUP: Delete all user files (optional admin endpoint)
# ----------------------------------------------------------
@router.delete("/user/{user_id}/cleanup")
def cleanup_user_media(user_id: str, session: Session = Depends(get_session)):
    """Delete all media for a specific user"""
    user_dir = get_user_upload_dir(user_id)
    if os.path.exists(user_dir):
        shutil.rmtree(user_dir)
        print(f"🧹 Deleted all files for {user_id}")

    # Clean DB
    session.exec(select(Media).where(Media.user_id == user_id))
    session.commit()

    return {"message": f"All media deleted for {user_id}"}
