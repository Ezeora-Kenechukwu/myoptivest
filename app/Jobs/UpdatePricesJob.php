<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Asset;
use Illuminate\Support\Facades\Log;

class UpdatePricesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        try {
            $assets = Asset::all();
            foreach ($assets as $asset) {
                $asset->updatePrice();
        
            }
        } catch (\Exception $e) {
            Log::error('Price update job failed: ' . $e->getMessage());
        }
    }
}
