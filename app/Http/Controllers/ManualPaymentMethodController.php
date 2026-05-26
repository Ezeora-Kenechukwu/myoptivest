<?php
namespace App\Http\Controllers;

use App\Models\ManualPaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManualPaymentMethodController extends Controller
{
    public function index()
    {
        return Inertia::render('ManualPaymentMethods/Index', [
            'methods' => ManualPaymentMethod::latest()->get()
        ]);
    }

    public function show(ManualPaymentMethod $method)
    {
        return Inertia::render('ManualPaymentMethods/Show', compact('method'));
    }

    public function create()
    {
        return Inertia::render('ManualPaymentMethods/Create');
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|unique:manual_payment_methods,name|string|max:255',
        'type' => 'required|string|in:bank_transfer,crypto',
        'instructions' => 'required|string',
        'account_name' => 'nullable|string|max:255',
        'account_number' => 'nullable|numeric|digits:10',
        'bank_name' => 'nullable|string|max:255',
        'wallet_address' => 'nullable|string|max:255',
        'icon' => 'nullable|image|max:2048',
    ]);

    // Handle icon upload
    if ($request->hasFile('icon')) {
        $path = $request->file('icon')->store('icons', 'public');
        $validated['icon'] = $path; // stores path like "icons/filename.jpg"
    }

    ManualPaymentMethod::create($validated);

    return to_route('manual-payment-methods.index')->with('success', 'Payment method created');
}

    public function edit(ManualPaymentMethod $method)
    {
        return Inertia::render('ManualPaymentMethods/Edit', compact('method'));
    }

    public function update(Request $request, ManualPaymentMethod $method)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:manual_payment_methods,name,' . $method->id,
            'type' => 'required|string|in:bank_transfer,crypto',
            'instructions' => 'required|string',
            'account_name' => 'nullable|string|max:255',
            'account_number' => 'nullable|numeric|digits:10',
            'bank_name' => 'nullable|string|max:255',
            'wallet_address' => 'nullable|string|max:255',
            'icon' => 'nullable',
        ]);

        // Handle icon upload or validation
        if ($request->hasFile('icon')) {
            $validated['icon'] = $request->file('icon')->store('icons', 'public');
        } elseif ($request->filled('icon')) {
            // Validate that it's a string path ending with a valid image extension
            $icon = $request->input('icon');
            if (!preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $icon)) {
                return back()->withErrors(['icon' => 'The icon must be a valid image file path or uploaded image.'])->withInput();
            }
            $validated['icon'] = $icon;
        }

        $method->update($validated);

        return to_route('manual-payment-methods.index')->with('success', 'Payment method updated successfully.');
    }


    public function destroy(ManualPaymentMethod $method)
    {
        $method->delete();

        return back()->with('success', 'Payment method soft-deleted');
    }

    public function restore($id)
    {
        $method = ManualPaymentMethod::withTrashed()->findOrFail($id);
        $method->restore();

        return back()->with('success', 'Payment method restored');
    }

    public function forceDelete($id)
    {
        $method = ManualPaymentMethod::withTrashed()->findOrFail($id);
        $method->forceDelete();

        return back()->with('success', 'Payment method permanently deleted');
    }

    public function activate($id)
    {
        ManualPaymentMethod::where('id', $id)->update(['active' => true]);

        return back()->with('success', 'Payment method activated');
    }

    public function deactivate($id)
    {
        ManualPaymentMethod::where('id', $id)->update(['active' => false]);

        return back()->with('success', 'Payment method deactivated');
    }
}

