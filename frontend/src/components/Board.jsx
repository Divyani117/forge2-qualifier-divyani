import { useMemo, useState } from "react";
import api from "../services/api";
import List from "./List";
import Modal from "./Modal";

function Board({ board }) {
  const [lists, setLists] = useState(board.task_lists || []);
  const [movingCardId, setMovingCardId] = useState(null);

  const [showListModal, setShowListModal] = useState(false);
  const [listName, setListName] = useState("");
  const [isSavingList, setIsSavingList] = useState(false);
  const [listError, setListError] = useState("");

  const statistics = useMemo(() => {
    const allCards = lists.flatMap((list) => list.cards || []);

    const completedList = lists.find((list) =>
      ["done", "completed", "complete"].includes(
        list.name.toLowerCase().trim()
      )
    );

    const completedCards = completedList?.cards?.length || 0;

    const overdueCards = allCards.filter((card) => {
      if (!card.due_date) return false;

      const dueDate = new Date(`${card.due_date}T23:59:59`);
      return dueDate < new Date();
    }).length;

    return {
      lists: lists.length,
      cards: allCards.length,
      completed: completedCards,
      overdue: overdueCards,
    };
  }, [lists]);

  const openListModal = () => {
    setListName("");
    setListError("");
    setShowListModal(true);
  };

  const closeListModal = () => {
    if (isSavingList) return;

    setShowListModal(false);
    setListName("");
    setListError("");
  };

  const createList = async (event) => {
    event.preventDefault();

    if (!listName.trim()) {
      setListError("List name is required.");
      return;
    }

    setIsSavingList(true);
    setListError("");

    try {
      const response = await api.post("/lists", {
        name: listName.trim(),
        board_id: board.id,
        position: lists.length,
      });

      setLists((currentLists) => [
        ...currentLists,
        {
          ...response.data,
          cards: [],
        },
      ]);

      setShowListModal(false);
      setListName("");
    } catch (error) {
      console.error(error.response?.data || error);

      setListError(
        error.response?.data?.message ||
          "Unable to create the list. Please try again."
      );
    } finally {
      setIsSavingList(false);
    }
  };

  const updateListCards = (listId, updatedCards) => {
    setLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId ? { ...list, cards: updatedCards } : list
      )
    );
  };

  const moveCard = async (
    cardId,
    sourceListId,
    destinationListId
  ) => {
    if (sourceListId === destinationListId) return;

    const sourceList = lists.find(
      (list) => Number(list.id) === Number(sourceListId)
    );

    const movedCard = sourceList?.cards?.find(
      (card) => Number(card.id) === Number(cardId)
    );

    if (!movedCard) {
      alert("Unable to find the dragged card.");
      return;
    }

    const previousLists = lists;

    const optimisticCard = {
      ...movedCard,
      task_list_id: destinationListId,
    };

    setMovingCardId(cardId);

    setLists((currentLists) =>
      currentLists.map((list) => {
        if (Number(list.id) === Number(sourceListId)) {
          return {
            ...list,
            cards: (list.cards || []).filter(
              (card) => Number(card.id) !== Number(cardId)
            ),
          };
        }

        if (Number(list.id) === Number(destinationListId)) {
          return {
            ...list,
            cards: [...(list.cards || []), optimisticCard],
          };
        }

        return list;
      })
    );

    try {
      const response = await api.put(`/cards/${cardId}/move`, {
        task_list_id: Number(destinationListId),
      });

      setLists((currentLists) =>
        currentLists.map((list) => {
          if (Number(list.id) !== Number(destinationListId)) {
            return list;
          }

          return {
            ...list,
            cards: (list.cards || []).map((card) =>
              Number(card.id) === Number(cardId)
                ? {
                    ...card,
                    ...response.data,
                    tags: response.data.tags || card.tags || [],
                    member:
                      response.data.member || card.member || null,
                  }
                : card
            ),
          };
        })
      );
    } catch (error) {
      console.error(error.response?.data || error);

      setLists(previousLists);

      alert(
        "Unable to move the card. The previous position was restored."
      );
    } finally {
      setMovingCardId(null);
    }
  };

  return (
    <>
      <section className="board-section">
        <div className="board-header">
          <div>
            <h2>{board.name}</h2>

            <p>Drag cards between lists to update their status.</p>
          </div>

          <button onClick={openListModal}>+ Add List</button>
        </div>

        <div className="board-statistics">
          <div className="stat-card">
            <span className="stat-icon">📋</span>

            <div>
              <strong>{statistics.lists}</strong>
              <p>Lists</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🗂️</span>

            <div>
              <strong>{statistics.cards}</strong>
              <p>Total Cards</p>
            </div>
          </div>

          <div className="stat-card completed-stat">
            <span className="stat-icon">✅</span>

            <div>
              <strong>{statistics.completed}</strong>
              <p>Completed</p>
            </div>
          </div>

          <div className="stat-card overdue-stat">
            <span className="stat-icon">⏰</span>

            <div>
              <strong>{statistics.overdue}</strong>
              <p>Overdue</p>
            </div>
          </div>
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
                movingCardId={movingCardId}
                onCardsChange={(cards) =>
                  updateListCards(list.id, cards)
                }
                onCardDrop={moveCard}
              />
            ))
          )}
        </div>
      </section>

      {showListModal && (
        <Modal
          title="Create a new list"
          onClose={closeListModal}
          onSubmit={createList}
          submitText="Create List"
          loading={isSavingList}
        >
          <div className="form-group">
            <label htmlFor={`list-name-${board.id}`}>
              List name
            </label>

            <input
              id={`list-name-${board.id}`}
              type="text"
              value={listName}
              onChange={(event) => setListName(event.target.value)}
              placeholder="Example: In Review"
              autoFocus
            />

            <p className="form-help">
              Use a clear workflow stage such as To Do, Doing or Done.
            </p>
          </div>

          {listError && (
            <p className="form-error">{listError}</p>
          )}
        </Modal>
      )}
    </>
  );
}

export default Board;