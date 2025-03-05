import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ViewApplication = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        // Use the new endpoint that accepts application ID
        const response = await axios.get(`/api/get-application/${id}`);
        setApplication(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching application: ' + (error.response?.data?.message || 'Unknown error'));
        setLoading(false);
      }
    };
    
    fetchApplication();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!application) {
    return <div className="alert alert-info">Application not found.</div>;
  }

  return (
    <div className="form-container mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Application Details</h2>
        <div>
          <Link to="/admin/dashboard" className="btn btn-secondary me-2">
            Back to Dashboard
          </Link>
          <Link to={`/admin/edit-application/${id}`} className="btn btn-warning">
            Edit Application
          </Link>
        </div>
      </div>
      
      {/* Personal Details */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Personal Details</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 mb-3">
              <strong>First Name:</strong>
              <p>{application.first_name}</p>
            </div>
            <div className="col-md-4 mb-3">
              <strong>Middle Name:</strong>
              <p>{application.middle_name || 'N/A'}</p>
              </div>
            <div className="col-md-4 mb-3">
              <strong>Last Name:</strong>
              <p>{application.last_name}</p>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <strong>Contact Number:</strong>
              <p>{application.contact_number}</p>
            </div>
            <div className="col-md-6 mb-3">
              <strong>Gender:</strong>
              <p>{application.gender}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Academic Details */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Academic Details</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <strong>Final Percentage:</strong>
              <p>{application.final_percentage}%</p>
            </div>
            <div className="col-md-6 mb-3">
              <strong>Tentative Ranking:</strong>
              <p>{application.tentative_ranking}</p>
            </div>
          </div>
          
          <div className="mb-3">
            <strong>Final Year Project:</strong>
            <p>{application.final_year_project}</p>
          </div>
          
          <div className="mb-3">
            <strong>Other Projects:</strong>
            <p>{application.other_projects || 'N/A'}</p>
          </div>
          
          <div className="mb-3">
            <strong>Publications:</strong>
            <p>{application.publications || 'N/A'}</p>
          </div>
        </div>
      </div>
      
      {/* Additional Information */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Additional Information</h3>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <strong>Extracurricular Activities and Awards:</strong>
            <p>{application.extracurricular || 'N/A'}</p>
          </div>
          
          <div className="mb-3">
            <strong>Professional Experience:</strong>
            <p>{application.professional_experience || 'N/A'}</p>
          </div>
          
          <div className="mb-3">
            <strong>Strong Points:</strong>
            <p>{application.strong_points}</p>
          </div>
          
          <div className="mb-3">
            <strong>Weak Points:</strong>
            <p>{application.weak_points}</p>
          </div>
        </div>
      </div>
      
      {/* Files */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Uploaded Files</h3>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <strong>Transcript:</strong>
            <p>{application.transcript || 'Not uploaded'}</p>
          </div>
          
          <div className="mb-3">
            <strong>CV:</strong>
            <p>{application.cv || 'Not uploaded'}</p>
          </div>
          
          <div className="mb-3">
            <strong>Photo:</strong>
            <p>{application.photo || 'Not uploaded'}</p>
          </div>
        </div>
      </div>
      
      {/* Additional Fields */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Additional Fields</h3>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <strong>Preferred Programs:</strong>
            <p>{application.preferred_programs}</p>
          </div>
          
          <div className="mb-3">
            <strong>References:</strong>
            <p>{application.references}</p>
          </div>
          
          <div className="mb-3">
            <strong>Statement of Purpose:</strong>
            <p>{application.statement_of_purpose}</p>
          </div>
          
          <div className="mb-3">
            <strong>Intended Research Areas:</strong>
            <p>{application.intended_research_areas}</p>
          </div>
          
          <div className="mb-3">
            <strong>English Proficiency:</strong>
            <p>{application.english_proficiency}</p>
          </div>
          
          <div className="mb-3">
            <strong>Leadership Experience:</strong>
            <p>{application.leadership_experience}</p>
          </div>
          
          <div className="mb-3">
            <strong>Availability to Start:</strong>
            <p>{application.availability_to_start}</p>
          </div>
          
          <div className="mb-3">
            <strong>Additional Certifications:</strong>
            <p>{application.additional_certifications || 'N/A'}</p>
          </div>
          
          <div className="mb-3">
            <strong>Submission Date:</strong>
            <p>{new Date(application.created_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewApplication;