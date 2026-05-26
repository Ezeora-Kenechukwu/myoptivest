<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
class SavingsPlan extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'short_description', 'long_description', 'thumbnail', 'photos',
        'daily_amount', 'duration', 'target_amount', 'type', 'monthly_charge',
        'active', 'created_by', 'approved_by', 'approved_on', 'last_updated_by'
    ];

    protected $casts = [
        'photos' => 'array',
        'approved_on' => 'datetime',
        'active' => 'boolean'
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function creator() {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver() {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function updater() {
        return $this->belongsTo(User::class, 'last_updated_by');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->slug = Str::slug($model->name);
        });
        static::updating(function ($model) {
            $model->slug = Str::slug($model->name);
        });
    }
}