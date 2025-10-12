from fastapi import APIRouter, HTTPException, Form
from typing import Optional
import os
import json
import time

router = APIRouter(prefix="/project", tags=["Project"])

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
@router.post("/")
async def create_project(
    user_id: str = Form(...),
    project_name: str = Form(...),
    project_id: Optional[str] = None,
):  
    server_time = int(time.time())  # ✅ ensure timestamp is server-side
    
    """Create a new project JSON for the user"""
    if not project_id:
        project_id = f"{project_name.lower().replace(' ', '_')}_{server_time}"

    project_path = get_project_path(user_id, project_id)

    if os.path.exists(project_path):
        raise HTTPException(status_code=400, detail="Project already exists")

    project_data = {
        "project_name": project_name,
        "project_id": project_id,
        "created_at": server_time,
        "audios": {},
        "videos": {}
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
# 3️⃣ List User Projects (with metadata)
# -----------------------------
@router.get("/{user_id}")
async def list_user_projects(user_id: str):
    """List all project metadata for a user"""
    user_dir = get_user_dir(user_id)
    
    if not os.path.exists(user_dir):
        raise HTTPException(status_code=404, detail="User not found or no projects")

    projects = []
    for file_name in os.listdir(user_dir):
        if file_name.endswith(".json"):
            file_path = os.path.join(user_dir, file_name)
            try:
                with open(file_path, "r") as f:
                    data = json.load(f)
                    projects.append({
                        "id": data.get("project_id", file_name.replace(".json", "")),
                        "name": data.get("project_name", "Untitled Project"),
                        "created_at": data.get("created_at", None),
                        "thumbnail": data.get("thumbnail", "")
                    })
            except Exception as e:
                print(f"⚠️ Error reading {file_name}: {e}")

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



# -----------------------------
# 5 Delete project
# -----------------------------
@router.delete("/{user_id}/{project_id}")
async def delete_project(user_id: str, project_id: str):
    """Delete a project and its JSON data"""
    project_path = get_project_path(user_id, project_id)
    
    if not os.path.exists(project_path):
        raise HTTPException(status_code=404, detail="Project not found")

    try:
        os.remove(project_path)
        return {"message": "Project deleted successfully", "project_id": project_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete project: {str(e)}")
