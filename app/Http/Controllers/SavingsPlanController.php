<?php

// app/Http/Controllers/SavingsPlanController.php

namespace App\Http\Controllers;

use App\Models\SavingsPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SavingsPlanController extends Controller
{
    public function index()
    {
        return Inertia::render('SavingsPlan/Index', [
            'plans' => SavingsPlan::with(['creator', 'approver', 'updater'])->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('SavingsPlan/Create');
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|unique:savings_plans,name',
                'short_description' => 'nullable|string',
                'long_description' => 'nullable|string',
                'daily_amount' => 'required|numeric|min:1',
                'duration' => 'required|integer|min:1',
                'target_amount' => 'nullable|numeric',
                'type' => 'required|in:normal,investment',
                'monthly_charge' => 'required|numeric|min:0',
                'thumbnail' => 'nullable|image|max:2048',
                'photos.*' => 'nullable|image|max:2048',
            ]);
    
            $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
            $validated['created_by'] = auth()->id();
            $validated['last_updated_by'] = auth()->id();
            $validated['photos'] = [];
    
            // Handle thumbnail upload
            if ($request->hasFile('thumbnail')) {
                $validated['thumbnail'] = $request->file('thumbnail')->store('savings_plans/thumbnails', 'public');
            }
    
            // Handle uploaded photo files
            $photoFiles = $request->file('photos', []);
            if (is_array($photoFiles)) {
                foreach ($photoFiles as $index => $file) {
                    if ($file && $file->isValid()) {
                        $validated['photos'][] = $file->store('savings_plans/photos', 'public');
                    } else {
                        return back()->with('error', "Photo #" . ($index + 1) . " is not a valid uploaded image.")->withInput();
                    }
                }
            }
    
            // Handle input photo paths
            $photosInput = $request->input('photos', []);
            if (is_array($photosInput)) {
                foreach ($photosInput as $index => $photoItem) {
                    if (is_string($photoItem) && preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $photoItem)) {
                        $validated['photos'][] = $photoItem;
                    } elseif (!isset($photoFiles[$index])) {
                        return back()->with('error', "Photo #" . ($index + 1) . " must be a valid image or image path.")->withInput();
                    }
                }
            }
    
            SavingsPlan::create($validated);
    
            return to_route('savings-plans.index')->with('success', 'Savings Plan created successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Log validation errors
            Log::error('Validation Error on SavingsPlan Store:', [
                'errors' => $e->errors(),
                'message' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);
    
            // Redirect back with validation errors
            return back()
                ->withErrors($e->validator)
                ->withInput();
        } catch (\Throwable $e) {
            Log::error('Unexpected SavingsPlan Store Error: ' . $e->getMessage());
            return back()->with('error', 'Something went wrong.')->withInput();
        }
    }
    

    public function show(SavingsPlan $savings_plan)
    {
        return Inertia::render('SavingsPlan/Show', [
            'plan' => $savings_plan->load(['creator', 'approver', 'updater'])
        ]);
    }

    public function edit(SavingsPlan $savings_plan)
    {
        return Inertia::render('SavingsPlan/Edit', [
            'plan' => $savings_plan
        ]);
    }

   public function update(Request $request, SavingsPlan $savings_plan)
{
    try {
        $validated = $request->validate([
            'name' => 'required|string|unique:savings_plans,name,' . $savings_plan->id,
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'daily_amount' => 'required|numeric|min:1',
            'duration' => 'required|integer|min:1',
            'target_amount' => 'nullable|numeric',
            'type' => 'required|in:normal,investment',
            'monthly_charge' => 'required|numeric|min:0',
            'thumbnail' => 'nullable',
            'photos' => 'nullable|array',
        ]);

        $validated['last_updated_by'] = auth()->id();
        $validated['photos'] = [];

        // Handle thumbnail update
        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('savings_plans/thumbnails', 'public');
        }

        // Handle uploaded photo files
        $photoFiles = $request->file('photos', []);
        if (is_array($photoFiles)) {
            foreach ($photoFiles as $index => $file) {
                if ($file && $file->isValid()) {
                    $validated['photos'][] = $file->store('savings_plans/photos', 'public');
                } else {
                    return back()->with('error', "Photo #" . ($index + 1) . " is not a valid uploaded image.")->withInput();
                }
            }
        }

        // Handle existing image paths
        $photosInput = $request->input('photos', []);
        if (is_array($photosInput)) {
            foreach ($photosInput as $index => $photoItem) {
                if (is_string($photoItem) && preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $photoItem)) {
                    $validated['photos'][] = $photoItem;
                } elseif (!isset($photoFiles[$index])) {
                    return back()->with('error', "Photo #" . ($index + 1) . " must be a valid image or image path.")->withInput();
                }
            }
        }

        $savings_plan->update($validated);

        return to_route('savings-plans.index')->with('success', 'Savings Plan updated successfully.');
    } catch (\Illuminate\Validation\ValidationException $e) {
        Log::error('Validation Error on SavingsPlan Update:', [
            'errors' => $e->errors(),
            'message' => $e->getMessage(),
            'user_id' => auth()->id(),
            'savings_plan_id' => $savings_plan->id,
        ]);

        return back()
            ->withErrors($e->validator)
            ->withInput();
    } catch (\Throwable $e) {
        Log::error('Unexpected SavingsPlan Update Error: ' . $e->getMessage(), [
            'user_id' => auth()->id(),
            'savings_plan_id' => $savings_plan->id,
        ]);
        return back()->with('error', 'Something went wrong.')->withInput();
    }
}


    public function destroy(SavingsPlan $savings_plan)
    {
        $savings_plan->delete();
        return back()->with('success', 'Soft deleted.');
    }

    public function restore($slug)
    {
        $plan = SavingsPlan::withTrashed()->where('slug', $slug)->firstOrFail();
        $plan->restore();
        return back()->with('success', 'Restored.');
    }

    public function forceDelete($slug)
    {
        $plan = SavingsPlan::withTrashed()->where('slug', $slug)->firstOrFail();
        $plan->forceDelete();
        return back()->with('success', 'Permanently deleted.');
    }

    public function activate($slug)
    {
        $plan = SavingsPlan::withTrashed()->where('slug', $slug)->firstOrFail();
        $plan->update(['active' => true]);
        return back()->with('success', 'Activated.');
    }

    public function deactivate($slug)
    {
        $plan = SavingsPlan::withTrashed()->where('slug', $slug)->firstOrFail();
        $plan->update(['active' => false]);
        return back()->with('success', 'Deactivated.');
    }

    public function approve($slug)
    {
        $plan = SavingsPlan::withTrashed()->where('slug', $slug)->firstOrFail();
        $plan->update([
            'approved_by' => auth()->id(),
            'approved_on' => now()
        ]);
        return back()->with('success', 'Approved.');
    }
}
