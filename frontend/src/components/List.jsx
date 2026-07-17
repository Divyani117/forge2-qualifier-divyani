import api from "../services/api";
import Card from "./Card";

function List({ list, cards, onCardsChange }) {
  const createCard = async () => {
    const title = window.prompt("Enter card title:");

    if (!title || !title.trim()) return;

    const description =
      window.prompt("Enter card description (optional):") || "";

    const dueDate =
      window.prompt("Enter due date as YYYY-MM-DD (optional):") || "";

    try {
      const response = await api.post("/cards", {
        task_list_id: list.id,
        title: title.trim(),
        description: description.trim() || null,
        due_date: dueDate.trim() || null,
        position: cards.length,
      });

      onCardsChange([...cards, response.data]);
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Unable to create card. Check the due-date format.");
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

  return (
    <section className="kanban-list">
      <div className="list-header">
        <h3>{list.name}</h3>
        <span>{cards.length}</span>
      </div>

      <div className="cards-container">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onUpdate={updateCard}
            onDelete={removeCard}
          />
        ))}
      </div>

      <button className="add-card-button" onClick={createCard}>
        + Add Card
      </button>
    </section>
  );
}

export default List;