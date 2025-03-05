import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const [systemInfo] = useState({
    version: '1.0.0',
    lastUpdate: '2025-03-05 19:06:04',
    environment: 'Production',
    currentUser: 'shreyaupretyy',
    serverStatus: 'Online',
    totalUsers: 14,
    totalApplications: 12,
    databaseSize: '24.5 MB',
    uploadsFolderSize: '128.7 MB'
  });
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [settings, setSettings] = useState({
    systemEmail: 'system@applicantstudies.edu',
    notificationSetting: 'important',
    maxFileSize: 10,
    maintenanceMode: false,
    enableEmails: true,
    darkMode: false,
    autoLogoutMinutes: 30,
    defaultLanguage: 'English'
  });
  
  const handleBackup = () => {
    setIsBackingUp(true);
    setError('');
    
    // Simulate backup functionality
    setTimeout(() => {
      setSuccess('System backup completed successfully.');
      setIsBackingUp(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 2500);
  };
  
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmitSettings = (e) => {
    e.preventDefault();
    setSuccess('Settings updated successfully.');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>System Settings</h2>
        <Link to="/admin/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
      
      <div className="system-info mb-4">
        <div className="card bg-light">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <strong>Current Date/Time (UTC):</strong> {systemInfo.lastUpdate}
              </div>
              <div>
                <strong>Logged in as:</strong> <span className="badge bg-success">Admin</span>
              </div>
              <div>
                <strong>Current User:</strong> {systemInfo.currentUser}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">System Information</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>Version:</strong> {systemInfo.version}
              </div>
              <div className="mb-3">
                <strong>Last Update:</strong> {systemInfo.lastUpdate}
              </div>
              <div className="mb-3">
                <strong>Environment:</strong> {systemInfo.environment}
              </div>
              <div className="mb-3">
                <strong>Server Status:</strong> <span className="badge bg-success">{systemInfo.serverStatus}</span>
              </div>
              <hr />
              <div className="mb-3">
                <strong>Total Users:</strong> {systemInfo.totalUsers}
              </div>
              <div className="mb-3">
                <strong>Total Applications:</strong> {systemInfo.totalApplications}
              </div>
              <div className="mb-3">
                <strong>Database Size:</strong> {systemInfo.databaseSize}
              </div>
              <div className="mb-3">
                <strong>Uploads Folder Size:</strong> {systemInfo.uploadsFolderSize}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
        <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Maintenance</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <button 
                  className="btn btn-warning w-100"
                  onClick={handleBackup}
                  disabled={isBackingUp}
                >
                  {isBackingUp ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Backing up...
                    </>
                  ) : (
                    <>Backup System Data</>
                  )}
                </button>
              </div>
              <div className="mb-3">
                <button 
                  className="btn btn-info w-100"
                >
                  Check for Updates
                </button>
              </div>
              <div className="mb-3">
                <button 
                  className="btn btn-danger w-100"
                >
                  Clear Application Cache
                </button>
              </div>
              
              <div className="alert alert-info">
                <strong>Last System Check:</strong> 2025-03-05 19:09:44
                <br />
                <strong>Status:</strong> All systems operational
              </div>
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">Quick Links</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6 mb-2">
                  <Link to="/admin/dashboard" className="btn btn-outline-primary w-100">
                    <i className="bi bi-speedometer2"></i> Dashboard
                  </Link>
                </div>
                <div className="col-6 mb-2">
                  <Link to="/admin/manage-users" className="btn btn-outline-success w-100">
                    <i className="bi bi-people-fill"></i> Users
                  </Link>
                </div>
                <div className="col-12">
                  <button className="btn btn-outline-secondary w-100" onClick={() => window.location.reload()}>
                    <i className="bi bi-arrow-clockwise"></i> Refresh Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">System Configuration</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmitSettings}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="systemEmail" className="form-label">System Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="systemEmail"
                    name="systemEmail"
                    value={settings.systemEmail}
                    onChange={handleSettingChange}
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="notificationSetting" className="form-label">Email Notification Setting</label>
                  <select
                    className="form-select"
                    id="notificationSetting"
                    name="notificationSetting"
                    value={settings.notificationSetting}
                    onChange={handleSettingChange}
                  >
                    <option value="all">All Activities</option>
                    <option value="important">Important Only</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="maxFileSize" className="form-label">Maximum File Upload Size (MB)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="maxFileSize"
                    name="maxFileSize"
                    value={settings.maxFileSize}
                    onChange={handleSettingChange}
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="autoLogoutMinutes" className="form-label">Auto Logout Time (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="autoLogoutMinutes"
                    name="autoLogoutMinutes"
                    value={settings.autoLogoutMinutes}
                    onChange={handleSettingChange}
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="defaultLanguage" className="form-label">Default Language</label>
                  <select
                    className="form-select"
                    id="defaultLanguage"
                    name="defaultLanguage"
                    value={settings.defaultLanguage}
                    onChange={handleSettingChange}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </div>
                
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="maintenanceMode"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleSettingChange}
                  />
                  <label className="form-check-label" htmlFor="maintenanceMode">
                    Enable Maintenance Mode
                  </label>
                </div>
                
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="enableEmails"
                    name="enableEmails"
                    checked={settings.enableEmails}
                    onChange={handleSettingChange}
                  />
                  <label className="form-check-label" htmlFor="enableEmails">
                    Enable Email Notifications
                  </label>
                </div>
                
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="darkMode"
                    name="darkMode"
                    checked={settings.darkMode}
                    onChange={handleSettingChange}
                  />
                  <label className="form-check-label" htmlFor="darkMode">
                    Dark Mode (Admin Interface)
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-3 d-flex justify-content-between">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => window.location.reload()}
              >
                Reset Changes
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header bg-info text-white">
          <h3 className="mb-0">System Activity</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Date/Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2025-03-05 19:09:44</td>
                  <td>shreyaupretyy</td>
                  <td>Login</td>
                  <td>Admin login from IP 192.168.1.105</td>
                </tr>
                <tr>
                  <td>2025-03-05 19:05:22</td>
                  <td>shreyaupretyy</td>
                  <td>Update</td>
                  <td>Updated application #47</td>
                </tr>
                <tr>
                  <td>2025-03-05 19:01:15</td>
                  <td>shreyaupretyy</td>
                  <td>Create</td>
                  <td>Created new student user</td>
                </tr>
                <tr>
                  <td>2025-03-05 18:58:03</td>
                  <td>system</td>
                  <td>Backup</td>
                  <td>Automatic database backup</td>
                </tr>
                <tr>
                  <td>2025-03-05 18:45:17</td>
                  <td>shreyaupretyy</td>
                  <td>View</td>
                  <td>Viewed application #32</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="text-center text-muted">
        <p>
          Higher Applicant Studies System v1.0.0 &copy; 2025
          <br />
          Current server time: 2025-03-05 19:09:44 UTC
          <br />
          Logged in as: shreyaupretyy
        </p>
      </div>
    </div>
  );
};

export default Settings;