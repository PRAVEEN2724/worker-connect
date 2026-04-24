import { Star, MapPin, Briefcase, Clock, DollarSign } from 'lucide-react';
import './WorkerCard.css';

const CATEGORIES = {
  Electrician: '⚡',
  Plumber: '🔧',
  Carpenter: '🪚',
  'House Cleaning': '🧹',
  Others: '🔨',
};

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="stars">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={13}
          fill={i < full ? '#f59e0b' : 'none'}
          color={i < full || (i === full && half) ? '#f59e0b' : '#475569'}
          strokeWidth={1.5}
        />
      ))}
      <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '2px' }}>
        ({rating?.toFixed(1) || '0.0'})
      </span>
    </div>
  );
}

export default function WorkerCard({ worker, onBook }) {
  const { user, skills, category, pricePerService, availability, averageRating, totalRatings, profileImageUrl, experience } = worker;
  const emoji = CATEGORIES[category] || '🔨';
  const isAvailable = availability === 'AVAILABLE';

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="worker-card card">
      <div className="worker-card-header">
        {profileImageUrl
          ? <img src={profileImageUrl} alt={user?.name} className="avatar avatar-md worker-avatar" />
          : <div className="avatar-placeholder avatar-md worker-avatar">{initials}</div>
        }
        <div className="worker-card-info">
          <h3 className="worker-name">{user?.name}</h3>
          <div className="worker-category">
            <span>{emoji}</span>
            <span>{category || 'General'}</span>
          </div>
          <Stars rating={averageRating || 0} />
        </div>
        <span className={`avail-dot ${isAvailable ? 'available' : 'busy'}`} title={availability} style={{ marginLeft: 'auto', alignSelf: 'flex-start', marginTop: '4px' }} />
      </div>

      <div className="worker-card-body">
        <div className="worker-detail">
          <MapPin size={14} color="#64748b" />
          <span>{user?.city || 'Unknown'}{user?.pincode ? `, ${user.pincode}` : ''}</span>
        </div>
        {skills && (
          <div className="worker-detail">
            <Briefcase size={14} color="#64748b" />
            <span>{skills}</span>
          </div>
        )}
        {experience != null && (
          <div className="worker-detail">
            <Clock size={14} color="#64748b" />
            <span>{experience} yr{experience !== 1 ? 's' : ''} experience</span>
          </div>
        )}
        <div className="worker-detail">
          <DollarSign size={14} color="#64748b" />
          <span className="worker-price">₹{pricePerService || 'Quote'}<span className="text-subtle">/service</span></span>
        </div>
      </div>

      <div className="worker-card-footer">
        <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}>
          <span className={`avail-dot ${isAvailable ? 'available' : 'busy'}`} />
          {isAvailable ? 'Available' : 'Busy'}
        </span>
        <div className="flex gap-2">
          {onBook && (
            <button className="btn btn-primary btn-sm" onClick={() => onBook(worker)} disabled={!isAvailable}>
              Book Now
            </button>
          )}
          {worker.onMessage && (
            <button className="btn btn-outline btn-sm" onClick={() => worker.onMessage(worker)}>
              Message
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
