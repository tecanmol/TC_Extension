import React from 'react';
import './AnalysisDisplay.css';

const AnalysisDisplay = ({ data }) => {
  if (!data) return null;

  const { summary, red_flags, good_points } = data;

  return (
    <div className="analysis-container">
      
      {/* Summary Section */}
      <div className="card summary-card">
        <h3 className="card-title">📝 Summary</h3>
        <p className="summary-text">
          {summary}
        </p>
      </div>

      {/* Red Flags Section */}
      <div className="card danger-card">
        <h3 className="card-title">
          🚩 Red Flags <span className="badge danger">{red_flags?.length || 0}</span>
        </h3>
        {red_flags && red_flags.length > 0 ? (
          <ul className="list danger-list">
            {red_flags.map((flag, index) => (
              <li key={index}>{flag}</li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No red flags detected.</p>
        )}
      </div>

      {/* Good Points Section */}
      <div className="card success-card">
        <h3 className="card-title">
          ✅ Good Points <span className="badge success">{good_points?.length || 0}</span>
        </h3>
        {good_points && good_points.length > 0 ? (
          <ul className="list success-list">
            {good_points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No specific benefits highlighted.</p>
        )}
      </div>
      
    </div>
  );
};

export default AnalysisDisplay;