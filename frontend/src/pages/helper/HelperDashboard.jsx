import { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { helperApi, jobApi, applicationApi, reviewApi } from '../../lib/api';
import ImageUpload from '../../components/ImageUpload';
import JobCard from '../../components/JobCard';
import toast from 'react-hot-toast';
import { LayoutDashboard, User, Briefcase, FileText, MessageCircle } from 'lucide-react';
import '../customer/Messaging.css';
import Messaging from '../customer/Messaging';
import SendMessageModal from '../../components/SendMessageModal';

const CATEGORIES = ['Electrician', 'Plumber', 'Carpenter', 'House Cleaning', 'Others'];
const APP_STATUS_BADGE = { PENDING:'badge-warning', ACCEPTED:'badge-success', REJECTED:'badge-danger' };

/* ─── OVERVIEW ─── */
function Overview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ apps: 0, accepted: 0 });
  useEffect(() => {
    applicationApi.getMyApplications().then(r => {
      const apps = r.data;
      setStats({ apps: apps.length, accepted: apps.filter(a => a.status === 'ACCEPTED').length });
    }).catch(() => {});
  }, []);
  return (
    <div className="page-enter">
      <div className="page-header"><h2>Welcome, {user?.name?.split(' ')[0]}! 🤝</h2><p className="text-muted">Find work and manage your applications</p></div>
      <div className="stats-row">
        <div className="stat-card card"><span className="stat-icon">📄</span><div><div className="stat-num">{stats.apps}</div><div className="stat-label">Applications</div></div></div>
        <div className="stat-card card"><span className="stat-icon">✅</span><div><div className="stat-num">{stats.accepted}</div><div className="stat-label">Accepted</div></div></div>
      </div>
    </div>
  );
}

/* ─── PROFILE ─── */
function HelperProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ workTypes:'', experience:'', availability:'AVAILABLE', bio:'', profileImageUrl:'' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    helperApi.getProfile(user.userId).then(r => {
      const p = r.data;
      setProfile({ workTypes: p.workTypes||'', experience: p.experience||'', availability: p.availability||'AVAILABLE', bio: p.bio||'', profileImageUrl: p.profileImageUrl||'' });
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user.userId]);

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await helperApi.updateProfile(profile);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message||'Update failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center" style={{padding:48}}><div className="spinner"/></div>;

  return (
    <div className="page-enter">
      <div className="page-header"><h2>My Profile</h2><p className="text-muted">Update your helper profile</p></div>
      <div className="card" style={{maxWidth:560}}>
        <form onSubmit={save} style={{display:'flex',flexDirection:'column',gap:16}}>
          <ImageUpload bucket="profiles" folder={user.userId} value={profile.profileImageUrl} onChange={url=>setProfile({...profile,profileImageUrl:url})} label="Profile Photo" />
          <div className="form-group">
            <label className="form-label">Work Types (what you can do)</label>
            <input type="text" className="form-input" placeholder="e.g., Cleaning, Painting, Lifting" value={profile.workTypes} onChange={e=>setProfile({...profile,workTypes:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Experience (years, optional)</label>
            <input type="number" className="form-input" min={0} value={profile.experience} onChange={e=>setProfile({...profile,experience:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Availability</label>
            <select className="form-select" value={profile.availability} onChange={e=>setProfile({...profile,availability:e.target.value})}>
              <option value="AVAILABLE">✅ Available</option>
              <option value="BUSY">🔴 Busy</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Bio (optional)</label>
            <textarea className="form-textarea" placeholder="Tell workers about yourself..." value={profile.bio} onChange={e=>setProfile({...profile,bio:e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving...':'Save Profile'}</button>
        </form>
      </div>
    </div>
  );
}

/* ─── BROWSE JOBS ─── */
function BrowseJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ city: '', category: '' });
  const [applyModal, setApplyModal] = useState(null);
  const [messageModal, setMessageModal] = useState(null);
  const [coverMsg, setCoverMsg] = useState('');
  const [applying, setApplying] = useState(false);

  const fetchJobs = async (params = {}) => {
    setLoading(true);
    try {
      const filtered = {};
      if (params.city) filtered.city = params.city;
      if (params.category) filtered.category = params.category;
      const res = Object.keys(filtered).length ? await jobApi.search(filtered) : await jobApi.getOpen();
      setJobs(res.data);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchJobs(search); };

  const handleApply = async (e) => {
    e.preventDefault(); setApplying(true);
    try {
      await applicationApi.apply(applyModal.id, coverMsg);
      toast.success('Application sent!');
      setApplyModal(null);
    } catch (err) { toast.error(err.response?.data?.message||'Already applied or failed'); }
    finally { setApplying(false); }
  };

  return (
    <div className="page-enter">
      <div className="page-header"><h2>Browse Jobs</h2><p className="text-muted">Find helper jobs posted by workers near you</p></div>
      <form onSubmit={handleSearch} className="search-bar card-glass">
        <div className="form-group" style={{flex:1}}>
          <input type="text" className="form-input" placeholder="🏙️ City" value={search.city} onChange={e=>setSearch({...search,city:e.target.value})} />
        </div>
        <div className="form-group" style={{width:180}}>
          <select className="form-select" value={search.category} onChange={e=>setSearch({...search,category:e.target.value})}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>Search</button>
      </form>

      {loading
        ? <div className="flex justify-center" style={{padding:48}}><div className="spinner"/></div>
        : jobs.length===0
          ? <div className="empty-state"><div className="empty-state-icon">🔍</div><p className="text-muted">No open jobs found</p></div>
          : <div className="grid-2" style={{marginTop:24}}>{jobs.map(j=><JobCard key={j.id} job={{...j, onMessage: (job) => setMessageModal(job.worker)}} onApply={setApplyModal}/>)}</div>
      }

      {applyModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setApplyModal(null)}>
          <div className="modal">
            <h3>Apply for "{applyModal.title}"</h3>
            <form onSubmit={handleApply} style={{display:'flex',flexDirection:'column',gap:14,marginTop:16}}>
              <div className="form-group">
                <label className="form-label">Cover Message (optional)</label>
                <textarea className="form-textarea" placeholder="Why are you a good fit for this job?" value={coverMsg} onChange={e=>setCoverMsg(e.target.value)} />
              </div>
              <div className="flex gap-3">
                <button type="button" className="btn btn-ghost btn-full" onClick={()=>setApplyModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-full" disabled={applying}>{applying?'Applying...':'Submit Application'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {messageModal && (
        <SendMessageModal 
          receiver={messageModal} 
          onClose={() => setMessageModal(null)} 
          rolePath="helper" 
        />
      )}
    </div>
  );
}

/* ─── MY APPLICATIONS ─── */
function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationApi.getMyApplications().then(r=>setApps(r.data)).catch(()=>toast.error('Failed')).finally(()=>setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center" style={{padding:48}}><div className="spinner"/></div>;

  return (
    <div className="page-enter">
      <div className="page-header"><h2>My Applications</h2><p className="text-muted">Track your job application statuses</p></div>
      {apps.length===0
        ? <div className="empty-state"><div className="empty-state-icon">📄</div><p className="text-muted">You haven't applied to any jobs yet</p></div>
        : <div className="booking-list">
            {apps.map(a => (
              <div key={a.id} className="card booking-card">
                <div className="booking-info">
                  <div className="booking-name">📢 {a.job?.title}</div>
                  <div className="booking-desc">by {a.job?.worker?.name} • {a.job?.city}</div>
                  {a.coverMessage && <div className="booking-desc" style={{marginTop:4}}>"{a.coverMessage}"</div>}
                  <div className="booking-meta">
                    <span className="booking-meta-item">💰 ₹{a.job?.wagePerDay}/day</span>
                    <span className="booking-meta-item">📅 {a.job?.jobDate ? new Date(a.job.jobDate).toLocaleDateString('en-IN') : 'TBD'}</span>
                  </div>
                </div>
                <span className={`badge ${APP_STATUS_BADGE[a.status]||'badge-info'}`}>{a.status}</span>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

/* ─── DASHBOARD ─── */
export default function HelperDashboard() {
  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <NavLink to="/helper" end className={({isActive})=>`sidebar-link ${isActive?'active':''}`}><LayoutDashboard size={18}/> Overview</NavLink>
            <NavLink to="/helper/profile" className={({isActive})=>`sidebar-link ${isActive?'active':''}`}><User size={18}/> My Profile</NavLink>
            <NavLink to="/helper/browse" className={({isActive})=>`sidebar-link ${isActive?'active':''}`}><Briefcase size={18}/> Browse Jobs</NavLink>
            <NavLink to="/helper/applications" className={({isActive})=>`sidebar-link ${isActive?'active':''}`}><FileText size={18}/> My Applications</NavLink>
            <NavLink to="/helper/messages" className={({isActive})=>`sidebar-link ${isActive?'active':''}`}><MessageCircle size={18}/> Messages</NavLink>
          </nav>
        </aside>
        <main className="dashboard-main">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="profile" element={<HelperProfilePage />} />
            <Route path="browse" element={<BrowseJobs />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="messages" element={<Messaging />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
