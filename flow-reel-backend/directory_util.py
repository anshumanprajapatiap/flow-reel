import os, json

USERS_FILE = "data/users.json"
os.makedirs("data", exist_ok=True)


def get_users_data_file_path():
    # Ensure the file exists
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, "w") as f:
            json.dump({}, f)
    return USERS_FILE


PROJECT_ROOT = "projects"
os.makedirs("projects", exist_ok=True)


def get_user_dir(user_id: str):
    """Ensure user folder exists"""
    user_path = os.path.join(PROJECT_ROOT, user_id)
    os.makedirs(user_path, exist_ok=True)
    return user_path


def get_project_path(user_id: str, project_id: str):
    """Full file path for a project JSON"""
    return os.path.join(get_user_dir(user_id), f"{project_id}.json")


STOCKS_DIR = "user_stocks"


def get_user_upload_dir(user_id: str) -> str:
    """Ensure folder exists for the user"""
    user_stocks_path = os.path.join(PROJECT_ROOT, user_id, STOCKS_DIR)
    os.makedirs(user_stocks_path, exist_ok=True)
    return user_stocks_path



