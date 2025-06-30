<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\OrganizationResource; 


class OrganizationController extends Controller
{
    /**
     * Display a listing of organizations the user belongs to.
     * This can be an API endpoint or rendered by an Inertia page if needed.
     */
    public function index()
    {
        return OrganizationResource::collection(Auth::user()->organizations);
    }

    /**
     * Store a new organization and make it the current.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:organizations'],
        ]);

        $organization = Organization::create([
            'name' => $request->name,
            'slug' => $request->slug,
        ]);

        // Attach the creating user as owner
        Auth::user()->organizations()->attach($organization->id, ['role' => 'owner']);

        // Set this as the user's current organization
        Auth::user()->update(['current_organization_id' => $organization->id]);

        // Return Inertia response or redirect
        return redirect()->route('dashboard'); // Redirect to dashboard after creating/switching
    }

    /**
     * Switch the authenticated user's current organization.
     */
    public function switch(Organization $organization)
    {
        // Ensure the authenticated user actually belongs to this organization
        if (!Auth::user()->belongsToOrganization($organization)) {
            // If using Inertia, you might redirect back with errors or use Inertia's error handling.
            // For a pure API call, return JSON error.
            throw ValidationException::withMessages([
                'organization' => 'You do not have access to this organization.',
            ])->status(403);
        }

        Auth::user()->update(['current_organization_id' => $organization->id]);

        // Inertia provides a `with` method for flash messages
        return redirect()->back()->with('success', 'Switched to organization ' . $organization->name);
    }
}