import { MapPin, Calendar, DollarSign, Users, Clock } from 'lucide-react';
import './JobCard.css';

export default function JobCard({ job, onApply, onManage, showStatus = false }) {
  const { worker, title, jobDescription, city, wagePerDay, numHelpersNeeded, jobDate, category, status, createdAt } = job;
  const isOpen = status === 'OPEN';

  return (
    <div className="job-card card">
      <div className="job-card-top">
        <div className="job-card-title-row">
          <h3 className="job-title">{title}</h3>
          {showStatus && (
            <span className={`badge ${isOpen ? 'badge-success' : 'badge-warning'}`}>
              {status}
            </span>
          )}
        </div>
        <div className="job-meta-row">
          {category && <span className="job-category badge badge-primary">{category}</span>}
          {worker && <span className="text-muted" style={{ fontSize: '13px' }}>by {worker.name}</span>}
        </div>
      </div>

      {jobDescription && (
        <p className="job-description">{jobDescription}</p>
      )}

      <div className="job-details">
        {city && (
          <div className="job-detail">
            <MapPin size={14} color="#64748b" />
            <span>{city}</span>
          </div>
        )}
        {wagePerDay && (
          <div className="job-detail">
            <DollarSign size={14} color="#10b981" />
            <span style={{ color: '#10b981', fontWeight: 600 }}>₹{wagePerDay}/day</span>
          </div>
        )}
        {numHelpersNeeded && (
          <div className="job-detail">
            <Users size={14} color="#64748b" />
            <span>{numHelpersNeeded} helper{numHelpersNeeded !== 1 ? 's' : ''} needed</span>
          </div>
        )}
        {jobDate && (
          <div className="job-detail">
            <Calendar size={14} color="#64748b" />
            <span>{new Date(jobDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        )}
      </div>

      <div className="job-card-footer">
        <span className="text-subtle" style={{ fontSize: '12px' }}>
          <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
          {new Date(createdAt || Date.now()).toLocaleDateString('en-IN')}
        </span>
        <div className="flex gap-2">
          {onApply && (
            <button className="btn btn-primary btn-sm" onClick={() => onApply(job)} disabled={!isOpen}>
              Apply Now
            </button>
          )}
          {job.onMessage && (
            <button className="btn btn-outline btn-sm" onClick={() => job.onMessage(job)}>
              Message
            </button>
          )}
          {onManage && (
            <button className="btn btn-outline btn-sm" onClick={() => onManage(job)}>
              Manage
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
