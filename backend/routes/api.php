<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TaskListController;
use Illuminate\Support\Facades\Route;

Route::apiResource('boards', BoardController::class);
Route::apiResource('lists', TaskListController::class);
Route::apiResource('cards', CardController::class);
Route::apiResource('tags', TagController::class);
Route::apiResource('members', MemberController::class);
Route::put('/cards/{card}/move', [CardController::class, 'move']);
Route::post('/cards/{card}/tags', [CardController::class, 'attachTag']);
Route::delete('/cards/{card}/tags/{tag}', [CardController::class, 'detachTag']);