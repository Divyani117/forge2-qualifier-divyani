import { useState } from "react";
import api from "../services/api";

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

      setLists([...lists, response.data]);
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Unable to create list.");
    }
  };

  return (
    <div className="board-card">
      <h2>{board.name}</h2>

      <button onClick={createList}>+ Add List</button>

      <div style={{ marginTop: "15px" }}>
        {lists.length === 0 ? (
          <p>No lists yet</p>
        ) : (
          lists.map((list) => (
            <div key={list.id}>
              📋 {list.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Board;