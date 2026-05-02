# 0Wat: Leveraging Deep Learning for Robust and Discriminative Zero-Watermarking in Digital Images

This repository contains the full-stack implementation of the **0Wat System**, a novel approach to digital image copyright protection as described in the IEEE conference paper. 

**Authors:** Khushi Bansal, Harshdeep Singh, Govind Varshney, Charul, Ashish Dixit

## Abstract
This research addresses the crucial need to safeguard picture copyrights through the use of zero-watermarking technology. Unlike earlier approaches that alter the original image, 0Wat uses advanced Deep Learning models to extract robust "DNA" features from the image to prove ownership without modifying a single pixel.

## System Architecture

The 0Wat System operates in two primary phases:

### 🟢 Phase 1: Registration (Asset Protection)
1. **Image Upload:** The user uploads an image and provides a unique **Secret Key** (ownership identity).
2. **AI Image Analysis:** A Deep Learning model (ConvNeXt-Small architecture) analyzes the image to extract deep structural features rather than relying on raw pixels.
3. **Strong Feature Creation:** Global pooling creates a stable understanding of the image that resists common attacks like cropping and compression.
4. **Binary Conversion:** The deep features are converted into a robust binary "DNA" sequence (0s and 1s).
5. **XOR Cryptography:** The system applies XOR logic: `Image_DNA ⊕ Secret_Key = Master_Share`.
6. **Database Storage:** Only the encrypted Master Share is stored. The original image remains completely unchanged.

### 🔴 Phase 2: Verification (Ownership Proof)
1. **Suspect Image Upload:** The user uploads a suspect image (potentially cropped or compressed) to check for copyright infringement.
2. **DNA Re-Extraction:** The AI model extracts the DNA from the suspect image.
3. **Key Recovery:** The system reverses the cryptography: `Suspect_DNA ⊕ Master_Share = Recovered_Key`.
4. **Matching Check:** The system calculates the similarity between the original Secret Key and the Recovered Key.
5. **Verdict:** If the match score is > 0.90, the system confirms ownership and displays a green badge.

## Tech Stack

* **Backend:** FastAPI (Python), PyTorch, SQLAlchemy, Pillow
* **Frontend:** React.js, Vite, Tailwind/CSS Glassmorphism UI
* **Database:** SQLite

## How to Run the Project Locally

### 1. Start the Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173/`.

## Features Included
- ✅ Complete Zero-Watermarking Registration & Verification Flow
- ✅ Simulated Deep Learning DNA Extraction (ConvNeXt architecture)
- ✅ XOR Cryptography Implementation
- ✅ Premium Glassmorphism UI Dashboard
- ✅ Optional Visible Watermark Generation
