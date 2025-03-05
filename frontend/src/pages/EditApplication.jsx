import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(`/api/get-application/${id}`);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error details:", error);
        setError('Failed to fetch application data: ' + (error.response?.data?.message || 'Unknown error'));
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Create a copy of the data and ensure proper value types
      const applicationData = { ...formData };
      
      // Ensure numeric values are numbers, not strings
      if (applicationData.final_percentage) {
        applicationData.final_percentage = parseFloat(applicationData.final_percentage);
      }
      
      // Remove any fields that shouldn't be sent in the update
      delete applicationData.created_at;
      delete applicationData.updated_at;
      
      const response = await axios.put(`/api/update-application/${id}`, applicationData);
      setSuccess('Application updated successfully');
      window.scrollTo(0, 0);
      setTimeout(() => navigate(`/admin/application/${id}`), 1500);
    } catch (error) {
      console.error("Update error details:", error);
      setError('Failed to update application: ' + (error.response?.data?.message || 'Server error, please try again'));
      window.scrollTo(0, 0);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/application/${id}`);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error && !formData.id) {
    return (
      <div className="form-container mb-5">
        <div className="alert alert-danger">
          {error}
          <div className="mt-3">
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/admin/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container mb-5">
      <h2 className="text-center mb-4">Edit Application</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Personal Details Section */}
        <div className="form-section">
          <h3>Personal Details</h3>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="first_name" className="form-label">
                First Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="first_name"
                name="first_name"
                value={formData.first_name || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-4 mb-3">
              <label htmlFor="middle_name" className="form-label">
                Middle Name
              </label>
              <input
                type="text"
                className="form-control"
                id="middle_name"
                name="middle_name"
                value={formData.middle_name || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="col-md-4 mb-3">
              <label htmlFor="last_name" className="form-label">
                Last Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="last_name"
                name="last_name"
                value={formData.last_name || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="contact_number" className="form-label">
                Contact Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                className="form-control"
                id="contact_number"
                name="contact_number"
                value={formData.contact_number || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="gender" className="form-label">
                Gender <span className="required">*</span>
              </label>
              <select
                className="form-select"
                id="gender"
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Academic Details Section */}
        <div className="form-section">
          <h3>Academic Details</h3>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="final_percentage" className="form-label">
                Final Percentage Score <span className="required">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                id="final_percentage"
                name="final_percentage"
                value={formData.final_percentage || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="tentative_ranking" className="form-label">
                Tentative Ranking <span className="required">*</span>
              </label>
              <select
                className="form-select"
                id="tentative_ranking"
                name="tentative_ranking"
                value={formData.tentative_ranking || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Top 5%">Top 5%</option>
                <option value="Top 10%">Top 10%</option>
                <option value="Top 20%">Top 20%</option>
                <option value="Top 30%">Top 30%</option>
                <option value="Top 40%">Top 40%</option>
              </select>
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="final_year_project" className="form-label">
              Final Year Project Details <span className="required">*</span>
            </label>
            <textarea
              className="form-control"
              id="final_year_project"
              name="final_year_project"
              rows="4"
              value={formData.final_year_project || ''}
              onChange={handleChange}
              required
              minLength="50"
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label htmlFor="other_projects" className="form-label">
              Other Notable Research or Project Work
            </label>
            <textarea
              className="form-control"
              id="other_projects"
              name="other_projects"
              rows="3"
              value={formData.other_projects || ''}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label htmlFor="publications" className="form-label">
              Publications
            </label>
            <textarea
              className="form-control"
              id="publications"
              name="publications"
              rows="3"
              value={formData.publications || ''}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        
        {/* Additional Information Section */}
        <div className="form-section">
          <h3>Additional Information</h3>
          
          <div className="mb-3">
            <label htmlFor="extracurricular" className="form-label">
              Notable Extracurricular Activities and Awards
            </label>
            <textarea
              className="form-control"
              id="extracurricular"
              name="extracurricular"
              rows="3"
              value={formData.extracurricular || ''}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label htmlFor="professional_experience" className="form-label">
              Professional Experience
            </label>
            <textarea
              className="form-control"
              id="professional_experience"
              name="professional_experience"
              rows="3"
              value={formData.professional_experience || ''}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label htmlFor="strong_points" className="form-label">
              Strong Points <span className="required">*</span>
            </label>
            <textarea
              className="form-control"
              id="strong_points"
              name="strong_points"
              rows="3"
              value={formData.strong_points || ''}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label htmlFor="weak_points" className="form-label">
              Weak Points <span className="required">*</span>
            </label>
            <textarea
              className="form-control"
              id="weak_points"
              name="weak_points"
              rows="3"
              value={formData.weak_points || ''}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>
        
        {/* Additional Fields Section */}
        <div className="form-section">
          <h3>Additional Fields</h3>
          
          <div className="mb-3">
            <label htmlFor="preferred_programs" className="form-label">
              Preferred Programs <span className="required">*</span>
            </label>
            <textarea
              className="form-control"
              id="preferred_programs"
              name="preferred_programs"
              rows="3"
              value={formData.preferred_programs || ''}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label htmlFor="references" className="form-label">
              References <span className="required">*</span>
            </label>
            <textarea
              className="form-control"
              id="references"
              name="references"
              rows="3"
              value={formData.references || ''}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label htmlFor="statement_of_purpose" className="form-label">
              Statement of Purpose <span className="required">*</span>
            </label>
            <textarea
              className="form-control"
              id="statement_of_purpose"
              name="statement_of_purpose"
              rows="5"
              value={formData.statement_of_purpose || ''}
              onChange={handleChange}
              required
              minLength="100"
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label htmlFor="intended_research_areas" className="form-label">
              Intended Research Areas <span className="required">*</span>
            </label>
            <textarea
              className="form-control"
              id="intended_research_areas"
              name="intended_research_areas"
              rows="3"
              value={formData.intended_research_areas || ''}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label htmlFor="english_proficiency" className="form-label">
              English Proficiency <span className="required">*</span>
            </label>
            <select
              className="form-select"
              id="english_proficiency"
              name="english_proficiency"
              value={formData.english_proficiency || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select your proficiency level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Native/Fluent">Native/Fluent</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label htmlFor="leadership_experience" className="form-label">
              Leadership Experience <span className="required">*</span>
            </label>
            <textarea
              className="form-control"
              id="leadership_experience"
              name="leadership_experience"
              rows="3"
              value={formData.leadership_experience || ''}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label htmlFor="availability_to_start" className="form-label">
              Availability to Start <span className="required">*</span>
            </label>
            <input
              type="date"
              className="form-control"
              id="availability_to_start"
              name="availability_to_start"
              value={formData.availability_to_start || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="additional_certifications" className="form-label">
              Additional Certifications
            </label>
            <textarea
              className="form-control"
              id="additional_certifications"
              name="additional_certifications"
              rows="3"
              value={formData.additional_certifications || ''}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        
        <div className="d-flex justify-content-center mt-4 gap-3">
          <button 
            type="button" 
            className="btn btn-secondary btn-lg"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditApplication;