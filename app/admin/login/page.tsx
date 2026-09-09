"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#111",
          border: "1px solid #292929",
          borderRadius: "20px",
          padding: "40px",
        }}
      >
        <p
          style={{
            color: "#888",
            fontSize: "12px",
            letterSpacing: "2px",
            marginBottom: "20px",
          }}
        >
          UCHIT.WEB / PRIVATE AREA
        </p>

        <h1
          style={{
            fontSize: "48px",
            lineHeight: "1",
            marginBottom: "15px",
          }}
        >
          ADMIN
          <br />
          <span style={{ color: "#8b5cf6" }}>LOGIN.</span>
        </h1>

        <p style={{ color: "#888", marginBottom: "30px" }}>
          Sign in to manage your portfolio projects.
        </p>

        <form onSubmit={handleLogin}>
          <label style={{ display: "block", marginBottom: "20px" }}>
            <span
              style={{
                display: "block",
                fontSize: "11px",
                letterSpacing: "1px",
                marginBottom: "8px",
              }}
            >
              EMAIL
            </span>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px",
                background: "#080808",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "10px",
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: "20px" }}>
            <span
              style={{
                display: "block",
                fontSize: "11px",
                letterSpacing: "1px",
                marginBottom: "8px",
              }}
            >
              PASSWORD
            </span>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px",
                background: "#080808",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "10px",
              }}
            />
          </label>

          {error && (
            <p style={{ color: "#ff5555", marginBottom: "15px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              background: "#fff",
              color: "#000",
              border: "none",
              borderRadius: "10px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "SIGNING IN..." : "SIGN IN →"}
          </button>
        </form>
      </div>
    </main>
  );
}