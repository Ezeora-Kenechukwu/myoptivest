<?php
namespace App\Http\Controllers;

use App\Models\MonnifyTransaction;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\WalletFundingService;
use Carbon\Carbon;

class WebhookController extends Controller
{
    public function __construct(private WalletFundingService $walletFundingService) {}

    public function handleMonnifyWebhook(Request $request)
    {
        $signature = (string) $request->header('monnify-signature');
        $clientSecret = (string) config('services.monnify.secret');
        $payload = json_encode($request->all());

        $computedHash = hash_hmac('sha512', $payload, $clientSecret);
        if (!$signature || !hash_equals($computedHash, $signature)) {
            Log::warning('Invalid Monnify signature.', ['reference' => $request->input('eventData.transactionReference')]);
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        $eventType = $request->input('eventType');
        $data = $request->input('eventData', []);
        $reference = $data['transactionReference'] ?? null;

        if (!$reference) {
            Log::warning('Missing transaction reference in webhook.', $data);
            return response()->json(['message' => 'Missing transaction reference'], 422);
        }

        if ($eventType === 'SUCCESSFUL_TRANSACTION') {
            $this->handleSuccessfulTransaction($reference, $data, $eventType);
        } else {
            Log::info("Webhook Event: {$eventType}", ['reference' => $reference, 'data' => $data]);
        }

        return response()->json(['status' => 'received']);
    }

    protected function handleSuccessfulTransaction(string $reference, array $data, string $eventType): void
    {
        $status = strtoupper($data['paymentStatus'] ?? 'UNKNOWN');
        if (!in_array($status, ['PAID', 'OVERPAID'], true)) {
            Log::info('Monnify webhook ignored because status is not fully paid.', compact('reference', 'status'));
            return;
        }

        $amountPaid = (float) ($data['amountPaid'] ?? 0);
        $paidAt = Carbon::parse($data['paidOn'] ?? now());
        $data['source'] = 'webhook:' . $eventType;

        $transaction = $this->walletFundingService->confirmMonnifyPayment($reference, $amountPaid, $paidAt, $data, $status);

        Log::info('Wallet funding webhook processed.', [
            'reference' => $reference,
            'amount' => $amountPaid,
            'status' => $status,
            'paid_at' => $paidAt->toDateTimeString(),
            'user_id' => $transaction?->user_id,
            'event' => $eventType,
        ]);
    }
}
