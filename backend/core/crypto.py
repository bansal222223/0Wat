import numpy as np
import hashlib

def generate_key_binary(secret_key: str, length: int) -> np.ndarray:
    """
    Converts a string secret key into a deterministic binary array of a specific length.
    Uses SHA-256 to hash the key repeatedly to generate enough bits.
    """
    binary_str = ""
    counter = 0
    while len(binary_str) < length:
        # Hash the key with a counter to get deterministic but different hashes
        hash_input = f"{secret_key}{counter}".encode('utf-8')
        hex_digest = hashlib.sha256(hash_input).hexdigest()
        # Convert hex to binary string
        bin_digest = bin(int(hex_digest, 16))[2:].zfill(256)
        binary_str += bin_digest
        counter += 1
    
    # Truncate to exact length and convert to numpy array of 0s and 1s
    binary_str = binary_str[:length]
    return np.array([int(bit) for bit in binary_str])

def apply_xor(binary_array_1: np.ndarray, binary_array_2: np.ndarray) -> np.ndarray:
    """
    Applies element-wise XOR between two binary arrays.
    """
    if len(binary_array_1) != len(binary_array_2):
        raise ValueError("Arrays must be of the same length to apply XOR")
    return np.bitwise_xor(binary_array_1, binary_array_2)

def calculate_match_score(binary_array_1: np.ndarray, binary_array_2: np.ndarray) -> float:
    """
    Calculates the ratio of matching bits between two binary arrays.
    """
    if len(binary_array_1) != len(binary_array_2):
        raise ValueError("Arrays must be of the same length to compare")
    matches = np.sum(binary_array_1 == binary_array_2)
    return float(matches) / len(binary_array_1)

def binary_array_to_string(binary_array: np.ndarray) -> str:
    """Converts a numpy array of 0s and 1s to a string."""
    return "".join(map(str, binary_array))

def string_to_binary_array(binary_str: str) -> np.ndarray:
    """Converts a string of 0s and 1s back to a numpy array."""
    return np.array([int(bit) for bit in binary_str])
