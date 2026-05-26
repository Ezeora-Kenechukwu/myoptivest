<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class LoanPlan extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'min_amount',
        'max_amount',
        'interest_rate',
        'duration',
        'min_profit_balance',
        'description',
        'active',
        'created_by',
        'last_updated_by',
    ];

    protected $casts = [
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

    public function loans()
    {
        return $this->hasMany(Loan::class, 'loan_plan_id');
    }

    public function toggleActive()
    {
        $this->update(['active' => !$this->active]);
        return $this;
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
