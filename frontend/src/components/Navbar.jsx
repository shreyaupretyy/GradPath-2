import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../services/axiosConfig';

const Navbar = () => {
  const [authStatus, setAuthStatus] = useState({
    authenticated: false,
    isAdmin: false,
    loaded: false
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser] = useState('User');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/check-auth');
        setAuthStatus({
          authenticated: response.data.authenticated,
          isAdmin: response.data.is_admin,
          loaded: true
        });
      } catch (error) {
        setAuthStatus({
          authenticated: false,
          isAdmin: false,
          loaded: true
        });
      }
    };

    checkAuth();
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('userDropdown');
      if (dropdown && !dropdown.contains(event.target) && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      setAuthStatus({
        authenticated: false,
        isAdmin: false,
        loaded: true
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header>
      {/* Main navbar */}
      <nav className="navbar navbar-expand-lg py-3" style={{
        background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src="/grad-logo.png"
              alt="Logo"
              height="32"
              className="me-2"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="text-white fw-light" style={{ letterSpacing: '-0.5px' }}>
              <span className="fw-bold"> GradPath</span>
            </span>
          </Link>

          {/* Mobile toggle button */}
          <button
            className="navbar-toggler border-0 text-white"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-controls="navbarNav"
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
            aria-label="Toggle navigation"
            style={{ boxShadow: 'none' }}
          >
            <i className={`bi ${isMobileMenuOpen ? 'bi-x' : 'bi-list'} fs-4`}></i>
          </button>

          {/* Nav items */}
          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarNav">
            <div className='w-75 ps-5'>
              <ul className="navbar-nav mx-auto">
                <li className="nav-item mx-1">
                  <Link 
                    className={`nav-link text-white px-3 ${isActive('/') && 'active'}`} 
                    to="/"
                  >
                    <i className="bi bi-house me-1"></i> Home
                  </Link>
                </li>

                {authStatus.authenticated && !authStatus.isAdmin && (
                  <>
                    <li className="nav-item mx-1">
                      <Link 
                        className={`nav-link text-white px-3 ${isActive('/application') && 'active'}`} 
                        to="/application"
                      >
                        <i className="bi bi-file-earmark-text me-1"></i> My Application
                      </Link>
                    </li>
                  </>
                )}

                {authStatus.isAdmin && (
                  <>
                    <li className="nav-item mx-1">
                      <Link 
                        className={`nav-link text-white px-3 ${isActive('/admin/dashboard') && 'active'}`} 
                        to="/admin/dashboard"
                      >
                        <i className="bi bi-speedometer2 me-1"></i> Admin Dashboard
                      </Link>
                    </li>
                    <li className="nav-item mx-1">
                      <Link 
                        className={`nav-link text-white px-3 ${isActive('/admin/manage-users') && 'active'}`} 
                        to="/admin/manage-users"
                      >
                        <i className="bi bi-people me-1"></i> Manage Users
                      </Link>
                    </li>
                    {/* <li className="nav-item mx-1">
                      <Link 
                        className={`nav-link text-white px-3 ${isActive('/admin/settings') && 'active'}`} 
                        to="/admin/settings"
                      >
                        <i className="bi bi-gear me-1"></i> Settings
                      </Link>
                    </li> */}
                  </>
                )}
              </ul>
            </div>

            {/* Auth buttons */}
            <div className="d-flex align-items-center mt-3 mt-lg-0">
              {!authStatus.authenticated ? (
                <>
                  <Link to="/login" className="btn btn-sm btn-light me-2 px-3">
                    <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                  </Link>
                  <Link to="/register" className="btn btn-sm btn-outline-light px-3">
                    <i className="bi bi-person-plus me-1"></i> Register
                  </Link>
                </>
              ) : (
                // <div className="dropdown" id="userDropdown">
                //   <button 
                //     className="btn btn-sm btn-light d-flex align-items-center px-3" 
                //     type="button"
                //     onClick={toggleDropdown}
                //     aria-expanded={isDropdownOpen}
                //   >
                //     <i className="bi bi-person-circle me-2"></i>
                //     <span className="d-none d-md-inline me-1">{currentUser}</span>
                //     <i className={`bi bi-chevron-${isDropdownOpen ? 'up' : 'down'} ms-2 small`}></i>
                //   </button>
                //   <ul 
                //     className={`dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2 ${isDropdownOpen ? 'show' : ''}`} 
                //     style={{ 
                //       borderRadius: '8px',
                //       display: isDropdownOpen ? 'block' : 'none',
                //       position: 'absolute',
                //       inset: '0px 0px auto auto',
                //       margin: '0px',
                //       transform: 'translate(-8px, 40px)'
                //     }}
                //   >
                    
                //     {authStatus.isAdmin && (
                //       <li>
                //         <Link className="dropdown-item py-2" to="/admin/dashboard">
                //           <i className="bi bi-speedometer2 me-2 text-primary"></i> Admin Dashboard
                //         </Link>
                //       </li>
                //     )}
                //     <li><hr className="dropdown-divider" /></li>
                //     <li>
                <button className="btn btn-light rounded-pill py-2 px-4 shadow-sm border" onClick={handleLogout}>
                    Log out
                </button>

                //   //   </li>
                //   // </ul>
                // </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Active page indicator - elegant line under active page */}
      <div className="container position-relative d-none d-lg-block" style={{ height: '3px', marginTop: '-3px' }}>
        <div className="position-absolute bg-white rounded-pill" style={{
          height: '3px',
          width: '50px',
          bottom: '0',
          left: (() => {
            if (location.pathname === '/') return 'calc(50% - 210px)';
            if (location.pathname === '/dashboard') return 'calc(50% - 70px)';
            if (location.pathname === '/application') return 'calc(50% + 70px)';
            if (location.pathname === '/admin/dashboard') return 'calc(50% - 130px)';
            if (location.pathname === '/admin/manage-users') return 'calc(50%)';
            if (location.pathname === '/admin/settings') return 'calc(50% + 130px)';
            return '-100px'; // Hide if not on these pages
          })(),
          transition: 'left 0.3s ease'
        }}></div>
      </div>
    </header>
  );
};

export default Navbar;