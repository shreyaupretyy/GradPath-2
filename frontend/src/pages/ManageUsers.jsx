import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({
    email: '',
    first_name: '',
    last_name: '',
    contact_number: ''
  });
  const [success, setSuccess] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetUserId, setResetUserId] = useState(null);
  const [currentDateTime] = useState('2025-03-05 19:06:04');
  const [currentUser] = useState('shreyaupretyy');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/admin/users');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching users: ' + (error.response?.data?.message || 'Unknown error'));
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTempPassword('');

    try {
      const response = await axios.post('/api/admin/create-student', newUser);
      setSuccess('Student created successfully');
      setTempPassword(response.data.temp_password);
      setUsers([...users, {
        id: response.data.user_id,
        email: newUser.email,
        created_at: currentDateTime,
        has_application: true,
        application_id: response.data.application_id,
        first_name: newUser.first_name,
        last_name: newUser.last_name
      }]);
      
      // Reset form
      setNewUser({
        email: '',
        first_name: '',
        last_name: '',
        contact_number: ''
      });
    } catch (error) {
      setError('Failed to create student: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleResetPassword = async (userId) => {
    setResetSuccess('');
    setResetUserId(null);
    
    try {
      const response = await axios.post(`/api/admin/reset-password/${userId}`);
      setResetUserId(userId);
      setResetSuccess(`Password reset successfully: ${response.data.temp_password}`);
    } catch (error) {
      setError('Failed to reset password: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage User Records</h2>
        <Link to="/admin/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
      
      
      
      <div className="row">
        <div className="col-md-5 mb-4">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">Add New Student Record</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && (
                <div className="alert alert-success">
                  {success}
                  {tempPassword && (
                    <div className="mt-2">
                      <strong>Temporary Password:</strong> {tempPassword}
                      <div className="small text-muted">
                        Please note this password as it will not be shown again.
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="first_name" className="form-label">First Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    value={newUser.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="last_name" className="form-label">Last Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    name="last_name"
                    value={newUser.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="contact_number" className="form-label">Contact Number <span className="text-danger">*</span></label>
                  <input
                    type="tel"
                    className="form-control"
                    id="contact_number"
                    name="contact_number"
                    value={newUser.contact_number}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-success">
                    <i className="bi bi-person-plus-fill"></i> Add Student
                  </button>
                  <button type="reset" className="btn btn-outline-secondary">
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-7">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Student List</h3>
            </div>
            <div className="card-body">
              {resetSuccess && (
                <div className="alert alert-success">
                  {resetSuccess}
                  <div className="small text-muted">
                    Please note this password as it will not be shown again.
                  </div>
                </div>
              )}
              
              {users.length === 0 ? (
                <div className="text-center p-5">
                  <div className="alert alert-info mb-4">No students found.</div>
                  <p className="lead">Add your first student using the form on the left.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.email}</td>
                          <td>{`${user.first_name || ''} ${user.last_name || ''}`}</td>
                          <td>{new Date(user.created_at).toLocaleDateString()}</td>
                          <td>
                            {user.has_application ? (
                              <Link 
                                to={`/admin/application/${user.application_id}`}
                                className="btn btn-sm btn-info me-2"
                              >
                                View Application
                              </Link>
                            ) : (
                              <span className="badge bg-warning text-dark me-2">No Application</span>
                            )}
                            <button 
                              className="btn btn-sm btn-warning"
                              onClick={() => handleResetPassword(user.id)}
                            >
                              Reset Password
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-header bg-info text-white">
              <h3 className="mb-0">Quick Actions</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="d-grid">
                    <Link to="/admin/dashboard" className="btn btn-outline-primary">
                      <i className="bi bi-speedometer2"></i> Dashboard
                    </Link>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-grid">
                    <Link to="/admin/settings" className="btn btn-outline-secondary">
                      <i className="bi bi-gear-fill"></i> Settings
                    </Link>
                  </div>
                </div>
              </div>
              <div className="d-grid">
                <button className="btn btn-outline-success" onClick={() => window.print()}>
                  <i className="bi bi-printer-fill"></i> Print Student List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;