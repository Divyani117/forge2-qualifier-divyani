<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Card extends Model
{
    protected $fillable = [
        'task_list_id',
        'member_id',
        'title',
        'description',
        'due_date',
        'position'
    ];

    public function taskList(): BelongsTo
    {
        return $this->belongsTo(TaskList::class);
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }
}