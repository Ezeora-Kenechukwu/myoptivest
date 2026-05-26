<?php

namespace App\Policies;

use App\Models\User;
use App\Models\AssetCategory;
use Illuminate\Auth\Access\HandlesAuthorization;

class AssetCategoryPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->type === 'admin';
    }

    public function view(User $user, AssetCategory $assetCategory): bool
    {
        return $user->type === 'admin';
    }

    public function create(User $user): bool
    {
        return $user->type === 'admin';
    }

    public function update(User $user, AssetCategory $assetCategory): bool
    {
        return $user->type === 'admin';
    }

    public function delete(User $user, AssetCategory $assetCategory): bool
    {
        return $user->type === 'admin';
    }
}
