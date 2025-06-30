<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ProjectResource; // Import ProjectResource
use Inertia\Inertia; // Import Inertia

class ProjectController extends Controller
{
    /**
     * Display a listing of the projects for the current organization.
     */
    public function index()
    {
        // The global scope in the Project model automatically filters by current_organization_id
        // Eager load the creator to display in the frontend
        $projects = Project::with('creator')->get();

        // Pass data to an Inertia React component
        return Inertia::render('Projects/Index', [
            'projects' => ProjectResource::collection($projects),
        ]);
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['in:active,completed,archived'],
        ]);

        $project = Project::create([
            'organization_id' => Auth::user()->currentOrganization->id, // Automatically set
            'user_id' => Auth::id(),
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status ?? 'active',
        ]);

        return redirect()->route('projects.index')->with('success', 'Project created successfully!');
    }

    // You'll add show, edit, update, destroy methods following similar patterns.
    // Remember to use ProjectResource for responses.
}