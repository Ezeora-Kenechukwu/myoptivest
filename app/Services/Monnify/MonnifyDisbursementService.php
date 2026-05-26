<?php

namespace App\Services\Monnify;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MonnifyDisbursementService
{
    public function __construct(private MonnifyClient $client, private array $cfg = [])
    {
        $this->cfg = $cfg ?: config('monnify');
    }

    /**
     * Disburse funds.
     *
     * @param  float|int|string  $amount        Amount in NGN
     * @param  string            $accountNumber Destination account number
     * @param  string            $bank          Bank name or 3-digit NIP code (e.g., "044" or "Access Bank")
     * @param  array             $options       [
     *                                            'narration' => 'Payout',
     *                                            'reference' => 'your-idem-ref',
     *                                            'async'     => true|false,
     *                                            'validate'  => true|false, // optional pre-validate account
     *                                          ]
     */
    public function disburse(float|string $amount, string $accountNumber, string $bank, array $options = []): array
    {
        $amount = (float) $amount;

        // Basic validations
        if ($amount <= 0) {
            throw ValidationException::withMessages(['amount' => 'Amount must be greater than 0.']);
        }
        if (!preg_match('/^\d{10}$/', $accountNumber)) {
            throw ValidationException::withMessages(['accountNumber' => 'Account number must be 10 digits.']);
        }

        // Resolve bank code
        $bankCode = $this->client->resolveBankCode($bank);
        if (!$bankCode) {
            throw ValidationException::withMessages(['bank' => 'Unknown or unsupported bank. Provide bank name or 3-digit code.']);
        }

        $reference = $options['reference'] ?? $this->generateReference($accountNumber, $amount);
        $narration = trim($options['narration'] ?? 'Wallet Payout');
        $async     = (bool) ($options['async'] ?? true);
        $source    = $this->cfg['source_account'] ?: null;

        // Optional pre-validation of account to reduce failures
        if (!empty($options['validate'])) {
            try {
                $this->validateAccount($accountNumber, $bankCode);
            } catch (\Throwable $e) {
                Log::warning('Monnify account validation failed', [
                    'reference' => $reference,
                    'bankCode' => $bankCode,
                    'account'  => $accountNumber,
                    'error'    => $e->getMessage(),
                ]);
            }
        }

        $payload = [
            'amount'                    => $amount,
            'reference'                 => $reference,
            'narration'                 => $narration,
            'destinationBankCode'       => $bankCode,
            'destinationAccountNumber'  => $accountNumber,
            'currency'                  => 'NGN',
            'async'                     => $async,
        ];

        if ($source) {
            $payload['sourceAccountNumber'] = $source; // if you use a specific wallet
        }

        try {
            $res = $this->client->post('/api/v2/disbursements/single', $payload);
            $json = $res->json();
        } catch (\Throwable $e) {
            Log::error('Monnify disbursement HTTP error', [
                'reference' => $reference,
                'payload'   => $payload,
                'message'   => $e->getMessage(),
            ]);
            throw new \RuntimeException('Network error while initiating disbursement.');
        }

        $ok = data_get($json, 'requestSuccessful') === true;
        $body = data_get($json, 'responseBody', []);
        $code = data_get($json, 'responseCode');
        $msg  = data_get($json, 'responseMessage');

        // Log every attempt with context
        Log::info('Monnify disbursement response', [
            'reference' => $reference,
            'requestSuccessful' => $ok,
            'responseCode' => $code,
            'responseMessage' => $msg,
            'responseBody' => $body,
        ]);

        if (!$ok) {
            throw new \RuntimeException($msg ?: 'Disbursement failed.');
        }

        // Two possible flows:
        // 1) 2FA enabled => PENDING_AUTHORIZATION returned. You must call authorize() with OTP.
        // 2) 2FA disabled => COMPLETED (or PENDING if async) and webhook/status will finalize.
        return [
            'reference'      => $reference,
            'status'         => data_get($body, 'status'), // e.g., PENDING_AUTHORIZATION, SUCCESS, FAILED, PENDING
            'amount'         => data_get($body, 'amount', $amount),
            'narration'      => $narration,
            'bankCode'       => $bankCode,
            'accountNumber'  => $accountNumber,
            'raw'            => $json,
        ];
    }

    /**
     * Authorize a single transfer with OTP (for 2FA flows).
     */
    public function authorize(string $reference, string $otp): array
    {
        $payload = [
            'reference'         => $reference,
            'authorizationCode' => $otp,
        ];

        try {
            $res = $this->client->post('/api/v2/disbursements/single/validate-otp', $payload);
            $json = $res->json();
        } catch (\Throwable $e) {
            Log::error('Monnify authorize transfer HTTP error', [
                'reference' => $reference,
                'message'   => $e->getMessage(),
            ]);
            throw new \RuntimeException('Network error while authorizing disbursement.');
        }

        $ok = data_get($json, 'requestSuccessful') === true;
        $msg = data_get($json, 'responseMessage');

        Log::info('Monnify authorize transfer response', [
            'reference' => $reference,
            'requestSuccessful' => $ok,
            'responseMessage' => $msg,
            'raw' => $json,
        ]);

        if (!$ok) {
            throw new \RuntimeException($msg ?: 'Authorization failed.');
        }

        return $json;
    }

    /**
     * (Optional) Validate account name/number with bank.
     */
    private function validateAccount(string $accountNumber, string $bankCode): void
    {
        // Some Monnify accounts use: GET /api/v1/disbursements/account/validate?accountNumber=...&bankCode=...
        // or a similar verification endpoint; keep it defensive if unavailable.
        $res = $this->client->get('/api/v1/disbursements/account/validate', [
            'accountNumber' => $accountNumber,
            'bankCode'      => $bankCode,
        ]);

        if (!$res->ok() || !data_get($res->json(), 'requestSuccessful')) {
            throw new \RuntimeException('Account validation not successful.');
        }
    }

    private function generateReference(string $accountNumber, float $amount): string
    {
        // Idempotent-ish reference: date + short hash
        return 'DB-' . now()->format('YmdHis') . '-' . substr(hash('sha256', $accountNumber.'|'.$amount.'|'.Str::uuid()), 0, 10);
    }
}
