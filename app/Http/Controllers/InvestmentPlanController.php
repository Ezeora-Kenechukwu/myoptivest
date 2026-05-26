<?php

namespace App\Http\Controllers;

use App\Models\InvestmentPlan;
use App\Models\InvestmentPlanCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class InvestmentPlanController extends Controller
{
    public function index()
    {
        return Inertia::render('InvestmentPlans/Index', [
            'plans' => InvestmentPlan::with(['creator', 'updater','category'])->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('InvestmentPlans/Create',[
            'categories'=> InvestmentPlanCategory::where('active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:investment_plans',
            'min_amount' => 'required|numeric',
            'category_id' => 'required|numeric|exists:investment_plan_categories,id',
            'max_amount' => 'nullable|numeric',
            'roi' => 'required|numeric',
            'duration' => 'required|integer',
            'payout_frequency' => 'required|in:monthly,weekly,yearly,daily',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'thumbnail' => 'nullable|image',
            'photos' => 'nullable|array',
            'photos.*' => 'image',
        ]);

        // Handle thumbnail
        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('investment_plans/thumbnails', 'public');
        }

        // Handle photos
        $validated['photos'] = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $validated['photos'][] = $photo->store('investment_plans/photos', 'public');
            }
        }

        $validated['created_by'] = auth()->id();

        InvestmentPlan::create($validated);

        return redirect()->route('investment-plans.index')->with('success', 'Investment plan created.');
    }

    public function show(InvestmentPlan $investmentplan)
    {

        return Inertia::render('InvestmentPlans/Show', [
            'plan' => $investmentplan
        ]);
    }

    public function edit(investmentplan $investmentplan)
    {

        return Inertia::render('InvestmentPlans/Edit', [
            'plan' => $investmentplan,
            'categories'=> InvestmentPlanCategory::where('active', true)->get(),
        ]);
    }

    public function update(Request $request, InvestmentPlan $investmentplan)
    {
        $validated = $request->validate([
            'name' => [
    'required',
    'string',
    Rule::unique('investment_plans', 'name')->ignore($investmentplan->id),
],
            'min_amount' => 'required|numeric',
            'category_id' => 'required|numeric|exists:investment_plan_categories,id',
            'max_amount' => 'nullable|numeric',
            'roi' => 'required|numeric',
            'duration' => 'required|integer',
            'payout_frequency' => 'required|in:monthly,weekly,yearly,daily',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'thumbnail' => 'nullable',
            'photos' => 'nullable|array',
        ]);

        // Handle thumbnail
        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('investment_plans/thumbnails', 'public');
        } elseif ($request->filled('thumbnail')) {
            $thumbnailPath = $request->input('thumbnail');
            if (preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $thumbnailPath)) {
                $validated['thumbnail'] = $thumbnailPath;
            } else {
                return back()->with('error', 'The thumbnail must be a valid image path or file.')->withInput();
            }
        }

        $validated['photos'] = [];

// First, handle uploaded files
$photoFiles = $request->file('photos', []);
if (is_array($photoFiles)) {
    foreach ($photoFiles as $index => $file) {
        if ($file && $file->isValid()) {
            $validated['photos'][] = $file->store('investment_plans/photos', 'public');
        } else {
            return back()->with('error', "Photo #".($index + 1)." is not a valid uploaded image.")->withInput();
        }
    }
}

// Then, handle image paths (if present)
$photosInput = $request->input('photos', []);
if (is_array($photosInput)) {
    foreach ($photosInput as $index => $photoItem) {
        if (is_string($photoItem) && preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $photoItem)) {
            $validated['photos'][] = $photoItem;
        } elseif (!isset($photoFiles[$index])) {
            // Only throw error if it's not already handled as a valid file
            return back()->with('error', "Photo #".($index + 1)." must be a valid image or image path.")->withInput();
        }
    }
}

        $validated['last_updated_by'] = auth()->id();
        $investmentplan->update($validated);

        return redirect()->route('investment-plans.index')->with('success', 'Investment plan updated.');
    }


    public function destroy(investmentplan $investmentplan)
    {
        $investmentplan->delete();
        return back()->with('success', 'Investment plan soft deleted.');
    }

    public function restore(InvestmentPlan $investmentplan)
    {
        $investmentplan->restore();
        return back()->with('success', 'Investment plan restored.');
    }

    public function forceDelete(investmentplan $investmentplan)
    {
        $investmentplan->forceDelete();
        return back()->with('success', 'Investment plan permanently deleted.');
    }

    public function activate(investmentplan $investmentplan)
    {
        $investmentplan->update(['active' => true]);
        return back()->with('success', 'Plan activated.');
    }

    public function deactivate(investmentplan $investmentplan)
    {
        $investmentplan->update(['active' => false]);
        return back()->with('success', 'Plan deactivated.');
    }
}
