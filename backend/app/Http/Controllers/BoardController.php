<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function index()
    {
        return Board::with('taskLists.cards.member')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $board = Board::create($validated);

        return response()->json($board, 201);
    }

    public function show(Board $board)
    {
        return $board->load('taskLists.cards.member');
    }

    public function update(Request $request, Board $board)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $board->update($validated);

        return $board;
    }

    public function destroy(Board $board)
    {
        $board->delete();

        return response()->json([
            'message' => 'Board deleted successfully',
        ]);
    }
}