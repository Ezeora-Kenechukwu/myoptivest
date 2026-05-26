<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Services\WalletService;
use Exception;

class Saving extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'saving_plan_id',
        'name',
        'status',
        'start_date',
        'end_date',
        'duration',
        'amount_per_day',
        'targeted_amount',
        'active',
        'approved_by',
        'approved_on',
    ];

    protected $casts = [
        'status' => 'string',
        'start_date' => 'date',
        'end_date' => 'date',
        'active' => 'boolean',
        'approved_on' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function savingPlan()
    {
        return $this->belongsTo(SavingsPlan::class, 'saving_plan_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function dailySavings()
    {
        return $this->hasMany(DailySaving::class);
    }

    public function calculateDuration()
    {
        try {
            if (!$this->start_date || !$this->end_date) {
                throw new Exception('Please provide both a start date and an end date.');
            }

            $startDate = Carbon::parse($this->start_date);
            $endDate = Carbon::parse($this->end_date);

            if ($endDate->lessThan($startDate)) {
                throw new Exception('The end date must be after the start date. Please choose a later end date.');
            }

            $this->duration = $startDate->diffInDays($endDate) + 1; // Include end date
            // dd($this->duration,  $startDate,  $endDate);
            return $this;
        } catch (Exception $e) {
            Log::error('Failed to calculate saving duration', [
                'saving_id' => $this->id,
                'user_id' => $this->user_id,
                'start_date' => $this->start_date,
                'end_date' => $this->end_date,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw new Exception($e->getMessage()); // Propagate user-friendly message
        }
    }

    public function createDailySavings($type = 'manual')
    {

        try {
            // Validate inputs
            if (!$this->start_date || !$this->duration || $this->duration <= 0 || $this->amount_per_day <= 0) {
                throw new Exception('Invalid saving data: Ensure start date, duration, and amount per day are valid.');
            }

            $startDate = Carbon::parse($this->start_date);
            $duration = $this->duration;

            // Log input data for debugging
            Log::debug('Creating daily savings', [
                'saving_id' => $this->id,
                'user_id' => $this->user_id,
                'type' => $type,
                'start_date' => $this->start_date,
                'duration' => $duration,
                'amount_per_day' => $this->amount_per_day,
            ]);

            $dailySavings = [];
            for ($i = 0; $i < $duration; $i++) {
                $dailySavings[] = [
                    'saving_id' => $this->id,
                    'user_id' => $this->user_id,
                    'status' => 'pending',
                    'type' => $type,
                    'expected_payment_at' => $startDate->copy()->addDays($i),
                    'amount' => $this->amount_per_day,
                    'transaction_reference' => Str::uuid(),
                    'retry_count' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Batch insert for performance
            foreach (array_chunk($dailySavings, 100) as $index => $chunk) {
                try {
                    DailySaving::insert($chunk);
                } catch (Exception $e) {
                    Log::error('Failed to insert daily savings batch', [
                        'saving_id' => $this->id,
                        'user_id' => $this->user_id,
                        'batch_index' => $index,
                        'batch_size' => count($chunk),
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                    ]);
                    throw new Exception('Failed to create daily savings records. Please try again.');
                }
            }
        } catch (Exception $e) {
            Log::error('Failed to create daily savings', [
                'saving_id' => $this->id,
                'user_id' => $this->user_id,
                'type' => $type,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw new Exception($e->getMessage()); // Propagate user-friendly message
        }
    }

    public function cancel()
    {
        try {
            return DB::transaction(function () {
                $this->update([
                    'status' => 'cancelled',
                    'active' => false,
                ]);

                // Update remaining daily savings to cancelled
                $this->dailySavings()
                    ->whereIn('status', ['pending', 'failed'])
                    ->update([
                        'status' => 'cancelled',
                        'cancelled_at' => Carbon::now(),
                    ]);

                $user = $this->user()->lockForUpdate()->first();
                $refund = (float) $this->dailySavings()
                    ->whereIn('status', ['successful', 'completed', 'paid'])
                    ->sum('amount');

                if ($user && $refund > 0) {
                    app(WalletService::class)->credit(
                        $user,
                        $refund,
                        'savings_refund',
                        'savings-refund:' . $this->id,
                        null,
                        ['saving_id' => $this->id]
                    );
                    $user->savings_balance = max(0, (float) $user->savings_balance - $refund);
                    $user->save();
                }
            });
        } catch (Exception $e) {
            Log::error('Failed to cancel saving', [
                'saving_id' => $this->id,
                'user_id' => $this->user_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw new Exception('Failed to cancel the saving. Please try again.');
        }
    }
}
