<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB; // For database transactions

class InvitationController extends Controller
{
    /**
     * Show the invitation acceptance page.
     */
    public function accept(string $token): Response
    {
        $invitation = Invitation::where('token', $token)
                                ->with('organization') // Eager load organization details
                                ->first();

        // Check if invitation exists, is not expired, and has not been accepted
        if (!$invitation || $invitation->expires_at->isPast() || $invitation->accepted_at) {
            return Inertia::render('invitations/accept', [
                'invitation' => null,
                'status' => 'invalid', // Indicate invalid/expired invitation
            ]);
        }

        // If user is already logged in and their email matches the invitation email,
        // we can automatically accept it or prompt them.
        $loggedInUser = Auth::user();
        if ($loggedInUser && $loggedInUser->email === $invitation->email) {
            // User is logged in and is the intended recipient
            return Inertia::render('invitations/accept', [
                'invitation' => $invitation,
                'status' => 'logged_in_match', // User is logged in and email matches
            ]);
        } elseif ($loggedInUser) {
            // User is logged in but their email does NOT match the invitation email
            // This scenario might require the user to log out first or use a different account.
            return Inertia::render('invitations/accept', [
                'invitation' => $invitation,
                'status' => 'logged_in_mismatch', // User is logged in but email mismatches
            ]);
        }

        // If no user is logged in, show the acceptance page
        return Inertia::render('invitations/accept', [
            'invitation' => $invitation,
            'status' => 'pending', // Waiting for user to register/login
        ]);
    }

    /**
     * Process the invitation acceptance.
     */
    public function processAcceptance(Request $request, string $token)
    {
        $invitation = Invitation::where('token', $token)
                                ->with('organization')
                                ->first();

        // Validate the invitation again
        if (!$invitation || $invitation->expires_at->isPast() || $invitation->accepted_at) {
            return redirect()->route('dashboard')->with('error', 'Invalid or expired invitation link.');
        }

        // Use a database transaction to ensure atomicity
        DB::transaction(function () use ($invitation) {
            $user = Auth::user();

            // If the user is not logged in, this scenario should ideally be handled by
            // forcing registration/login on the 'Accept' page before this route is hit.
            // For simplicity here, we assume a user is logged in or created.
            if (!$user) {
                // This case should ideally not happen if the frontend forces login/registration.
                // However, as a fallback, you might want to create a user here if they are
                // trying to accept without being logged in and their email is unique.
                // For now, let's assume the frontend handles the registration flow.
                return redirect()->route('login')->with('error', 'Please log in or register to accept the invitation.');
            }

            // Check if the user is already a member of this organization
            if ($invitation->organization->users->contains($user->id)) {
                $invitation->update(['accepted_at' => Carbon::now()]); // Mark as accepted even if already a member
                return redirect()->route('organizations.show', $invitation->organization)
                                 ->with('info', 'You are already a member of ' . $invitation->organization->name . '.');
            }

            // Attach the user to the organization with the invited role
            $invitation->organization->users()->attach($user->id, ['role' => $invitation->role]);

            // Mark the invitation as accepted
            $invitation->update(['accepted_at' => Carbon::now()]);

            // Optionally, set the new organization as the current organization for the user
            $user->update(['current_organization_id' => $invitation->organization->id]);

            return redirect()->route('organizations.show', $invitation->organization)
                             ->with('success', 'You have successfully joined ' . $invitation->organization->name . '!');
        });

        // If transaction fails, it will throw an exception, caught by Laravel's error handler.
        return redirect()->route('dashboard')->with('error', 'Failed to accept invitation. Please try again.');
    }
}
