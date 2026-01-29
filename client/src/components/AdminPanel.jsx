import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  login,
  logout,
  isLoggedIn,
  verifyToken,
  updateProfile,
  updateLatestProject,
  updateProjects,
  addProject,
  deleteProject,
  fetchAllData,
  uploadHeadlineImage
} from '../api/portfolio';
import './AdminPanel.css';

const AdminPanel = ({ onClose, isPage = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('headline');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Form states
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [data, setData] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (isLoggedIn()) {
      try {
        await verifyToken();
        setIsAuthenticated(true);
        await loadData();
      } catch {
        logout();
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  const loadData = async () => {
    try {
      const fetchedData = await fetchAllData();
      setData(fetchedData);
    } catch (err) {
      showMessage('Failed to load data', 'error');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginForm.username, loginForm.password);
      setIsAuthenticated(true);
      await loadData();
      showMessage('Login successful!', 'success');
    } catch (err) {
      showMessage(err.message, 'error');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setData(null);
    showMessage('Logged out', 'success');
  };

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const saveLatestProject = async () => {
    setSaving(true);
    try {
      await updateLatestProject(data.latestProject);
      showMessage('Headline project saved!', 'success');
    } catch (err) {
      showMessage(err.message, 'error');
    }
    setSaving(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(data.profile);
      showMessage('Profile saved!', 'success');
    } catch (err) {
      showMessage(err.message, 'error');
    }
    setSaving(false);
  };

  const saveProjects = async () => {
    setSaving(true);
    try {
      await updateProjects(data.projects);
      showMessage('Projects saved!', 'success');
    } catch (err) {
      showMessage(err.message, 'error');
    }
    setSaving(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showMessage('Please select an image file', 'error');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('Image must be less than 5MB', 'error');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadHeadlineImage(file);
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      setData({
        ...data,
        latestProject: { ...data.latestProject, image: `${baseUrl}${result.imageUrl}` }
      });
      showMessage('Image uploaded!', 'success');
    } catch (err) {
      showMessage(err.message, 'error');
    }
    setUploading(false);
  };

  const handleAddProject = () => {
    const newProject = {
      id: Date.now(),
      title: 'New Project',
      description: 'Project description',
      tags: ['Tag1'],
      url: '',
      github: '',
      showLiveUrl: false,
      showGithub: false
    };
    setData({ ...data, projects: [...data.projects, newProject] });
  };

  const handleDeleteProject = (id) => {
    setData({ ...data, projects: data.projects.filter(p => p.id !== id) });
  };

  if (loading) {
    return (
      <div className={isPage ? "admin-page-container" : "admin-overlay"}>
        <div className="admin-panel">
          <div className="admin-loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={isPage ? "admin-page-container" : "admin-overlay"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className={`admin-panel ${isPage ? 'admin-panel-page' : ''}`}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <div className="admin-header">
          <h1>Portfolio Admin</h1>
          <button className="admin-close" onClick={onClose}>
            {isPage ? '← Back to Portfolio' : '×'}
          </button>
        </div>

        {message && (
          <div className={`admin-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {!isAuthenticated ? (
          <form className="admin-login" onSubmit={handleLogin}>
            <h2>Login to Admin Panel</h2>
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <>
            <div className="admin-tabs">
              <button 
                className={activeTab === 'headline' ? 'active' : ''} 
                onClick={() => setActiveTab('headline')}
              >
                Headline
              </button>
              <button 
                className={activeTab === 'projects' ? 'active' : ''} 
                onClick={() => setActiveTab('projects')}
              >
                Projects
              </button>
              <button 
                className={activeTab === 'profile' ? 'active' : ''} 
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>

            <div className="admin-content">
              {activeTab === 'headline' && data && (
                <div className="admin-section">
                  <h2>Select Headline Project</h2>
                  <p style={{ marginBottom: '20px', color: '#666', fontSize: '0.9rem' }}>
                    Choose a project from your list to feature as the main headline.
                  </p>
                  <label>
                    Select Project
                    <select
                      value={data.latestProject.title}
                      onChange={(e) => {
                        const selectedProject = data.projects.find(p => p.title === e.target.value);
                        if (selectedProject) {
                          setData({
                            ...data,
                            latestProject: {
                              ...data.latestProject,
                              title: selectedProject.title,
                              subtitle: selectedProject.description,
                              tags: selectedProject.tags,
                              liveUrl: selectedProject.url,
                              githubUrl: selectedProject.github,
                              date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                            }
                          });
                        }
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        marginTop: '8px',
                        padding: '12px 14px',
                        border: '1px solid #333',
                        background: '#0d0d0d',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.9rem',
                        color: '#e0e0e0',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">-- Select a project --</option>
                      {data.projects.map(project => (
                        <option key={project.id} value={project.title}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  
                  {data.latestProject.title && (
                    <>
                      <h3 style={{ marginTop: '30px' }}>Customize Headline Details</h3>
                      <label>
                        Headline Title
                        <input
                          type="text"
                          value={data.latestProject.title}
                          onChange={(e) => setData({
                            ...data,
                            latestProject: { ...data.latestProject, title: e.target.value }
                          })}
                        />
                      </label>
                      <label>
                        Subtitle
                        <input
                          type="text"
                          value={data.latestProject.subtitle}
                          onChange={(e) => setData({
                            ...data,
                            latestProject: { ...data.latestProject, subtitle: e.target.value }
                          })}
                        />
                      </label>
                      <label>
                        Image URL
                        <input
                          type="text"
                          value={data.latestProject.image}
                          onChange={(e) => setData({
                            ...data,
                            latestProject: { ...data.latestProject, image: e.target.value }
                          })}
                          placeholder="Enter URL or upload an image below"
                        />
                      </label>
                      <label>
                        Upload Image
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            style={{
                              flex: 1,
                              padding: '10px',
                              border: '1px solid #333',
                              background: '#0d0d0d',
                              borderRadius: '4px',
                              color: '#e0e0e0',
                              cursor: 'pointer'
                            }}
                          />
                          {uploading && <span style={{ color: '#888' }}>Uploading...</span>}
                        </div>
                        {data.latestProject.image && (
                          <div style={{ marginTop: '12px' }}>
                            <img 
                              src={data.latestProject.image} 
                              alt="Preview" 
                              style={{ 
                                maxWidth: '200px', 
                                maxHeight: '150px', 
                                borderRadius: '4px',
                                border: '1px solid #333'
                              }} 
                            />
                          </div>
                        )}
                      </label>
                      <label>
                        Description (one paragraph per line)
                        <textarea
                          rows={6}
                          value={data.latestProject.description.join('\n\n')}
                          onChange={(e) => setData({
                            ...data,
                            latestProject: { ...data.latestProject, description: e.target.value.split('\n\n').filter(p => p.trim()) }
                          })}
                        />
                      </label>
                    </>
                  )}
                  
                  <button className="save-btn" onClick={saveLatestProject} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Headline'}
                  </button>
                </div>
              )}

              {activeTab === 'projects' && data && (
                <div className="admin-section">
                  <h2>All Projects (Sidebar)</h2>
                  <button className="add-btn" onClick={handleAddProject}>+ Add Project</button>
                  
                  {data.projects.map((project, index) => (
                    <div key={project.id} className="project-item">
                      <div className="project-header">
                        <span>Project {index + 1}</span>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          ×
                        </button>
                      </div>
                      <label>
                        Title
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => {
                            const newProjects = [...data.projects];
                            newProjects[index].title = e.target.value;
                            setData({ ...data, projects: newProjects });
                          }}
                        />
                      </label>
                      <label>
                        Description
                        <input
                          type="text"
                          value={project.description}
                          onChange={(e) => {
                            const newProjects = [...data.projects];
                            newProjects[index].description = e.target.value;
                            setData({ ...data, projects: newProjects });
                          }}
                        />
                      </label>
                      <label>
                        Tags (comma separated)
                        <input
                          type="text"
                          value={project.tags.join(', ')}
                          onChange={(e) => {
                            const newProjects = [...data.projects];
                            newProjects[index].tags = e.target.value.split(',').map(t => t.trim());
                            setData({ ...data, projects: newProjects });
                          }}
                        />
                      </label>
                      
                      <div className="url-toggles" style={{ marginTop: '15px' }}>
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <input
                              type="checkbox"
                              checked={project.showLiveUrl !== false && project.url && project.url !== '#'}
                              onChange={(e) => {
                                const newProjects = [...data.projects];
                                newProjects[index].showLiveUrl = e.target.checked;
                                if (!e.target.checked) newProjects[index].url = '';
                                setData({ ...data, projects: newProjects });
                              }}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <span>Include Live URL</span>
                          </label>
                          {(project.showLiveUrl || (project.url && project.url !== '#')) && (
                            <input
                              type="text"
                              placeholder="https://your-live-site.com"
                              value={project.url || ''}
                              onChange={(e) => {
                                const newProjects = [...data.projects];
                                newProjects[index].url = e.target.value;
                                setData({ ...data, projects: newProjects });
                              }}
                              style={{ marginTop: '5px' }}
                            />
                          )}
                        </div>
                        
                        <div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <input
                              type="checkbox"
                              checked={project.showGithub !== false && project.github && project.github !== '#'}
                              onChange={(e) => {
                                const newProjects = [...data.projects];
                                newProjects[index].showGithub = e.target.checked;
                                if (!e.target.checked) newProjects[index].github = '';
                                setData({ ...data, projects: newProjects });
                              }}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <span>Include GitHub URL</span>
                          </label>
                          {(project.showGithub || (project.github && project.github !== '#')) && (
                            <input
                              type="text"
                              placeholder="https://github.com/user/repo"
                              value={project.github || ''}
                              onChange={(e) => {
                                const newProjects = [...data.projects];
                                newProjects[index].github = e.target.value;
                                setData({ ...data, projects: newProjects });
                              }}
                              style={{ marginTop: '5px' }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button className="save-btn" onClick={saveProjects} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Projects'}
                  </button>
                </div>
              )}

              {activeTab === 'profile' && data && (
                <div className="admin-section">
                  <h2>Profile Information</h2>
                  <label>
                    Name
                    <input
                      type="text"
                      value={data.profile.name}
                      onChange={(e) => setData({
                        ...data,
                        profile: { ...data.profile, name: e.target.value }
                      })}
                    />
                  </label>
                  <label>
                    Title
                    <input
                      type="text"
                      value={data.profile.title}
                      onChange={(e) => setData({
                        ...data,
                        profile: { ...data.profile, title: e.target.value }
                      })}
                    />
                  </label>
                  <label>
                    Subtitle (Newspaper tagline)
                    <input
                      type="text"
                      value={data.profile.subtitle}
                      onChange={(e) => setData({
                        ...data,
                        profile: { ...data.profile, subtitle: e.target.value }
                      })}
                    />
                  </label>
                  <label>
                    Profile Image URL
                    <input
                      type="text"
                      value={data.profile.image}
                      onChange={(e) => setData({
                        ...data,
                        profile: { ...data.profile, image: e.target.value }
                      })}
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      value={data.profile.email}
                      onChange={(e) => setData({
                        ...data,
                        profile: { ...data.profile, email: e.target.value }
                      })}
                    />
                  </label>
                  <label>
                    Bio (one paragraph per line)
                    <textarea
                      rows={6}
                      value={data.profile.bio.join('\n\n')}
                      onChange={(e) => setData({
                        ...data,
                        profile: { ...data.profile, bio: e.target.value.split('\n\n').filter(p => p.trim()) }
                      })}
                    />
                  </label>
                  
                  <h3>Stats</h3>
                  <div className="input-row">
                    <label>
                      Experience
                      <input
                        type="text"
                        value={data.profile.stats.experience}
                        onChange={(e) => setData({
                          ...data,
                          profile: { ...data.profile, stats: { ...data.profile.stats, experience: e.target.value } }
                        })}
                      />
                    </label>
                    <label>
                      Projects
                      <input
                        type="text"
                        value={data.profile.stats.projects}
                        onChange={(e) => setData({
                          ...data,
                          profile: { ...data.profile, stats: { ...data.profile.stats, projects: e.target.value } }
                        })}
                      />
                    </label>
                    <label>
                      Coffee
                      <input
                        type="text"
                        value={data.profile.stats.coffee}
                        onChange={(e) => setData({
                          ...data,
                          profile: { ...data.profile, stats: { ...data.profile.stats, coffee: e.target.value } }
                        })}
                      />
                    </label>
                  </div>

                  <h3>Social Links</h3>
                  <label>
                    GitHub
                    <input
                      type="text"
                      value={data.profile.social.github}
                      onChange={(e) => setData({
                        ...data,
                        profile: { ...data.profile, social: { ...data.profile.social, github: e.target.value } }
                      })}
                    />
                  </label>
                  <label>
                    LinkedIn
                    <input
                      type="text"
                      value={data.profile.social.linkedin}
                      onChange={(e) => setData({
                        ...data,
                        profile: { ...data.profile, social: { ...data.profile.social, linkedin: e.target.value } }
                      })}
                    />
                  </label>
                  <label>
                    Twitter
                    <input
                      type="text"
                      value={data.profile.social.twitter}
                      onChange={(e) => setData({
                        ...data,
                        profile: { ...data.profile, social: { ...data.profile.social, twitter: e.target.value } }
                      })}
                    />
                  </label>
                  
                  <button className="save-btn" onClick={saveProfile} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;
