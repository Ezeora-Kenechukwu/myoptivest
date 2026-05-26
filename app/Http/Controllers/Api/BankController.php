<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use App\Http\Resources\BankResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BankController extends Controller
{
    public function index()
    {
        $banks = Bank::all();
        return response()->json([
            'requestSuccessful' => true,
            'responseMessage' => 'success',
            'responseCode' => '0',
            'responseBody' => BankResource::collection($banks),
        ]);
    }

    public function syncFromMonnify(Request $request)
    {
        try {
            // Replace with your Monnify credentials
            $apiKey = env('MONNIFY_API_KEY');
            $secretKey = env('MONNIFY_SECRET_KEY');
            $baseUrl = env('MONNIFY_BASE_URL', 'https://sandbox.monnify.com'); // Or live URL

            // Get authentication token
            $authResponse = Http::withBasicAuth($apiKey, $secretKey)
                ->post("$baseUrl/api/v1/auth/login");

            if (!$authResponse->ok()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication with Monnify failed.',
                ], 500);
            }

            $token = $authResponse['responseBody']['accessToken'];

            // Fetch banks from Monnify
            $bankResponse = Http::withToken($token)
                ->get("$baseUrl/api/v1/disbursements/banks");

            if (!$bankResponse->ok()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to fetch banks from Monnify.',
                ], 500);
            }

            $banks = $bankResponse['responseBody'];

            // Truncate current banks
            Bank::truncate();

            // Save new list
            foreach ($banks as $bank) {
                Bank::create([
                    'name' => $bank['name'],
                    'code' => $bank['code'],
                    'ussd_template' => $bank['ussdTemplate'] ?? null,
                    'base_ussd_code' => $bank['baseUssdCode'] ?? null,
                    'transfer_ussd_template' => $bank['transferUssdTemplate'] ?? null,
                ]);
            }

            return response()->json([
                'requestSuccessful' => true,
                'responseMessage' => 'Banks synchronized successfully from Monnify.',
                'responseCode' => '0',
                'totalBanks' => count($banks),
            ]);
        } catch (\Throwable $e) {
            Log::error('Bank sync error: ' . $e->getMessage());

            return response()->json([
                'requestSuccessful' => false,
                'responseMessage' => 'An error occurred: ' . $e->getMessage(),
                'responseCode' => '500',
            ], 500);
        }
    }

}
