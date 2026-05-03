import { useState, useRef } from 'react';
import { UploadCloud, Key, ShieldPlus, Check, Loader2, Download } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [secretKey, setSecretKey] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !secretKey) return;

    setStatus('loading');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('secret_key', secretKey);
    formData.append('owner_id', ownerId);

    try {
      const response = await axios.post('/api/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
      setStatus('success');
    } catch (error) {
      console.error('Registration failed:', error);
      setStatus('error');
    }
  };

  const handleDownloadWatermark = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('/api/add-watermark', formData, {
        responseType: 'blob' // Important for handling binary data
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `watermarked_${file.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download watermarked image', error);
      alert('Failed to download watermarked image');
    }
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Asset Registration</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Protect your image ownership securely without altering the original file.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--success)',
                marginBottom: '1.5rem'
              }}>
                <Check size={40} />
              </div>
              <h2 style={{ marginBottom: '1rem' }}>Asset Protected!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Your Master Share has been generated and securely stored.
              </p>
              
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Image ID</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace' }}>#{result?.image_id}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  Please save this ID for verification later.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={handleDownloadWatermark}
                >
                  <Download style={{ marginRight: '0.5rem' }} size={20} />
                  Download Watermarked Copy
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setStatus('idle');
                    setFile(null);
                    setPreview(null);
                    setSecretKey('');
                    setOwnerId('');
                    setResult(null);
                  }}
                >
                  Register Another Asset
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Upload Image</label>
                <div 
                  className="upload-area"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  style={{ position: 'relative', overflow: 'hidden' }}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                    accept="image/*"
                  />
                  {preview ? (
                    <img 
                      src={preview} 
                      alt="Preview" 
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }} 
                    />
                  ) : (
                    <>
                      <UploadCloud size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
                      <p>Click or drag image to upload</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Supports PNG, JPG, JPEG</p>
                    </>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Owner Name / ID</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. John Doe or Clinic-001"
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Secret Key</label>
                <div style={{ position: 'relative' }}>
                  <Key size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    type="password" 
                    className="form-input" 
                    style={{ paddingLeft: '3rem' }} 
                    placeholder="Enter your ownership identity key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    required
                  />
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  This key is required to prove your ownership later.
                </p>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1rem' }}
                disabled={!file || !secretKey || !ownerId || status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="animate-spin" style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} size={20} />
                    Extracting DNA & Applying XOR...
                  </>
                ) : (
                  <>
                    <ShieldPlus style={{ marginRight: '0.5rem' }} size={20} />
                    Generate Master Share
                  </>
                )}
              </button>
              
              {status === 'error' && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '8px', textAlign: 'center' }}>
                  Failed to register image. Please try again.
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
