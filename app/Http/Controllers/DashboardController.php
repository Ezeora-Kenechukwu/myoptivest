<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
   public function dashboard() {
    $user = Auth::user();
    // dd($user);
    if ($user->type == 'user') {
        $walletAmount = $user->wallet;
        $transactions = Transaction::where('user_id', $user->id)->latest()->limit(10)->get();
      return Inertia::render('dashboard', [
        'main_balance' => $walletAmount,
        'transactions' => $transactions,
      ]);
    }
   if ($user->type === 'admin') {
    // Sum wallet of all users with type 'user'
    $walletAmount = User::where('type', 'user')->sum('wallet');

    // Get latest 10 transactions where the related user is of type 'user'
    $transactions = Transaction::whereHas('user', function ($query) {
        $query->where('type', 'user');
    })
    ->latest()
    ->limit(10)
    ->get();

    return Inertia::render('admindashboard', [
        'main_balance' => $walletAmount,
        'transactions' => $transactions,
    ]);
}

    if ($user->type == 'staff' || $user->type == 'editor') {
      return Inertia::render('editdashboard');
    }
        
    }
}
