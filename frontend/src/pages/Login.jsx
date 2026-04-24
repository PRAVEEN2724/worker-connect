import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form);
      const { token, ...userData } = res.data;
      login(userData, token);
      toast.success(`Welcome back, ${userData.name}!`);
      if (userData.role === 'CUSTOMER') navigate('/customer');
      else if (userData.role === 'WORKER') navigate('/worker');
      else navigate('/helper');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-glow" />
      <div className="auth-card card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-icon">⚡</div>
            <span>WorkerConnect</span>
          </Link>
          <h1>Welcome back</h1>
          <p className="text-muted">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} className="form-input"
              placeholder="you@example.com" required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <input
                type={showPass ? 'text' : 'password'} name="password" value={form.password}
                onChange={handleChange} className="form-input"
                placeholder="••••••••" required
              />
              <button type="button" className="input-icon-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><div className="spinner" style={{width:18,height:18}} /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/register" className="auth-link">Create one free</Link>
        </p>
      </div>
    </div>
  );
}
