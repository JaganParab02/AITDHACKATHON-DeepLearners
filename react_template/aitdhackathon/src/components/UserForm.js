import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import './UserForm.css';

const UserForm = ({ supabase }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    linkedin_url: '',
    skills: '',
    li_at: null,
    linkedin_username: '',
    linkedin_password: '',
    preference: '',
    location: '',
    uploads: null,
    first_name: '',
    last_name: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('File size should be less than 2MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }

      // Create a unique filename using timestamp
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      
      // Create a local path for the file
      const localPath = `/uploads/${fileName}`;
      
      // Store the file locally
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          uploads: localPath
        }));
      };
      reader.readAsDataURL(file);
      
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            phone: formData.phone,
            linkedin_url: formData.linkedin_url,
            skills: formData.skills,
            li_at: formData.li_at,
            linkedin_username: formData.linkedin_username,
            linkedin_password: formData.linkedin_password,
            preference: formData.preference,
            location: formData.location,
            uploads: formData.uploads,
            first_name: formData.first_name,
            last_name: formData.last_name
          }
        ]);

      if (insertError) throw insertError;

      setSuccess('Profile created successfully!');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        localStorage.setItem('user', JSON.stringify({
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          preference: formData.preference,
          location: formData.location
        }));
        navigate('/dashboard');
      }, 1500);

      setFormData({
        username: '',
        password: '',
        email: '',
        phone: '',
        linkedin_url: '',
        skills: '',
        li_at: null,
        linkedin_username: '',
        linkedin_password: '',
        preference: '',
        location: '',
        uploads: null,
        first_name: '',
        last_name: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app">
      <div className="form-container">
        <h1>Create Your Profile</h1>
        <form className="user-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="linkedin_url">LinkedIn URL</label>
                <input
                  type="url"
                  id="linkedin_url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="linkedin_username">LinkedIn Username/Email</label>
                <input
                  type="text"
                  id="linkedin_username"
                  name="linkedin_username"
                  value={formData.linkedin_username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="linkedin_password">LinkedIn Password</label>
                <input
                  type="password"
                  id="linkedin_password"
                  name="linkedin_password"
                  value={formData.linkedin_password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preference">Preference</label>
                <input
                  type="text"
                  id="preference"
                  name="preference"
                  value={formData.preference}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="skills">Skills</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="uploads">Upload Document (PDF)</label>
                <input
                  type="file"
                  id="uploads"
                  name="uploads"
                  onChange={handleFileChange}
                  accept=".pdf"
                  required
                />
                <p className="cookie-notice">Maximum file size: 2MB</p>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm; 