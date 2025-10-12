from fastapi import APIRouter, HTTPException
import os, json

router = APIRouter(prefix="/user", tags=["User"])

USERS_FILE = "data/users.json"
os.makedirs("data", exist_ok=True)

# Ensure the file exists
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w") as f:
        json.dump({}, f)


def read_users():
    with open(USERS_FILE, "r") as f:
        return json.load(f)


def write_users(users):
    with open(USERS_FILE, "w") as f:
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
