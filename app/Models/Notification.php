<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Str;

class Notification extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'notifiable_id',
        'notifiable_type',
        'type',
        'data',
        'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Notification $notification) {
            if (!$notification->id) {
                $notification->id = (string) Str::uuid();
            }
        });
    }

    public function notifiable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'notifiable_id');
    }

    public function markAsRead(): void
    {
        if (!$this->read_at) {
            $this->forceFill(['read_at' => now()])->save();
        }
    }
}
