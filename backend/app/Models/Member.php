<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Member extends Model
{
    protected $fillable = [
        'name',
        'email'
    ];

    public function cards(): HasMany
    {
        return $this->hasMany(Card::class);
    }
}