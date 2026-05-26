<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanySettingsSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'company_name' => env('APP_NAME', 'Optivest'),
            'support_email' => env('SUPPORT_EMAIL', 'support@example.com'),
            'support_phone' => env('SUPPORT_PHONE', null),
            'default_currency' => env('DEFAULT_CURRENCY', 'NGN'),
            'currency_symbol' => env('CURRENCY_SYMBOL', '₦'),
            'timezone' => config('app.timezone', 'UTC'),
        ];

        foreach ($defaults as $key => $value) {
            DB::table('settings')->updateOrInsert(
                ['key' => $key],
                ['value' => $value, 'updated_at' => now(), 'created_at' => now()]
            );
        }
    }
}
