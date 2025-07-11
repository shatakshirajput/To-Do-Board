import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import './ConflictModal.css';

const ConflictModal = ({ 
  localTask, 
  serverTask, 
  onResolve, 
  onCancel 
}) => {
  const [resolution, setResolution] = useState('overwrite');
  const [mergedData, setMergedData] = useState({
    title: localTask.title,
    description: localTask.description,
    priority: localTask.priority,
    assignedUser: localTask.assignedUser?._id || '',
  });

  const handleMergeChange = (field, value) => {
    setMergedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResolve = () => {
    if (resolution === 'merge') {
      onResolve('merge', mergedData);
    } else {
      onResolve('overwrite', localTask);
    }
  };

  const getFieldDiff = (localValue, serverValue, fieldName) => {
    if (localValue === serverValue) return null;
    
    return {
      field: fieldName,
      local: localValue,
      server: serverValue
    };
  };

  const differences = [
    getFieldDiff(localTask.title, serverTask.title, 'title'),
    getFieldDiff(localTask.description, serverTask.description, 'description'),
    getFieldDiff(localTask.priority, serverTask.priority, 'priority'),
    getFieldDiff(
      localTask.assignedUser?._id, 
      serverTask.assignedUser?._id, 
      'assignedUser'
    )
  ].filter(Boolean);

  return (
    <div className="conflict-modal-overlay">
      <div className="conflict-modal">
        <div className="conflict-header">
          <h2>
            <AlertTriangle size={24} className="conflict-icon" />
            Conflict Detected
          </h2>
          <p>This task was modified by another user while you were editing it.</p>
        </div>

        <div className="conflict-content">
          <div className="conflict-info">
            <div className="version-info">
              <span className="version-badge local">Your Version (v{localTask.version})</span>
              <span className="version-badge server">Server Version (v{serverTask.version})</span>
            </div>
            
            {differences.length > 0 && (
              <div className="differences">
                <h4>Changes detected:</h4>
                <ul>
                  {differences.map((diff, index) => (
                    <li key={index} className="difference-item">
                      <strong>{diff.field}:</strong>
                      <div className="diff-values">
                        <span className="local-value">Your: {diff.local || 'empty'}</span>
                        <span className="server-value">Server: {diff.server || 'empty'}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="resolution-options">
            <h4>Choose how to resolve:</h4>
            
            <div className="option-group">
              <label className="option-label">
                <input
                  type="radio"
                  name="resolution"
                  value="overwrite"
                  checked={resolution === 'overwrite'}
                  onChange={(e) => setResolution(e.target.value)}
                />
                <span className="option-text">
                  <strong>Overwrite server version</strong>
                  <small>Replace the server version with your changes</small>
                </span>
              </label>
            </div>

            <div className="option-group">
              <label className="option-label">
                <input
                  type="radio"
                  name="resolution"
                  value="merge"
                  checked={resolution === 'merge'}
                  onChange={(e) => setResolution(e.target.value)}
                />
                <span className="option-text">
                  <strong>Merge changes</strong>
                  <small>Combine both versions (you can edit the result)</small>
                </span>
              </label>
            </div>

            {resolution === 'merge' && (
              <div className="merge-form">
                <h5>Merge Result:</h5>
                <div className="merge-fields">
                  <div className="merge-field">
                    <label>Title:</label>
                    <input
                      type="text"
                      value={mergedData.title}
                      onChange={(e) => handleMergeChange('title', e.target.value)}
                      placeholder="Enter merged title"
                    />
                  </div>
                  
                  <div className="merge-field">
                    <label>Description:</label>
                    <textarea
                      value={mergedData.description}
                      onChange={(e) => handleMergeChange('description', e.target.value)}
                      placeholder="Enter merged description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="merge-field">
                    <label>Priority:</label>
                    <select
                      value={mergedData.priority}
                      onChange={(e) => handleMergeChange('priority', e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="conflict-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="resolve-btn"
            onClick={handleResolve}
          >
            {resolution === 'merge' ? 'Merge & Save' : 'Overwrite'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal; 