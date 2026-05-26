<?php

namespace App\Listeners;

use App\Events\ReferralBonusTriggered;
use App\Services\ReferralBonusService;

class ProcessReferralBonus
{
    public function __construct(protected ReferralBonusService $referralBonusService) {}

    public function handle(ReferralBonusTriggered $event): void
    {
        // Check if the user has a referrer first
        if (!$event->referredUser->referrer) {
            return;
        }

        $this->referralBonusService->handle(
            $event->type,
            $event->referredUser,
            $event->amount,
            $event->sourceType,
            $event->sourceId
        );
    }
}

