import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { workerApi, bookingApi } from '../../lib/api';
import WorkerCard from '../../components/WorkerCard';
import toast from 'react-hot-toast';
import { Search, Calendar, MessageCircle, LayoutDashboard, Star } from 'lucide-react';
import './CustomerDashboard.css';
import Messaging from './Messaging';
import MyBookings from './MyBookings';
import ReviewModal from './ReviewModal';
import SendMessageModal from '../../components/SendMessageModal';

const CATEGORIES = ['All', 'Electrician', 'Plumber', 'Carpenter', 'House Cleaning', 'Others'];

function SearchWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({ city: '', pincode: '', category: '' });
  const [bookingModal, setBookingModal] = useState(null);
  const [messageModal, setMessageModal] = useState(null);
  const [bookingData, setBookingData] = useState({ workDescription: '', bookingDate: '', address: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchWorkers = async (params = {}) => {
    setLoading(true);
    try {
      const filtered = {};
      if (params.city) filtered.city = params.city;
      if (params.pincode) filtered.pincode = params.pincode;
      if (params.category && params.category !== 'All') filtered.category = params.category;
      const res = Object.keys(filtered).length
        ? await workerApi.search(filtered)
        : await workerApi.getAll();
      setWorkers(res.data);
    } catch { toast.error('Failed to load workers'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWorkers(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWorkers(search);
  };

  const handleBook = (worker) => {
    setBookingModal(worker);
    setBookingData({ workDescription: '', bookingDate: '', address: '' });
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await bookingApi.create(bookingModal.user.id, bookingData);
      toast.success('Booking request sent!');
      setBookingModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <h2>Find Workers</h2>
        <p className="text-muted">Search skilled professionals by location and category</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-bar card-glass">
        <div className="form-group" style={{ flex: 1 }}>
          <input type="text" className="form-input" placeholder="🏙️ City (e.g., Mumbai)"
            value={search.city} onChange={e => setSearch({ ...search, city: e.target.value })} />
        </div>
        <div className="form-group" style={{ width: 140 }}>
          <input type="text" className="form-input" placeholder="📍 Pincode"
            value={search.pincode} onChange={e => setSearch({ ...search, pincode: e.target.value })} />
        </div>
        <div className="form-group" style={{ width: 180 }}>
          <select className="form-select" value={search.category}
            onChange={e => setSearch({ ...search, category: e.target.value })}>
            {CATEGORIES.map(c => <option key={c} value={c === 'All' ? '' : c}>{c}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <Search size={16} /> Search
        </button>
      </form>

      {/* Results */}
      {loading
        ? <div className="flex justify-center" style={{ padding: 48 }}><div className="spinner" /></div>
        : workers.length === 0
          ? <div className="empty-state"><div className="empty-state-icon">👷</div><p className="text-muted">No workers found. Try a different search.</p></div>
          : <div className="grid-3" style={{ marginTop: 24 }}>
              {workers.map(w => <WorkerCard key={w.id} worker={{...w, onMessage: (worker) => setMessageModal(worker.user)}} onBook={handleBook} />)}
            </div>
      }

      {/* Booking Modal */}
      {bookingModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setBookingModal(null)}>
          <div className="modal">
            <h3 style={{ marginBottom: 4 }}>Book {bookingModal.user?.name}</h3>
            <p className="text-muted" style={{ fontSize: 13, marginBottom: 20 }}>
              Fill in your service details and preferred date
            </p>
            <form onSubmit={submitBooking} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Work Description</label>
                <textarea className="form-textarea" placeholder="Describe the work needed..." required
                  value={bookingData.workDescription}
                  onChange={e => setBookingData({ ...bookingData, workDescription: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Date</label>
                <input type="date" className="form-input" required min={new Date().toISOString().split('T')[0]}
                  value={bookingData.bookingDate}
                  onChange={e => setBookingData({ ...bookingData, bookingDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Your Address</label>
                <input type="text" className="form-input" placeholder="Street, City, Pincode" required
                  value={bookingData.address}
                  onChange={e => setBookingData({ ...bookingData, address: e.target.value })} />
              </div>
              <div className="flex gap-3" style={{ marginTop: 4 }}>
                <button type="button" className="btn btn-ghost btn-full" onClick={() => setBookingModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Booking Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageModal && (
        <SendMessageModal 
          receiver={messageModal} 
          onClose={() => setMessageModal(null)} 
          rolePath="customer" 
        />
      )}
    </div>
  );
}

function Overview() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    bookingApi.getMyBookings().then(r => setBookings(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const pending = bookings.filter(b => b.status === 'PENDING').length;
  const accepted = bookings.filter(b => b.status === 'ACCEPTED').length;

  return (
    <div className="page-enter">
      <div className="page-header">
        <h2>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
        <p className="text-muted">Here's a snapshot of your activity</p>
      </div>
      <div className="stats-row">
        <div className="stat-card card">
          <span className="stat-icon">📅</span>
          <div><div className="stat-num">{bookings.length}</div><div className="stat-label">Total Bookings</div></div>
        </div>
        <div className="stat-card card">
          <span className="stat-icon">⏳</span>
          <div><div className="stat-num">{pending}</div><div className="stat-label">Pending</div></div>
        </div>
        <div className="stat-card card">
          <span className="stat-icon">✅</span>
          <div><div className="stat-num">{accepted}</div><div className="stat-label">Accepted</div></div>
        </div>
      </div>
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <p className="text-muted" style={{ marginBottom: 12 }}>Ready to find a professional?</p>
        <NavLink to="/customer/search" className="btn btn-primary btn-lg">
          <Search size={18} /> Browse Workers
        </NavLink>
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <NavLink to="/customer" end className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Overview
            </NavLink>
            <NavLink to="/customer/search" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Search size={18} /> Find Workers
            </NavLink>
            <NavLink to="/customer/bookings" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Calendar size={18} /> My Bookings
            </NavLink>
            <NavLink to="/customer/messages" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <MessageCircle size={18} /> Messages
            </NavLink>
          </nav>
        </aside>
        <main className="dashboard-main">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="search" element={<SearchWorkers />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="messages" element={<Messaging />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
