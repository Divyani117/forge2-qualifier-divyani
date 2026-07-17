<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Card;

class Tag extends Model
{
    protected $fillable = [
        'name',
        'color'
    ];

    public function cards()
{
    return $this->belongsToMany(Card::class)->withTimestamps();
}
}