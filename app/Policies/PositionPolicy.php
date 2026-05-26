<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Position;
use Illuminate\Auth\Access\HandlesAuthorization;

class PositionPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->type === 'admin';
    }

    public function view(User $user, Position $position): bool
    {
        return $user->id === $position->user_id || $user->type === 'admin';
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Position $position): bool
    {
        return $user->id === $position->user_id || $user->type === 'admin';
    }

    public function delete(User $user, Position $position): bool
    {
        return $user->type === 'admin';
    }

    public function requestSell(User $user, Position $position): bool
    {
        return $user->id === $position->user_id && $position->status === 'active';
    }

    public function transfer(User $user, Position $position): bool
    {
        return $user->id === $position->user_id && $position->status === 'active';
    }

    public function approveSell(User $user, Position $position): bool
    {
        return $user->type === 'admin' && $position->status === 'pending_sell';
    }

    public function declineSell(User $user, Position $position): bool
    {
        return $user->type === 'admin' && $position->status === 'pending_sell';
    }
}
