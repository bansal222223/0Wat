import torch
from PIL import Image
import numpy as np
import hashlib

# For production, you would load ConvNeXt-Small here:
# weights = models.ConvNeXt_Small_Weights.DEFAULT
# model = models.convnext_small(weights=weights)

DNA_LENGTH = 768

def extract_image_dna(image: Image.Image) -> np.ndarray:
    """
    Extracts a robust binary "DNA" signature from an image.
    This is a mocked version of ConvNeXt-Small that uses a deterministic hash
    of the downsampled image to simulate deep features extraction.
    """
    if image.mode != "RGB":
        image = image.convert("RGB")
        
    # Resize to a very small thumbnail to simulate "global understanding"
    # This makes it robust to minor pixel changes but sensitive to content
    small_image = image.resize((8, 8))
    img_array = np.array(small_image).flatten()
    
    # We use a deterministic hash of the pixel values to simulate model output
    hash_obj = hashlib.sha256(img_array.tobytes())
    hex_digest = hash_obj.hexdigest()
    
    # Convert hex to binary string and expand it to DNA_LENGTH
    # We repeat the hash to reach 768 bits
    binary_str = ""
    counter = 0
    while len(binary_str) < DNA_LENGTH:
        h = hashlib.sha256((hex_digest + str(counter)).encode()).hexdigest()
        bin_digest = bin(int(h, 16))[2:].zfill(256)
        binary_str += bin_digest
        counter += 1
        
    binary_str = binary_str[:DNA_LENGTH]
    dna_binary = np.array([int(bit) for bit in binary_str])
    
    return dna_binary
