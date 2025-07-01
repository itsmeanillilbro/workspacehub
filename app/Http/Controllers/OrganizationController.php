<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrganizationRequest;
use App\Http\Requests\UpdateOrganizationRequest;
use App\Http\Resources\OrganizationResource;
use App\Http\Resources\ProjectResource;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationController extends Controller
{
    /**
     * Display a listing of the resource (organizations the user is a member of).
     */
    public function index(): Response
    {
        $user = Auth::user();
        $organizations = $user->organizations()->withCount('users')->get();

        return Inertia::render('Organizations/Index', [
            'organizations' => OrganizationResource::collection($organizations),
            'currentOrganizationId' => $user->current_organization_id,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Organizations/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrganizationRequest $request): RedirectResponse
    {
        $organization = Organization::create($request->validated());

        // Attach the creating user as a member (e.g., with 'admin' role)
        Auth::user()->organizations()->attach($organization->id, ['role' => 'admin']);

        // Set the newly created organization as the current organization for the user
        Auth::user()->update(['current_organization_id' => $organization->id]);

        return redirect()->route('organizations.show', $organization)
            ->with('success', 'Organization created successfully and set as current!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization): Response
    {
        // Apply global scope for multi-tenancy:
        // Ensure the current user has access to this organization via the global scope
        // This is handled by a global scope on your tenant-scoped models (e.g., Project, Task, Document).
        // For the Organization model itself, you might need a different check or policy.
        // For simplicity now, we assume if you can view it, you are a member.

        $organization->load('users'); // Load members for display
        $projects = $organization->projects()->latest()->get(); // Example: Get projects for this organization

        return Inertia::render('Organizations/Show', [
            'organization' => OrganizationResource::make($organization),
            'projects' => ProjectResource::collection($projects),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Organization $organization): Response
    {
        // Policy check will go here: ->authorize('update', $organization);
        return Inertia::render('Organizations/Edit', [
            'organization' => OrganizationResource::make($organization),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrganizationRequest $request, Organization $organization): RedirectResponse
    {
        $organization->update($request->validated());

        return redirect()->route('organizations.show', $organization)
            ->with('success', 'Organization updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization): RedirectResponse
    {
        // Policy check will go here: ->authorize('delete', $organization);
        $organization->delete();

        // If the deleted organization was the user's current organization, unset it.
        if (Auth::user()->current_organization_id === $organization->id) {
            Auth::user()->update(['current_organization_id' => null]);
        }

        return redirect()->route('organizations.index')
            ->with('success', 'Organization deleted successfully!');
    }

    /**
     * Handle switching the current organization for the authenticated user.
     */
    public function switch(Organization $organization): RedirectResponse
    {
        // Ensure the user is a member of this organization
        if (!Auth::user()->organizations->contains($organization->id)) {
            abort(403, 'You are not a member of this organization.');
        }

        Auth::user()->update(['current_organization_id' => $organization->id]);

        return redirect()->back()->with('success', 'Switched to organization: ' . $organization->name);
    }
}