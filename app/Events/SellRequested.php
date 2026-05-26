<?php

namespace App\Events;

use App\Models\Position;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SellRequested implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $position;

    public function __construct(Position $position)
    {
        $this->position = $position;
    }

    public function broadcastOn(): array
    {
        return [new PrivateChannel('admin')]; // Assume admin channel
    }
}
