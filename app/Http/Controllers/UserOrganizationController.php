<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrganizationResource;
use App\Http\Resources\UserResource;
use App\Mail\InvitationMail;
use App\Models\Invitation;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
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
        // Eager load the users (members) for this organization,
        // and ensure the pivot table 'role' is included.
        $members = $organization->users()->withPivot('role')->get();

        return Inertia::render('organizations/members/index', [
            'organization' => OrganizationResource::make($organization),
            'members' => UserResource::collection($members),
        ]);
    }

    /**
     * Show the form for inviting new users to an organization.
     */
    public function create(Organization $organization): Response
    {
        // Ensure we're rendering the correct 'create' component
        return Inertia::render('organizations/members/create', [
            // Pass the organization using OrganizationResource for consistency
            'organization' => OrganizationResource::make($organization),
        ]);
    }

    /**
     * Store a new user (or attach existing user) to an organization.
     */
    public function store(Request $request, Organization $organization)
    {
        // 1. Validate the incoming request data
        $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'role' => ['required', 'string', Rule::in(['member', 'admin'])],
        ]);

        // 2. Try to find an existing user by the provided email address
        $userToInvite = User::where('email', $request->email)->first();

        if ($userToInvite) {
            // --- SCENARIO 1: User with this email already exists ---

            // To ensure the 'users' relationship is loaded for the 'contains' check:
            $organization->loadMissing('users'); // Load users only if not already loaded

            if ($organization->users->contains($userToInvite->id)) {
                return redirect()->back()->with('error', 'This user is already a member of this organization.');
            }

            // Attach the user to the organization with the specified role
            $organization->users()->attach($userToInvite->id, ['role' => $request->role]);


            return redirect()->back()->with('success', 'Member added successfully!');

        } else {
            $existingInvitation = Invitation::where('organization_id', $organization->id)
                                            ->where('email', $request->email)
                                            ->whereNull('accepted_at') // Only consider unaccepted invitations
                                            ->first();

            if ($existingInvitation) {
                return redirect()->back()->with('info', 'An invitation has already been sent to this email address for this organization.');
            }

            $invitation = Invitation::create([
                'organization_id' => $organization->id,
                'email' => $request->email,
                'token' => Str::random(60), // Generate a unique token
                'role' => $request->role,
                'expires_at' => Carbon::now()->addDays(7), // Invitation expires in 7 days
            ]);

            // Send the invitation email
            Mail::to($request->email)->send(new InvitationMail($invitation));

            return redirect()->back()->with('success', 'Invitation sent successfully to ' . $request->email . '!');
        }
    }
    /**
     * Update a user's role within an organization.
     */
    public function update(Request $request, Organization $organization, User $member): RedirectResponse
{
    $request->validate(['role' => ['required', 'string', 'in:member,admin']]);

    try {
        $pivotUser = $organization->users()->find($member->id);
        if (!$pivotUser) {
            throw new \Exception("User is not part of this organization");
        }

        // Update role via syncWithoutDetaching
        $organization->users()->syncWithoutDetaching([
            $member->id => ['role' => $request->role]
        ]);

        // Confirm the role changed
        $updatedRole = $organization->users()->find($member->id)->pivot->role;
        if ($updatedRole !== $request->role) {
            throw new \Exception("Role update failed, mismatch after update.");
        }

        return back()->with('success', 'Role updated!');
    } catch (\Exception $e) {
        Log::error("Role update failed", [
            'error' => $e->getMessage(),
            'organization' => $organization->id,
            'user' => $member->id,
            'request' => $request->all()
        ]);
        return back()->with('error', 'Failed to update role');
    }
}

    /**
     * Remove a user from an organization.
     */
    public function destroy(Organization $organization, User $user): RedirectResponse
    {
        $organization->users()->detach($user->id);

        if ($user->id === Auth::id() && $user->current_organization_id === $organization->id) {
            $user->update(['current_organization_id' => null]);
            return redirect()->route('organizations.index')
                ->with('warning', 'You have been removed from this organization. Please select another.');
        }

        return redirect()->route('organizations.members.index', $organization)
            ->with('success', 'User removed from organization!');
    }
}
