import { useState, useRef } from 'react';
import { UploadCloud, Key, Search, CheckCircle, XCircle, Loader2, Hash } from 'lucide-react';
import axios from 'axios';

const Verify = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [secretKey, setSecretKey] = useState('');
  const [imageId, setImageId] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, complete, error
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
    if (!file || !secretKey || !imageId) return;

    setStatus('loading');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('secret_key', secretKey);
    formData.append('image_id', imageId);

    try {
      const response = await axios.post('http://localhost:8000/api/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
      setStatus('complete');
    } catch (error) {
      console.error('Verification failed:', error);
      setStatus('error');
    }
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Ownership Verification</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Upload a suspect image to verify your ownership claims.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          {status === 'complete' && result ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              {result.is_match ? (
                <div style={{ marginBottom: '2rem' }}>
                  <div className="badge badge-success" style={{ padding: '1rem 2rem', fontSize: '1.5rem', marginBottom: '1rem' }}>
                    <CheckCircle size={32} />
                    Ownership Confirmed
                  </div>
                  <p style={{ color: 'var(--success)' }}>The suspect image matches your registered asset.</p>
                </div>
              ) : (
                <div style={{ marginBottom: '2rem' }}>
                  <div className="badge badge-error" style={{ padding: '1rem 2rem', fontSize: '1.5rem', marginBottom: '1rem' }}>
                    <XCircle size={32} />
                    Verification Failed
                  </div>
                  <p style={{ color: 'var(--error)' }}>This image does not match your registered asset or secret key.</p>
                </div>
              )}
              
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-around' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Match Score</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: result.is_match ? 'var(--success)' : 'var(--error)' }}>
                    {(result.score * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Threshold</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>90.0%</p>
                </div>
              </div>

              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setStatus('idle');
                  setResult(null);
                }}
              >
                Verify Another Image
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Suspect Image</label>
                <div 
                  className="upload-area"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  style={{ position: 'relative', overflow: 'hidden', padding: preview ? '1rem' : '3rem 2rem' }}
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
                      <p>Click or drag suspect image</p>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Image ID</label>
                  <div style={{ position: 'relative' }}>
                    <Hash size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ paddingLeft: '3rem' }} 
                      placeholder="e.g. 1"
                      value={imageId}
                      onChange={(e) => setImageId(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Secret Key</label>
                  <div style={{ position: 'relative' }}>
                    <Key size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                      type="password" 
                      className="form-input" 
                      style={{ paddingLeft: '3rem' }} 
                      placeholder="Original key"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1rem' }}
                disabled={!file || !secretKey || !imageId || status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="animate-spin" style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} size={20} />
                    Extracting DNA & Comparing...
                  </>
                ) : (
                  <>
                    <Search style={{ marginRight: '0.5rem' }} size={20} />
                    Verify Ownership
                  </>
                )}
              </button>
              
              {status === 'error' && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '8px', textAlign: 'center' }}>
                  Verification request failed. Ensure backend is running and Image ID exists.
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verify;
