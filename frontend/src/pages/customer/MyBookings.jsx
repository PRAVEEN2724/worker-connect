import { useState, useEffect } from 'react';
import { bookingApi, reviewApi } from '../../lib/api';
import toast from 'react-hot-toast';
import { Calendar, MapPin, FileText, Clock } from 'lucide-react';
import '../customer/CustomerDashboard.css';

const STATUS_BADGE = {
  PENDING:   'badge-warning',
  ACCEPTED:  'badge-success',
  REJECTED:  'badge-danger',
  COMPLETED: 'badge-info',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    bookingApi.getMyBookings()
      .then(r => setBookings(r.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await reviewApi.create(reviewModal.worker.id, {
        ...reviewData,
        reviewType: 'CUSTOMER_TO_WORKER',
      });
      toast.success('Review submitted!');
      setReviewModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed');
    }
  };

  if (loading) return <div className="flex justify-center" style={{ padding: 48 }}><div className="spinner" /></div>;

  return (
    <div className="page-enter">
      <div className="page-header">
        <h2>My Bookings</h2>
        <p className="text-muted">Track all your service requests</p>
      </div>

      {bookings.length === 0
        ? <div className="empty-state"><div className="empty-state-icon">📅</div><p className="text-muted">No bookings yet. Go find a worker!</p></div>
        : (
          <div className="booking-list">
            {bookings.map(b => (
              <div key={b.id} className="card booking-card">
                <div className="booking-info">
                  <div className="booking-name">👷 {b.worker?.name}</div>
                  <div className="booking-desc">{b.workDescription}</div>
                  <div className="booking-meta">
                    <span className="booking-meta-item"><Calendar size={12} /> {new Date(b.bookingDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                    {b.address && <span className="booking-meta-item"><MapPin size={12} /> {b.address}</span>}
                    <span className="booking-meta-item"><Clock size={12} /> {new Date(b.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <span className={`badge ${STATUS_BADGE[b.status] || 'badge-info'}`}>{b.status}</span>
                  {b.status === 'COMPLETED' && (
                    <button className="btn btn-outline btn-sm" onClick={() => setReviewModal(b)}>
                      ⭐ Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      }

      {reviewModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setReviewModal(null)}>
          <div className="modal">
            <h3>Rate {reviewModal.worker?.name}</h3>
            <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
              <div className="form-group">
                <label className="form-label">Rating (1–5)</label>
                <input type="number" min={1} max={5} className="form-input" value={reviewData.rating}
                  onChange={e => setReviewData({ ...reviewData, rating: Number(e.target.value) })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Comment</label>
                <textarea className="form-textarea" placeholder="Share your experience..."
                  value={reviewData.comment}
                  onChange={e => setReviewData({ ...reviewData, comment: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <button type="button" className="btn btn-ghost btn-full" onClick={() => setReviewModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-full">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
