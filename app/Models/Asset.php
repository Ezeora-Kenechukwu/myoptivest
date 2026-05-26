<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Asset extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'name', 'description', 'min_price', 'max_price', 'current_price', 'drift'
    ];

    public function category()
    {
        return $this->belongsTo(AssetCategory::class);
    }

    public function positions()
    {
        return $this->hasMany(Position::class);
    }
public function priceHistories()
{
    return $this->hasMany(PriceHistory::class);
}



    public function updatePrice()
    {
        try {
            $range = $this->max_price - $this->min_price;
            $noise = (rand(-10, 10) / 100) * $range * 0.1;
            $step = $this->drift * $range * 0.01;
            $newPrice = $this->current_price + $step + $noise;

            if ($newPrice < $this->min_price) {
                $newPrice = $this->min_price;
            }
            if ($newPrice > $this->max_price) {
                $newPrice = $this->max_price;
            }

            // 5% chance to reverse drift direction
            if (rand(0, 100) < 5) {
                $this->drift = -$this->drift;
            }

            $this->current_price = $newPrice;
            $this->save();
                    PriceHistory::create([
    'asset_id' => $this->id,
    'price' => $newPrice,
    'timestamp' => now(),
]);

            // Broadcast the update
            broadcast(new \App\Events\PriceUpdated($this));

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to update asset price: ' . $e->getMessage(), ['asset_id' => $this->id]);
            return false;
        }
    }
}
