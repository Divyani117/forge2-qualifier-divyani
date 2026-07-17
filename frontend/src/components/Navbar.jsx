import { useState } from "react";
import api from "../services/api";

function Navbar({ onBoardCreated }) {
  const [creating, setCreating] = useState(false);

  const createBoard = async () => {
    const name = window.prompt("Enter board name:");

    if (!name || !name.trim()) {
      return;
    }

    try {
      setCreating(true);

      await api.post("/boards", {
        name: name.trim(),
      });

      await onBoardCreated();
    } catch (error) {
      console.error(error);
      alert("Could not create the board.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <nav className="navbar">
      <h2>Forge2 Kanban</h2>

      <button onClick={createBoard} disabled={creating}>
        {creating ? "Creating..." : "Create Board"}
      </button>
    </nav>
  );
}

export default Navbar;