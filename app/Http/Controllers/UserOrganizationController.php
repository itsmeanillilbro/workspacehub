<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rule;

class UserOrganizationController extends Controller
{
    /**
     * Display a listing of users in an organization.
     */
    public function index(Organization $organization): Response
    {
        // Policy check will go here: ->authorize('viewAny', [User::class, $organization]);
        $members = $organization->users()->get();

        return Inertia::render('Organizations/Members/Index', [
            'organization' => $organization->only('id', 'name'),
            'members' => UserResource::collection($members),
        ]);
    }

    /**
     * Show the form for inviting new users to an organization.
     */
    public function create(Organization $organization): Response
    {
        // Policy check will go here: ->authorize('invite', [User::class, $organization]);
        return Inertia::render('Organizations/Members/Create', [
            'organization' => $organization->only('id', 'name'),
        ]);
    }

    /**
     * Store a new user (or attach existing user) to an organization.
     */
    public function store(Request $request, Organization $organization): RedirectResponse
    {
        // Policy check will go here: ->authorize('invite', [User::class, $organization]);

        $request->validate([
            'email' => [
                'required',
                'email',
                Rule::unique('organization_user')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization->id);
                }),
            ],
            'role' => ['required', 'string', 'in:member,admin'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Option 1: Create a new user (and send invitation email)
            $password = \Illuminate\Support\Str::random(10); // Generate a temporary password
            $user = User::create([
                'name' => 'New User', // Placeholder, user will set it
                'email' => $request->email,
                'password' => Hash::make($password),
            ]);
            // TODO: Send invitation email with password reset link or instructions

            $message = 'User created and invited to organization!';
        } else {
            $message = 'Existing user invited to organization!';
        }

        // Attach the user to the organization
        $organization->users()->attach($user->id, ['role' => $request->role]);

        return redirect()->route('organizations.members.index', $organization)
            ->with('success', $message);
    }

    /**
     * Update a user's role within an organization.
     */
    public function update(Request $request, Organization $organization, User $user): RedirectResponse
    {
        // Policy check will go here: ->authorize('updateRole', [$user, $organization]);

        $request->validate([
            'role' => ['required', 'string', 'in:member,admin'],
        ]);

        $organization->users()->updateExistingPivot($user->id, ['role' => $request->role]);

        return redirect()->route('organizations.members.index', $organization)
            ->with('success', 'User role updated!');
    }

    /**
     * Remove a user from an organization.
     */
    public function destroy(Organization $organization, User $user): RedirectResponse
    {
        // Policy check will go here: ->authorize('removeMember', [$user, $organization]);

        // Prevent removing the last admin or yourself if you're the last admin
        // More robust checks will be in policies

        $organization->users()->detach($user->id);

        // If the removed user was viewing this organization, and it's their current, unset it.
        if ($user->id === Auth::id() && $user->current_organization_id === $organization->id) {
            $user->update(['current_organization_id' => null]);
            return redirect()->route('organizations.index')
                ->with('warning', 'You have been removed from this organization. Please select another.');
        }

        return redirect()->route('organizations.members.index', $organization)
            ->with('success', 'User removed from organization!');
    }
}