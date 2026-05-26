<?php

namespace App\Http\Controllers;

use App\Traits\UserManagementTrait;
use Illuminate\Http\Request;

class StaffUserController extends Controller
{
    use UserManagementTrait;

    protected string $userType = 'staff';
    protected int $defaultRoleId = 2;
}
