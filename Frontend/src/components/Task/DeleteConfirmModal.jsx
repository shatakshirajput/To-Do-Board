import React from 'react';
import { X, Trash2 } from 'lucide-react';
import './DeleteConfirmModal.css';

const DeleteConfirmModal = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <button className="close-btn" onClick={onCancel} title="Cancel">
          <X size={20} />
        </button>
        <div className="delete-modal-icon">
          <Trash2 size={36} />
        </div>
        <h3>Delete Task?</h3>
        <p>Are you sure you want to delete this task? This action cannot be undone.</p>
        <div className="delete-modal-actions">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="confirm-btn" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal; 