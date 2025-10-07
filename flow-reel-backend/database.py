import os
from sqlmodel import SQLModel, create_engine, Session

# Get DATABASE_URL from environment (default to local SQLite for fallback)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./flowreel.db" # clocal SQLite file fallback
)

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL, echo=False)

def get_session():
    """Yield a database session for dependency injection"""
    with Session(engine) as session:
        yield session

def init_db():
    """Initialize database tables"""
    SQLModel.metadata.create_all(engine)
    print(f"✅ Database initialized at {DATABASE_URL}")
