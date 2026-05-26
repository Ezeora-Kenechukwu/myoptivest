<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceHistory extends Model
{
    use HasFactory;

    protected $fillable = ['asset_id', 'price', 'timestamp'];
 protected $table = "price_histories";
public $timestamps = false;
    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }
}
