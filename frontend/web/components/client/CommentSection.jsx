import React, { useState } from "react";
import {
  Users,
  Send,
  Edit3,
  Trash2,
  Save,
  X,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../../utils/AuthContext";
import { clientService } from "../../services/clientService";
import RichTextEditor from "../shared/RichTextEditor";
import UserDisplay from "../shared/UserDisplay";
import TimeDisplay from "../shared/TimeDisplay";
import styles from "../../styles/client/commentSection.module.css";

const CommentSection = ({ client, onClientUpdate, isLoading, setMessage }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!user) return;

    // Add comment to client's teamComments
    const updatedComments = [
      ...client.teamComments,
      {
        userId: user._id,
        comment: newComment,
        timestamp: new Date(),
      },
    ];

    const result = await clientService.updateClient(client._id, {
      teamComments: updatedComments,
    });

    if (result.success) {
      setNewComment("");
      onClientUpdate(result.data);
      setMessage({ type: "success", text: "Comment added successfully!" });
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to add comment",
      });
    }
  };

  const handleEditComment = (index, comment) => {
    setEditingCommentIndex(index);
    setEditCommentText(comment.comment);
  };

  const handleSaveEditComment = async () => {
    if (!editCommentText.trim() || editingCommentIndex === null) return;

    const updatedComments = [...client.teamComments];
    updatedComments[editingCommentIndex] = {
      ...updatedComments[editingCommentIndex],
      comment: editCommentText,
      timestamp: new Date(), // Update timestamp to show it was edited
    };

    const result = await clientService.updateClient(client._id, {
      teamComments: updatedComments,
    });

    if (result.success) {
      setEditingCommentIndex(null);
      setEditCommentText("");
      onClientUpdate(result.data);
      setMessage({ type: "success", text: "Comment updated successfully!" });
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to update comment",
      });
    }
  };

  const handleCancelEditComment = () => {
    setEditingCommentIndex(null);
    setEditCommentText("");
  };

  const handleDeleteComment = async (index) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    const updatedComments = client.teamComments.filter((_, i) => i !== index);

    const result = await clientService.updateClient(client._id, {
      teamComments: updatedComments,
    });

    if (result.success) {
      onClientUpdate(result.data);
      setMessage({ type: "success", text: "Comment deleted successfully!" });
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to delete comment",
      });
    }
  };

  return (
    <div className={styles.commentsSection}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Users size={18} />
          Team Comments
        </h3>
      </div>

      <div className={styles.commentsList}>
        {client.teamComments && client.teamComments.length > 0 ? (
          client.teamComments
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((comment, index) => {
              const isCurrentUser =
                comment.userId === user?._id ||
                comment.userId?._id === user?._id;
              const isEditing = editingCommentIndex === index;

              return (
                <div key={index} className={styles.comment}>
                  <div className={styles.commentMeta}>
                    <div className={styles.authorInfo}>
                      <UserDisplay user={comment.userId} size="sm" />
                      <TimeDisplay
                        date={comment.timestamp}
                        className={styles.timestamp}
                      />
                    </div>
                    {isCurrentUser && !isEditing && (
                      <div className={styles.commentActions}>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleEditComment(index, comment)}
                          title="Edit"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleDeleteComment(index)}
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className={styles.editForm}>
                      <RichTextEditor
                        value={editCommentText}
                        onChange={setEditCommentText}
                        placeholder="Edit your comment..."
                      />
                      <div className={styles.formActions}>
                        <button
                          className={styles.cancelButton}
                          onClick={handleCancelEditComment}
                        >
                          <X size={14} />
                        </button>
                        <button
                          className={styles.saveButton}
                          onClick={handleSaveEditComment}
                          disabled={!editCommentText.trim() || isLoading}
                        >
                          <Save size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={styles.commentContent}
                      dangerouslySetInnerHTML={{ __html: comment.comment }}
                    />
                  )}
                </div>
              );
            })
        ) : (
          <div className={styles.emptyState}>
            <Users size={20} />
            <span>No team comments yet</span>
          </div>
        )}
      </div>

      <div className={styles.addCommentSection}>
        <div className={styles.addCommentForm}>
          <RichTextEditor
            value={newComment}
            onChange={setNewComment}
            placeholder="Add a comment about this client..."
          />
          <div className={styles.formActions}>
            <button
              className={styles.saveButton}
              onClick={handleAddComment}
              disabled={!newComment.trim() || isLoading}
            >
              <Send size={14} />
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
