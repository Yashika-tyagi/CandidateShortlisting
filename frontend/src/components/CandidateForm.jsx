import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const CandidateForm = ({ onAdded, apiUrl }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        experience: Number(formData.experience),
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };

      await axios.post(`${apiUrl}/candidates`, payload);
      setMsg({ type: 'success', text: 'Candidate added successfully!' });
      setFormData({ name: '', email: '', skills: '', experience: '', bio: '' });
      if (onAdded) onAdded();
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.error || 'Failed to add candidate.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <UserPlus size={24} color="var(--primary)" />
        <h2>Add Candidate</h2>
      </div>

      {msg.text && (
        <div className={`alert ${msg.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input required type="text" name="name" className="input-field" value={formData.name} onChange={handleChange} placeholder="John Doe" />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input required type="email" name="email" className="input-field" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
        </div>

        <div className="two-col-grid" style={{ gap: '1rem' }}>
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input required type="text" name="skills" className="input-field" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
          </div>
          
          <div className="form-group">
            <label>Experience (Years)</label>
            <input required type="number" name="experience" min="0" step="0.1" className="input-field" value={formData.experience} onChange={handleChange} placeholder="3" />
          </div>
        </div>

        <div className="form-group">
          <label>Bio / Projects</label>
          <textarea name="bio" className="input-field" value={formData.bio} onChange={handleChange} placeholder="Brief bio or links to projects..." />
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Adding...' : 'Save Candidate'}
        </button>
      </form>
    </div>
  );
};

export default CandidateForm;
