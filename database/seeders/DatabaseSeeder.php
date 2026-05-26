<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\CompanySettingsSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            AdminUserSeeder::class,
            CompanySettingsSeeder::class,
        ]);

        // Create a test user for development and mark as verified
        $testUser = User::where('email', 'test@example.com')->first()
            ?? User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        if (empty($testUser->email_verified_at)) {
            $testUser->email_verified_at = now();
            $testUser->save();
        }

        $this->call(OptivestSqlDataSeeder::class);
    }
}
