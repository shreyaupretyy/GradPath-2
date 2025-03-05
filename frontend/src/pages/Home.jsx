import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../services/axiosConfig';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('/api/check-auth');
        if (response.data.authenticated) {
          setUser({
            id: response.data.user_id,
            isAdmin: response.data.is_admin
          });
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Minimalist Hero Section */}
      <section className="py-5 flex-grow-1 d-flex align-items-center" style={{
        background: 'linear-gradient(to right, #f8f9fa, #ffffff)',
        borderBottom: '1px solid #e9ecef'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className="display-4 fw-light mb-3" style={{ 
                color: '#0d6efd',
                letterSpacing: '-0.5px'
              }}>
                Higher Applicant<br />
                <span className="fw-bold">Studies System</span>
              </h1>
              
              <p className="lead text-muted mb-4">
                A refined application experience for higher education programs.
              </p>
              
              {!loading && (
                user ? (
                  <div className="d-flex flex-wrap gap-3">
                    {user.isAdmin ? (
                      <Link to="/admin/dashboard" className="btn btn-primary px-4 py-2">
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link to="/application" className="btn btn-primary px-4 py-2">
                        My Application
                      </Link>
                    )}
                    
                  </div>
                ) : (
                  <div className="d-flex flex-wrap gap-3">
                    <Link to="/register" className="btn btn-primary px-4 py-2">
                      Register
                    </Link>
                    <Link to="/login" className="btn btn-outline-secondary px-4 py-2">
                      Login
                    </Link>
                  </div>
                )
              )}
            </div>
            <div className="col-lg-6">
              <div className="px-4 text-center">
                {/* <img 
                  src="/images/hero-illustration.svg" 
                  alt="Education" 
                  className="img-fluid"
                  style={{ maxHeight: '400px' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x400?text=';
                    e.target.style.opacity = '0.8';
                  }}
                /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Process Steps - Simplified & Elegant */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-4">
            {[
              {
                number: '01',
                title: 'Register',
                description: 'Create your account'
              },
              {
                number: '02',
                title: 'Apply',
                description: 'Submit your application'
              },
              {
                number: '03',
                title: 'Track',
                description: 'Monitor your status'
              },
              {
                number: '04',
                title: 'Receive',
                description: 'Get your results'
              }
            ].map((step, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="p-4 h-100">
                  <div className="d-flex align-items-center mb-3">
                    <span className="display-4 fw-light text-primary me-3">{step.number}</span>
                    <h3 className="h5 m-0">{step.title}</h3>
                  </div>
                  <p className="text-muted small">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Minimal CTA */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="h3 fw-light mb-4">Begin your academic journey today</h2>
          <Link to="/register" className="btn btn-primary px-5 py-2">
            Get Started
          </Link>
        </div>
      </section>
      
      {/* Simple Footer */}
      <footer className="py-4 bg-white">
        <div className="container">
          <div className="d-flex justify-content-center align-items-center">
            <span className="text-muted small">
              © 2025 Higher Applicant Studies System
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;