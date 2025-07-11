import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Edit, Trash2, UserPlus } from 'lucide-react';
import './TaskCard.css';

const TaskCard = ({ task, index, onEdit, onDelete, onSmartAssign, isMoving }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#e53e3e';
      case 'Medium':
        return '#d69e2e';
      case 'Low':
        return '#38a169';
      default:
        return '#718096';
    }
  };

  const getPriorityLabel = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${snapshot.isDragging ? 'dragging' : ''} ${isMoving ? 'moving' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isMoving && (
            <div className="moving-overlay">
              <div className="spinner"></div>
            </div>
          )}
          <div className="task-header">
            <h3 className="task-title">{task.title}</h3>
            <div 
              className="priority-badge"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              {getPriorityLabel(task.priority)}
            </div>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-footer">
            <div className="task-meta">
              {task.assignedUser && (
                <div className="assigned-user">
                  <span className="user-avatar">
                    {task.assignedUser.username.charAt(0).toUpperCase()}
                  </span>
                  <span className="username">{task.assignedUser.username}</span>
                </div>
              )}
              <div className="task-date">
                {formatDate(task.updatedAt)}
              </div>
            </div>

                         {isHovered && (
               <div className="task-actions">
                 <button
                   className="action-btn edit-btn"
                   onClick={() => onEdit(task)}
                   title="Edit task"
                 >
                   <Edit size={14} />
                 </button>
                 <button
                   className="action-btn smart-assign-btn"
                   onClick={() => onSmartAssign(task._id)}
                   title="Smart Assign"
                 >
                   <UserPlus size={14} />
                 </button>
                 <button
                   className="action-btn delete-btn"
                   onClick={() => onDelete(task._id)}
                   title="Delete task"
                 >
                   <Trash2 size={14} />
                 </button>
               </div>
             )}
          </div>

          {/* Version indicator for conflict detection */}
          <div className="task-version">
            v{task.version}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard; 