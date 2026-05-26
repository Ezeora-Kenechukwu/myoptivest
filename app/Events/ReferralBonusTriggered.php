<?php 
namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReferralBonusTriggered
{
    use Dispatchable, SerializesModels;

    public string $type;
    public User $referredUser;
    public float $amount;
    public string $sourceType;
    public int $sourceId;

    public function __construct(string $type, User $referredUser, float $amount, string $sourceType, int $sourceId)
    {
        $this->type = $type;
        $this->referredUser = $referredUser;
        $this->amount = $amount;
        $this->sourceType = $sourceType;
        $this->sourceId = $sourceId;
    }
}
