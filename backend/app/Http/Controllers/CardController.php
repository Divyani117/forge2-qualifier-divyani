<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Tag;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function index()
    {
        return Card::with(['member', 'tags'])
            ->orderBy('position')
            ->get();
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

        return response()->json(
            $card->load(['member', 'tags']),
            201
        );
    }

    public function show(Card $card)
    {
        return $card->load(['member', 'tags']);
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

        return $card->load(['member', 'tags']);
    }

    public function destroy(Card $card)
    {
        $card->delete();

        return response()->json([
            'message' => 'Card deleted successfully',
        ]);
    }

    public function move(Request $request, Card $card)
    {
        $validated = $request->validate([
            'task_list_id' => 'required|exists:task_lists,id',
        ]);

        $card->update([
            'task_list_id' => $validated['task_list_id'],
        ]);

        return response()->json(
            $card->load(['member', 'tags'])
        );
    }

    public function attachTag(Request $request, Card $card)
    {
        $validated = $request->validate([
            'tag_id' => 'required|exists:tags,id',
        ]);

        $card->tags()->syncWithoutDetaching([
            $validated['tag_id'],
        ]);

        return response()->json(
            $card->load(['member', 'tags'])
        );
    }

    public function detachTag(Card $card, Tag $tag)
    {
        $card->tags()->detach($tag->id);

        return response()->json(
            $card->load(['member', 'tags'])
        );
    }
}