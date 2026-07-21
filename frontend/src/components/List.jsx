import { useState } from "react";
import api from "../services/api";
import Card from "./Card";
import Modal from "./Modal";

function List({
  list,
  cards,
  onCardsChange,
  onCardDrop,
  movingCardId,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [cardForm, setCardForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const openCardModal = () => {
    setCardForm({
      title: "",
      description: "",
      dueDate: "",
    });

    setFormError("");
    setShowCardModal(true);
  };

  const closeCardModal = () => {
    if (isSaving) return;

    setShowCardModal(false);
    setFormError("");
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setCardForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const createCard = async (event) => {
    event.preventDefault();

    if (!cardForm.title.trim()) {
      setFormError("Card title is required.");
      return;
    }

    setIsSaving(true);
    setFormError("");

    try {
      const response = await api.post("/cards", {
        task_list_id: list.id,
        title: cardForm.title.trim(),
        description: cardForm.description.trim() || null,
        due_date: cardForm.dueDate || null,
        position: cards.length,
      });

      onCardsChange([...cards, response.data]);
      setShowCardModal(false);

      setCardForm({
        title: "",
        description: "",
        dueDate: "",
      });
    } catch (error) {
      console.error(error.response?.data || error);

      setFormError(
        error.response?.data?.message ||
          "Unable to create card. Please check the form."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const updateCard = (updatedCard) => {
    onCardsChange(
      cards.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      )
    );
  };

  const removeCard = (cardId) => {
    onCardsChange(cards.filter((card) => card.id !== cardId));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);

    const cardId = Number(event.dataTransfer.getData("cardId"));
    const sourceListId = Number(
      event.dataTransfer.getData("sourceListId")
    );

    if (!cardId || !sourceListId) return;

    onCardDrop(cardId, sourceListId, Number(list.id));
  };

  return (
    <>
      <section
        className={`kanban-list ${
          isDragOver ? "drag-over-list" : ""
        }`}
        onDragOver={handleDragOver}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="list-header">
          <h3>{list.name}</h3>
          <span>{cards.length}</span>
        </div>

        <div className="cards-container">
          {cards.length === 0 && (
            <div className="empty-list-message">
              Drop a card here
            </div>
          )}

          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              listId={list.id}
              isMoving={
                Number(movingCardId) === Number(card.id)
              }
              onUpdate={updateCard}
              onDelete={removeCard}
            />
          ))}
        </div>

        <button
          className="add-card-button"
          onClick={openCardModal}
        >
          + Add Card
        </button>
      </section>

      {showCardModal && (
        <Modal
          title={`Add card to ${list.name}`}
          onClose={closeCardModal}
          onSubmit={createCard}
          submitText="Create Card"
          loading={isSaving}
        >
          <div className="form-group">
            <label htmlFor={`title-${list.id}`}>
              Card title
            </label>

            <input
              id={`title-${list.id}`}
              name="title"
              type="text"
              value={cardForm.title}
              onChange={handleFormChange}
              placeholder="Example: Build login page"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor={`description-${list.id}`}>
              Description
            </label>

            <textarea
              id={`description-${list.id}`}
              name="description"
              value={cardForm.description}
              onChange={handleFormChange}
              placeholder="Add more details about this task"
            />
          </div>

          <div className="form-group">
            <label htmlFor={`dueDate-${list.id}`}>
              Due date
            </label>

            <input
              id={`dueDate-${list.id}`}
              name="dueDate"
              type="date"
              value={cardForm.dueDate}
              onChange={handleFormChange}
            />

            <p className="form-help">
              The due date is optional.
            </p>
          </div>

          {formError && (
            <p className="form-error">{formError}</p>
          )}
        </Modal>
      )}
    </>
  );
}

export default List;