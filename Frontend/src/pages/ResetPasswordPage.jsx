// src/pages/ResetPasswordPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../redux/slices/authAction";

export function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token, isAuthenticated, isFirstLogin, role } = useSelector((state) => state.auth);


  useEffect(() => {
  if (!isAuthenticated) return;
  if (isFirstLogin) return; 
  navigate("/dashboard");
//   const path = ROLE_ROUTES[role] || "/dashboard";
//   navigate(path);
}, [isAuthenticated, isFirstLogin, role, navigate]);

const ROLE_ROUTES = {
  admin: "/admin/dashboard",
  manager: "/manager/dashboard",
  employee: "/employee/dashboard",
};
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [success, setSuccess]                 = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(changePassword({ new_password: newPassword, confirm_password: confirmPassword, token }));
    if (changePassword.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
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

        .rp-card {
          border-radius: 24px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 24px 64px rgba(0,0,0,0.10);
          display: flex; flex-direction: column;
          padding: 36px 32px;
          position: relative; overflow: hidden;
          animation: slideInUp 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
          width: 100%; max-width: 400px;
        }

        .rp-field-wrap { position: relative; }

        .rp-field-wrap input {
          width: 100%; height: 56px;
          padding: 22px 42px 8px 42px;
          border: 1.5px solid #e5e7eb; border-radius: 12px;
          font-size: 14px; font-family: 'Inter', sans-serif;
          outline: none; background: #f9fafb; color: #111;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          caret-color: #e74c3c; box-sizing: border-box;
        }
        .rp-field-wrap input::placeholder { color: transparent; }
        .rp-field-wrap input:focus {
          border-color: #e74c3c; background: #fff;
          box-shadow: 0 0 0 3px rgba(231,76,60,0.10);
        }
        .rp-field-wrap input.rp-error {
          border-color: #e74c3c; background: #fff5f5;
          animation: shake 0.4s ease;
        }

        .rp-field-wrap label {
          position: absolute; left: 42px; top: 50%;
          transform: translateY(-50%);
          font-size: 14px; color: #9ca3af;
          pointer-events: none;
          transition: top 0.18s ease, font-size 0.18s ease, color 0.18s ease, transform 0.18s ease;
          z-index: 3; font-family: 'Inter', sans-serif; line-height: 1;
        }
        .rp-field-wrap input:focus + label,
        .rp-field-wrap input:not(:placeholder-shown) + label {
          top: 10px; transform: translateY(0);
          font-size: 10px; font-weight: 700;
          color: #e74c3c; letter-spacing: 0.05em; text-transform: uppercase;
        }

        .rp-icon-left {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          font-size: 17px; color: #c0c0c0;
          pointer-events: none; z-index: 2; transition: color 0.2s;
        }
        .rp-field-wrap input:focus ~ .rp-icon-left { color: #e74c3c; }

        .rp-icon-right {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          font-size: 17px; color: #c0c0c0;
          cursor: pointer; z-index: 2;
          background: none; border: none; padding: 0;
          display: flex; align-items: center; transition: color 0.2s;
        }
        .rp-icon-right:hover { color: #e74c3c; }

        .rp-btn {
          width: 100%; height: 48px; border: none; border-radius: 12px;
          font-size: 15px; font-weight: 600; font-family: 'Inter', sans-serif;
          cursor: pointer; color: #fff; position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          background: linear-gradient(135deg, #e74c3c 0%, #8e44ad 100%);
        }
        .rp-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          background-size: 200% 100%; animation: shimmer 2s infinite;
        }
        .rp-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(231,76,60,0.4); }
        .rp-btn:active:not(:disabled) { transform: translateY(0); }
        .rp-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .rp-deco-bar {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 4px; border-radius: 0 0 24px 24px;
          background: linear-gradient(90deg, #e74c3c, #8e44ad, #e74c3c);
        }

        .rp-error-banner {
          background: #fff5f5; border: 1px solid #fecaca;
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #dc2626;
          display: flex; align-items: center; gap: 8px;
        }

        .rp-success-banner {
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #16a34a;
          display: flex; align-items: center; gap: 8px;
        }

        .rp-rule {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; color: #9ca3af;
        }
        .rp-rule.met { color: #16a34a; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)",
        padding: "2rem",
        fontFamily: "'Inter', sans-serif",
      }}>
        <div className="rp-card">

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#e74c3c", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
              First time login
            </p>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111", fontFamily: "'Playfair Display', serif", margin: 0 }}>
              Set Password
            </h2>
            <p style={{ fontSize: 13, color: "#888", marginTop: 4, marginBottom: 0 }}>
              Create a strong password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Success Banner */}
            {success && (
              <div className="rp-success-banner">
                <span>✅</span>
                <span>Password changed! Redirecting to login...</span>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="rp-error-banner">
                <span>⚠️</span>
                <span>{typeof error === "string" ? error : error.message || "Something went wrong"}</span>
              </div>
            )}

            {/* New Password */}
            <div className="rp-field-wrap">
              <input
                type={showNew ? "text" : "password"}
                id="newpwd" placeholder="x"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={error ? "rp-error" : ""}
                required
              />
              <label htmlFor="newpwd">New Password</label>
              <span className="rp-icon-left">🔒</span>
              <button type="button" className="rp-icon-right"
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? "Hide" : "Show"}>
                {showNew ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="rp-field-wrap">
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmpwd" placeholder="x"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={error ? "rp-error" : ""}
                required
              />
              <label htmlFor="confirmpwd">Confirm Password</label>
              <span className="rp-icon-left">🔑</span>
              <button type="button" className="rp-icon-right"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide" : "Show"}>
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Password Rules */}
            {newPassword && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "8px 12px", background: "#f9fafb", borderRadius: 10 }}>
                <div className={`rp-rule ${newPassword.length >= 8 ? "met" : ""}`}>
                  {newPassword.length >= 8 ? "✅" : "⬜"} Min 8 characters
                </div>
                <div className={`rp-rule ${/[A-Z]/.test(newPassword) ? "met" : ""}`}>
                  {/[A-Z]/.test(newPassword) ? "✅" : "⬜"} One uppercase letter
                </div>
                <div className={`rp-rule ${/[a-z]/.test(newPassword) ? "met" : ""}`}>
                  {/[a-z]/.test(newPassword) ? "✅" : "⬜"} One lowercase letter
                </div>
                <div className={`rp-rule ${/\d/.test(newPassword) ? "met" : ""}`}>
                  {/\d/.test(newPassword) ? "✅" : "⬜"} One number
                </div>
                <div className={`rp-rule ${/[@$!%*?&]/.test(newPassword) ? "met" : ""}`}>
                  {/[@$!%*?&]/.test(newPassword) ? "✅" : "⬜"} One special character (@$!%*?&)
                </div>
                <div className={`rp-rule ${newPassword === confirmPassword && confirmPassword ? "met" : ""}`}>
                  {newPassword === confirmPassword && confirmPassword ? "✅" : "⬜"} Passwords match
                </div>
              </div>
            )}

            <button className="rp-btn" type="submit"
              disabled={loading} style={{ marginTop: 4 }}>
              {loading ? "Saving..." : "Set Password →"}
            </button>

          </form>

          <div className="rp-deco-bar" />
        </div>
      </div>
    </>
  );
}