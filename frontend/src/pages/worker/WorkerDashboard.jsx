import { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { workerApi, bookingApi, jobApi, applicationApi } from '../../lib/api';
import { uploadFile } from '../../lib/supabase';
import ImageUpload from '../../components/ImageUpload';
import JobCard from '../../components/JobCard';
import toast from 'react-hot-toast';
import { LayoutDashboard, User, Calendar, Briefcase, Users, MessageCircle } from 'lucide-react';
import '../customer/CustomerDashboard.css';
import '../customer/Messaging.css';
import Messaging from '../customer/Messaging';
import SendMessageModal from '../../components/SendMessageModal';

const CATEGORIES = ['Electrician', 'Plumber', 'Carpenter', 'House Cleaning', 'Others'];
const STATUS_BADGE = { PENDING:'badge-warning', ACCEPTED:'badge-success', REJECTED:'badge-danger', COMPLETED:'badge-info' };

/* ─── OVERVIEW ─── */
function Overview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ bookings: 0, pending: 0, jobs: 0 });
  useEffect(() => {
    Promise.all([bookingApi.getIncoming(), jobApi.getMyJobs()]).then(([bRes, jRes]) => {
      const b = bRes.data;
      setStats({ bookings: b.length, pending: b.filter(x => x.status === 'PENDING').length, jobs: jRes.data.length });
    }).catch(() => {});
  }, []);
  return (
    <div className="page-enter">
      <div className="page-header"><h2>Welcome, {user?.name?.split(' ')[0]}! 👷</h2><p className="text-muted">Manage your services and bookings</p></div>
      <div className="stats-row">
        <div className="stat-card card"><span className="stat-icon">📅</span><div><div className="stat-num">{stats.bookings}</div><div className="stat-label">Bookings</div></div></div>
        <div className="stat-card card"><span className="stat-icon">⏳</span><div><div className="stat-num">{stats.pending}</div><div className="stat-label">Pending</div></div></div>
        <div className="stat-card card"><span className="stat-icon">📢</span><div><div className="stat-num">{stats.jobs}</div><div className="stat-label">Job Posts</div></div></div>
      </div>
    </div>
  );
}

/* ─── PROFILE ─── */
function WorkerProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ skills:'', category:'Electrician', experience:'', pricePerService:'', availability:'AVAILABLE', bio:'', profileImageUrl:'', workSampleUrl:'' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    workerApi.getProfile(user.userId).then(r => {
      const p = r.data;
      setProfile({ skills: p.skills||'', category: p.category||'Electrician', experience: p.experience||'', pricePerService: p.pricePerService||'', availability: p.availability||'AVAILABLE', bio: p.bio||'', profileImageUrl: p.profileImageUrl||'', workSampleUrl: p.workSampleUrl||'' });
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user.userId]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await workerApi.updateProfile(profile);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center" style={{padding:48}}><div className="spinner"/></div>;

  return (
    <div className="page-enter">
      <div className="page-header"><h2>My Profile</h2><p className="text-muted">Update your worker profile and services</p></div>
      <div className="card" style={{maxWidth:640}}>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
            <ImageUpload bucket="profiles" folder={user.userId} value={profile.profileImageUrl} onChange={url => setProfile({...profile,profileImageUrl:url})} label="Profile Photo" />
            <ImageUpload bucket="work-samples" folder={user.userId} value={profile.workSampleUrl} onChange={url => setProfile({...profile,workSampleUrl:url})} label="Work Sample" />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={profile.category} onChange={e => setProfile({...profile,category:e.target.value})}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Skills</label>
            <input type="text" className="form-input" placeholder="e.g., Wiring, Repairs, AC Installation" value={profile.skills} onChange={e => setProfile({...profile,skills:e.target.value})} />
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="form-group">
              <label className="form-label">Experience (years)</label>
              <input type="number" className="form-input" min={0} value={profile.experience} onChange={e => setProfile({...profile,experience:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Price/Service (₹)</label>
              <input type="number" className="form-input" min={0} value={profile.pricePerService} onChange={e => setProfile({...profile,pricePerService:e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Availability</label>
            <select className="form-select" value={profile.availability} onChange={e => setProfile({...profile,availability:e.target.value})}>
              <option value="AVAILABLE">✅ Available</option>
              <option value="BUSY">🔴 Busy</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-textarea" placeholder="Tell customers about yourself..." value={profile.bio} onChange={e => setProfile({...profile,bio:e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving...':'Save Profile'}</button>
        </form>
      </div>
    </div>
  );
}

/* ─── BOOKINGS ─── */
function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageModal, setMessageModal] = useState(null);

  useEffect(() => {
    bookingApi.getIncoming().then(r => setBookings(r.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await bookingApi.updateStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? res.data : b));
      toast.success(`Booking ${status.toLowerCase()}`);
    } catch { toast.error('Update failed'); }
  };

  if (loading) return <div className="flex justify-center" style={{padding:48}}><div className="spinner"/></div>;

  return (
    <div className="page-enter">
      <div className="page-header"><h2>Manage Bookings</h2><p className="text-muted">Accept or reject incoming service requests</p></div>
      {bookings.length === 0
        ? <div className="empty-state"><div className="empty-state-icon">📅</div><p className="text-muted">No booking requests yet</p></div>
        : <div className="booking-list">
            {bookings.map(b => (
              <div key={b.id} className="card booking-card">
                <div className="booking-info">
                  <div className="booking-name">🙋 {b.customer?.name}</div>
                  <div className="booking-desc">{b.workDescription}</div>
                  <div className="booking-meta">
                    <span className="booking-meta-item">📅 {new Date(b.bookingDate).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</span>
                    {b.address && <span className="booking-meta-item">📍 {b.address}</span>}
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
                  <span className={`badge ${STATUS_BADGE[b.status]||'badge-info'}`}>{b.status}</span>
                  {b.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-outline" style={{color:'var(--color-success)',borderColor:'var(--color-success)'}} onClick={() => updateStatus(b.id,'ACCEPTED')}>Accept</button>
                      <button className="btn btn-sm btn-danger" onClick={() => updateStatus(b.id,'REJECTED')}>Reject</button>
                    </div>
                  )}
                  {b.status === 'ACCEPTED' && (
                    <button className="btn btn-sm btn-primary" onClick={() => updateStatus(b.id,'COMPLETED')}>Mark Done</button>
                  )}
                </div>
                <button className="btn btn-sm btn-ghost" style={{marginTop: 'auto', alignSelf: 'flex-end'}} onClick={() => setMessageModal(b.customer)}>
                  Message
                </button>
              </div>
            ))}
          </div>
      }
      {messageModal && (
        <SendMessageModal 
          receiver={messageModal} 
          onClose={() => setMessageModal(null)} 
          rolePath="worker" 
        />
      )}
    </div>
  );
}

/* ─── POST JOB ─── */
function PostJob() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title:'', jobDescription:'', location:'', city:'', pincode:'', wagePerDay:'', numHelpersNeeded:1, jobDate:'', category:'Electrician' });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [messageModal, setMessageModal] = useState(null);

  const loadJobs = () => jobApi.getMyJobs().then(r => setJobs(r.data)).catch(() => {});
  useEffect(() => { loadJobs(); }, []);

  const submit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await jobApi.create(form);
      toast.success('Job posted!');
      loadJobs();
      setShowForm(false);
      setForm({ title:'',jobDescription:'',location:'',city:'',pincode:'',wagePerDay:'',numHelpersNeeded:1,jobDate:'',category:'Electrician'});
    } catch (err) { toast.error(err.response?.data?.message||'Failed'); }
    finally { setSubmitting(false); }
  };

  const [appModal, setAppModal] = useState(null);
  const [apps, setApps] = useState([]);
  const viewApps = async (job) => {
    setAppModal(job);
    try { const r = await applicationApi.getForJob(job.id); setApps(r.data); }
    catch { toast.error('Failed to load applications'); }
  };
  const updateApp = async (appId, status) => {
    try {
      const r = await applicationApi.updateStatus(appId, status);
      setApps(prev => prev.map(a => a.id === appId ? r.data : a));
      toast.success(`Application ${status.toLowerCase()}`);
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="page-enter">
      <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
        <div><h2>Helper Job Posts</h2><p className="text-muted">Post jobs and manage helper applications</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Post New Job'}</button>
      </div>

      {showForm && (
        <div className="card" style={{marginBottom:24,maxWidth:600}}>
          <h3 style={{marginBottom:16}}>New Job Post</h3>
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:14}}>
            <div className="form-group"><label className="form-label">Job Title</label><input type="text" className="form-input" placeholder="e.g., Need Electrician Helper" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" placeholder="Describe the work..." value={form.jobDescription} onChange={e=>setForm({...form,jobDescription:e.target.value})} /></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="form-group"><label className="form-label">City</label><input type="text" className="form-input" placeholder="Mumbai" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="form-group"><label className="form-label">Wage/Day (₹)</label><input type="number" className="form-input" min={0} value={form.wagePerDay} onChange={e=>setForm({...form,wagePerDay:e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Helpers Needed</label><input type="number" className="form-input" min={1} value={form.numHelpersNeeded} onChange={e=>setForm({...form,numHelpersNeeded:e.target.value})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Job Date</label><input type="date" className="form-input" value={form.jobDate} onChange={e=>setForm({...form,jobDate:e.target.value})} required /></div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting?'Posting...':'Post Job'}</button>
          </form>
        </div>
      )}

      {jobs.length === 0
        ? <div className="empty-state"><div className="empty-state-icon">📢</div><p className="text-muted">No job posts yet. Post your first job!</p></div>
        : <div className="grid-2">{jobs.map(j => <JobCard key={j.id} job={j} showStatus onManage={viewApps} />)}</div>
      }

      {appModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setAppModal(null)}>
          <div className="modal" style={{maxWidth:560}}>
            <h3>Applications for "{appModal.title}"</h3>
            <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:16}}>
              {apps.length===0
                ? <p className="text-muted" style={{textAlign:'center', padding: '20px 0'}}>No applications yet</p>
                : apps.map(a => (
                  <div key={a.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,padding:'12px',background:'var(--color-bg-elevated)',borderRadius:'var(--radius-md)'}}>
                    <div>
                      <div style={{fontWeight:600}}>{a.helper?.name}</div>
                      {a.coverMessage && <div style={{fontSize:13,color:'var(--color-text-muted)',marginTop:2}}>{a.coverMessage}</div>}
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <button className="btn btn-sm btn-ghost" onClick={() => setMessageModal(a.helper)}>Message</button>
                      <span className={`badge ${STATUS_BADGE[a.status]||'badge-info'}`}>{a.status}</span>
                      {a.status==='PENDING'&&(
                        <div className="flex gap-2">
                          <button className="btn btn-sm btn-outline" style={{color:'var(--color-success)',borderColor:'var(--color-success)'}} onClick={()=>updateApp(a.id,'ACCEPTED')}>Accept</button>
                          <button className="btn btn-sm btn-danger" onClick={()=>updateApp(a.id,'REJECTED')}>Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              }
            </div>
            <button className="btn btn-ghost btn-full" style={{marginTop:16}} onClick={()=>setAppModal(null)}>Close</button>
          </div>
        </div>
      )}
      
      {messageModal && (
        <SendMessageModal 
          receiver={messageModal} 
          onClose={() => setMessageModal(null)} 
          rolePath="worker" 
        />
      )}
    </div>
  );
}

/* ─── DASHBOARD ─── */
export default function WorkerDashboard() {
  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <NavLink to="/worker" end className={({isActive})=>`sidebar-link ${isActive?'active':''}`}><LayoutDashboard size={18}/> Overview</NavLink>
            <NavLink to="/worker/profile" className={({isActive})=>`sidebar-link ${isActive?'active':''}`}><User size={18}/> My Profile</NavLink>
            <NavLink to="/worker/bookings" className={({isActive})=>`sidebar-link ${isActive?'active':''}`}><Calendar size={18}/> Bookings</NavLink>
            <NavLink to="/worker/jobs" className={({isActive})=>`sidebar-link ${isActive?'active':''}`}><Briefcase size={18}/> Job Posts</NavLink>
            <NavLink to="/worker/messages" className={({isActive})=>`sidebar-link ${isActive?'active':''}`}><MessageCircle size={18}/> Messages</NavLink>
          </nav>
        </aside>
        <main className="dashboard-main">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="profile" element={<WorkerProfilePage />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="jobs" element={<PostJob />} />
            <Route path="messages" element={<Messaging />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
