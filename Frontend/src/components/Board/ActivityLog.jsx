import { useState, useEffect, useRef } from 'react';
import { actionsAPI } from '../../services/api';
import { 
  FileText, 
  Edit, 
  Trash2, 
  UserPlus, 
  LogIn, 
  RefreshCw 
} from 'lucide-react';
import './ActivityLog.css';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);

  useEffect(() => {
    loadActivities();
  }, []);

  // Auto-scroll to top when activities change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [activities]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await actionsAPI.getAll();
      setActivities(response.data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'Task created':
        return <FileText size={16} />;
      case 'Task updated':
        return <Edit size={16} />;
      case 'Task deleted':
        return <Trash2 size={16} />;
      case 'User registered':
        return <UserPlus size={16} />;
      case 'User logged in':
        return <LogIn size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'Task created':
        return '#38a169';
      case 'Task updated':
        return '#3182ce';
      case 'Task deleted':
        return '#e53e3e';
      case 'User registered':
        return '#d69e2e';
      case 'User logged in':
        return '#805ad5';
      default:
        return '#718096';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  const formatDetails = (details) => {
    if (!details) return '';
    
    // Extract task title from details if it exists
    const taskMatch = details.match(/:\s*(.+)$/);
    if (taskMatch) {
      return taskMatch[1];
    }
    
    return details;
  };

  if (loading) {
    return (
      <div className="activity-log">
        <div className="activity-header">
          <h3>Activity Log</h3>
                  <button 
          className="refresh-btn"
          onClick={loadActivities}
          disabled={loading}
        >
          <RefreshCw size={16} />
        </button>
        </div>
        <div className="loading-activities">
          <div className="loading-spinner"></div>
          <p>Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-log">
      <div className="activity-header">
        <h3>Activity Log</h3>
        <button 
          className="refresh-btn"
          onClick={loadActivities}
          title="Refresh activities"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="activity-list" ref={listRef}>
        {activities.length === 0 ? (
          <div className="no-activities">
            <p>No activities yet</p>
            <small>Actions will appear here as they happen</small>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div 
              key={activity._id || index} 
              className="activity-item"
              style={{ 
                '--action-color': getActionColor(activity.action),
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="activity-icon">
                {getActionIcon(activity.action)}
              </div>
              
              <div className="activity-content">
                <div className="activity-main">
                  <span className="activity-user">
                    {activity.user?.username || 'Unknown User'}
                  </span>
                  <span className="activity-action">
                    {activity.action.toLowerCase()}
                  </span>
                  {activity.taskId && (
                    <span className="activity-task">
                      "{activity.taskId.title || 'Unknown Task'}"
                    </span>
                  )}
                </div>
                
                {activity.details && (
                  <div className="activity-details">
                    {formatDetails(activity.details)}
                  </div>
                )}
                
                <div className="activity-time">
                  {formatTimestamp(activity.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog; 