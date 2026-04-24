import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import './Auth.css';

const ROLES = [
  { value: 'CUSTOMER', label: '🙋 Customer', desc: 'Book services' },
  { value: 'WORKER',   label: '👷 Worker',   desc: 'Offer services' },
  { value: 'HELPER',   label: '🤝 Helper',   desc: 'Find daily work' },
];

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', city: '', pincode: '', role: 'CUSTOMER',
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await authApi.register(form);
      const { token, ...userData } = res.data;
      login(userData, token);
      toast.success(`Welcome to WorkerConnect, ${userData.name}! 🎉`);
      if (userData.role === 'CUSTOMER') navigate('/customer');
      else if (userData.role === 'WORKER') navigate('/worker');
      else navigate('/helper');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-glow" />
      <div className="auth-card card" style={{ maxWidth: 520 }}>
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-icon">⚡</div>
            <span>WorkerConnect</span>
          </Link>
          <h1>Create Account</h1>
          <p className="text-muted">Join the platform for free</p>
        </div>

        {/* Role Picker */}
        <div className="role-picker">
          {ROLES.map(r => (
            <button key={r.value} type="button"
              className={`role-option ${form.role === r.value ? 'active' : ''}`}
              onClick={() => setForm({ ...form, role: r.value })}>
              <span className="role-option-label">{r.label}</span>
              <span className="role-option-desc">{r.desc}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                className="form-input" placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                className="form-input" placeholder="+91 9876543210" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="form-input" placeholder="you@example.com" required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <input type={showPass ? 'text' : 'password'} name="password" value={form.password}
                onChange={handleChange} className="form-input" placeholder="Min 6 characters" required />
              <button type="button" className="input-icon-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange}
                className="form-input" placeholder="Mumbai" />
            </div>
            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input type="text" name="pincode" value={form.pincode} onChange={handleChange}
                className="form-input" placeholder="400001" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><div className="spinner" style={{width:18,height:18}} /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
