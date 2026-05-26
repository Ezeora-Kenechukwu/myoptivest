<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\UserManagementTrait;

class AdminUserController extends Controller
{
    use UserManagementTrait;

    protected string $userType = 'admin';
    protected int $defaultRoleId = 1;
}
