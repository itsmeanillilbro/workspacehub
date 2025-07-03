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
        $organizations = $organizations->map(function ($org) use ($user) {
            $org->is_current_organization = $user->current_organization_id === $org->id;
            return $org;
        });
        // dd($organizations->toArray());
        return Inertia::render('organizations/index', [
            'organizations' => OrganizationResource::collection($organizations),
            'currentOrganizationId' => $user->current_organization_id,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('organizations/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrganizationRequest $request): RedirectResponse
    {
        $organization = Organization::create($request->validated());
        Auth::user()->organizations()->attach($organization->id, ['role' => 'admin']);
        Auth::user()->update(['current_organization_id' => $organization->id]);

        return redirect()->route('organizations.show', $organization)
            ->with('success', 'Organization created successfully and set as current!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization): Response
    {
       

        $organization->load('users'); 
        $projects = $organization->projects()->with('creator')->get();

        return Inertia::render('organizations/show', [
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
        return Inertia::render('organizations/edit', [
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
       
        if (!Auth::user()->organizations->contains($organization->id)) {
            abort(403, 'You are not a member of this organization.');
        }

        Auth::user()->update(['current_organization_id' => $organization->id]);

        return redirect()->back()->with('success', 'Switched to organization: ' . $organization->name);
    }
}