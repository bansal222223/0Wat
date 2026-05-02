import { ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem' }}>
      <div className="glass-panel" style={{ padding: '4rem', maxWidth: '900px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background element */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: 0 }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600', marginBottom: '2rem' }}>
            <BookOpen size={16} />
            IEEE Conference Research Implementation
          </div>

          <h1 style={{ fontSize: '3rem', lineHeight: '1.2', marginBottom: '1.5rem', fontWeight: '700' }}>
            0Wat: Leveraging Deep Learning for Robust and Discriminative <span className="text-gradient">Zero-Watermarking</span> in Digital Images
          </h1>

          <div style={{ marginBottom: '3rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              <strong>Authors:</strong> Khushi Bansal, Harshdeep Singh, Govind Varshney, Charul, Ashish Dixit
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Final Year Project Implementation
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '3rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={24} style={{ color: 'var(--success)' }} />
              Research Abstract
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              This research addresses the crucial need to safeguard picture copyrights through the use of zero-watermarking technology. Unlike earlier approaches that rely on altering the original image, 0Wat uses advanced Deep Learning models (ConvNeXt-Small) to extract robust structural "DNA" features. By applying XOR cryptography to these features alongside a Secret Key, ownership is proven definitively without modifying a single pixel of the original asset.
            </p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>The Zero-Watermarking Workflow</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '150px', textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖼️</div>
                <h4 style={{ fontSize: '0.875rem' }}>Original Image</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>No modification</p>
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>➜</div>
              <div style={{ flex: 1, minWidth: '150px', textAlign: 'center', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧠</div>
                <h4 style={{ fontSize: '0.875rem' }}>Feature Extractor</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AI Deep Learning</p>
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>➜</div>
              <div style={{ flex: 1, minWidth: '150px', textAlign: 'center', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💾</div>
                <h4 style={{ fontSize: '0.875rem' }}>Secure Registry</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>TTP Database</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="btn btn-primary" 
              style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
              onClick={() => navigate('/register')}
            >
              Start Registration <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
              onClick={() => navigate('/verify')}
            >
              Verify Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
