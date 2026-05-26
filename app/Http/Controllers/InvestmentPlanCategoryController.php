<?php

namespace App\Http\Controllers;

use App\Models\InvestmentPlanCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InvestmentPlanCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Categories/Index', [
            'categories' => InvestmentPlanCategory::with('creator')->get(),
        ]);
    }
    public function create()
    {
        return Inertia::render('Categories/Create', [
            // 'categories' => InvestmentPlanCategory::with('creator')->withTrashed()->get(),
        ]);
    }

    public function show( InvestmentPlanCategory $investmentplancategory)
    {
        // $category = InvestmentPlanCategory::withTrashed()->findOrFail($id);
        return Inertia::render('Categories/Show', [
            'category' => $investmentplancategory
        ]);
    }
    public function edit( InvestmentPlanCategory $investmentplancategory)
    {
        // $category = InvestmentPlanCategory::withTrashed()->findOrFail($id);
        return Inertia::render('Categories/Edit', [
            'category' => $investmentplancategory
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:investment_plan_categories',
            'description' => 'nullable|string',
        ]);

        InvestmentPlanCategory::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
           
            'created_by' => auth()->id(),
            'active' => true,
        ]);

        return redirect()->route('investment-plan-categories.index')->with('success', 'Category created successfully.');
    }

    public function update(Request $request, InvestmentPlanCategory $investmentplancategory)
    {
        // $category = InvestmentPlanCategory::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|unique:investment_plan_categories,name,' . $investmentplancategory->id,
            'description' => 'nullable|string',
        ]);

        $investmentplancategory->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
           
        ]);

        return redirect()->route('investment-plan-categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(InvestmentPlanCategory $investmentplancategory)
    {
       
        $investmentplancategory->delete();

        return back()->with('success', 'Category soft deleted successfully.');
    }

    public function restore(InvestmentPlanCategory $investmentplancategory)
    {
       
        $investmentplancategory->restore();

        return back()->with('success', 'Category restored successfully.');
    }

    public function forceDelete(InvestmentPlanCategory $investmentplancategory)
    {
       
        $investmentplancategory->forceDelete();

        return back()->with('success', 'Category permanently deleted.');
    }

    public function activate(InvestmentPlanCategory $investmentplancategory)
    {
      
        $investmentplancategory->update(['active' => true]);

        return back()->with('success', 'Category activated.');
    }

    public function deactivate(InvestmentPlanCategory $investmentplancategory)
    {
       
        $investmentplancategory->update(['active' => false]);

        return back()->with('success', 'Category deactivated.');
    }
}
