<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AssetCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class AssetCategoryController extends Controller
{
    public function __construct()
    {
        // $this->authorizeResource(AssetCategory::class, 'asset_category');
    }

    public function index()
    {
        try {
            $categories = AssetCategory::paginate(10);
            return Inertia::render('Admin/AssetCategories/Index', ['categories' => $categories]);
        } catch (\Exception $e) {
            Log::error('Error fetching asset categories: ' . $e->getMessage());
            return back()->with('error', 'Failed to load categories. Please try again.');
        }
    }

    public function create()
    {
        return Inertia::render('Admin/AssetCategories/Create');
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:asset_categories',
                'description' => 'nullable|string',
            ]);

            AssetCategory::create($validated);
            return redirect()->route('admin.asset-categories.index')->with('success', 'Category created successfully.');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            Log::error('Error creating asset category: ' . $e->getMessage());
            return back()->with('error', 'Failed to create category. Please try again.');
        }
    }

    public function edit(AssetCategory $assetCategory)
    {
        return Inertia::render('Admin/AssetCategories/Edit', ['category' => $assetCategory]);
    }

    public function update(Request $request, AssetCategory $assetCategory)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:asset_categories,name,' . $assetCategory->id,
                'description' => 'nullable|string',
            ]);

            $assetCategory->update($validated);
            return redirect()->route('admin.asset-categories.index')->with('success', 'Category updated successfully.');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            Log::error('Error updating asset category: ' . $e->getMessage());
            return back()->with('error', 'Failed to update category. Please try again.');
        }
    }

    public function destroy(AssetCategory $assetCategory)
    {
        try {
            $assetCategory->delete();
            return redirect()->route('admin.asset-categories.index')->with('success', 'Category deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting asset category: ' . $e->getMessage());
            return back()->with('error', 'Failed to delete category. Please try again.');
        }
    }
}
