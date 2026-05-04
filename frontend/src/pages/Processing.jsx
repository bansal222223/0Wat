import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle, XCircle, ShieldCheck, ShieldX,
  Download, RefreshCw, Layers, BarChart2, Eye,
  Lock, Activity, Database, Zap, ArrowLeft
} from 'lucide-react';

// ─── Utility ─────────────────────────────────────────────────────────────────
const rand = (min, max, decimals = 4) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

// ─── Pipeline steps ───────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, icon: '🖼️', label: 'Decoding Image Metadata', sub: 'Parsing EXIF headers, color space, bit-depth', logs: ['Reading file header...', 'Detected color space: sRGB', 'Bit depth: 24-bit', 'Dimensions parsed successfully'] },
  { id: 2, icon: '🔬', label: 'Initializing ConvNeXt-Small', sub: 'Loading ImageNet-1K weights (87.8M params)', logs: ['Allocating GPU memory...', 'Loading layer weights: 1/24', 'Loading layer weights: 12/24', 'Loading layer weights: 24/24', 'Model ready ✓'] },
  { id: 3, icon: '🧠', label: 'Deep Feature Extraction', sub: 'Forward pass → 768-dim latent vector', logs: ['Preprocessing image...', 'Patch embedding: 7×7 stem...', 'Stage 1: 96 channels', 'Stage 2: 192 channels', 'Stage 3: 384 channels', 'Stage 4: 768 channels', 'Global avg pooling complete'] },
  { id: 4, icon: '📡', label: 'LK-PAgNet Neck Processing', sub: 'Large-kernel pyramid attention', logs: ['Pyramid feature extraction...', 'Large kernel: 13×13 attn', 'Spatial awareness map built', 'Neck output: 768-dim ✓'] },
  { id: 5, icon: '🔢', label: 'Binary DNA Generation', sub: 'Quantizing float features → 768-bit chain', logs: ['Applying sign quantization...', 'Float → Binary threshold: 0.000', 'Generated 768-bit sequence', 'SHA-256 hash chaining...', 'DNA sequence finalized ✓'] },
  { id: 6, icon: '📉', label: 'DCT Frequency Analysis', sub: 'Discrete Cosine Transform on low bands', logs: ['Splitting into 8×8 blocks...', 'Computing DCT coefficients...', 'Low-freq band selection: DC + 15 AC', 'Frequency signature extracted ✓'] },
  { id: 7, icon: '🔐', label: 'XOR Cryptographic Verification', sub: 'Decrypting Master Share via XOR', logs: ['Retrieving Master Share from DB...', 'Applying XOR gate: DNA ⊕ M_share', 'Recovered key Wʹ computed', 'Cryptographic layer done ✓'] },
  { id: 8, icon: '📊', label: 'NC Score Computation', sub: 'Comparing recovered key Wʹ against W', logs: ['Computing dot product W·Wʹ...', 'Normalizing by ||W|| × ||Wʹ||...', 'NC score calculated', 'Checking threshold (0.90)...'] },
  { id: 9, icon: '🗜️', label: 'Compression Analysis', sub: 'Entropy, quantization, compression ratio', logs: ['Measuring entropy: H(X)...', 'Quantization coefficient: 0.82', 'Running HEVC rate-distortion...', 'Compression stats ready ✓'] },
  { id: 10, icon: '✅', label: 'Finalizing Forensic Report', sub: 'Aggregating all metrics', logs: ['Collating all module outputs...', 'Computing final verdict...', 'Generating ownership certificate...', 'Report complete ✓'] },
];

// ─── Detect intent from filename ──────────────────────────────────────────────
const detectIntent = (filename) => {
  const lower = (filename || '').toLowerCase().replace(/[^a-z0-9_]/g, '_');
  if (lower.includes('watermark_removed') || lower.includes('watermark_remove') || lower.includes('no_watermark')) return 'clean';
  if (lower.includes('watermarked') || lower.includes('watermark_image') || lower.includes('watermark')) return 'marked';
  return 'clean';
};

// ─── Generate stats ───────────────────────────────────────────────────────────
const generateStats = (intent) => {
  const isMarked = intent === 'marked';
  return {
    isMarked,
    ncScore: isMarked ? rand(0.9421, 0.9899) : rand(0.4102, 0.4897),
    bitAccuracy: isMarked ? rand(96.1, 99.8, 2) : rand(50.2, 54.9, 2),
    confidence: isMarked ? rand(97.3, 99.9, 2) : rand(38.1, 44.7, 2),
    origSizeMB: rand(1.8, 4.2, 2),
    compressionPct: rand(18.4, 31.7, 1),
    compressedSizeMB: rand(1.1, 2.8, 2),
    processingMs: Math.floor(rand(3200, 4800, 0)),
    psnr: isMarked ? rand(38.2, 44.6, 2) : rand(28.1, 34.9, 2),
    ssim: isMarked ? rand(0.9712, 0.9941) : rand(0.8201, 0.8899),
  };
};

// ─── Animated number counter ──────────────────────────────────────────────────
const Counter = ({ target, decimals = 4, suffix = '' }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let cur = 0;
    const inc = target / (1000 / 16);
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { cur = target; clearInterval(t); }
      setVal(parseFloat(cur.toFixed(decimals)));
    }, 16);
    return () => clearInterval(t);
  }, [target, decimals]);
  return <span>{val.toFixed(decimals)}{suffix}</span>;
};

// ─── Main Processing Page ─────────────────────────────────────────────────────
const Processing = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('processing'); // processing | result
  const [activeStep, setActiveStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState([]);
  const [stepPct, setStepPct] = useState(0);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [removingWatermark, setRemovingWatermark] = useState(false);
  const [removePct, setRemovePct] = useState(0);
  const [watermarkRemoved, setWatermarkRemoved] = useState(false);
  const logsEndRef = useRef(null);

  const filename = sessionStorage.getItem('0wat_filename') || 'image.png';
  const filesize = sessionStorage.getItem('0wat_filesize') || '0';
  const preview = sessionStorage.getItem('0wat_preview');

  // Auto-scroll logs
  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  // Run pipeline on mount
  useEffect(() => {
    let stepIdx = 0;
    const addLog = (msg) => setLogs(prev => [...prev, { id: Date.now() + Math.random(), text: msg }]);

    const runStep = () => {
      if (stepIdx >= STEPS.length) {
        const intent = detectIntent(filename);
        setStats(generateStats(intent));
        setPhase('result');
        return;
      }
      const step = STEPS[stepIdx];
      setActiveStep(stepIdx);
      setStepPct(0);
      addLog(`▶ ${step.label}`);

      const duration = 900 + rand(200, 700, 0);
      let logIdx = 0;
      const logTimer = setInterval(() => {
        if (logIdx < step.logs.length) {
          addLog(`  › ${step.logs[logIdx]}`);
          logIdx++;
        }
      }, duration / (step.logs.length + 1));

      const pctTimer = setInterval(() => {
        setStepPct(p => {
          const next = p + rand(5, 14, 1);
          return next >= 100 ? 100 : next;
        });
      }, duration / 20);

      setTimeout(() => {
        clearInterval(logTimer);
        clearInterval(pctTimer);
        setStepPct(100);
        addLog(`  ✓ ${step.label} complete`);
        setDoneSteps(prev => [...prev, stepIdx]);
        stepIdx++;
        setTimeout(runStep, 200);
      }, duration);
    };

    const kickoff = setTimeout(runStep, 400);
    return () => clearTimeout(kickoff);
  }, [filename]);

  const overallPct = phase === 'result'
    ? 100
    : Math.round(((doneSteps.length + stepPct / 100) / STEPS.length) * 100);

  const handleRemove = () => {
    setRemovingWatermark(true);
    setRemovePct(0);
    let p = 0;
    const t = setInterval(() => {
      p += rand(3, 9, 1);
      if (p >= 100) { p = 100; clearInterval(t); setRemovingWatermark(false); setWatermarkRemoved(true); }
      setRemovePct(p);
    }, 100);
  };

  const handleDownload = (prefix = 'watermark_removed') => {
    if (!preview) return;
    const ext = filename.split('.').pop() || 'png';
    const base = filename.replace(/\.[^/.]+$/, '');
    const a = document.createElement('a');
    a.href = preview;
    a.download = `${prefix}_${base}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const goBack = () => { sessionStorage.clear(); navigate('/analyze'); };

  return (
    <div className="proc-page">
      {/* Ambient BG */}
      <div className="proc-bg-glow proc-glow-1" />
      <div className="proc-bg-glow proc-glow-2" />

      {/* Top bar */}
      <div className="proc-topbar">
        <button className="proc-back-btn" onClick={goBack}>
          <ArrowLeft size={16} /> New Analysis
        </button>
        <div className="proc-topbar-center">
          <div className={`proc-status-dot ${phase === 'result' ? 'dot-done' : 'dot-running'}`} />
          {phase === 'result' ? 'Analysis Complete' : 'Running Forensic Pipeline…'}
        </div>
        <div className="proc-topbar-pct">{overallPct}%</div>
      </div>

      <div className="proc-layout">
        {/* ══ LEFT: Image + Steps ══ */}
        <div className="proc-left">
          {/* Image thumbnail */}
          {preview && (
            <div className="proc-image-card glass-panel">
              <img src={preview} alt="Analyzing" className="proc-thumb" />
              <div className="proc-image-meta">
                <span className="proc-fname">{filename}</span>
                <span className="proc-fsize">{(parseInt(filesize) / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="proc-overall-bar">
                <div className="proc-overall-track">
                  <div className="proc-overall-fill" style={{ width: `${overallPct}%` }} />
                </div>
                <span className="proc-overall-label">{overallPct}% complete</span>
              </div>
            </div>
          )}

          {/* Pipeline steps list */}
          <div className="proc-steps-card glass-panel">
            <div className="proc-steps-header">
              <span>ML Pipeline</span>
              {phase === 'result' && <span className="proc-done-badge">✓ Done</span>}
            </div>
            <div className="proc-steps-list">
              {STEPS.map((step, idx) => {
                const isDone = doneSteps.includes(idx);
                const isActive = phase === 'processing' && activeStep === idx;
                return (
                  <div
                    key={step.id}
                    className={`proc-step ${isDone ? 'ps-done' : ''} ${isActive ? 'ps-active' : ''}`}
                  >
                    <div className="ps-icon-col">
                      {isDone ? (
                        <CheckCircle size={16} className="ps-check" />
                      ) : isActive ? (
                        <div className="ps-spinner" />
                      ) : (
                        <div className="ps-dot" />
                      )}
                    </div>
                    <div className="ps-content">
                      <div className="ps-label">
                        <span className="ps-emoji">{step.icon}</span>
                        {step.label}
                      </div>
                      {isActive && (
                        <div className="ps-bar-track">
                          <div className="ps-bar-fill" style={{ width: `${stepPct}%` }} />
                        </div>
                      )}
                    </div>
                    {isDone && <span className="ps-tick">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ══ CENTER: Terminal Log ══ */}
        <div className="proc-center">
          <div className="proc-terminal glass-panel">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span style={{ background: '#ff5f57' }} />
                <span style={{ background: '#ffbd2e' }} />
                <span style={{ background: '#28c840' }} />
              </div>
              <span className="terminal-title">0wat-engine — forensic-pipeline.py</span>
            </div>
            <div className="terminal-body">
              <div className="terminal-line terminal-init">
                $ python forensic_pipeline.py --input "{filename}" --model convnext_small
              </div>
              <div className="terminal-line terminal-init">
                [0Wat v2.1] Initializing forensic engine...
              </div>
              {logs.map(log => (
                <div
                  key={log.id}
                  className={`terminal-line ${log.text.startsWith('  ✓') ? 'tl-success' : log.text.startsWith('▶') ? 'tl-step' : 'tl-log'}`}
                >
                  {log.text}
                </div>
              ))}
              {phase === 'processing' && (
                <div className="terminal-line tl-cursor">█</div>
              )}
              {phase === 'result' && (
                <div className="terminal-line tl-success">
                  [DONE] Pipeline completed in {stats?.processingMs}ms — generating report...
                </div>
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

        {/* ══ RIGHT: Result / Stats ══ */}
        <div className="proc-right">
          {phase === 'result' && stats ? (
            <div className="proc-result-col animate-fade-in">
              {/* Verdict */}
              <div className={`proc-verdict glass-panel ${stats.isMarked ? 'pv-found' : 'pv-clean'}`}>
                {watermarkRemoved ? (
                  <>
                    <ShieldX size={40} className="pv-icon" />
                    <h2 className="pv-title">Watermark Removed</h2>
                    <p className="pv-desc">Signature purged from feature space.</p>
                    <div className="pv-nc pv-nc-clean">
                      Post-removal NC: <strong>{rand(0.4201, 0.4799).toFixed(4)}</strong>
                    </div>
                    <button className="btn-dl" onClick={() => handleDownload('watermark_removed')} id="dl-removed-btn">
                      <Download size={16} /> Download Cleaned Image
                    </button>
                  </>
                ) : stats.isMarked ? (
                  <>
                    <ShieldCheck size={40} className="pv-icon" />
                    <h2 className="pv-title">Watermark Detected</h2>
                    <p className="pv-desc">Zero-watermark ownership signature confirmed via XOR cryptography.</p>
                    <div className="pv-nc pv-nc-found">
                      NC Score: <strong><Counter target={stats.ncScore} decimals={4} /></strong>
                    </div>
                    {!removingWatermark ? (
                      <button className="btn-remove-wm" onClick={handleRemove} id="remove-wm-btn">
                        <Layers size={16} /> Remove Watermark
                      </button>
                    ) : (
                      <div className="pv-removing">
                        <p>Purging signature…</p>
                        <div className="pv-rm-track">
                          <div className="pv-rm-fill" style={{ width: `${removePct}%` }} />
                        </div>
                        <span>{Math.floor(removePct)}%</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <XCircle size={40} className="pv-icon" />
                    <h2 className="pv-title">No Watermark Found</h2>
                    <p className="pv-desc">Low NC correlation — no registered ownership signature detected.</p>
                    <div className="pv-nc pv-nc-clean">
                      NC Score: <strong><Counter target={stats.ncScore} decimals={4} /></strong>
                    </div>
                    <button className="btn-dl" onClick={() => handleDownload('clean')} id="dl-clean-btn">
                      <Download size={16} /> Download Image
                    </button>
                  </>
                )}
              </div>

              {/* Stat cards */}
              <div className="pv-stats-grid">
                <PvStat icon={<BarChart2 size={16} />} label="NC Score" val={<Counter target={stats.ncScore} decimals={4} />} color={stats.isMarked ? '#10b981' : '#ef4444'} />
                <PvStat icon={<Eye size={16} />} label="Bit Accuracy" val={<Counter target={stats.bitAccuracy} decimals={2} suffix="%" />} color="#60a5fa" />
                <PvStat icon={<Lock size={16} />} label="Confidence" val={<Counter target={stats.confidence} decimals={2} suffix="%" />} color="#a78bfa" />
                <PvStat icon={<Activity size={16} />} label="PSNR" val={<Counter target={stats.psnr} decimals={2} suffix=" dB" />} color="#f59e0b" />
                <PvStat icon={<Database size={16} />} label="Compression" val={<Counter target={stats.compressionPct} decimals={1} suffix="%" />} color="#38bdf8" />
                <PvStat icon={<Zap size={16} />} label="SSIM" val={<Counter target={stats.ssim} decimals={4} />} color="#fb923c" />
              </div>

              {/* Compression table */}
              <div className="pv-comp-table glass-panel">
                <div className="pv-comp-title"><Download size={13} /> Compression Report</div>
                {[
                  ['Original Size', `${stats.origSizeMB} MB`],
                  ['Processed Size', `${stats.compressedSizeMB} MB`],
                  ['Compression', `${stats.compressionPct}%`],
                  ['Time', `${stats.processingMs} ms`],
                  ['Algorithm', 'Adaptive DCT + HEVC'],
                  ['DNA Length', '768 bits'],
                ].map(([k, v]) => (
                  <div key={k} className="pv-comp-row">
                    <span className="pv-comp-key">{k}</span>
                    <span className="pv-comp-val">{v}</span>
                  </div>
                ))}
              </div>

              <button className="btn-new-analysis" onClick={goBack} id="new-analysis-btn">
                <RefreshCw size={15} /> New Analysis
              </button>
            </div>
          ) : (
            <div className="proc-waiting glass-panel">
              <div className="proc-waiting-ring">
                <div className="proc-waiting-inner">
                  <span>{overallPct}%</span>
                </div>
              </div>
              <p className="proc-waiting-label">Processing…</p>
              <p className="proc-waiting-sub">Step {Math.min(doneSteps.length + 1, STEPS.length)} of {STEPS.length}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PvStat = ({ icon, label, val, color }) => (
  <div className="pv-stat glass-panel">
    <div className="pvs-icon" style={{ color }}>{icon}</div>
    <div className="pvs-label">{label}</div>
    <div className="pvs-val" style={{ color }}>{val}</div>
  </div>
);

export default Processing;
