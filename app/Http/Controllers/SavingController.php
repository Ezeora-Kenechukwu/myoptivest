<?php

namespace App\Http\Controllers;

use App\Models\Saving;
use App\Models\SavingsPlan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Exception;

class SavingController extends Controller
{
    public function index()
    {
        try {
            $query = Saving::with(['user', 'savingPlan', 'approvedBy']);

            // For regular users, filter savings by user_id and load only completed dailySavings
            if (Auth::user()->type !== 'admin') {
                $query->where('user_id', Auth::id())
                      ->with(['dailySavings' => function ($query) {
                          $query->where('status', 'successful');
                      }]);
            } else {
                // For admins, load all dailySavings
                $query->with('dailySavings');
            }

            $savings = $query->latest()->paginate(10);
            $plans = SavingsPlan::where('active', true)->get(['id', 'name', 'daily_amount', 'target_amount']);
            $users = Auth::user()->type === 'admin' ? User::select('id', 'name')->get() : [];

            $viewPath = Auth::user()->type === 'admin' ? 'Savings/Admin/Index' : 'Savings/Index';

            return Inertia::render($viewPath, [
                'savings' => $savings,
                'plans' => $plans,
                'users' => $users,
            ]);
        } catch (Exception $e) {
            Log::error('Failed to fetch savings index', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', 'An error occurred while fetching savings. Please try again.');
        }
    }

    public function create()
    {
        try {
            $plans = SavingsPlan::where('active', true)->get(['id', 'name', 'daily_amount', 'target_amount']);
            $users = Auth::user()->type === 'admin' ? User::select('id', 'name')->get() : [];
            $viewPath = Auth::user()->type === 'admin' ? 'Savings/Admin/Create' : 'Savings/Create';

            return Inertia::render($viewPath, [
                'plans' => $plans,
                'users' => $users,
                'auth' => Auth::user(),
            ]);
        } catch (Exception $e) {
            Log::error('Failed to load create saving form', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', 'An error occurred while loading the form. Please try again.');
        }
    }

    public function store(Request $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                Log::debug('Saving store request data', [
                    'user_id' => Auth::id(),
                    'request_data' => $request->all(),
                ]);

                $rules = [
                    'saving_plan_id' => 'required|exists:savings_plans,id',
                    'name' => 'required|string|max:255',
                    'start_date' => 'required|date|after_or_equal:today',
                    'end_date' => 'required|date|after:start_date',
                    'amount_per_day' => 'required|numeric|min:0',
                    'targeted_amount' => 'required|numeric|min:0',
                    'type' => 'required|in:manual,automatic',
                ];

                if (Auth::user()->type === 'admin') {
                    $rules['user_id'] = 'required|exists:users,id';
                }

                $validator = Validator::make($request->all(), $rules, [
                    'saving_plan_id.required' => 'Please select a savings plan.',
                    'saving_plan_id.exists' => 'The selected savings plan is invalid.',
                    'name.required' => 'Please provide a name for the saving.',
                    'name.max' => 'The saving name must not exceed 255 characters.',
                    'start_date.required' => 'Please select a start date.',
                    'start_date.after_or_equal' => 'The start date must be today or a future date.',
                    'end_date.required' => 'Please select an end date.',
                    'end_date.after' => 'The end date must be after the start date. Please choose a later date.',
                    'amount_per_day.required' => 'Please ensure an amount per day is set (select a valid plan).',
                    'amount_per_day.numeric' => 'The daily amount must be a valid number.',
                    'amount_per_day.min' => 'The daily amount must be at least 0.',
                    'targeted_amount.required' => 'Please ensure a target amount is calculated (select valid dates).',
                    'targeted_amount.numeric' => 'The target amount must be a valid number.',
                    'targeted_amount.min' => 'The target amount must be at least 0.',
                    'type.required' => 'Please select a contribution type (manual or automatic).',
                    'type.in' => 'The contribution type must be either manual or automatic.',
                    'user_id.required' => 'Please select a user to create the saving for.',
                    'user_id.exists' => 'The selected user is invalid.',
                ]);

                if ($validator->fails()) {
                    Log::warning('Validation failed for saving creation', [
                        'user_id' => Auth::id(),
                        'errors' => $validator->errors()->all(),
                        'request_data' => $request->except(['_token']),
                    ]);
                    return back()->withErrors($validator)->withInput();
                }

                $validated = $validator->validated();
                $saving = new Saving($validated);
                $saving->user_id = Auth::user()->type === 'admin' ? $validated['user_id'] : Auth::id();
                $saving->calculateDuration()->save();

                $saving->createDailySavings($validated['type']);

                return back()->with('success', 'Saving created successfully.');
            });
        } catch (Exception $e) {
            Log::error('Failed to create saving', [
                'user_id' => Auth::id(),
                'request_data' => $request->except(['_token']),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', $e->getMessage());
        }
    }

    public function show(Saving $saving)
    {
        try {
            $this->authorizeSavingOwnerOrAdmin($saving);
            $saving->load([
                'user',
                'savingPlan',
                'approvedBy',
                'dailySavings' => function ($query) use ($saving) {
                    if (Auth::user()->type !== 'admin') {
                        $query->where('status', 'successful')->where('user_id', Auth::id());
                    }
                }
            ]);
            $viewPath = Auth::user()->type === 'admin' ? 'Savings/Admin/Show' : 'Savings/Show';

            return Inertia::render($viewPath, [
                'saving' => $saving,
                'auth' => Auth::user(),
            ]);
        } catch (Exception $e) {
            Log::error('Failed to show saving', [
                'user_id' => Auth::id(),
                'saving_id' => $saving->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', 'An error occurred while fetching the saving. Please try again.');
        }
    }

    public function edit(Saving $saving)
    {
        try {
            $this->authorizeSavingOwnerOrAdmin($saving);
            $plans = SavingsPlan::where('active', true)->get(['id', 'name', 'daily_amount', 'target_amount']);
            $users = Auth::user()->type === 'admin' ? User::select('id', 'name')->get() : [];
            $saving->load(['user', 'savingPlan']);
            $viewPath = Auth::user()->type === 'admin' ? 'Savings/Admin/Edit' : 'Savings/Edit';

            return Inertia::render($viewPath, [
                'saving' => $saving,
                'plans' => $plans,
                'users' => $users,
                'auth' => Auth::user(),
            ]);
        } catch (Exception $e) {
            Log::error('Failed to load edit saving form', [
                'user_id' => Auth::id(),
                'saving_id' => $saving->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', 'An error occurred while loading the form. Please try again.');
        }
    }

    public function update(Request $request, Saving $saving)
    {
        try {
            $this->authorizeSavingOwnerOrAdmin($saving);
            $rules = [
                'saving_plan_id' => 'required|exists:savings_plans,id',
                'name' => 'required|string|max:255',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                'amount_per_day' => 'required|numeric|min:0',
                'targeted_amount' => 'required|numeric|min:0',
                'type' => 'required|in:manual,automatic',
            ];

            if (Auth::user()->type === 'admin') {
                $rules['user_id'] = 'required|exists:users,id';
            }

            $validator = Validator::make($request->all(), $rules, [
                'saving_plan_id.required' => 'Please select a savings plan.',
                'saving_plan_id.exists' => 'The selected savings plan is invalid.',
                'name.required' => 'Please provide a name for the saving.',
                'name.max' => 'The saving name must not exceed 255 characters.',
                'start_date.required' => 'Please select a start date.',
                'start_date.date' => 'The start date must be a valid date.',
                'end_date.required' => 'Please select an end date.',
                'end_date.after' => 'The end date must be after the start date. Please choose a later date.',
                'amount_per_day.required' => 'Please ensure an amount per day is set (select a valid plan).',
                'amount_per_day.numeric' => 'The daily amount must be a valid number.',
                'amount_per_day.min' => 'The daily amount must be at least 0.',
                'targeted_amount.required' => 'Please ensure a target amount is calculated (select valid dates).',
                'targeted_amount.numeric' => 'The target amount must be a valid number.',
                'targeted_amount.min' => 'The target amount must be at least 0.',
                'type.required' => 'Please select a contribution type (manual or automatic).',
                'type.in' => 'The contribution type must be either manual or automatic.',
                'user_id.required' => 'Please select a user to update the saving for.',
                'user_id.exists' => 'The selected user is invalid.',
            ]);

            if ($validator->fails()) {
                Log::warning('Validation failed for saving update', [
                    'user_id' => Auth::id(),
                    'saving_id' => $saving->id,
                    'errors' => $validator->errors()->all(),
                    'request_data' => $request->except(['_token']),
                ]);
                return back()->withErrors($validator)->withInput();
            }

            $validated = $validator->validated();
            if (Auth::user()->type === 'admin') {
                $saving->user_id = $validated['user_id'];
            }
            $saving->update($validated);
            $saving->calculateDuration()->save();

            $saving->dailySavings()->update(['type' => $validated['type']]);

            return back()->with('success', 'Saving updated successfully.');
        } catch (Exception $e) {
            Log::error('Failed to update saving', [
                'user_id' => Auth::id(),
                'saving_id' => $saving->id,
                'request_data' => $request->except(['_token']),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', $e->getMessage());
        }
    }

    public function deactivate(Saving $saving)
    {
        try {
            $this->authorizeSavingOwnerOrAdmin($saving);
            $saving->update(['active' => false, 'status' => 'cancelled']);
            return back()->with('success', 'Saving deactivated successfully.');
        } catch (Exception $e) {
            Log::error('Failed to deactivate saving', [
                'user_id' => Auth::id(),
                'saving_id' => $saving->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', 'An error occurred while deactivating the saving. Please try again.');
        }
    }

    public function activate(Saving $saving)
    {
        try {
            $this->authorizeSavingOwnerOrAdmin($saving);
            $saving->update(['active' => true, 'status' => 'started']);
            return back()->with('success', 'Saving activated successfully.');
        } catch (Exception $e) {
            Log::error('Failed to activate saving', [
                'user_id' => Auth::id(),
                'saving_id' => $saving->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', 'An error occurred while activating the saving. Please try again.');
        }
    }

    public function destroy(Saving $saving)
    {
        try {
            $this->authorizeSavingOwnerOrAdmin($saving);
            $saving->delete();
            return redirect()->route('savings.index')->with('success', 'Saving deleted successfully.');
        } catch (Exception $e) {
            Log::error('Failed to delete saving', [
                'user_id' => Auth::id(),
                'saving_id' => $saving->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', 'An error occurred while deleting the saving. Please try again.');
        }
    }

    public function approve(Saving $saving)
    {
        try {
            abort_unless(Auth::user()?->type === 'admin', 403);
            $saving->update([
                'approved_by' => Auth::id(),
                'approved_on' => Carbon::now(),
                'status' => 'started',
            ]);

            return back()->with('success', 'Saving approved successfully.');
        } catch (Exception $e) {
            Log::error('Failed to approve saving', [
                'user_id' => Auth::id(),
                'saving_id' => $saving->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', 'An error occurred while approving the saving. Please try again.');
        }
    }

    public function cancel(Saving $saving)
    {
        try {
            $this->authorizeSavingOwnerOrAdmin($saving);

            $saving->cancel();
            return back()->with('success', 'Saving cancelled and funds refunded successfully.');
        } catch (Exception $e) {
            Log::error('Failed to cancel saving', [
                'user_id' => Auth::id(),
                'saving_id' => $saving->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', $e->getMessage());
        }
    }

    protected function authorizeSavingOwnerOrAdmin(Saving $saving): void
    {
        abort_unless(
            Auth::user()?->type === 'admin' || (int) $saving->user_id === (int) Auth::id(),
            403
        );
    }
}
