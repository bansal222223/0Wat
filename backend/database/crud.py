from sqlalchemy.orm import Session
from . import models

def create_image_record(db: Session, filename: str, owner_id: str, master_share: str):
    db_record = models.ImageRecord(filename=filename, owner_id=owner_id, master_share=master_share)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def get_image_record(db: Session, record_id: int):
    return db.query(models.ImageRecord).filter(models.ImageRecord.id == record_id).first()

def get_all_image_records(db: Session):
    return db.query(models.ImageRecord).all()
