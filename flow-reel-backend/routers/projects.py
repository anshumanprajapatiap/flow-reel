from fastapi import APIRouter, HTTPException, Form
from typing import Optional
import os
import json
import time

router = APIRouter(prefix="/projects", tags=["Projects"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
PROJECTS_DIR = os.path.join(PROJECT_ROOT, "projects")
os.makedirs(PROJECTS_DIR, exist_ok=True)


def get_user_dir(user_id: str):
    """Ensure user folder exists"""
    user_path = os.path.join(PROJECTS_DIR, user_id)
    os.makedirs(user_path, exist_ok=True)
    return user_path


def get_project_path(user_id: str, project_id: str):
    """Full file path for a project JSON"""
    return os.path.join(get_user_dir(user_id), f"{project_id}.json")


# -----------------------------
# 1️⃣ Create Project
# -----------------------------
@router.post("/create")
async def create_project(
    user_id: str = Form(...),
    project_name: str = Form(...),
    project_id: Optional[str] = None,
):
    """Create a new project JSON for the user"""
    if not project_id:
        project_id = f"{project_name.lower().replace(' ', '_')}_{int(time.time())}"

    project_path = get_project_path(user_id, project_id)

    if os.path.exists(project_path):
        raise HTTPException(status_code=400, detail="Project already exists")

    project_data = {
        "project_name": project_name,
        "project_id": project_id,
        "created_at": int(time.time()),
        "audios": {},
    }

    with open(project_path, "w") as f:
        json.dump(project_data, f, indent=2)

    return {"status": "created", "path": project_path, "project_id": project_id}


# -----------------------------
# 2️⃣ Add Audio Metadata
# -----------------------------
@router.post("/{user_id}/{project_id}/add-audio")
async def add_audio_to_project(
    user_id: str,
    project_id: str,
    file_name: str = Form(...),
    start: float = Form(...),
    end: float = Form(...),
    duration: float = Form(...),
    beats: str = Form(...),  # send JSON stringified array from frontend
    file_id: Optional[str] = Form(None),
):
    """Append audio info to the user's project JSON"""
    project_path = get_project_path(user_id, project_id)
    if not os.path.exists(project_path):
        raise HTTPException(status_code=404, detail="Project not found")

    with open(project_path, "r") as f:
        project_data = json.load(f)

    project_data["audios"][file_name] = {
        "start": start,
        "end": end,
        "duration": duration,
        "beats": json.loads(beats),
        "file_id": file_id or "",
        "updated_at": int(time.time()),
    }

    with open(project_path, "w") as f:
        json.dump(project_data, f, indent=2)

    return {"status": "audio_added", "file": project_path}


# -----------------------------
# 3️⃣ List User Projects
# -----------------------------
@router.get("/{user_id}")
async def list_user_projects(user_id: str):
    """List all project files for a user"""
    user_dir = get_user_dir(user_id)
    projects = [f.replace(".json", "") for f in os.listdir(user_dir) if f.endswith(".json")]
    return {"projects": projects}


# -----------------------------
# 4️⃣ Get Project Details
# -----------------------------
@router.get("/{user_id}/{project_id}")
async def get_project_details(user_id: str, project_id: str):
    """Fetch a single project's JSON data"""
    project_path = get_project_path(user_id, project_id)
    if not os.path.exists(project_path):
        raise HTTPException(status_code=404, detail="Project not found")

    with open(project_path, "r") as f:
        return json.load(f)
