"use client";

import { useActionState } from "react";
import { Flame, LockKeyhole } from "lucide-react";
import { login } from "../actions";

export default function LoginForm() {
  const [error, action, pending] = useActionState(login, "");
  return (
    <form action={action} className="admin-login-card">
      <div className="admin-login-brand">
        <span className="admin-brand-mark"><Flame aria-hidden="true" size={20} /></span>
        <div><strong>ESSTOFA</strong><span>STOVE WORKS</span></div>
      </div>
      <div className="admin-login-heading">
        <span className="admin-login-icon"><LockKeyhole aria-hidden="true" size={18} /></span>
        <p className="admin-login-eyebrow">Secure workspace</p>
        <h1>Welcome back</h1>
        <p>Sign in with your admin credentials to continue.</p>
      </div>
      <label className="admin-login-field">
        <span>Email address</span>
        <input name="email" type="email" autoComplete="username" required placeholder="name@company.com" className="inp" />
      </label>
      <label className="admin-login-field">
        <span>Password</span>
        <input name="password" type="password" autoComplete="current-password" required placeholder="Enter your password" className="inp" />
      </label>
      {error && <p role="alert" className="admin-login-error">{error}</p>}
      <button disabled={pending} className="btn admin-login-submit">
        {pending ? "Signing in…" : "Sign in to admin"}
      </button>
      <p className="admin-login-note">Authorized Esstofa team members only.</p>
    </form>
  );
}