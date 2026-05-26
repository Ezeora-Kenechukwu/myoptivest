<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\MonnifyTransaction;
use App\Helpers\MonnifyHelper;

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Helpers\MonnifyHelper;

class MonnifyService
{
    public function initTransaction($payload): array
    {
        $accessToken = MonnifyHelper::getAccessToken();
        $url = config('services.monnify.base_url') . '/api/v1/merchant/transactions/init-transaction';

        return Http::withToken($accessToken)->post($url, $payload)->json();
    }

    public function payWithBankTransfer(string $reference, string $bankCode): array
    {
        $accessToken = MonnifyHelper::getAccessToken();
        $url = config('services.monnify.base_url') . "/api/v1/merchant/bank-transfer/init-payment";

        return Http::withToken($accessToken)->post($url, [
            'transactionReference' => $reference,
            'bankCode' => $bankCode
        ])->json();
    }

    public function getTransactionStatus(string $transactionReference): array
    {
        $accessToken = MonnifyHelper::getAccessToken();
        $encodedReference = urlencode($transactionReference);
        $url = config('services.monnify.base_url') . "/api/v2/transactions/{$encodedReference}";

        return Http::withToken($accessToken)->get($url)->json();
    }

    public function getBankTransferDetails(string $reference, string $bankCode = null): array
    {
        $accessToken = MonnifyHelper::getAccessToken();
        $url = config('services.monnify.base_url') . "/api/v1/merchant/bank-transfer/details?transactionReference={$reference}";
        if ($bankCode) {
            $url .= "&bankCode=$bankCode";
        }

        return Http::withToken($accessToken)->get($url)->json();
    }

    public function chargeCard(array $cardPayload): array
    {
        $accessToken = MonnifyHelper::getAccessToken();
        $url = config('services.monnify.base_url') . "/api/v1/merchant/cards/charge";

        return Http::withToken($accessToken)->post($url, $cardPayload)->json();
    }

    /**
     * Authorize OTP (2FA Token) for a card charge
     */
    public function authorizeOtp(array $payload): array
    {
        $accessToken = MonnifyHelper::getAccessToken();
        $url = config('services.monnify.base_url') . "/api/v1/merchant/cards/otp/authorize";

        return Http::withToken($accessToken)->post($url, $payload)->json();
    }

    /**
     * Authorize a 3D Secure Card
     */
    public function authorize3DSCard(array $payload): array
    {
        $accessToken = MonnifyHelper::getAccessToken();
        $url = config('services.monnify.base_url') . "/api/v1/sdk/cards/secure-3d/authorize";

        return Http::withToken($accessToken)->post($url, $payload)->json();
    }
}

