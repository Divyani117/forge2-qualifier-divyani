<?php

namespace Database\Seeders;

use App\Models\Member;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Tag::updateOrCreate(
            ['name' => 'Bug'],
            ['color' => '#ef4444']
        );

        Tag::updateOrCreate(
            ['name' => 'Design'],
            ['color' => '#8b5cf6']
        );

        Tag::updateOrCreate(
            ['name' => 'Feature'],
            ['color' => '#22c55e']
        );

        Member::updateOrCreate(
            ['email' => 'divyani@example.com'],
            ['name' => 'Divyani']
        );
    }
}