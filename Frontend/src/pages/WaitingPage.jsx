import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkStatus } from "../redux/slices/authAction";

const POLL_INTERVAL = 5000;

export function WaitingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.pendingEmail);

  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }

    const interval = setInterval(async () => {
      const result = await dispatch(checkStatus(email));

      if (checkStatus.fulfilled.match(result)) {
        if (result.payload.status === "ACTIVE") {
          clearInterval(interval);
          navigate("/");
        }
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [email, navigate, dispatch]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f9fafb",
      padding: "2rem",
    }}>
      <div style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: "2.5rem 2rem",
        maxWidth: 420,
        width: "100%",
        textAlign: "center",
        fontFamily: "'Inter', sans-serif",
      }}>

        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "#f3f4f6",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem",
          fontSize: 32,
        }}>
          ⏳
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 0.5rem", color: "#111" }}>
          Waiting for approval
        </h2>
        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
          Your registration request has been submitted. Once admin approves your account,
          you'll receive your Employee ID and temporary password via email.
        </p>

        <div style={{
          background: "#f9fafb", borderRadius: 12,
          padding: "1rem", marginBottom: "1.5rem",
          textAlign: "left",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 18, color: "#16a34a" }}>✅</span>
            <span style={{ fontSize: 13, color: "#111", flex: 1 }}>Registration submitted</span>
            <span style={{
              fontSize: 12, background: "#dcfce7", color: "#16a34a",
              padding: "2px 10px", borderRadius: 99,
            }}>Done</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>🔄</span>
            <span style={{ fontSize: 13, color: "#6b7280", flex: 1 }}>Admin approval</span>
            <span style={{
              fontSize: 12, background: "#f3f4f6", color: "#6b7280",
              padding: "2px 10px", borderRadius: 99,
              border: "1px solid #e5e7eb",
            }}>Pending</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>📧</span>
            <span style={{ fontSize: 13, color: "#6b7280", flex: 1 }}>Credentials via email</span>
            <span style={{
              fontSize: 12, background: "#f3f4f6", color: "#6b7280",
              padding: "2px 10px", borderRadius: 99,
              border: "1px solid #e5e7eb",
            }}>Waiting</span>
          </div>
        </div>

        <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
          This page will automatically redirect once approved.
        </p>

      </div>
    </div>
  );
}