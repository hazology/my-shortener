"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { FaUser, FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null); // 메시지 상태

  async function handleAuth(e) {
    e.preventDefault();
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "로그인 성공!" });
        setTimeout(() => (window.location.href = "/"), 1000);
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "회원가입 성공! 로그인해주세요." });
      }
    }
  }

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height: "100vh", background: "#f5f6fa", fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        background: "#fff", padding: "2rem", borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: 400, textAlign: "center"
      }}>
        <h1 style={{ marginBottom: 20 }}>
          {mode === "login" ? "🔐 로그인" : "📝 회원가입"}
        </h1>

        {/* 메시지 표시 영역 */}
        {message && (
          <div
            style={{
              marginBottom: 12,
              padding: "10px",
              borderRadius: 6,
              color: message.type === "error" ? "#d63031" : "#2ecc71",
              background: message.type === "error" ? "#ffe6e6" : "#e8f9f1",
              border: `1px solid ${message.type === "error" ? "#fab1a0" : "#55efc4"}`
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
            <FaUser style={{ marginRight: 8, color: "#636e72" }} />
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: 1, padding: "10px",
                border: "1px solid #dcdde1", borderRadius: 8
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
            <FaLock style={{ marginRight: 8, color: "#636e72" }} />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                flex: 1, padding: "10px",
                border: "1px solid #dcdde1", borderRadius: 8
              }}
            />
          </div>

          <button type="submit" style={{
            width: "100%", padding: "12px",
            background: "#0984e3", color: "#fff",
            border: "none", borderRadius: 8, fontWeight: "bold",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            cursor: "pointer"
          }}>
            {mode === "login" ? <FaSignInAlt /> : <FaUserPlus />}
            {mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>

        <p style={{ marginTop: 16 }}>
          {mode === "login" ? (
            <>
              계정이 없나요?{" "}
              <button
                onClick={() => setMode("signup")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "1px solid #dcdde1",
                  borderRadius: 6,
                  padding: "4px 8px",
                  cursor: "pointer"
                }}
              >
                <FaUserPlus style={{ color: "#0984e3" }} /> 회원가입
              </button>
            </>
          ) : (
            <>
              이미 계정이 있나요?{" "}
              <button
                onClick={() => setMode("login")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "1px solid #dcdde1",
                  borderRadius: 6,
                  padding: "4px 8px",
                  cursor: "pointer"
                }}
              >
                <FaSignInAlt style={{ color: "#0984e3" }} /> 로그인
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
