<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Notifications\TransactionStatusNotification;

class TransactionController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $transactions = $user->type === 'admin'
            ? Transaction::with('user')->latest()->paginate(20)
            : $user->transactions()->latest()->paginate(20);

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }

    public function show(Transaction $transaction)
    {
        $this->authorizeTransactionOwnerOrAdmin($transaction);
        $transaction->load(['user', 'approvedBy', 'confirmedBy']);
        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:investment,saving,withdrawal',
            'amount' => 'required|numeric|min:1',
            'method' => 'nullable|string',
            'proof' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $data['user_id'] = Auth::id();
        $data['status'] = 'pending';

        if ($request->hasFile('proof')) {
            $data['proof'] = $request->file('proof')->store('transaction-proofs', 'public');
        }

        $transaction = Transaction::create($data);

        // Notify admins + user
        $admins = User::where('type', 'admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new TransactionStatusNotification($transaction, 'created'));
        }

        Auth::user()->notify(new TransactionStatusNotification($transaction, 'created'));

        return to_route('transactions.index')->with('success', 'Transaction submitted successfully.');
    }

    public function approve(Transaction $transaction)
    {
        $this->authorizeAdminAction();
        $transaction->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
        ]);

        $this->notifyAll($transaction, 'approved');
        return back()->with('success', 'Transaction approved.');
    }

    public function decline(Request $request, Transaction $transaction)
    {
        $this->authorizeAdminAction();
        $request->validate(['note' => 'required|string']);

        $transaction->update([
            'status' => 'declined',
            'note' => $request->note,
        ]);

        $this->notifyAll($transaction, 'declined');
        return back()->with('success', 'Transaction declined.');
    }

    public function confirm(Transaction $transaction)
    {
        $this->authorizeAdminAction();
        $transaction->update([
            'status' => 'confirmed',
            'confirmed_by' => Auth::id(),
            'confirmed_at' => now(),
        ]);

        $this->notifyAll($transaction, 'confirmed');
        return back()->with('success', 'Transaction confirmed.');
    }

    public function destroy(Transaction $transaction)
    {
        $this->authorizeAdminAction();
        $transaction->delete();
        return back()->with('success', 'Transaction soft-deleted.');
    }

    public function restore($id)
    {
        $this->authorizeAdminAction();
        $transaction = Transaction::withTrashed()->findOrFail($id);
        $transaction->restore();
        return back()->with('success', 'Transaction restored.');
    }

    public function forceDelete($id)
    {
        $this->authorizeAdminAction();
        $transaction = Transaction::withTrashed()->findOrFail($id);
        $transaction->forceDelete();
        return back()->with('success', 'Transaction permanently deleted.');
    }

    protected function notifyAll(Transaction $transaction, string $action)
    {
        $admins = User::where('type', 'admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new TransactionStatusNotification($transaction, $action));
        }

        $transaction->user->notify(new TransactionStatusNotification($transaction, $action));
    }

    protected function authorizeTransactionOwnerOrAdmin(Transaction $transaction): void
    {
        abort_unless(
            Auth::user()?->type === 'admin' || (int) $transaction->user_id === (int) Auth::id(),
            403
        );
    }

    protected function authorizeAdminAction(): void
    {
        abort_unless(Auth::user()?->type === 'admin', 403);
    }
}
