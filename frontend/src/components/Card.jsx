import api from "../services/api";

function Card({ card, onUpdate, onDelete }) {
  const isOverdue =
    card.due_date &&
    new Date(`${card.due_date}T23:59:59`) < new Date();

  const editCard = async () => {
    const title = window.prompt("Edit title:", card.title);
    if (!title || !title.trim()) return;

    const description = window.prompt(
      "Edit description:",
      card.description || ""
    );

    const dueDate = window.prompt(
      "Edit due date (YYYY-MM-DD):",
      card.due_date || ""
    );

    const memberId = window.prompt(
      "Enter member ID (use 1 for Divyani):",
      card.member_id || ""
    );

    try {
      const response = await api.put(`/cards/${card.id}`, {
        title: title.trim(),
        description: description?.trim() || null,
        due_date: dueDate?.trim() || null,
        member_id: memberId ? Number(memberId) : null,
      });

      onUpdate(response.data);
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Unable to update card.");
    }
  };

  const moveCard = async () => {
    const listId = window.prompt(
      "Enter destination list ID: 1 = To Do, 2 = Doing, 3 = Done"
    );

    if (!listId) return;

    try {
      await api.put(`/cards/${card.id}/move`, {
        task_list_id: Number(listId),
      });

      window.location.reload();
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Unable to move card.");
    }
  };

  const addTag = async () => {
    const tagId = window.prompt(
      "Enter tag ID: 1 = Bug, 2 = Design"
    );

    if (!tagId) return;

    try {
      const response = await api.post(`/cards/${card.id}/tags`, {
        tag_id: Number(tagId),
      });

      onUpdate(response.data);
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Unable to add tag.");
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
    const confirmed = window.confirm(`Delete "${card.title}"?`);
    if (!confirmed) return;

    try {
      await api.delete(`/cards/${card.id}`);
      onDelete(card.id);
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Unable to delete card.");
    }
  };

  return (
    <article className={`task-card ${isOverdue ? "overdue-card" : ""}`}>
      <h4>{card.title}</h4>

      {card.description && <p>{card.description}</p>}

      {card.tags && card.tags.length > 0 && (
        <div className="tags-container">
          {card.tags.map((tag) => (
            <button
              key={tag.id}
              className="tag-label"
              style={{ backgroundColor: tag.color }}
              onClick={() => removeTag(tag.id)}
              title="Click to remove tag"
            >
              {tag.name}
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
        <div className={`due-date ${isOverdue ? "overdue-text" : ""}`}>
          {isOverdue ? "Overdue: " : "Due: "}
          {card.due_date}
        </div>
      )}

      <div className="card-actions">
        <button onClick={editCard}>Edit</button>
        <button onClick={moveCard}>Move</button>
        <button onClick={addTag}>+ Tag</button>

        <button className="delete-button" onClick={deleteCard}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default Card;