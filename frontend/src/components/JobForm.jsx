import React, { useState } from 'react';
import axios from 'axios';
import { Target } from 'lucide-react';

const JobForm = ({ apiUrl }) => {
  const [formData, setFormData] = useState({
    requiredSkills: '',
    minExperience: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMatch = async (type) => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        minExperience: Number(formData.minExperience)
      };

      if (payload.requiredSkills.length === 0) {
        throw new Error('Please enter at least one required skill.');
      }

      const endpoint = type === 'basic' ? '/candidates/match' : '/candidates/ai/shortlist';
      const res = await axios.post(`${apiUrl}${endpoint}`, payload);
      
      // Dispatch an event or use a state manager in a real app, but for simplicity here we'll use a custom event on window
      window.dispatchEvent(new CustomEvent('shortlistResults', { 
        detail: { results: res.data, type, requirements: payload } 
      }));

    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to match candidates.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Target size={24} color="var(--secondary)" />
        <h2>Job Requirements</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label>Required Skills (comma separated)</label>
        <input 
          type="text" 
          name="requiredSkills" 
          className="input-field" 
          value={formData.requiredSkills} 
          onChange={handleChange} 
          placeholder="e.g. React, Node.js" 
        />
      </div>
      
      <div className="form-group">
        <label>Minimum Experience (Years)</label>
        <input 
          type="number" 
          name="minExperience" 
          min="0" 
          className="input-field" 
          value={formData.minExperience} 
          onChange={handleChange} 
          placeholder="e.g. 2" 
        />
      </div>

      <div className="two-col-grid" style={{ marginTop: '2rem' }}>
        <button 
          onClick={() => handleMatch('basic')} 
          className="btn btn-secondary" 
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Basic Match'}
        </button>
        <button 
          onClick={() => handleMatch('ai')} 
          className="btn btn-primary" 
          disabled={loading}
          style={{ background: 'linear-gradient(135deg, var(--secondary), var(--primary))', border: 'none' }}
        >
          {loading ? 'Analyzing...' : 'AI Shortlist'}
        </button>
      </div>
    </div>
  );
};

export default JobForm;
