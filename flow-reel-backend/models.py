from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    type: str
    thumbnail: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Media(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    type: str  # audio, video, image
    user_id: str
    project_id: Optional[str] = None
    path: str
    created_at: int


class MediaRead(SQLModel):
    id: int
    name: str
    type: str
    user_id: str
    project_id: Optional[str]
    path: str
    created_at: int