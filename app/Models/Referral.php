<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Referral extends Model
{
    use SoftDeletes;

    protected $fillable = ['referrer_id', 'referred_id', 'type', 'slug'];

    public function referrer() {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    public function referred() {
        return $this->belongsTo(User::class, 'referred_id');
    }
}

