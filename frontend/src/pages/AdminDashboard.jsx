import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../services/axiosConfig';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('/api/get-all-applications');
        setApplications(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching applications: ' + (error.response?.data?.message || 'Unknown error'));
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`/api/delete-application/${id}`);
        setApplications(applications.filter(app => app.id !== id));
        setDeleteSuccess('Application deleted successfully');
        setTimeout(() => setDeleteSuccess(''), 3000);
      } catch (error) {
        setError('Error deleting application: ' + (error.response?.data?.message || 'Unknown error'));
      }
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
          <p className="text-muted">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-4 px-md-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 fw-light mb-0" style={{ letterSpacing: '-0.5px' }}>
            Admin <span className="fw-bold">Dashboard</span>
          </h1>
          <p className="text-muted">Manage applications and system settings</p>
        </div>
        <div className="col-auto d-flex align-items-center">
          <Link to="/admin/manage-users" className="btn btn-outline-primary me-2" style={{ borderRadius: '8px' }}>
            <i className="bi bi-people me-2"></i>Manage Users
          </Link>
          {/* <Link to="/admin/settings" className="btn btn-outline-secondary" style={{ borderRadius: '8px' }}>
            <i className="bi bi-gear me-2"></i>Settings
          </Link> */}
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
      
      {deleteSuccess && (
        <div className="alert alert-success py-2 px-3 mb-4" style={{
          borderRadius: '8px',
          fontSize: '0.9rem',
          border: 'none',
          backgroundColor: 'rgba(25, 135, 84, 0.1)'
        }}>
          <i className="bi bi-check-circle me-2"></i>{deleteSuccess}
        </div>
      )}
      
      {/* Total Applications Card */}
      <div className="row mb-4">
        <div className="col-md-6 col-xl-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                  <i className="bi bi-file-earmark-text text-primary fs-4"></i>
                </div>
                <div>
                  <h5 className="card-title mb-1">Total Applications</h5>
                  <h2 className="fw-bold text-primary mb-0">{applications.length}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Applications Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <div className="card-header py-3 bg-white border-bottom">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="h5 mb-0">
              <i className="bi bi-file-earmark-text text-primary me-2"></i>
              Applications
            </h3>
            <div className="input-group" style={{ maxWidth: '250px' }}>
              <span className="input-group-text bg-white text-muted border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input 
                type="search" 
                className="form-control border-start-0 ps-0" 
                placeholder="Search applications" 
                style={{ borderRadius: '8px', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }} 
              />
            </div>
          </div>
        </div>
        
        <div className="card-body p-0">
          {applications.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted fs-1"></i>
              <p className="mt-3 text-muted">No applications found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0" style={{ fontSize: '0.95rem' }}>
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">ID</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Gender</th>
                    <th className="text-center">Final %</th>
                    <th>Created</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(application => (
                    <tr key={application.id}>
                      <td className="ps-4 fw-medium">{application.id}</td>
                      <td>
                        <span className="text-primary">{application.email}</span>
                      </td>
                      <td>
                        {`${application.first_name || ''} ${application.last_name || ''}`}
                      </td>
                      <td>{application.contact_number}</td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {application.gender}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${application.final_percentage >= 80 ? 'bg-success' : application.final_percentage >= 60 ? 'bg-primary' : 'bg-warning'}`}>
                          {application.final_percentage}%
                        </span>
                      </td>
                      <td>
                        {new Date(application.created_at).toLocaleDateString()}
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <Link 
                            to={`/admin/application/${application.id}`}
                            className="btn btn-sm px-2 py-1"
                            style={{ 
                              backgroundColor: 'rgba(13, 110, 253, 0.1)', 
                              color: '#0d6efd',
                              borderRadius: '6px' 
                            }}
                            title="View Application"
                          >View
                            <i className="bi bi-eye"></i>
                          </Link>
                          <Link 
                            to={`/admin/edit-application/${application.id}`}
                            className="btn btn-sm px-2 py-1"
                            style={{ 
                              backgroundColor: 'rgba(255, 193, 7, 0.1)', 
                              color: '#ffc107',
                              borderRadius: '6px' 
                            }}
                            title="Edit Application"
                          >Edit
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button 
                            className="btn btn-sm px-2 py-1"
                            style={{ 
                              backgroundColor: 'rgba(220, 53, 69, 0.1)', 
                              color: '#dc3545',
                              borderRadius: '6px' 
                            }}
                            onClick={() => handleDelete(application.id)}
                            title="Delete Application"
                          >Delete
                            <i className="bi bi-trash"></i>
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
        
        <div className="card-footer bg-white py-3 border-top">
          <div className="d-flex justify-content-between align-items-center">
            <div className="small text-muted">
              Showing {applications.length} of {applications.length} applications
            </div>
            <nav aria-label="Page navigation">
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item disabled">
                  <span className="page-link">Previous</span>
                </li>
                <li className="page-item active">
                  <span className="page-link">1</span>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">Next</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;