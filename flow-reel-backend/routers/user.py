from fastapi import APIRouter, HTTPException
import os, json
from directory_util import get_users_data_file_path

router = APIRouter(prefix="/user", tags=["User"])

def read_users():
    users_file_path = get_users_data_file_path()
    print(f"users_file_path: {users_file_path}")
    with open(users_file_path, "r") as f:
        return json.load(f)


def write_users(users):
    users_file_path = get_users_data_file_path()
    print(f"users_file_path: {users_file_path}")
    with open(users_file_path, "w") as f:
        json.dump(users, f, indent=2)


@router.post("/")
async def add_user(user: dict):
    """
    Adds a user to the local file-based store.
    Expected JSON:
    {
        "id": "anshuman_prajapati",
        "name": "Anshuman Prajapati"
    }
    """
    users = read_users()
    user_id = user.get("id")
    name = user.get("name")
    password = user.get("password")

    if not user_id:
        raise HTTPException(status_code=400, detail="id missing")
    
    if not name:
        raise HTTPException(status_code=400, detail="name missing")
    
    if not user_id:
        raise HTTPException(status_code=400, detail="pasword missing")

    if user_id in users:
        return {"status": "exists", "message": "User already exists"}

    users[user_id] = user
    write_users(users)
    return {"status": "success", "user": user}


@router.get("/{user_id}")
async def get_user(user_id: str):
    """
    Get user info by ID
    """
    users = read_users()
    user = users.get(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"user": user}
