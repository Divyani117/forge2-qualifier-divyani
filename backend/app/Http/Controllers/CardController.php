<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function index()
    {
        return Card::with('member')->orderBy('position')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_list_id' => 'required|exists:task_lists,id',
            'member_id' => 'nullable|exists:members,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'position' => 'nullable|integer|min:0',
        ]);

        $card = Card::create($validated);

        return response()->json($card->load('member'), 201);
    }

    public function show(Card $card)
    {
        return $card->load('member');
    }

    public function update(Request $request, Card $card)
    {
        $validated = $request->validate([
            'task_list_id' => 'sometimes|exists:task_lists,id',
            'member_id' => 'nullable|exists:members,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'position' => 'sometimes|integer|min:0',
        ]);

        $card->update($validated);

        return $card->load('member');
    }

    public function destroy(Card $card)
    {
        $card->delete();

        return response()->json([
            'message' => 'Card deleted successfully',
        ]);
    }
}