import { Link } from 'react-router-dom';
import './Landing.css';

const features = [
  { icon: '🔍', title: 'Search & Connect', desc: 'Find skilled workers by city, skill category, and availability. Filter by price and ratings.' },
  { icon: '📅', title: 'Book Services', desc: 'Send booking requests with job details and preferred dates. Workers accept or decline in real-time.' },
  { icon: '📢', title: 'Post Helper Jobs', desc: 'Workers can post helper job openings with wages, dates, and requirements to recruit assistance.' },
  { icon: '⭐', title: 'Ratings & Reviews', desc: 'Build trust through a transparent rating system. Customers rate workers, workers rate helpers.' },
  { icon: '💬', title: 'In-App Messaging', desc: 'Communicate directly between all parties — Customers, Workers, and Helpers — without leaving the app.' },
  { icon: '📸', title: 'Work Portfolios', desc: 'Workers showcase their past work with photos. Helpers display their profile to attract job opportunities.' },
];

const roles = [
  { role: 'Customer', emoji: '🙋', color: '#3b82f6', desc: 'Request services, browse workers by skill and location, book and review professionals.' },
  { role: 'Worker', emoji: '👷', color: '#00d4aa', desc: 'Offer skilled services, manage bookings, post helper jobs and build your reputation.' },
  { role: 'Helper', emoji: '🤝', color: '#f59e0b', desc: 'Browse job postings by workers, apply for daily work, and grow your experience.' },
];

const categories = [
  { name: 'Electrician', icon: '⚡' },
  { name: 'Plumber', icon: '🔧' },
  { name: 'Carpenter', icon: '🪚' },
  { name: 'House Cleaning', icon: '🧹' },
  { name: 'Others', icon: '🔨' },
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <div className="landing-logo-icon">⚡</div>
            <span className="landing-logo-text">Worker<span>Connect</span></span>
          </div>
          <div className="landing-nav-actions">
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero section">
        <div className="hero-bg-glow" />
        <div className="container hero-container">
          <div className="hero-badge">
            <span>🚀</span> Now available across India
          </div>
          <h1 className="hero-title">
            Connect with<br />
            <span className="text-gradient">Skilled Workers</span><br />
            Near You
          </h1>
          <p className="hero-subtitle">
            A multi-role platform connecting <strong>Customers</strong>, <strong>Skilled Workers</strong>, and <strong>Helpers</strong> to collaborate on real-world service jobs — in urban and rural areas.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">
              Start for Free →
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">
              Sign In
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><span className="hero-stat-num">3</span><span>User Roles</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><span className="hero-stat-num">5+</span><span>Categories</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><span className="hero-stat-num">Free</span><span>To Use</span></div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="section roles-section">
        <div className="container">
          <div className="section-header">
            <h2>Built for Everyone</h2>
            <p className="text-muted">Three distinct roles, one powerful platform</p>
          </div>
          <div className="roles-grid">
            {roles.map(r => (
              <div key={r.role} className="role-card" style={{ '--role-color': r.color }}>
                <div className="role-emoji">{r.emoji}</div>
                <h3>{r.role}</h3>
                <p>{r.desc}</p>
                <Link to="/register" className="role-cta">
                  Join as {r.role} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Service Categories</h2>
            <p className="text-muted">Find professionals across all major service types</p>
          </div>
          <div className="categories-grid">
            {categories.map(c => (
              <div key={c.name} className="category-chip">
                <span className="category-emoji">{c.icon}</span>
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need</h2>
            <p className="text-muted">A complete ecosystem for service delivery and collaboration</p>
          </div>
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p className="text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card card-glass">
            <h2>Ready to Get Started?</h2>
            <p className="text-muted">Join thousands of professionals and customers on Worker Connect</p>
            <div className="flex gap-4 justify-center" style={{ marginTop: '24px' }}>
              <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
              <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p className="text-subtle" style={{ textAlign: 'center', fontSize: '13px' }}>
            © 2024 WorkerConnect. Connecting people, enabling work.
          </p>
        </div>
      </footer>
    </div>
  );
}
