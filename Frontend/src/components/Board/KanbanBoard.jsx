import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, X } from 'lucide-react';
import TaskCard from '../Task/TaskCard';
import TaskForm from '../Task/TaskForm';
import DeleteConfirmModal from '../Task/DeleteConfirmModal';
import ConflictModal from '../Task/ConflictModal';
import { tasksAPI, updateWithRetry } from '../../services/api';
import socketService from '../../services/socket';
import './KanbanBoard.css';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [conflictData, setConflictData] = useState(null);
  const [error, setError] = useState('');
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [movingTaskId, setMovingTaskId] = useState(null);

  const columns = [
    { id: 'Todo', title: 'To Do', color: '#e2e8f0' },
    { id: 'In Progress', title: 'In Progress', color: '#bee3f8' },
    { id: 'Done', title: 'Done', color: '#c6f6d5' }
  ];

  useEffect(() => {
    loadTasks();
    setupSocketListeners();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socketService.connect();

    socketService.onTaskCreated((data) => {
      setTasks(prev => [...prev, data.task]);
    });

    socketService.onTaskUpdated((data) => {
      setTasks(prev => prev.map(task => 
        task._id === data.task._id ? data.task : task
      ));
    });

    socketService.onTaskDeleted((data) => {
      setTasks(prev => prev.filter(task => task._id !== data.taskId));
    });
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // If dropped in the same position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the task being moved
    const task = tasks.find(t => t._id === draggableId);
    if (!task) return;

    // Update the task status
    const newStatus = destination.droppableId;
    const prevTasks = [...tasks];

    // Optimistically update UI
    setTasks(prev => prev.map(t =>
      t._id === task._id ? { ...t, status: newStatus } : t
    ));
    setMovingTaskId(task._id);

    try {
      const response = await updateWithRetry(task._id, {
        status: newStatus,
        version: task.version
      });
      setTasks(prev => prev.map(t =>
        t._id === task._id ? response.data.task : t
      ));
    } catch (error) {
      // Revert on error
      setTasks(prevTasks);
      if (error.response?.status === 409) {
        // Conflict detected
        setConflictData({
          localTask: { ...task, status: newStatus },
          serverTask: error.response.data.serverTask
        });
      } else {
        console.error('Error updating task:', error);
        setError('Failed to update task');
      }
    } finally {
      setMovingTaskId(null);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.create(taskData);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
      setError(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      const response = await updateWithRetry(editingTask._id, {
        ...taskData,
        version: editingTask.version
      });
      
      setTasks(prev => prev.map(t => 
        t._id === editingTask._id ? response.data.task : t
      ));
      setEditingTask(null);
    } catch (error) {
      if (error.response?.status === 409) {
        // Conflict detected
        setConflictData({
          localTask: { ...editingTask, ...taskData },
          serverTask: error.response.data.serverTask
        });
      } else {
        console.error('Error updating task:', error);
        setError(error.response?.data?.message || 'Failed to update task');
      }
    }
  };

  const handleDeleteTask = (taskId) => {
    setDeleteTaskId(taskId);
  };

  const confirmDeleteTask = async () => {
    if (!deleteTaskId) return;
    try {
      await tasksAPI.delete(deleteTaskId);
      setTasks(prev => prev.filter(t => t._id !== deleteTaskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    } finally {
      setDeleteTaskId(null);
    }
  };

  const handleSmartAssign = async (taskId) => {
    try {
      const response = await updateWithRetry(taskId, {
        assignedUser: '', // Empty string triggers smart assign on backend
        version: tasks.find(t => t._id === taskId)?.version || 1
      });
      
      setTasks(prev => prev.map(t => 
        t._id === taskId ? response.data.task : t
      ));
    } catch (error) {
      if (error.response?.status === 409) {
        // Conflict detected
        setConflictData({
          localTask: { ...tasks.find(t => t._id === taskId), assignedUser: '' },
          serverTask: error.response.data.serverTask
        });
      } else {
        console.error('Error smart assigning task:', error);
        setError('Failed to smart assign task');
      }
    }
  };

  const handleConflictResolve = async (resolution, data) => {
    try {
      if (resolution === 'merge') {
        const response = await updateWithRetry(conflictData.localTask._id, {
          ...data,
          version: conflictData.serverTask.version + 1  // Use server version + 1
        });
        setTasks(prev => prev.map(t => 
          t._id === conflictData.localTask._id ? response.data.task : t
        ));
        setError(''); // Clear any previous errors
      } else {
        // Overwrite - retry the original update with server version + 1
        const response = await updateWithRetry(conflictData.localTask._id, {
          ...conflictData.localTask,
          version: conflictData.serverTask.version + 1  // Use server version + 1
        });
        setTasks(prev => prev.map(t => 
          t._id === conflictData.localTask._id ? response.data.task : t
        ));
        setError(''); // Clear any previous errors
      }
      setConflictData(null);
    } catch (error) {
      console.error('Error resolving conflict:', error);
      if (error.response?.status === 409) {
        // Still getting conflicts, update the conflict data
        setConflictData({
          localTask: conflictData.localTask,
          serverTask: error.response.data.serverTask
        });
        setError('Conflict still exists. Please try again.');
      } else {
        setError('Failed to resolve conflict. Please refresh and try again.');
      }
    }
  };

  const getTasksForColumn = (columnId) => {
    return tasks.filter(task => task.status === columnId);
  };

  if (loading) {
    return (
      <div className="kanban-loading">
        <div className="loading-spinner"></div>
        <p>Loading your board...</p>
      </div>
    );
  }

  return (
    <div className="kanban-board">
      <div className="board-header">
        <h1>Collaborative To-Do Board</h1>
        <button 
          className="add-task-btn"
          onClick={() => setShowTaskForm(true)}
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')}>
            <X size={16} />
          </button>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board-columns">
          {columns.map(column => (
            <div key={column.id} className="board-column">
              <div className="column-header" style={{ backgroundColor: column.color }}>
                <h3>{column.title}</h3>
                <span className="task-count">
                  {getTasksForColumn(column.id).length}
                </span>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                  >
                    {getTasksForColumn(column.id).map((task, index) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        index={index}
                        onEdit={(task) => setEditingTask(task)}
                        onDelete={handleDeleteTask}
                        onSmartAssign={handleSmartAssign}
                        isMoving={movingTaskId === task._id}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {/* Edit Task Form Modal */}
      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={handleEditTask}
          onCancel={() => setEditingTask(null)}
          isEditing={true}
        />
      )}

      {/* Conflict Resolution Modal */}
      {conflictData && (
        <ConflictModal
          localTask={conflictData.localTask}
          serverTask={conflictData.serverTask}
          onResolve={handleConflictResolve}
          onCancel={() => setConflictData(null)}
        />
      )}

      <DeleteConfirmModal
        open={!!deleteTaskId}
        onConfirm={confirmDeleteTask}
        onCancel={() => setDeleteTaskId(null)}
      />
    </div>
  );
};

export default KanbanBoard; 