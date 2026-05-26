<?php

namespace App\Events;

use App\Models\Asset;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PriceUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $asset;

    public function __construct(Asset $asset)
    {
        $this->asset = $asset;
    }

    public function broadcastOn(): array
    {
        return [new Channel('assets')];
    }

    public function broadcastWith(): array
    {
        return [
            'asset_id' => $this->asset->id,
            'current_price' => $this->asset->current_price,
        ];
    }
}
