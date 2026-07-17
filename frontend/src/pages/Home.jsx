import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Board from "../components/Board";
import api from "../services/api";

function Home() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const response = await api.get("/boards");
      setBoards(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Could not load boards. Make sure Laravel is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <>
      <Navbar onBoardCreated={fetchBoards} />

      <main className="container">
        <h1>Kanban Board</h1>

        {loading && <p>Loading boards...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && boards.length === 0 && (
          <p>No boards yet. Click Create Board to add one.</p>
        )}

        <div className="boards-grid">
          {boards.map((board) => (
            <Board key={board.id} board={board} />
          ))}
        </div>
      </main>
    </>
  );
}

export default Home;