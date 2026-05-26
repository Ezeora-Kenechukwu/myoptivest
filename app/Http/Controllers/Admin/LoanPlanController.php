<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoanPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoanPlanController extends Controller
{
    public function index()
    {
        $loanPlans = LoanPlan::with(['creator', 'updater'])->withCount('loans')->get();
        return inertia('Admin/LoanPlans/Index', [
            'loanPlans' => $loanPlans,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'min_amount' => 'required|numeric|min:0',
            'max_amount' => 'required|numeric|min:0|gte:min_amount',
            'interest_rate' => 'required|numeric|min:0|max:100',
            'duration' => 'required|integer|min:1',
            'min_profit_balance' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'active' => 'boolean',
        ]);

        LoanPlan::create([
            ...$validated,
            'created_by' => Auth::id(),
            'last_updated_by' => Auth::id(),
        ]);

        return redirect()->route('admin.loan-plans.index')->with('success', 'Loan plan created successfully.');
    }

    public function update(Request $request, LoanPlan $loanPlan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'min_amount' => 'required|numeric|min:0',
            'max_amount' => 'required|numeric|min:0|gte:min_amount',
            'interest_rate' => 'required|numeric|min:0|max:100',
            'duration' => 'required|integer|min:1',
            'min_profit_balance' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'active' => 'boolean',
        ]);

        $loanPlan->update([
            ...$validated,
            'last_updated_by' => Auth::id(),
        ]);

        return redirect()->route('admin.loan-plans.index')->with('success', 'Loan plan updated successfully.');
    }

    public function edit(LoanPlan $loanPlan)
    {
        return inertia('Admin/LoanPlans/Create', [
            'loanPlan' => $loanPlan,
        ]);
    }

    public function destroy(LoanPlan $loanPlan)
    {
        $loanPlan->delete();
        return redirect()->route('admin.loan-plans.index')->with('success', 'Loan plan deleted successfully.');
    }

    public function toggleActive(LoanPlan $loanPlan)
    {
        $loanPlan->toggleActive();
        $status = $loanPlan->active ? 'activated' : 'deactivated';
        return redirect()->route('admin.loan-plans.index')->with('success', "Loan plan $status successfully.");
    }

    public function show(LoanPlan $loanPlan)
    {
        $loanPlan->load(['loans.user', 'creator', 'updater']);
        return inertia('Admin/LoanPlans/Show', [
            'loanPlan' => $loanPlan,
        ]);
    }
}
