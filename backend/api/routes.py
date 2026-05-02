from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont

from database import database, crud
from core import ai_model, crypto

router = APIRouter()

@router.post("/register")
async def register_image(
    owner_id: str = Form(...),
    secret_key: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    # 1. Read Image
    try:
        contents = await file.read()
        image = Image.open(BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image file")

    # 2. Extract DNA (AI Analysis)
    image_dna = ai_model.extract_image_dna(image)
    
    # 3. Generate Key Binary
    secret_key_binary = crypto.generate_key_binary(secret_key, ai_model.DNA_LENGTH)
    
    # 4. Apply XOR Logic to get Master Share
    master_share_binary = crypto.apply_xor(image_dna, secret_key_binary)
    master_share_str = crypto.binary_array_to_string(master_share_binary)
    
    # 5. Store in Database
    record = crud.create_image_record(db=db, filename=file.filename, owner_id=owner_id, master_share=master_share_str)
    
    return {
        "status": "success", 
        "message": "Image registered successfully", 
        "image_id": record.id,
        "filename": record.filename
    }

@router.post("/verify")
async def verify_image(
    secret_key: str = Form(...),
    image_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    # 1. Get Master Share from DB
    record = crud.get_image_record(db, image_id)
    if not record:
        raise HTTPException(status_code=404, detail="Image record not found")
        
    master_share_str = record.master_share
    master_share_binary = crypto.string_to_binary_array(master_share_str)

    # 2. Read Suspect Image
    try:
        contents = await file.read()
        image = Image.open(BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid suspect image file")

    # 3. Extract DNA from Suspect Image
    suspect_dna = ai_model.extract_image_dna(image)
    
    # 4. Recover Key using Master Share (Inverse XOR)
    recovered_key_binary = crypto.apply_xor(suspect_dna, master_share_binary)
    
    # 5. Get Original Secret Key Binary
    original_key_binary = crypto.generate_key_binary(secret_key, ai_model.DNA_LENGTH)
    
    # 6. Compare Keys
    score = crypto.calculate_match_score(original_key_binary, recovered_key_binary)
    
    is_match = score > 0.90
    
    return {
        "status": "success",
        "score": round(score, 4),
        "is_match": is_match,
        "owner_id": record.owner_id if is_match else None,
        "message": "Ownership Confirmed" if is_match else "Verification Failed"
    }

@router.post("/add-watermark")
async def add_watermark(
    file: UploadFile = File(...),
    watermark_text: str = Form("Protected by 0Wat System")
):
    try:
        contents = await file.read()
        image = Image.open(BytesIO(contents))
        if image.mode != "RGBA":
            image = image.convert("RGBA")
            
        # Create a transparent overlay for the text
        overlay = Image.new('RGBA', image.size, (255, 255, 255, 0))
        draw = ImageDraw.Draw(overlay)
        
        # Calculate text size and position (simple approach)
        width, height = image.size
        # Use default font since PIL's default doesn't scale well, just draw it repeatedly or big if possible
        # Since we don't have a guaranteed ttf file, we use default and draw it tiled
        
        # Draw tiled watermark
        for y in range(0, height, 100):
            for x in range(0, width, 200):
                draw.text((x, y), watermark_text, fill=(255, 255, 255, 100)) # Semi-transparent white
                
        # Composite the overlay onto the original image
        watermarked_image = Image.alpha_composite(image, overlay)
        watermarked_image = watermarked_image.convert("RGB") # Convert back to RGB for saving as JPEG
        
        # Save to buffer
        img_byte_arr = BytesIO()
        watermarked_image.save(img_byte_arr, format='JPEG')
        img_byte_arr.seek(0)
        
        return StreamingResponse(img_byte_arr, media_type="image/jpeg", headers={
            "Content-Disposition": f'attachment; filename="watermarked_{file.filename}"'
        })
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to add watermark: {str(e)}")
