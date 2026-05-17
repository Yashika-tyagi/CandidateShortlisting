import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CandidateForm from '../components/CandidateForm';
import CandidateList from '../components/CandidateList';
import JobForm from '../components/JobForm';
import Shortlist from '../components/Shortlist';

const API_URL = import.meta.env.VITE_API_URL || 'https://candidateshortlisting-nfmr.onrender.com/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' or 'shortlist'
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/candidates`);
      setCandidates(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch candidates.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleCandidateAdded = () => {
    fetchCandidates();
  };

  return (
    <div>
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Candidates
        </div>
        <div 
          className={`tab ${activeTab === 'shortlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('shortlist')}
        >
          AI Shortlisting
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {activeTab === 'manage' && (
        <div className="dashboard-grid">
          <div>
            <CandidateForm onAdded={handleCandidateAdded} apiUrl={API_URL} />
          </div>
          <div>
            <div className="glass-card">
              <h2>Candidate Pool</h2>
              <p style={{ marginBottom: '1rem' }}>Total candidates: {candidates.length}</p>
              <CandidateList candidates={candidates} loading={loading} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'shortlist' && (
        <div className="dashboard-grid">
          <div>
            <JobForm apiUrl={API_URL} />
          </div>
          <div>
             <Shortlist />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
