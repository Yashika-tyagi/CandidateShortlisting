import React from 'react';

const CandidateList = ({ candidates, loading }) => {
  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading candidates...</p>
      </div>
    );
  }

  if (!candidates || candidates.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>No candidates found. Add some to get started.</p>;
  }

  return (
    <div>
      {candidates.map(candidate => (
        <div key={candidate._id} className="candidate-item">
          <div className="candidate-header">
            <span className="candidate-name">{candidate.name}</span>
            <span className="candidate-exp">{candidate.experience} yrs exp</span>
          </div>
          
          <div className="skill-tags">
            {candidate.skills.map((skill, i) => (
              <span key={i} className="skill-tag">{skill}</span>
            ))}
          </div>
          
          {candidate.bio && (
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>{candidate.bio}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CandidateList;
