<?php namespace App\Helpers;

use Illuminate\Support\Facades\Http;

class MonnifyHelper
{
    public static function getAccessToken(): ?string
    {
        $apiKey = config('services.monnify.api_key');
        $secret = config('services.monnify.secret');
        $credentials = base64_encode("{$apiKey}:{$secret}");

        $response = Http::withHeaders([
            'Authorization' => "Basic $credentials"
        ])->post(config('services.monnify.base_url') . '/api/v1/auth/login');

        return $response->json()['responseBody']['accessToken'] ?? null;
    }
}
