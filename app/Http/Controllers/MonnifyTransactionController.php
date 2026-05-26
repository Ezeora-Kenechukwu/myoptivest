<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Mail\WalletFundedMail;
use App\Services\MonnifyService;
use App\Services\WalletFundingService;
use App\Models\MonnifyTransaction;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
class MonnifyTransactionController extends Controller
{
    public function __construct(private MonnifyService $monnifyService, private WalletFundingService $walletFundingService) {}

    public function blockedDirectCardCharge(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => 'Direct card collection is disabled for PCI safety. Please use the secure hosted checkout flow.',
        ], 422);
    }
public function initTransfer(Request $request)
{
    $request->validate([
        'amount' => 'required|numeric|min:1',
        'customer_name' => 'required|string',
        'customer_email' => 'required|email',
        'bank_code' => 'nullable|string', // optional
    ]);

    $reference = 'TRX_' . Str::uuid();
    $transactionPayload = [
        'amount' => $request->amount,
        'customerName' => $request->customer_name,
        'customerEmail' => $request->customer_email,
        'paymentReference' => $reference,
        'paymentDescription' => 'Wallet Funding',
        'currencyCode' => 'NGN',
        'contractCode' => config('services.monnify.contract_code'),
        'paymentMethods' => ['ACCOUNT_TRANSFER'],
        'redirectUrl' => route('monnify.webhook')
    ];

    try {
        // Step 1: Init transaction
        $initResponse = $this->monnifyService->initTransaction($transactionPayload);

        Log::info('Init Transaction', $initResponse);
        if (
            !$initResponse['requestSuccessful'] ||
            empty($initResponse['responseBody']['transactionReference'])
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction initialization failed',
                'data' => $initResponse
            ], 400);
        }

        $transactionRef = $initResponse['responseBody']['transactionReference'];
      

        // Step 2: Fetch dynamic account number
        $bankCode = $request->bank_code ?? '035'; // Wema as fallback
        $bankResponse = $this->monnifyService->payWithBankTransfer($transactionRef, $bankCode);
Log::info('Monnify Bank request', $bankResponse);
        if (!$bankResponse['requestSuccessful']) {
            return response()->json([
                'success' => false,
                'message' => 'Bank account generation failed',
                'data' => $bankResponse
            ], 400);
        }

        $account = $bankResponse['responseBody'];

        // Step 3: Save to DB
        MonnifyTransaction::create([
            'reference' => $transactionRef,
            'payment_reference' => $reference,
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'amount' => $request->amount,
            'payment_method' => 'account_transfer',
            'response' => json_encode($initResponse),
            'account_number' => $account['accountNumber'] ?? null,
            'account_name' => $account['accountName'] ?? null,
            'bank_name' => $account['bankName'] ?? null,
            'account_expiry' => isset($account['expiresOn']) ? \Carbon\Carbon::parse($account['expiresOn']) : null,
        ]);

        Transaction::create([
            'type' => "wallet",
            'method' => "Monnify",
            'amount' => $request->amount,
            'status' => 'pending',
                'payment_reference' => $reference,
            'note' => "Transaction have been initialized",
            'user_id' => $request->user()->id,
            'reference'=>$transactionRef
        ]);

        // Step 4: Return clean response
        return response()->json([
            'success' => true,
            'message' => 'Bank transfer account generated successfully',
            'data' => [
                'transactionReference' => $transactionRef,
                'paymentReference' => $initResponse['responseBody']['paymentReference'] ?? null,
                'checkoutUrl' => $initResponse['responseBody']['checkoutUrl'] ?? null,
                'account' => [
                    'accountNumber' => $account['accountNumber'] ?? null,
                    'accountName' => $account['accountName'] ?? null,
                    'bankName' => $account['bankName'] ?? null,
                    'expiry' => $account['expiresOn'] ?? null,
                    'ussdCode' => $account['ussdPayment'] ?? null,
                ]
            ]
        ]);

    } catch (\Throwable $e) {
        Log::error('Monnify Transaction Error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Server error occurred while processing payment',
        ], 500);
    }
}
/**
 * Initiate checkout
 */
public function initiateCheckout(Request $request)
{
    $request->validate([
        'amount' => 'required|numeric|min:1',
        'customer_name' => 'required|string',
        'customer_email' => 'required|email',
       
    ]);

    $reference = 'CHO_' . Str::uuid();
    $transactionPayload = [
        'amount' => $request->amount,
        'customerName' => $request->customer_name,
        'customerEmail' => $request->customer_email,
        'paymentReference' => $reference,
        'paymentDescription' => 'Wallet Funding',
        'currencyCode' => 'NGN',
        'contractCode' => config('services.monnify.contract_code'),
        'paymentMethods' => ['ACCOUNT_TRANSFER','CARD'],
        'redirectUrl' => route('checkout-callback')
    ];

    try {
        // Step 1: Init transaction
        $initResponse = $this->monnifyService->initTransaction($transactionPayload);

        Log::info('Init Transaction', $initResponse);
        if (
            !$initResponse['requestSuccessful'] ||
            empty($initResponse['responseBody']['transactionReference'])
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction initialization failed',
                'data' => $initResponse
            ], 400);
        }

        $transactionRef = $initResponse['responseBody']['transactionReference'];


//  $paymentRef = $initResponse['responseBody']['paymentReference'];


        // Step 3: Save to DB
        MonnifyTransaction::create([
            'reference' => $transactionRef,
               'payment_reference' => $reference,
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'amount' => $request->amount,
            'payment_method' => 'monnify checkout',
            'response' => json_encode($initResponse),
            'account_number' => $account['accountNumber'] ?? null,
            'account_name' => $account['accountName'] ?? null,
            'bank_name' => $account['bankName'] ?? null,
            'account_expiry' => isset($account['expiresOn']) ? \Carbon\Carbon::parse($account['expiresOn']) : null,
        ]);

        Transaction::create([
            'type' => "wallet",
            'method' => "Monnify",
            'amount' => $request->amount,
            'status' => 'pending',
            'note' => "Transaction have been initialized",
            'user_id' => $request->user()->id,
            'payment_reference' => $reference,
            'reference'=>$transactionRef
        ]);

        // Step 4: Return clean response
        return response()->json([
            'success' => true,
            'message' => 'Bank transfer account generated successfully',
            'data' => [
                'transactionReference' => $transactionRef,
                'paymentReference' => $initResponse['responseBody']['paymentReference'] ?? null,
                'checkoutUrl' => $initResponse['responseBody']['checkoutUrl'] ?? null,
                'account' => [
                    'accountNumber' => $account['accountNumber'] ?? null,
                    'accountName' => $account['accountName'] ?? null,
                    'bankName' => $account['bankName'] ?? null,
                    'expiry' => $account['expiresOn'] ?? null,
                    'ussdCode' => $account['ussdPayment'] ?? null,
                ]
            ]
        ]);

    } catch (\Throwable $e) {
        Log::error('Monnify Transaction Error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Server error occurred while processing payment',
        ], 500);
    }
}
/**
 * Checkout callback
 */


public function checkoutcallback(Request $request)
{
    try {
        $paymentReference = $request->query('paymentReference');

        if (!$paymentReference) {
            return redirect()
                ->route('dashboard') // or ->to('/dashboard')
                ->with('error', 'Missing paymentReference in callback.');
        }

        // 🔁 Find MonnifyTransaction using payment_reference
        $monnifyTx = MonnifyTransaction::where('payment_reference', $paymentReference)->first();

        if (!$monnifyTx) {
            return redirect()
                ->route('dashboard')
                ->with('error', 'Transaction not found using paymentReference.');
        }

        $transactionReference = $monnifyTx->reference;

        // ✅ Call Monnify to confirm the transaction
        $response = $this->monnifyService->getTransactionStatus($transactionReference);

        if (!($response['requestSuccessful'] ?? false)) {
            return redirect()
                ->route('dashboard')
                ->with('error', 'Failed to confirm transaction from Monnify.');
        }

        $monnifyData = $response['responseBody'];
        $status = strtoupper($monnifyData['paymentStatus'] ?? 'UNKNOWN');

        if (!in_array($status, ['PAID', 'OVERPAID', 'PARTIALLY_PAID'])) {
            return redirect()
                ->route('dashboard')
                ->with('error', "Transaction not marked as paid: {$status}.");
        }

        $amount = $monnifyData['amountPaid'] ?? 0;
        $paidAt = Carbon::parse($monnifyData['paidOn'] ?? now());

        // 🔁 Fetch local transaction using the same reference
        $transaction = Transaction::where('reference', $monnifyTx->reference)->first();

        if (!$transaction) {
            return redirect()
                ->route('dashboard')
                ->with('error', 'Local transaction record not found.');
        }

        $monnifyData['source'] = 'checkout_callback';
        $this->walletFundingService->confirmMonnifyPayment($transaction->reference, $amount, $paidAt, $monnifyData, $status);

        // 💾 Update MonnifyTransaction too
        $monnifyTx->update([
            'status' => $status,
            'amount' => $amount,
            'paid_at' => $paidAt,
            'response' => json_encode($response),
        ]);

        return redirect()
            ->route('dashboard')
            ->with('success', "Payment of ₦" . number_format($amount, 2) . " confirmed successfully.");

    } catch (\Throwable $e) {
        Log::error('Monnify Checkout Callback Error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);

        return redirect()
            ->route('dashboard')
            ->with('error', 'An error occurred while processing your payment.');
    }
}

/**
 * Confirm Transfer and Transaction
 */





public function confirmTransfer(Request $request)
{
    $validate= $request->validate([
        'transactionReference' => 'required|string',
    ]);

    try {
        $reference = $validate['transactionReference'];

        $transaction = Transaction::where('reference', $reference)
            ->first();


        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found',
            ], 404);
        }

        $monnifyTransaction = MonnifyTransaction::where('reference', $reference)->first();

        $alreadyConfirmed = in_array($transaction->status, ['confirmed', 'approved']);
        $monnifyConfirmed = in_array(optional($monnifyTransaction)->status, ['PAID', 'OVERPAID', 'PARTIALLY_PAID']);

        if ($alreadyConfirmed && $monnifyConfirmed) {
            return response()->json([
                'success' => true,
                'message' => 'Transaction already confirmed',
                'status' => $transaction->status,
                'amount' => $transaction->amount,
            ]);
        }

        // Call Monnify to get latest status
        $response = $this->monnifyService->getTransactionStatus($reference);

        if (!$response['requestSuccessful']) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found on Monnify',
                'data' => $response
            ], 404);
        }

        $monnifyData = $response['responseBody'];
        $monnifyStatus = strtoupper($monnifyData['paymentStatus'] ?? 'UNKNOWN');
        $amountPaid = $monnifyData['amountPaid'] ?? 0;
        $paidAt = Carbon::parse($monnifyData['paidOn'] ?? now());

        if (in_array($monnifyStatus, ['PAID', 'OVERPAID', 'PARTIALLY_PAID'])) {

            if (!$alreadyConfirmed) {
                $monnifyData['source'] = 'manual_confirm_transfer';
                $this->walletFundingService->confirmMonnifyPayment($reference, $amountPaid, $paidAt, $monnifyData, $monnifyStatus);
            }

            if ($monnifyTransaction && !$monnifyConfirmed) {
                $monnifyTransaction->update([
                    'status' => $monnifyStatus,
                    'amount' => $amountPaid,
                    'paid_at' => $paidAt,
                    'response' => json_encode($response),
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => "Transaction confirmed as {$monnifyStatus}",
                'status' => $monnifyStatus,
                'amount' => $amountPaid,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => "Transaction status: {$monnifyStatus}",
            'status' => $monnifyStatus,
            'amount' => $amountPaid,
        ]);

    } catch (\Throwable $e) {
        Log::error('Error confirming Monnify transfer', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Something went wrong while confirming transfer',
        ], 500);
    }
}





public function initCard(Request $request)
{
    $request->validate([
        'amount' => 'required|numeric|min:1',
        'customer_name' => 'required|string',
        'customer_email' => 'required|email',
    ]);

    $reference = 'CRD_' . Str::uuid(); // Safer than uniqid

    // Init transaction
    $initPayload = [
        'amount' => $request->amount,
        'customerName' => $request->customer_name,
        'customerEmail' => $request->customer_email,
        'paymentReference' => $reference,
        'paymentDescription' => 'Wallet Funding via Card',
        'currencyCode' => 'NGN',
        'contractCode' => config('services.monnify.contract_code'),
        'paymentMethods' => ['CARD'],
        'redirectUrl' => route('checkout-callback'),
    ];
  try {
    $init = $this->monnifyService->initTransaction($initPayload);

    if (!($init['requestSuccessful'] ?? false)) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to initialize card transaction',
            'data' => $init,
        ], 500);
    }

    $transactionReference = $init['responseBody']['transactionReference'];

    Transaction::create([
        'reference' => $transactionReference,
        'payment_reference' => $reference,
        'user_id' => $request->user()->id,
        'type' => 'wallet',
        'amount' => $request->amount,
        'status' => 'pending',
        'method' => 'Monnify hosted card checkout',
        'note' => 'Hosted card payment initialized',
    ]);

    MonnifyTransaction::create([
        // 'reference' => $reference,
          'payment_reference' => $reference,
        'reference' => $transactionReference,
        'customer_name' => $request->customer_name,
        'customer_email' => $request->customer_email,
        'amount' => $request->amount,
        'status' => 'initiated',
        'payment_method' => 'card',
    ]);

    // // Now prepare charge payload
    // $cardPayload = [
    //     'transactionReference' => $transactionReference,
    //     'collectionChannel' => 'API_NOTIFICATION',
    //     'card' => [
    //         'number' => $request->card_number,
    //         'expiryMonth' => $request->expiry_month,
    //         'expiryYear' => $request->expiry_year,
    //         'cvv' => $request->cvv,
    //     ],
    //     'deviceInformation' => [
    //         'httpBrowserLanguage' => 'en-US',
    //         'httpBrowserJavaEnabled' => false,
    //         'httpBrowserJavaScriptEnabled' => true,
    //         'httpBrowserColorDepth' => 24,
    //         'httpBrowserScreenHeight' => 1080,
    //         'httpBrowserScreenWidth' => 1920,
    //         'httpBrowserTimeDifference' => '',
    //         'userAgentBrowserValue' => $request->header('User-Agent'),
    //     ]
    // ];

    // $chargeResponse = $this->monnifyService->chargeCard($cardPayload);

    // Step 4: Return clean response
    return response()->json([
            'success' => true,
            'message' => 'Hosted card checkout initialized successfully',
            'data' => [
                'transactionReference' => $transactionReference,
                'paymentReference' => $init['responseBody']['paymentReference'] ?? null,
                'checkoutUrl' => $init['responseBody']['checkoutUrl'] ?? null,
            ]
        ]);
    }
        catch (\Throwable $e) {
        Log::error('Monnify Transaction Error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Server error occurred while processing payment',
        ], 500);
    }
}


public function chargeCard(Request $request)
{
    return $this->blockedDirectCardCharge($request);

    $validated = $request->validate([
        'transactionReference' => 'required|string',
        'card_number' => 'required|string',
        'expiry_month' => 'required|string',
        'expiry_year' => 'required|string',
        'cvv' => 'required|string',
        'pin' => 'required|string',
        'deviceInformation' => 'required|array',
    ]);

    try {
        $cardPayload = [
            'transactionReference' => $validated['transactionReference'],
            'collectionChannel' => 'API_NOTIFICATION',
            'card' => [
                'number' => $validated['card_number'],
                'expiryMonth' => $validated['expiry_month'],
                'expiryYear' => $validated['expiry_year'],
                'cvv' => $validated['cvv'],
                'pin' => $validated['pin'],
            ],
            'deviceInformation' => $validated['deviceInformation'],
        ];

        // if (!empty($validated['pin'])) {
        //     $cardPayload['card']['pin'] = $validated['pin'];
        // }

        $chargeResponse = $this->monnifyService->chargeCard($cardPayload);

        $responseBody = $chargeResponse['responseBody'] ?? [];

        if (($responseBody['status'] ?? '') === 'BANK_AUTHORIZATION_REQUIRED') {
            return response()->json([
                'success' => false,
                'message' => '3D Secure authentication required',
                'type' => '3ds',
                'redirectUrl' => $responseBody['secure3dData']['redirectUrl'] ?? null,
                'data' => $responseBody,
            ]);
        }

        if (($responseBody['status'] ?? '') === 'OTP_AUTHORIZATION_REQUIRED') {
            return response()->json([
                'success' => false,
                'message' => 'OTP required to authorize payment',
                'type' => 'otp',
                'tokenId' => $responseBody['transactionToken'] ?? null,
                'data' => $responseBody,
            ]);
        }

        if (($responseBody['status'] ?? '') === 'SUCCESS') {
            return $this->handleSuccessfulCardTransaction($validated['transactionReference'], $responseBody);
        }

        return response()->json([
            'success' => false,
            'message' => $chargeResponse['responseMessage'] ?? 'Payment failed',
            'data' => $responseBody,
        ], 422);

    } catch (\Throwable $e) {
        Log::error('Monnify Transaction Error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Server error occurred while processing card payment',
        ], 500);
    }
}

public function authorizeOtp(Request $request)
{
    return $this->blockedDirectCardCharge($request);

    $validated = $request->validate([
        'transactionReference' => 'required|string',
        'tokenId' => 'required|string',
        'token' => 'required|string',
    ]);

    try {
        $payload = [
            'transactionReference' => $validated['transactionReference'],
            'collectionChannel' => 'API_NOTIFICATION',
            'tokenId' => $validated['tokenId'],
            'token' => $validated['token'],
        ];

        $response = $this->monnifyService->authorizeOtp($payload);

        if (($response['responseBody']['status'] ?? '') === 'SUCCESS') {
            return $this->handleSuccessfulCardTransaction($validated['transactionReference'], $response['responseBody']);
        }

        return response()->json([
            'success' => false,
            'message' => 'OTP verification failed',
            'data' => $response['responseBody'] ?? null
        ], 422);

    } catch (\Throwable $e) {
        Log::error('Monnify Transaction Error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Server error occurred while authorizing OTP',
        ], 500);
    }
}

public function authorize3DSCard(Request $request)
{
    return $this->blockedDirectCardCharge($request);

    $validated = $request->validate([
        'transactionReference' => 'required|string',
        'card_number' => 'required|string',
        'expiry_month' => 'required|string',
        'expiry_year' => 'required|string',
        'cvv' => 'required|string',
        'pin' => 'required|string',
    ]);

    try {
        $payload = [
            'transactionReference' => $validated['transactionReference'],
            'collectionChannel' => 'API_NOTIFICATION',
            'apiKey' => config('services.monnify.api_key'),
            'card' => [
                'number' => $validated['card_number'],
                'pin' => $validated['pin'],
                'expiryMonth' => $validated['expiry_month'],
                'expiryYear' => $validated['expiry_year'],
                'cvv' => $validated['cvv'],
            ]
        ];

        $response = $this->monnifyService->authorize3DSCard($payload);

        if (($response['responseBody']['status'] ?? '') === 'SUCCESS') {
            return $this->handleSuccessfulCardTransaction($validated['transactionReference'], $response['responseBody']);
        }

        if (($response['responseBody']['status'] ?? '') === 'BANK_AUTHORIZATION_REQUIRED') {
            return response()->json([
                'success' => false,
                'message' => '3DS Auth required',
                'redirectUrl' => $response['responseBody']['secure3dData']['redirectUrl'] ?? null,
                'type' => '3ds'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Authorization failed',
            'data' => $response['responseBody'] ?? null
        ], 422);

    } catch (\Throwable $e) {
        Log::error('Monnify Transaction Error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Server error occurred while authorizing 3DS card',
        ], 500);
    }
}
 

private function handleSuccessfulCardTransaction(string $reference, array $responseBody)
{
    $amount = $responseBody['authorizedAmount'] ?? $responseBody['amountPaid'] ?? 0;
    $responseBody['source'] = 'card_provider_callback';

    $this->walletFundingService->confirmMonnifyPayment($reference, $amount, now(), $responseBody, 'PAID');

    return response()->json([
        'success' => true,
        'message' => 'Card payment confirmed and wallet funding processed idempotently.',
        'reference' => $reference,
        'amount' => $amount,
    ]);
}


}
