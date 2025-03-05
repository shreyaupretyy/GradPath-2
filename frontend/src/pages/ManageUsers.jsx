import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../services/axiosConfig';

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
      setUsers([
        ...users,
        {
          id: response.data.user_id,
          email: newUser.email,
          created_at: new Date().toISOString(),
          has_application: true,
          application_id: response.data.application_id,
          first_name: newUser.first_name,
          last_name: newUser.last_name
        }
      ]);

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
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{
        background: 'linear-gradient(to right, #f8f9fa, #ffffff)'
      }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-4 px-md-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 fw-light mb-0" style={{ letterSpacing: '-0.5px' }}>
            Manage <span className="fw-bold">Users</span>
          </h1>
          <p className="text-muted">Add and manage student records in the system</p>
        </div>
        <div className="col-auto">
          <Link to="/admin/dashboard" className="btn btn-outline-primary" style={{ borderRadius: '8px' }}>
            <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-2 px-3 mb-4" style={{
          borderRadius: '8px',
          fontSize: '0.9rem',
          border: 'none',
          backgroundColor: 'rgba(220, 53, 69, 0.1)'
        }}>
          <i className="bi bi-exclamation-circle me-2"></i>{error}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-5">
          {/* Add New Student Card */}
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div className="card-header border-0 py-3" style={{
              background: 'linear-gradient(135deg, #20c997, #0dcaf0)',
              color: 'white'
            }}>
              <div className="d-flex align-items-center">
                <i className="bi bi-person-plus fs-4 me-2"></i>
                <h3 className="h5 mb-0">Add New Student</h3>
              </div>
            </div>

            <div className="card-body p-4">
              {success && (
                <div className="alert py-2 px-3 mb-4" style={{
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  border: 'none',
                  backgroundColor: 'rgba(25, 135, 84, 0.1)',
                  color: '#198754'
                }}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle me-2"></i>
                    <div>
                      <div>{success}</div>
                      {tempPassword && (
                        <div className="mt-2 bg-white p-2 rounded">
                          <span className="fw-medium">Temporary Password:</span>
                          <span className="user-select-all ms-2 badge bg-dark text-light px-2 py-1" style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                            {tempPassword}
                          </span>
                          <div className="small mt-1">Please note this password as it will not be shown again.</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label small text-muted">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted border-end-0">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0 ps-0"
                      id="email"
                      name="email"
                      placeholder="student@example.com"
                      value={newUser.email}
                      onChange={handleChange}
                      required
                      style={{
                        borderRadius: '8px',
                        padding: '0.6rem 1rem',
                        borderTopLeftRadius: '0',
                        borderBottomLeftRadius: '0'
                      }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="first_name" className="form-label small text-muted">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted border-end-0">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      id="first_name"
                      name="first_name"
                      placeholder="Enter first name"
                      value={newUser.first_name}
                      onChange={handleChange}
                      required
                      style={{
                        borderRadius: '8px',
                        padding: '0.6rem 1rem',
                        borderTopLeftRadius: '0',
                        borderBottomLeftRadius: '0'
                      }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="last_name" className="form-label small text-muted">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted border-end-0">
                      <i className="bi bi-person-fill"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      id="last_name"
                      name="last_name"
                      placeholder="Enter last name"
                      value={newUser.last_name}
                      onChange={handleChange}
                      required
                      style={{
                        borderRadius: '8px',
                        padding: '0.6rem 1rem',
                        borderTopLeftRadius: '0',
                        borderBottomLeftRadius: '0'
                      }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="contact_number" className="form-label small text-muted">
                    Contact Number <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted border-end-0">
                      <i className="bi bi-phone"></i>
                    </span>
                    <input
                      type="tel"
                      className="form-control border-start-0 ps-0"
                      id="contact_number"
                      name="contact_number"
                      placeholder="Enter contact number"
                      value={newUser.contact_number}
                      onChange={handleChange}
                      required
                      style={{
                        borderRadius: '8px',
                        padding: '0.6rem 1rem',
                        borderTopLeftRadius: '0',
                        borderBottomLeftRadius: '0'
                      }}
                    />
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn py-2"
                    style={{
                      background: 'linear-gradient(135deg, #20c997, #0dcaf0)',
                      color: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 3px 6px rgba(32, 201, 151, 0.2)'
                    }}
                  >
                    <i className="bi bi-person-plus me-2"></i>Add Student
                  </button>
                  <button
                    type="reset"
                    className="btn btn-light"
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #dee2e6'
                    }}
                  >
                    <i className="bi bi-x-lg me-2"></i>Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          {/* Student List Card */}
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div className="card-header border-0 py-3" style={{
              background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)',
              color: 'white'
            }}>
              <div className="d-flex align-items-center">
                <i className="bi bi-people fs-4 me-2"></i>
                <h3 className="h5 mb-0">Student List</h3>
              </div>
            </div>

            <div className="card-body p-0">
              {resetSuccess && (
                <div className="alert m-3 py-2 px-3" style={{
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  border: 'none',
                  backgroundColor: 'rgba(25, 135, 84, 0.1)',
                  color: '#198754'
                }}>
                  <div className="d-flex">
                    <i className="bi bi-check-circle me-2"></i>
                    <div>
                      <div>{resetSuccess}</div>
                      <div className="small mt-1">Please note this password as it will not be shown again.</div>
                    </div>
                  </div>
                </div>
              )}

              {users.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-people text-muted fs-1"></i>
                  <p className="mt-3 text-muted">No students found.</p>
                  <p className="text-muted">Add your first student using the form on the left.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.95rem' }}>
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">Email</th>
                        <th>Name</th>
                        <th>Created</th>
                        <th className="text-end pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td className="ps-4">
                            <span className="text-primary">{user.email}</span>
                          </td>
                          <td>
                            {`${user.first_name || ''} ${user.last_name || ''}`}
                          </td>
                          <td>
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="text-end pe-4">
                            <div className="d-flex justify-content-end gap-2">
                              {user.has_application ? (
                                <Link
                                  to={`/admin/application/${user.application_id}`}
                                  className="btn btn-sm px-3 py-1"
                                  style={{
                                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                                    color: '#0d6efd',
                                    borderRadius: '6px'
                                  }}
                                  title="View student's application"
                                >
                                  <i className="bi bi-file-earmark-text me-1"></i>
                                  <span className="d-none d-md-inline">View Application</span>
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
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;