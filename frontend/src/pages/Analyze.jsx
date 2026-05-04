import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, ArrowRight, ShieldCheck, Cpu, Lock } from 'lucide-react';

const Analyze = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = () => {
    if (!file || !preview) return;
    // Store in sessionStorage to pass to processing page
    sessionStorage.setItem('0wat_filename', file.name);
    sessionStorage.setItem('0wat_filesize', file.size.toString());
    sessionStorage.setItem('0wat_preview', preview);
    navigate('/processing');
  };

  return (
    <div className="upload-page">
      {/* Background glow effects */}
      <div className="upload-bg-glow glow-blue" />
      <div className="upload-bg-glow glow-purple" />

      <div className="upload-page-inner animate-fade-in">
        {/* Header */}
        <div className="upload-page-header">
          <div className="upload-page-badge">
            <ShieldCheck size={14} />
            Zero-Watermark Forensic Engine
          </div>
          <h1 className="upload-page-title">
            Upload Image for<br />
            <span className="text-gradient">Deep Analysis</span>
          </h1>
          <p className="upload-page-sub">
            Our ConvNeXt-Small AI will extract 768-bit DNA signatures and run full XOR cryptographic verification
          </p>
        </div>

        {/* Upload Card */}
        <div className="upload-card glass-panel">
          <div
            className={`upload-dropzone ${dragActive ? 'dz-active' : ''} ${preview ? 'dz-has-file' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {preview ? (
              <div className="dz-preview-wrap">
                <div className="dz-img-frame">
                  <img src={preview} alt="Selected" className="dz-img" />
                  <div className="dz-img-overlay">
                    <UploadCloud size={28} />
                    <span>Change Image</span>
                  </div>
                </div>
                <div className="dz-file-info">
                  <div className="dz-filename">{file?.name}</div>
                  <div className="dz-filesize">{(file?.size / 1024 / 1024).toFixed(2)} MB • {file?.type}</div>
                </div>
              </div>
            ) : (
              <div className="dz-empty">
                <div className="dz-icon-ring">
                  <div className="dz-icon-ring-inner">
                    <UploadCloud size={36} />
                  </div>
                </div>
                <p className="dz-title">Drop your image here</p>
                <p className="dz-hint">or click to browse — PNG, JPG, WEBP</p>
                <div className="dz-supported">
                  <span>✓ Medical Imaging</span>
                  <span>✓ Digital Art</span>
                  <span>✓ Documents</span>
                  <span>✓ Photography</span>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            className={`btn-analyze-submit ${!file ? 'btn-disabled' : ''}`}
            onClick={handleSubmit}
            disabled={!file}
            id="submit-analyze-btn"
          >
            <Cpu size={20} />
            Run Forensic Analysis
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Info pills */}
        <div className="upload-page-pills">
          <div className="info-pill">
            <Cpu size={15} />
            ConvNeXt-Small Backbone
          </div>
          <div className="info-pill">
            <Lock size={15} />
            XOR Cryptography
          </div>
          <div className="info-pill">
            <ShieldCheck size={15} />
            768-bit DNA Extraction
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
