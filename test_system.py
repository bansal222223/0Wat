import requests
import io
from PIL import Image

def test_system():
    # 1. Create a dummy image
    img = Image.new('RGB', (256, 256), color = 'red')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_bytes = img_byte_arr.getvalue()
    
    print("Testing Registration...")
    # 2. Register
    reg_response = requests.post(
        'http://localhost:8000/api/register',
        files={'file': ('test_img.jpg', img_bytes, 'image/jpeg')},
        data={'secret_key': 'my_super_secret_123'}
    )
    
    print(f"Registration Status: {reg_response.status_code}")
    print(f"Registration Response: {reg_response.json()}")
    
    if reg_response.status_code != 200:
        return
        
    image_id = reg_response.json().get('image_id')
    
    print("\nTesting Verification (Match)...")
    # 3. Verify Match
    ver_response = requests.post(
        'http://localhost:8000/api/verify',
        files={'file': ('test_img_suspect.jpg', img_bytes, 'image/jpeg')},
        data={'secret_key': 'my_super_secret_123', 'image_id': image_id}
    )
    print(f"Verify Status: {ver_response.status_code}")
    print(f"Verify Response: {ver_response.json()}")

    print("\nTesting Verification (Mismatch)...")
    # 4. Verify Mismatch (Different Image)
    img_diff = Image.new('RGB', (256, 256), color = 'blue')
    img_diff_byte_arr = io.BytesIO()
    img_diff.save(img_diff_byte_arr, format='JPEG')
    img_diff_bytes = img_diff_byte_arr.getvalue()
    
    ver_miss_response = requests.post(
        'http://localhost:8000/api/verify',
        files={'file': ('test_img_suspect2.jpg', img_diff_bytes, 'image/jpeg')},
        data={'secret_key': 'my_super_secret_123', 'image_id': image_id}
    )
    print(f"Verify Mismatch Status: {ver_miss_response.status_code}")
    print(f"Verify Mismatch Response: {ver_miss_response.json()}")

if __name__ == "__main__":
    test_system()
