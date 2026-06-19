import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../redux/slices/authAction";
import { clearError } from "../../redux/slices/authSlice";

const ROLE_ROUTES = {
  admin: "/admin/dashboard",
  manager: "/manager/dashboard",
  employee: "/employee/dashboard",
};

export function LoginCard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, role, isFirstLogin } = useSelector(
    (state) => state.auth
  );

  const [isFlipped, setIsFlipped] = useState(false);

  // Login state
  const [empId, setEmpId]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);

  // Register state
  const [empName, setEmpName]         = useState("");
  const [regEmail, setRegEmail]       = useState("");
  const [dob, setDob]                 = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // ── Redirect after login ──
  useEffect(() => {
    if (!isAuthenticated) return;
    if (isFirstLogin) {
      navigate("/reset-password");
    } else {
      // const path = ROLE_ROUTES[role] || "/dashboard";
      // navigate(path);
      navigate("/dashboard"); 
    }
  }, [isAuthenticated, isFirstLogin]);

  useEffect(() => {
    if (error) dispatch(clearError());
  }, [empId, password, empName, regEmail, dob]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ emp_id: empId, password }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      registerUser({ name: empName, dob, email: regEmail })
    );

    if (registerUser.fulfilled.match(result)) {
      setRegisterSuccess(true);
      setEmpName("");
      setRegEmail("");
      setDob("");
      setTimeout(() => {
        setRegisterSuccess(false);
        navigate("/waiting");
      }, 2000);
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }

        .cc-flip-container {
          perspective: 1200px;
          width: 100%;
          max-width: 420px;
          height: 520px;
        }

        .cc-flip-card {
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.75s cubic-bezier(0.4,0.2,0.2,1);
        }
        .cc-flip-card.flipped { transform: rotateY(180deg); }

        .cc-face {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 24px; overflow: hidden;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 24px 64px rgba(0,0,0,0.10);
          display: flex; flex-direction: column;
          padding: 36px 32px;
        }
        .cc-face-back { transform: rotateY(180deg); }

        @media (max-width: 767px) {
          .cc-face { border-radius: 20px; }
          .cc-face-back { display: none; }
          .cc-flip-card.flipped .cc-face:not(.cc-face-back) { display: none; }
          .cc-flip-card.flipped .cc-face-back { display: flex; }
        }

        .cc-field-wrap { position: relative; }

        .cc-field-wrap input {
          width: 100%; height: 56px;
          padding: 22px 42px 8px 42px;
          border: 1.5px solid #e5e7eb; border-radius: 12px;
          font-size: 14px; font-family: 'Inter', sans-serif;
          outline: none; background: #f9fafb; color: #111;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          caret-color: #e74c3c;
          box-sizing: border-box;
        }
        .cc-field-wrap input::placeholder { color: transparent; }
        .cc-field-wrap input:focus {
          border-color: #e74c3c; background: #fff;
          box-shadow: 0 0 0 3px rgba(231,76,60,0.10);
        }
        .cc-field-wrap input.cc-input-error {
          border-color: #e74c3c; background: #fff5f5;
          animation: shake 0.4s ease;
        }

        .cc-field-wrap label {
          position: absolute; left: 42px; top: 50%;
          transform: translateY(-50%);
          font-size: 14px; color: #9ca3af;
          pointer-events: none;
          transition: top 0.18s ease, font-size 0.18s ease, color 0.18s ease, transform 0.18s ease;
          z-index: 3; font-family: 'Inter', sans-serif; line-height: 1;
        }
        .cc-field-wrap input:focus + label,
        .cc-field-wrap input:not(:placeholder-shown) + label {
          top: 10px; transform: translateY(0);
          font-size: 10px; font-weight: 700;
          color: #e74c3c; letter-spacing: 0.05em; text-transform: uppercase;
        }

        .cc-field-icon-left {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          font-size: 17px; color: #c0c0c0;
          pointer-events: none; z-index: 2; transition: color 0.2s;
        }
        .cc-field-wrap input:focus ~ .cc-field-icon-left { color: #e74c3c; }

        .cc-field-icon-right {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          font-size: 17px; color: #c0c0c0;
          cursor: pointer; z-index: 2;
          background: none; border: none; padding: 0;
          display: flex; align-items: center; transition: color 0.2s;
        }
        .cc-field-icon-right:hover { color: #e74c3c; }

        .cc-field-wrap input[type="date"] { color: transparent; }
        .cc-field-wrap input[type="date"]:focus { color: #111; }
        .cc-field-wrap input[type="date"].cc-has-val { color: #111; }
        .cc-field-wrap input[type="date"]:focus + label,
        .cc-field-wrap input[type="date"].cc-has-val + label {
          top: 10px; transform: translateY(0);
          font-size: 10px; font-weight: 700;
          color: #e74c3c; letter-spacing: 0.05em; text-transform: uppercase;
        }

        .cc-btn {
          width: 100%; height: 48px; border: none; border-radius: 12px;
          font-size: 15px; font-weight: 600; font-family: 'Inter', sans-serif;
          cursor: pointer; color: #fff; position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          background: linear-gradient(135deg, #e74c3c 0%, #8e44ad 100%);
        }
        .cc-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          background-size: 200% 100%; animation: shimmer 2s infinite;
        }
        .cc-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(231,76,60,0.4); }
        .cc-btn:active:not(:disabled) { transform: translateY(0); }
        .cc-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .cc-btn-reg { background: linear-gradient(135deg, #8e44ad 0%, #e74c3c 100%); }

        .cc-link-btn {
          background: none; border: none; font-weight: 600;
          cursor: pointer; font-size: 13px; font-family: 'Inter', sans-serif;
        }

        .cc-deco-bar {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 4px; border-radius: 0 0 24px 24px;
        }

        .cc-error-banner {
          background: #fff5f5; border: 1px solid #fecaca;
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #dc2626;
          display: flex; align-items: center; gap: 8px;
        }

        .cc-success-banner {
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #16a34a;
          display: flex; align-items: center; gap: 8px;
        }
      `}</style>

      <div
        style={{
          width: 520, minWidth: 480,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "40px 32px",
          background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)",
          borderRadius:"20px",
          animation: "slideInRight 0.7s cubic-bezier(0.34,1.56,0.64,1) both",
          position: "relative", zIndex: 10,
        }}
      >
        <div className="cc-flip-container">
          <div className={`cc-flip-card ${isFlipped ? "flipped" : ""}`}>

            {/* ── FRONT: Login ── */}
            <div className="cc-face">
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#e74c3c", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                  Welcome back
                </p>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111", fontFamily: "'Playfair Display',serif", margin: 0 }}>
                  Sign in
                </h2>
                <p style={{ fontSize: 13, color: "#888", marginTop: 4, marginBottom: 0 }}>
                  Access your Berger account
                </p>
              </div>
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>

                {/* Error Banner */}
                {error && !isFlipped && (
                  <div className="cc-error-banner">
                    <span>⚠️</span>
                    <span>{typeof error === "string" ? error : error.message || "Invalid credentials"}</span>
                  </div>
                )}

                {/* Employee ID */}
                <div className="cc-field-wrap">
                  <input
                    type="text" id="empid" placeholder="x"
                    value={empId} onChange={(e) => setEmpId(e.target.value)}
                    className={error && !isFlipped ? "cc-input-error" : ""}
                    required
                  />
                  <label htmlFor="empid">Employee ID</label>
                  <span className="cc-field-icon-left">🪪</span>
                </div>

                {/* Password */}
                <div className="cc-field-wrap">
                  <input
                    type={showPwd ? "text" : "password"}
                    id="pwd" placeholder="x"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className={error && !isFlipped ? "cc-input-error" : ""}
                    required
                  />
                  <label htmlFor="pwd">Enter password</label>
                  <span className="cc-field-icon-left">🔒</span>
                  <button type="button" className="cc-field-icon-right"
                    onClick={() => setShowPwd(!showPwd)}
                    aria-label={showPwd ? "Hide password" : "Show password"}>
                    {showPwd ? "🙈" : "👁️"}
                  </button>
                </div>

                <button className="cc-btn" type="submit"
                  disabled={loading && !isFlipped} style={{ marginTop: 4 }}>
                  {loading && !isFlipped ? "Signing in..." : "Sign in →"}
                </button>
              </form>

              <div style={{ marginTop: 24, textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
                  Don't have an account?{" "}
                  <button className="cc-link-btn" style={{ color: "#e74c3c" }}
                    onClick={() => { dispatch(clearError()); setIsFlipped(true); }}>
                    Register →
                  </button>
                </p>
              </div>
              <div className="cc-deco-bar" style={{ background: "linear-gradient(90deg,#e74c3c,#8e44ad,#e74c3c)" }} />
            </div>

            {/* ── BACK: Register ── */}
            <div className="cc-face cc-face-back">
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#8e44ad", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                  New account
                </p>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111", fontFamily: "'Playfair Display',serif", margin: 0 }}>
                  Register
                </h2>
                <p style={{ fontSize: 13, color: "#888", marginTop: 4, marginBottom: 0 }}>
                  Create your ChromaCraft account
                </p>
              </div>

              <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>

                {/* Success Banner */}
                {registerSuccess && (
                  <div className="cc-success-banner">
                    <span>✅</span>
                    <span>Request submitted! Redirecting to login...</span>
                  </div>
                )}

                {/* Error Banner */}
                {error && isFlipped && (
                  <div className="cc-error-banner">
                    <span>⚠️</span>
                    <span>{typeof error === "string" ? error : error.message || "Registration failed"}</span>
                  </div>
                )}

                {/* Employee Name */}
                <div className="cc-field-wrap">
                  <input
                    type="text" id="empname" placeholder="x"
                    value={empName} onChange={(e) => setEmpName(e.target.value)}
                    required
                  />
                  <label htmlFor="empname">Employee Name</label>
                  <span className="cc-field-icon-left">👤</span>
                </div>

                {/* Email */}
                <div className="cc-field-wrap">
                  <input
                    type="email" id="regemail" placeholder="x"
                    value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="regemail">Email</label>
                  <span className="cc-field-icon-left">✉️</span>
                </div>

                {/* Date of Birth */}
                <div className="cc-field-wrap">
                  <input
                    type="date" id="dob" placeholder="x"
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                      e.target.classList.toggle("cc-has-val", e.target.value !== "");
                    }}
                    required
                  />
                  <label htmlFor="dob">Date of Birth</label>
                  <span className="cc-field-icon-left">📅</span>
                </div>

                <button className="cc-btn cc-btn-reg" type="submit"
                  disabled={loading && isFlipped} style={{ marginTop: 8 }}>
                  {loading && isFlipped ? "Submitting..." : "Create Account →"}
                </button>
              </form>

              <div style={{ marginTop: 20, textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
                  Already have an account?{" "}
                  <button className="cc-link-btn" style={{ color: "#8e44ad" }}
                    onClick={() => { dispatch(clearError()); setIsFlipped(false); }}>
                    ← Sign in
                  </button>
                </p>
              </div>
              <div className="cc-deco-bar" style={{ background: "linear-gradient(90deg,#8e44ad,#e74c3c,#8e44ad)" }} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}