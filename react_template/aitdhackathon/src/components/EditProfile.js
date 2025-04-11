import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './EditProfile.css';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    preference: '',
    skills: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('users')
          .select('preference, skills, location')
          .eq('id', userData.id)
          .single();

        if (error) throw error;

        setFormData({
          preference: data.preference || '',
          skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills || '',
          location: data.location || ''
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        navigate('/login');
        return;
      }

      const { error } = await supabase
        .from('users')
        .update({
          preference: formData.preference,
          skills: formData.skills.split(',').map(skill => skill.trim()),
          location: formData.location
        })
        .eq('id', userData.id);

      if (error) throw error;

      // Update localStorage with new data
      const updatedUser = {
        ...userData,
        preference: formData.preference,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        location: formData.location
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-box">
        <h1>Edit Profile</h1>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="preference">Preference</label>
            <input
              type="text"
              id="preference"
              name="preference"
              value={formData.preference}
              onChange={handleChange}
              placeholder="Enter your job preferences"
            />
          </div>
          <div className="form-group">
            <label htmlFor="skills">Skills (comma separated)</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., JavaScript, React, Node.js"
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your location"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile; 