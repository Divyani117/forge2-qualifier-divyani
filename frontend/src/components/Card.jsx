import { useState } from "react";
import api from "../services/api";
import Modal from "./Modal";

function Card({
  card,
  listId,
  isMoving,
  onUpdate,
  onDelete,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isSavingTag, setIsSavingTag] = useState(false);

  const [formError, setFormError] = useState("");
  const [tagError, setTagError] = useState("");
  const [selectedTagId, setSelectedTagId] = useState("");

  const availableTags = [
    {
      id: 1,
      name: "Bug",
      color: "#ef4444",
    },
    {
      id: 2,
      name: "Design",
      color: "#8b5cf6",
    },
  ];

  const [editForm, setEditForm] = useState({
    title: card.title || "",
    description: card.description || "",
    dueDate: card.due_date || "",
    memberId: card.member_id || "",
  });

  const isOverdue =
    card.due_date &&
    new Date(`${card.due_date}T23:59:59`) < new Date();

  const openEditModal = () => {
    setEditForm({
      title: card.title || "",
      description: card.description || "",
      dueDate: card.due_date || "",
      memberId: card.member_id || "",
    });

    setFormError("");
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    if (isSaving) return;

    setShowEditModal(false);
    setFormError("");
  };

  const openTagModal = () => {
    setSelectedTagId("");
    setTagError("");
    setShowTagModal(true);
  };

  const closeTagModal = () => {
    if (isSavingTag) return;

    setShowTagModal(false);
    setSelectedTagId("");
    setTagError("");
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const editCard = async (event) => {
    event.preventDefault();

    if (!editForm.title.trim()) {
      setFormError("Card title is required.");
      return;
    }

    setIsSaving(true);
    setFormError("");

    try {
      const response = await api.put(`/cards/${card.id}`, {
        title: editForm.title.trim(),
        description: editForm.description.trim() || null,
        due_date: editForm.dueDate || null,
        member_id: editForm.memberId
          ? Number(editForm.memberId)
          : null,
      });

      onUpdate(response.data);
      setShowEditModal(false);
    } catch (error) {
      console.error(error.response?.data || error);

      setFormError(
        error.response?.data?.message ||
          "Unable to update the card."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = async (event) => {
    event.preventDefault();

    if (!selectedTagId) {
      setTagError("Please select a tag.");
      return;
    }

    const tagAlreadyAdded = card.tags?.some(
      (tag) => Number(tag.id) === Number(selectedTagId)
    );

    if (tagAlreadyAdded) {
      setTagError("This tag is already added to the card.");
      return;
    }

    setIsSavingTag(true);
    setTagError("");

    try {
      const response = await api.post(`/cards/${card.id}/tags`, {
        tag_id: Number(selectedTagId),
      });

      onUpdate(response.data);
      setShowTagModal(false);
      setSelectedTagId("");
    } catch (error) {
      console.error(error.response?.data || error);

      setTagError(
        error.response?.data?.message ||
          "Unable to add the selected tag."
      );
    } finally {
      setIsSavingTag(false);
    }
  };

  const removeTag = async (tagId) => {
    try {
      const response = await api.delete(
        `/cards/${card.id}/tags/${tagId}`
      );

      onUpdate(response.data);
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Unable to remove tag.");
    }
  };

  const deleteCard = async () => {
    const confirmed = window.confirm(
      `Delete "${card.title}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/cards/${card.id}`);
      onDelete(card.id);
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Unable to delete card.");
    }
  };

  const handleDragStart = (event) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("cardId", String(card.id));
    event.dataTransfer.setData("sourceListId", String(listId));

    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <>
      <article
        draggable={!isMoving}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={[
          "task-card",
          isOverdue ? "overdue-card" : "",
          isDragging ? "dragging-card" : "",
          isMoving ? "moving-card" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        title="Drag this card to another list"
      >
        <div className="card-drag-handle">
          <span>⋮⋮</span>
          <small>Drag</small>
        </div>

        <h4>{card.title}</h4>

        {card.description && <p>{card.description}</p>}

        {card.tags && card.tags.length > 0 && (
          <div className="tags-container">
            {card.tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                className="tag-label"
                style={{ backgroundColor: tag.color }}
                onClick={() => removeTag(tag.id)}
                title="Click to remove tag"
              >
                {tag.name} ×
              </button>
            ))}
          </div>
        )}

        {card.member && (
          <div className="member-name">
            Assigned to: {card.member.name}
          </div>
        )}

        {card.due_date && (
          <div
            className={`due-date ${
              isOverdue ? "overdue-text" : ""
            }`}
          >
            {isOverdue ? "Overdue: " : "Due: "}
            {card.due_date}
          </div>
        )}

        <div className="card-actions">
          <button type="button" onClick={openEditModal}>
            Edit
          </button>

          <button type="button" onClick={openTagModal}>
            + Tag
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={deleteCard}
          >
            Delete
          </button>
        </div>
      </article>

      {showEditModal && (
        <Modal
          title="Edit card"
          onClose={closeEditModal}
          onSubmit={editCard}
          submitText="Save Changes"
          loading={isSaving}
        >
          <div className="form-group">
            <label htmlFor={`edit-title-${card.id}`}>
              Card title
            </label>

            <input
              id={`edit-title-${card.id}`}
              name="title"
              type="text"
              value={editForm.title}
              onChange={handleEditChange}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor={`edit-description-${card.id}`}>
              Description
            </label>

            <textarea
              id={`edit-description-${card.id}`}
              name="description"
              value={editForm.description}
              onChange={handleEditChange}
              placeholder="Add task details"
            />
          </div>

          <div className="form-group">
            <label htmlFor={`edit-due-date-${card.id}`}>
              Due date
            </label>

            <input
              id={`edit-due-date-${card.id}`}
              name="dueDate"
              type="date"
              value={editForm.dueDate}
              onChange={handleEditChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`edit-member-${card.id}`}>
              Assigned member
            </label>

            <select
              id={`edit-member-${card.id}`}
              name="memberId"
              value={editForm.memberId}
              onChange={handleEditChange}
            >
              <option value="">Unassigned</option>
              <option value="1">Divyani</option>
            </select>
          </div>

          {formError && (
            <p className="form-error">{formError}</p>
          )}
        </Modal>
      )}

      {showTagModal && (
        <Modal
          title="Add tag"
          onClose={closeTagModal}
          onSubmit={addTag}
          submitText="Add Tag"
          loading={isSavingTag}
        >
          <div className="form-group">
            <label htmlFor={`tag-select-${card.id}`}>
              Select a tag
            </label>

            <select
              id={`tag-select-${card.id}`}
              value={selectedTagId}
              onChange={(event) =>
                setSelectedTagId(event.target.value)
              }
              autoFocus
            >
              <option value="">Choose a tag</option>

              {availableTags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          <div className="tag-preview-list">
            {availableTags.map((tag) => (
              <div
                key={tag.id}
                className="tag-preview-item"
              >
                <span
                  className="tag-color-preview"
                  style={{ backgroundColor: tag.color }}
                />

                <span>{tag.name}</span>
              </div>
            ))}
          </div>

          {tagError && (
            <p className="form-error">{tagError}</p>
          )}
        </Modal>
      )}
    </>
  );
}

export default Card;