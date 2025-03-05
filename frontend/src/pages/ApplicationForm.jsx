import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplicationForm = ({ user }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    contact_number: '',
    gender: '',
    final_percentage: '',
    tentative_ranking: '',
    final_year_project: '',
    other_projects: '',
    publications: '',
    extracurricular: '',
    professional_experience: '',
    strong_points: '',
    weak_points: '',
    preferred_programs: '',
    references: '',
    statement_of_purpose: '',
    intended_research_areas: '',
    english_proficiency: '',
    leadership_experience: '',
    availability_to_start: '',
    additional_certifications: ''
  });
  const [files, setFiles] = useState({
    transcript: null,
    cv: null,
    photo: null
  });
  const [filePaths, setFilePaths] = useState({
    transcript: '',
    cv: '',
    photo: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [existingApplication, setExistingApplication] = useState(false);

  // Fetch existing application data if available
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(`/api/get-application`);
        setFormData(prev => ({
          ...prev,
          ...response.data
        }));
        setFilePaths({
          transcript: response.data.transcript || '',
          cv: response.data.cv || '',
          photo: response.data.photo || ''
        });
        setExistingApplication(true);
      } catch (error) {
        // No existing application found, continue with empty form
        if (error.response?.status !== 404) {
          console.error('Error fetching application:', error);
        }
      }
    };

    if (user) {
      fetchApplication();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles.length > 0) {
      setFiles({
        ...files,
        [name]: selectedFiles[0]
      });
    }
  };

  const uploadFile = async (file, type) => {
    if (!file) return filePaths[type] || null;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await axios.post('/api/upload-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data.path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      // Upload files first
      const fileUploads = {};
      for (const type of ['transcript', 'cv', 'photo']) {
        if (files[type]) {
          fileUploads[type] = await uploadFile(files[type], type);
        }
      }
      
      // Submit form with file paths
      const applicationData = {
        ...formData,
        ...fileUploads
      };
      
      await axios.post('/api/submit-application', applicationData);
      
      window.scrollTo(0, 0);
      setSuccess('Application submitted successfully!');
      setExistingApplication(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit application');
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container mb-5">
      <h2 className="text-center mb-4">
        {existingApplication ? 'Update Application' : 'Higher Studies Application Form'}
      </h2>
      
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
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
                placeholder="Enter your first name"
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
                placeholder="Enter your middle name (optional)"
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
                placeholder="Enter your last name"
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
                placeholder="Enter 10-digit mobile number"
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
                placeholder="Enter your final percentage score"
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
              placeholder="Describe your final year project in detail (minimum 50 characters)"
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
              placeholder="Describe any other research or projects you have worked on..."
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
              placeholder="List your publications (e.g., Title, Conference/Journal Name)"
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
              placeholder="List your achievements and activities..."
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
              placeholder="Briefly describe your work experience..."
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
              placeholder="List your strengths..."
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
              placeholder="List your weaknesses..."
              required
            ></textarea>
          </div>
        </div>
        
        {/* File Uploads Section */}
        <div className="form-section">
          <h3>File Uploads</h3>
          
          <div className="mb-3">
            <label htmlFor="transcript" className="form-label">
              Transcript <span className="required">*</span>
            </label>
            <input
              type="file"
              className="form-control"
              id="transcript"
              name="transcript"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              required={!filePaths.transcript}
            />
            {filePaths.transcript && (
              <div className="mt-2">
                <small className="text-success">File already uploaded</small>
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <label htmlFor="cv" className="form-label">
              CV <span className="required">*</span>
            </label>
            <input
              type="file"
              className="form-control"
              id="cv"
              name="cv"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              required={!filePaths.cv}
            />
            {filePaths.cv && (
              <div className="mt-2">
                <small className="text-success">File already uploaded</small>
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <label htmlFor="photo" className="form-label">
              Photo <span className="required">*</span>
            </label>
            <input
              type="file"
              className="form-control"
              id="photo"
              name="photo"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png"
              required={!filePaths.photo}
            />
            {filePaths.photo && (
              <div className="mt-2">
                <small className="text-success">File already uploaded</small>
              </div>
            )}
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
              placeholder="List the programs you are interested in..."
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
              placeholder="Provide references or mentors..."
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
              placeholder="Write your statement of purpose (minimum 100 characters)..."
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
              placeholder="Describe your intended research areas..."
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
              placeholder="Describe your leadership experiences..."
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
              placeholder="List any additional certifications you have..."
            ></textarea>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? 'Submitting...' : (existingApplication ? 'Update Application' : 'Submit Application')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
              