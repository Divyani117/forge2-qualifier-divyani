<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Board extends Model
{
    protected $fillable = ['name'];

    public function taskLists(): HasMany
    {
        return $this->hasMany(TaskList::class);
    }
}