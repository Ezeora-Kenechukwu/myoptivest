<?php

namespace App\Services\Monnify;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\RequestException;
use Throwable;

class MonnifyClient
{
    public function __construct(private array $cfg = [])
    {
        $this->cfg = $cfg ?: config('monnify');
    }

    private function base(): string
    {
        return rtrim($this->cfg['base_url'], '/');
    }

    /**
     * Get OAuth token (cached).
     */
    public function token(): string
    {
        return Cache::remember('monnify:oauth_token', $this->cfg['cache_ttl'], function () {
            $basic = base64_encode($this->cfg['api_key'] . ':' . $this->cfg['secret_key']);

            $res = Http::timeout($this->cfg['http_timeout'])
                ->withHeaders(['Authorization' => "Basic {$basic}"])
                ->retry($this->cfg['retry_times'], $this->cfg['retry_sleep_ms'])
                ->post($this->base() . '/api/v1/auth/login');

            if (!$res->ok() || !data_get($res->json(), 'requestSuccessful')) {
                Log::error('Monnify login failed', ['status' => $res->status(), 'body' => $res->json()]);
                throw new \RuntimeException('Failed to authenticate with Monnify.');
            }

            return data_get($res->json(), 'responseBody.accessToken');
        });
    }

    /**
     * Authorized GET.
     */
    public function get(string $path, array $query = [])
    {
        return $this->authorized()->get($this->base() . $path, $query);
    }

    /**
     * Authorized POST.
     */
    public function post(string $path, array $payload = [])
    {
        return $this->authorized()->post($this->base() . $path, $payload);
    }

    private function authorized()
    {
        $token = $this->token();

        return Http::timeout($this->cfg['http_timeout'])
            ->withToken($token)
            ->retry($this->cfg['retry_times'], $this->cfg['retry_sleep_ms'])
            ->acceptJson();
    }

    /**
     * Resolve Nigerian bank code from code or common name (cached).
     */
    public function resolveBankCode(string $bank): ?string
    {
        $bank = trim($bank);

        // If they already passed a 3-digit NIP code, accept.
        if (preg_match('/^\d{3}$/', $bank)) {
            return $bank;
        }

        $banks = Cache::remember('monnify:banks', $this->cfg['cache_ttl'], function () {
            $res = $this->get('/api/v1/banks'); // bearer
            if (!$res->ok()) {
                Log::warning('Failed fetching banks list', ['status' => $res->status(), 'body' => $res->json()]);
                return [];
            }
            return data_get($res->json(), 'responseBody', []);
        });

        $needle = mb_strtolower($bank);
        foreach ($banks as $b) {
            $name = mb_strtolower($b['name'] ?? '');
            $code = $b['code'] ?? null;
            if ($code && ($name === $needle || str_contains($name, $needle))) {
                return $code;
            }
        }

        return null;
    }
}
