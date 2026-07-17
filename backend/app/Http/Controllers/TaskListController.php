<?php

namespace App\Http\Controllers;

use App\Models\TaskList;
use Illuminate\Http\Request;

class TaskListController extends Controller
{
    public function index()
    {
        return TaskList::with('cards.member')->orderBy('position')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'board_id' => 'required|exists:boards,id',
            'name' => 'required|string|max:255',
            'position' => 'nullable|integer|min:0',
        ]);

        $taskList = TaskList::create($validated);

        return response()->json($taskList, 201);
    }

    public function show(TaskList $taskList)
    {
        return $taskList->load('cards.member');
    }

    public function update(Request $request, TaskList $taskList)
    {
        $validated = $request->validate([
            'board_id' => 'sometimes|exists:boards,id',
            'name' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|integer|min:0',
        ]);

        $taskList->update($validated);

        return $taskList;
    }

    public function destroy(TaskList $taskList)
    {
        $taskList->delete();

        return response()->json([
            'message' => 'List deleted successfully',
        ]);
    }
}