from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from .database import Base

class ImageRecord(Base):
    __tablename__ = "image_records"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    owner_id = Column(String, index=True) # Visible Owner Name/ID from diagram
    master_share = Column(Text) # Store as binary string "101010..."
    created_at = Column(DateTime(timezone=True), server_default=func.now())
