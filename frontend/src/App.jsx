import { useState, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const ANALYZING_STEPS = [
  "Parsing code structure...",
  "Identifying functions and classes...",
  "Analyzing parameters and return types...",
  "Cross-referencing patterns...",
  "Generating documentation...",
  "Formatting output...",
];

export default function App() {
  const [code, setCode] = useState("");
  const [docType, setDocType] = useState("readme");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const fileRef = useRef();

  const generate = async () => {
    if (!code.trim()) return alert("Please paste some code first!");
    setLoading(true);
    setOutput("");
    setStep(0);
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev < ANALYZING_STEPS.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 600);
    try {
      const res = await axios.post("http://127.0.0.1:8000/generate", {
        code,
        doc_type: docType,
      });
      clearInterval(interval);
      setOutput(res.data.documentation);
    } catch (err) {
      clearInterval(interval);
      setOutput("❌ Error connecting to backend. Make sure it's running!");
    }
    setLoading(false);
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "documentation.md";
    a.click();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCode(ev.target.result);
    reader.readAsText(file);
  };

  return (
    <div style={s.page}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d1117; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #161b22; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin { to { transform: rotate(360deg); } }
        .step { animation: fadeIn 0.3s ease forwards; }
        .cursor { animation: blink 1s infinite; display: inline-block; color: #58a6ff; }
        textarea:focus { outline: none !important; border-color: #58a6ff !important; box-shadow: 0 0 0 3px rgba(88,166,255,0.1) !important; }
        select:focus { outline: none; border-color: #58a6ff !important; }
        .gen-btn:hover:not(:disabled) { background: #1f6feb !important; }
        .gen-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .action-btn:hover { background: #21262d !important; border-color: #58a6ff !important; color: #58a6ff !important; }
        .upload-btn:hover { background: #21262d !important; border-color: #30363d !important; }
        .avatar-btn:hover { border-color: #58a6ff !important; background: #21262d !important; }
        .md h1 { color: #e6edf3; font-size: 1.5rem; font-weight: 600; margin: 0 0 16px; padding-bottom: 12px; border-bottom: 1px solid #21262d; }
        .md h2 { color: #e6edf3; font-size: 1.1rem; font-weight: 600; margin: 20px 0 8px; }
        .md h3 { color: #58a6ff; font-size: 1rem; font-weight: 600; margin: 16px 0 6px; }
        .md p { color: #8b949e; margin: 8px 0; line-height: 1.8; font-size: 14px; }
        .md code { background: #161b22; color: #58a6ff; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-family: 'SFMono-Regular', monospace; border: 1px solid #21262d; }
        .md pre { background: #161b22; border: 1px solid #21262d; padding: 16px; border-radius: 6px; overflow-x: auto; margin: 12px 0; }
        .md pre code { background: none; border: none; padding: 0; color: #e6edf3; font-size: 13px; }
        .md ul, .md ol { padding-left: 24px; margin: 8px 0; }
        .md li { color: #8b949e; margin: 4px 0; line-height: 1.7; font-size: 14px; }
        .md strong { color: #e6edf3; }
        .md a { color: #58a6ff; text-decoration: none; }
        .md a:hover { text-decoration: underline; }
        .md blockquote { border-left: 3px solid #58a6ff; padding: 4px 12px; margin: 8px 0; background: #161b22; border-radius: 0 4px 4px 0; }
        .md blockquote p { color: #8b949e; }
        .md table { border-collapse: collapse; width: 100%; margin: 12px 0; }
        .md th { background: #161b22; color: #e6edf3; padding: 8px 12px; border: 1px solid #21262d; font-size: 13px; }
        .md td { color: #8b949e; padding: 8px 12px; border: 1px solid #21262d; font-size: 13px; }
      `}</style>

      {/* NAV */}
      <div style={s.nav}>
        <div style={s.navInner}>
          <div style={s.navLeft}>
            <div style={s.navLogo}>
              <span style={{ fontSize: 22 }}>📄</span>
              <span style={s.navBrand}>Doc Agent</span>
            </div>
            <span style={s.navSep}>/</span>
            <span style={s.navSub}>docs</span>
          </div>
          <div style={s.navRight}>
            <span style={s.navBadge}>AI Agent Track</span>
            <div style={{ position: "relative" }}>
              <div
                className="avatar-btn"
                style={s.avatar}
                onClick={() => setShowTooltip(!showTooltip)}
              >
                👤
              </div>
              {showTooltip && (
                <div style={s.tooltip}>
                  <span style={s.tooltipIcon}>👤</span>
                  <div>
                    <p style={s.tooltipTitle}>Sign Up</p>
                    <p style={s.tooltipSub}>Feature coming soon!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroBadge}>✦ Powered by Gemini 2.5</div>
          <h1 style={s.heroTitle}>Intelligent Documentation Generator</h1>
          <p style={s.heroSub}>Paste your code and get professional, structured documentation in seconds.</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={s.content}>
        {/* LEFT */}
        <div style={s.left}>
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.cardTitle}>Configuration</span>
            </div>
            <div style={s.cardBody}>
              <label style={s.label}>Documentation Type</label>
              <select style={s.select} value={docType} onChange={(e) => setDocType(e.target.value)}>
                <option value="readme">📄 README.md</option>
                <option value="api">🔌 API Documentation</option>
                <option value="reference">📚 Function Reference</option>
              </select>

              <div style={s.divider} />

              <div style={s.labelRow}>
                <label style={s.label}>Source Code</label>
                <button className="upload-btn" style={s.uploadBtn} onClick={() => fileRef.current.click()}>
                  ↑ Upload file
                </button>
                <input ref={fileRef} type="file" accept=".py,.js,.ts,.java,.cpp,.cs,.go,.rb" style={{ display: "none" }} onChange={handleFileUpload} />
              </div>
              <textarea
                style={s.textarea}
                placeholder={"# Paste your code here\ndef hello():\n    return 'Hello, World!'"}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />

              <button className="gen-btn" style={s.genBtn} onClick={generate} disabled={loading}>
                {loading ? "Generating..." : "Generate Documentation →"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={s.right}>
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.cardTitle}>Output</span>
              {output && (
                <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                  <button className="action-btn" style={s.actionBtn} onClick={copyToClipboard}>
                    {copied ? "✓ Copied!" : "⎘ Copy"}
                  </button>
                  <button className="action-btn" style={s.actionBtn} onClick={download}>
                    ↓ Download .md
                  </button>
                </div>
              )}
            </div>
            <div style={s.cardBody}>
              <div style={s.outputBox}>
                {loading && (
                  <div style={s.loadingBox}>
                    <div style={s.loadingHeader}>
                      <div style={s.spinner} />
                      <p style={s.loadingTitle}>Analyzing your code<span className="cursor">|</span></p>
                    </div>
                    <div style={s.progressTrack}>
                      <div style={{ ...s.progressBar, width: `${((step + 1) / ANALYZING_STEPS.length) * 100}%` }} />
                    </div>
                    <div style={{ marginTop: 20 }}>
                      {ANALYZING_STEPS.slice(0, step + 1).map((st, i) => (
                        <div key={i} className="step" style={{ ...s.stepRow, color: i === step ? "#58a6ff" : "#3d444d", fontWeight: i === step ? 500 : 400 }}>
                          <span style={{ marginRight: 8 }}>{i < step ? "✓" : "›"}</span>
                          {st}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!loading && !output && (
                  <div style={s.emptyState}>
                    <div style={s.emptyIcon}>📄</div>
                    <p style={s.emptyTitle}>No documentation yet</p>
                    <p style={s.emptySub}>Paste your code on the left and click Generate</p>
                  </div>
                )}
                {!loading && output && (
                  <div className="md">
                    <ReactMarkdown>{output}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={s.footer}>
        <span>© 2026 Doc Agent — Built for Hackathon · AI Agent Track · Powered by Gemini 2.5</span>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  nav: { background: "#161b22", borderBottom: "1px solid #21262d", position: "sticky", top: 0, zIndex: 100 },
  navInner: { maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" },
  navLeft: { display: "flex", alignItems: "center", gap: 8 },
  navLogo: { display: "flex", alignItems: "center", gap: 8 },
  navBrand: { fontWeight: 600, fontSize: 15, color: "#e6edf3" },
  navSep: { color: "#3d444d", fontSize: 18, marginLeft: 4 },
  navSub: { color: "#8b949e", fontSize: 14 },
  navRight: { display: "flex", alignItems: "center", gap: 12 },
  navBadge: { background: "rgba(88,166,255,0.1)", color: "#58a6ff", border: "1px solid rgba(88,166,255,0.3)", borderRadius: 20, padding: "3px 12px", fontSize: 12 },
  avatar: { width: 34, height: 34, borderRadius: "50%", background: "#21262d", border: "1px solid #30363d", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, transition: "all 0.15s" },
  tooltip: { position: "absolute", right: 0, top: 42, background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: "12px 16px", zIndex: 999, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: 10, minWidth: 200 },
  tooltipIcon: { fontSize: 20 },
  tooltipTitle: { color: "#e6edf3", fontSize: 13, fontWeight: 600 },
  tooltipSub: { color: "#8b949e", fontSize: 12, marginTop: 2 },
  hero: { background: "linear-gradient(180deg, #161b22 0%, #0d1117 100%)", borderBottom: "1px solid #21262d", padding: "48px 24px" },
  heroInner: { maxWidth: 1280, margin: "0 auto" },
  heroBadge: { display: "inline-block", background: "rgba(88,166,255,0.1)", color: "#58a6ff", border: "1px solid rgba(88,166,255,0.2)", borderRadius: 20, padding: "4px 14px", fontSize: 12, marginBottom: 16 },
  heroTitle: { fontSize: 32, fontWeight: 700, color: "#e6edf3", marginBottom: 10 },
  heroSub: { color: "#8b949e", fontSize: 16, lineHeight: 1.6, maxWidth: 500 },
  content: { maxWidth: 1280, margin: "32px auto", padding: "0 24px", display: "flex", gap: 24 },
  left: { width: 420, flexShrink: 0 },
  right: { flex: 1 },
  card: { background: "#161b22", border: "1px solid #21262d", borderRadius: 8, overflow: "hidden" },
  cardHeader: { padding: "12px 16px", borderBottom: "1px solid #21262d", display: "flex", alignItems: "center", background: "#1c2128" },
  cardTitle: { fontSize: 13, fontWeight: 600, color: "#e6edf3" },
  cardBody: { padding: 16, display: "flex", flexDirection: "column", gap: 12 },
  label: { fontSize: 12, fontWeight: 600, color: "#8b949e", display: "block" },
  labelRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  select: { width: "100%", background: "#0d1117", border: "1px solid #30363d", color: "#e6edf3", padding: "8px 12px", borderRadius: 6, fontSize: 13, cursor: "pointer" },
  uploadBtn: { background: "transparent", border: "1px solid #21262d", color: "#8b949e", padding: "4px 10px", fontSize: 11, cursor: "pointer", borderRadius: 6, fontFamily: "inherit", transition: "all 0.15s" },
  textarea: { width: "100%", minHeight: 340, background: "#0d1117", border: "1px solid #30363d", color: "#e6edf3", padding: 14, fontSize: 12, fontFamily: "'SFMono-Regular', 'Courier New', monospace", resize: "vertical", borderRadius: 6, lineHeight: 1.7, transition: "all 0.15s" },
  genBtn: { width: "100%", background: "#238636", color: "#fff", border: "1px solid rgba(240,246,252,0.1)", padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 6, fontFamily: "inherit", transition: "background 0.15s" },
  divider: { height: 1, background: "#21262d", margin: "4px 0" },
  actionBtn: { background: "transparent", border: "1px solid #30363d", color: "#8b949e", padding: "5px 12px", fontSize: 12, cursor: "pointer", borderRadius: 6, fontFamily: "inherit", transition: "all 0.15s" },
  outputBox: { minHeight: 460 },
  loadingBox: { padding: "8px 0" },
  loadingHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 },
  spinner: { width: 16, height: 16, border: "2px solid #21262d", borderTopColor: "#58a6ff", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  loadingTitle: { fontSize: 14, fontWeight: 600, color: "#e6edf3" },
  progressTrack: { height: 3, background: "#21262d", borderRadius: 2, overflow: "hidden" },
  progressBar: { height: "100%", background: "linear-gradient(90deg, #238636, #58a6ff)", borderRadius: 2, transition: "width 0.5s ease" },
  stepRow: { fontSize: 13, padding: "4px 0", transition: "color 0.3s", display: "flex", alignItems: "center" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 12 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { color: "#3d444d", fontSize: 16, fontWeight: 600 },
  emptySub: { color: "#3d444d", fontSize: 13 },
  footer: { textAlign: "center", padding: "32px 24px", color: "#3d444d", fontSize: 12, borderTop: "1px solid #21262d", marginTop: 32 },
};