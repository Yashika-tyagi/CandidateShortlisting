import React, { useState, useEffect } from 'react';
import { Award, BrainCircuit } from 'lucide-react';

const Shortlist = () => {
  const [results, setResults] = useState(null);
  const [matchType, setMatchType] = useState(null); // 'basic' or 'ai'

  useEffect(() => {
    const handleResults = (e) => {
      setResults(e.detail.results);
      setMatchType(e.detail.type);
    };

    window.addEventListener('shortlistResults', handleResults);
    return () => window.removeEventListener('shortlistResults', handleResults);
  }, []);

  if (!results) {
    return (
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', opacity: 0.7 }}>
        <BrainCircuit size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ color: 'var(--text-muted)' }}>No Results Yet</h3>
        <p style={{ textAlign: 'center' }}>Enter job requirements and run a match to see shortlisted candidates here.</p>
      </div>
    );
  }

  if (results.length === 0 || (results.rankedCandidates && results.rankedCandidates.length === 0)) {
    return (
      <div className="glass-card">
        <h3>Results</h3>
        <p>No candidates match your criteria.</p>
      </div>
    );
  }

  const renderBasicMatch = () => {
    return results.map((item, index) => {
      let badgeClass = 'badge-low';
      if (item.matchLevel === 'High Match') badgeClass = 'badge-high';
      else if (item.matchLevel === 'Medium Match') badgeClass = 'badge-medium';

      return (
        <div key={item.candidate._id || index} className="candidate-item" style={{ position: 'relative', overflow: 'hidden' }}>
          {index === 0 && <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--success)' }}></div>}
          
          <div className="candidate-header">
            <span className="candidate-name" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {index === 0 && <Award size={18} color="var(--success)" />}
              {item.candidate.name}
            </span>
            <span className={`badge ${badgeClass}`}>{item.matchLevel} ({item.matchScore.toFixed(0)}%)</span>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Experience: {item.candidate.experience} yrs
          </div>
          
          <div className="skill-tags">
            {item.candidate.skills.map((skill, i) => (
              <span key={i} className={`skill-tag ${item.matchedSkills.includes(skill.toLowerCase()) ? 'matched' : ''}`}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      );
    });
  };

  const renderAiMatch = () => {
    return results.map((item, index) => (
      <div key={item.candidateId || index} className="candidate-item" style={{ position: 'relative', overflow: 'hidden' }}>
        {index === 0 && <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--secondary)' }}></div>}
        
        <div className="candidate-header">
          <span className="candidate-name" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {index === 0 && <Award size={18} color="var(--secondary)" />}
            #{item.rank} - {item.name}
          </span>
          <span className="badge badge-high" style={{ background: 'var(--secondary)', color: 'white' }}>AI Ranked</span>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Experience: {item.experience} yrs
        </div>

        {item.skills && (
          <div className="skill-tags">
            {item.skills.map((skill, i) => (
              <span key={i} className="skill-tag">{skill}</span>
            ))}
          </div>
        )}

        <div className="ai-box">
          <div className="ai-text">{item.explanation}</div>
        </div>
      </div>
    ));
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Shortlisted Candidates</h2>
        <span className="badge badge-medium" style={{ background: 'var(--card-border)', color: 'var(--text-main)' }}>
          {matchType === 'ai' ? 'AI Powered' : 'Keyword Match'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {matchType === 'basic' ? renderBasicMatch() : renderAiMatch()}
      </div>
    </div>
  );
};

export default Shortlist;
