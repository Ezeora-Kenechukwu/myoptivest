<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
class InvestmentPlan extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'min_amount',
        'max_amount',
        'category_id',
        'roi',
        'duration',
        'payout_frequency',
        'thumbnail',
        'photos',
        'short_description',
        'long_description',
        'active',
        'created_by',
        'last_updated_by',
    ];

    protected $casts = [
        'photos' => 'array',
        'active' => 'boolean',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'last_updated_by');
    }
    public function category()
    {
        return $this->belongsTo(InvestmentPlanCategory::class, 'category_id');
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
public function getRouteKeyName()
    {
        return 'slug';
    }
}

