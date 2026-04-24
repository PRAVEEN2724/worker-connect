import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Briefcase, HardHat } from 'lucide-react';
import './Navbar.css';

const roleConfig = {
  CUSTOMER: { label: 'Customer', icon: User, color: '#3b82f6', path: '/customer' },
  WORKER:   { label: 'Worker',   icon: Briefcase, color: '#00d4aa', path: '/worker' },
  HELPER:   { label: 'Helper',   icon: HardHat,   color: '#f59e0b', path: '/helper' },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const config = user ? roleConfig[user.role] : null;
  const RoleIcon = config?.icon;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={config?.path || '/'} className="navbar-brand">
          <div className="navbar-logo">
            <span className="logo-icon">⚡</span>
          </div>
          <span className="navbar-title">Worker<span>Connect</span></span>
        </Link>

        {user && (
          <div className="navbar-right">
            <div className="navbar-user">
              <div className="navbar-role-badge" style={{ '--role-color': config?.color }}>
                {RoleIcon && <RoleIcon size={13} />}
                {config?.label}
              </div>
              <span className="navbar-name">{user.name}</span>
            </div>
            <button className="navbar-logout" onClick={handleLogout} title="Logout">
              <LogOut size={17} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
