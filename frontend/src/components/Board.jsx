import { useState } from "react";
import api from "../services/api";
import List from "./List";

function Board({ board }) {
  const [lists, setLists] = useState(board.task_lists || []);

  const createList = async () => {
    const name = window.prompt("Enter list name:");

    if (!name || !name.trim()) return;

    try {
      const response = await api.post("/lists", {
        name: name.trim(),
        board_id: board.id,
        position: lists.length,
      });

      setLists([
        ...lists,
        {
          ...response.data,
          cards: [],
        },
      ]);
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Unable to create list.");
    }
  };

  const updateListCards = (listId, updatedCards) => {
    setLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId ? { ...list, cards: updatedCards } : list
      )
    );
  };

  return (
    <section className="board-section">
      <div className="board-header">
        <div>
          <h2>{board.name}</h2>
          <p>{lists.length} lists</p>
        </div>

        <button onClick={createList}>+ Add List</button>
      </div>

      <div className="lists-container">
        {lists.length === 0 ? (
          <p>No lists yet. Add To Do, Doing and Done.</p>
        ) : (
          lists.map((list) => (
            <List
              key={list.id}
              list={list}
              cards={list.cards || []}
              onCardsChange={(cards) => updateListCards(list.id, cards)}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default Board;