from sqlmodel import SQLModel
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectCreate(BaseModel):
    name: str
    type: str
    thumbnail: Optional[str] = None

class ProjectRead(ProjectCreate):
    id: int
    created_at: datetime

class MediaCreate(SQLModel):
    user_id: str
    project_id: str
    file_name: str
    file_path: str
    media_type: str


class MediaRead(SQLModel):
    id: int
    name: str
    type: str
    user_id: str
    project_id: Optional[str]
    path: str
    created_at: int