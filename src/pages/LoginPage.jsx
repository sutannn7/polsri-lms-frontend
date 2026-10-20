// src/pages/LoginPage.jsx
import { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import FlowCanvas from "../components/ui/FlowCanvas";
import useAuth from "../hooks/useAuth";
import "./LoginPage.css";

// Reusable Error Icon
function ErrorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  // State Managements
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation & UI States
  const [errId, setErrId] = useState("");
  const [errPass, setErrPass] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const identifierRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAlertMsg("");

    const nextId = identifier.trim();
    const nextErrId = nextId ? "" : "NIP / NPH / NPM wajib diisi.";
    const nextErrPass = !password
      ? "Kata sandi wajib diisi."
      : password.length < 6
        ? "Kata sandi minimal 6 karakter."
        : "";

    setErrId(nextErrId);
    setErrPass(nextErrPass);

    // Focus the first field that failed
    if (nextErrId) {
      identifierRef.current?.focus();
      return;
    }
    if (nextErrPass) {
      passwordRef.current?.focus();
      return;
    }

    // Mock sign-in: the session marker lives in sessionStorage and the real
    // authentication service (src/services/authService.js) replaces this later.
    setIsLoading(true);
    try {
      await login(nextId, password);
      navigate("/beranda", { replace: true });
    } catch (error) {
      setIsLoading(false);
      setAlertMsg(
        error instanceof Error ? error.message : "Gagal masuk. Coba lagi.",
      );
    }
  };

  const handleForgotPassword = () => {
    setAlertMsg("Pemulihan kata sandi belum tersedia.");
  };

  // Already signed in: /login has nothing to offer, go straight to the app.
  if (isAuthenticated) {
    return <Navigate to="/beranda" replace />;
  }

  return (
    <div className="login-kosmik-theme">
      <div className="wrap">
        {/* Kosmik Scene */}
        <aside className="scene" aria-label="Identitas Politeknik Negeri Sriwijaya">
          <FlowCanvas />
          <div className="scene-top rv" style={{ "--i": 0 }}>
            <div className="brand">
              <img
                src="/logo-polsri.png"
                alt="Logo Politeknik Negeri Sriwijaya"
                width="44"
                height="44"
              />
              <div>
                <b>LearnEase</b>
                <small>Politeknik Negeri Sriwijaya</small>
              </div>
            </div>
          </div>

          <div className="card rv" style={{ "--i": 1 }}>
            <img
              src="/logo-polsri.png"
              alt="Logo Politeknik Negeri Sriwijaya"
              width="592"
              height="592"
              loading="eager"
              fetchpriority="high"
            />
          </div>

          <div className="head rv" style={{ "--i": 2 }}>
            <p className="head-quote">
              Masuk ke perjalanan <span>belajarmu!</span>
            </p>
            <p className="head-credit">
              Portal Akademik Politeknik Negeri Sriwijaya
            </p>
          </div>
        </aside>

        {/* Login Panel */}
        <main className="panel">
          <div className="box">
            {/* The title paints on the first frame: a visitor must never stare
                at an empty slot waiting for an animation. */}
            <h1>Masuk ke portal akademik</h1>
            <p className="lead rv" style={{ "--i": 3 }}>
              Portal Akademik Politeknik Negeri Sriwijaya. Masuk dengan NIP,
              NPH, atau NPM akun akademik Anda.
            </p>

            <form onSubmit={handleLogin} noValidate>
              {/* Field Identitas */}
              <div className="field rv" style={{ "--i": 4 }}>
                <label className="lb" htmlFor="u">
                  NIP / NPH / NPM
                </label>
                <div className="shell">
                  <div className="core">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21a8 8 0 0 1 16 0" />
                    </svg>
                    <input
                      id="u"
                      ref={identifierRef}
                      type="text"
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck="false"
                      placeholder="Masukkan NIP / NPH / NPM"
                      aria-invalid={!!errId}
                      aria-describedby={errId ? "u-e" : undefined}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>
                </div>
                {errId && (
                  <div className="er" id="u-e" role="alert">
                    <ErrorIcon />
                    <span>{errId}</span>
                  </div>
                )}
              </div>

              {/* Field Kata Sandi */}
              <div className="field rv" style={{ "--i": 5 }}>
                <label className="lb" htmlFor="p">
                  Kata Sandi
                </label>
                <div className="shell">
                  <div className="core">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="4" y="11" width="16" height="10" rx="2.5" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                    <input
                      id="p"
                      ref={passwordRef}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Masukkan kata sandi"
                      aria-invalid={!!errPass}
                      aria-describedby={errPass ? "p-e" : undefined}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="eye"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword
                          ? "Sembunyikan kata sandi"
                          : "Tampilkan kata sandi"
                      }
                      aria-pressed={showPassword}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </div>
                {errPass && (
                  <div className="er" id="p-e" role="alert">
                    <ErrorIcon />
                    <span>{errPass}</span>
                  </div>
                )}
              </div>

              {/* Alert Feedback */}
              {alertMsg && (
                <div className="al" role="status">
                  {alertMsg}
                </div>
              )}

              {/* Tombol Submit */}
              <button
                className="go rv"
                style={{ "--i": 6 }}
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                <span>{isLoading ? "Memproses…" : "Masuk"}</span>
                <span className="arr" aria-hidden="true">
                  {isLoading ? (
                    <i className="sp"></i>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  )}
                </span>
              </button>
            </form>

            {/* Bantuan & Legal */}
            <div className="help rv" style={{ "--i": 7 }}>
              <div className="two">
                <button
                  className="gb"
                  type="button"
                  onClick={handleForgotPassword}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 12a9 9 0 1 0 2.6-6.4" />
                    <path d="M3 4v5h5" />
                  </svg>
                  Lupa kata sandi
                </button>
                <span className="dot" aria-hidden="true">
                  ·
                </span>
                <Link to="/panduan" className="gb">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01" />
                  </svg>
                  Bantuan login
                </Link>
              </div>

              <p className="tm">
                Dengan masuk, Anda menyetujui{" "}
                <span className="tm-l">Ketentuan Penggunaan</span>.
              </p>

              <footer className="legal-mobile rv" style={{ "--i": 8 }}>
                © 2026 Politeknik Negeri Sriwijaya
              </footer>
            </div>
          </div>

          <div className="panel-foot rv" style={{ "--i": 9 }}>
            <p className="legal-desk">© 2026 Politeknik Negeri Sriwijaya</p>
          </div>
        </main>
      </div>
    </div>
  );
}
