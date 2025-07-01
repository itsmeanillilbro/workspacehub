<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\DocumentResource;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $user = Auth::user();
        if (!$user->current_organization_id) {
            return Inertia::render('Projects/Index', ['projects' => []])
                ->with('warning', 'Please select an organization to view projects.');
        }

        // Global scope will ensure only projects for the current_organization_id are returned
        $projects = Project::with('creator')->latest()->get();

        return Inertia::render('Projects/Index', [
            'projects' => ProjectResource::collection($projects),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Projects/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $project = Project::create($request->validated());

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project): Response
    {
        // Global scope on Project model ensures user only accesses projects within their current organization
        $project->load(['creator', 'tasks.assignedTo', 'tasks.createdBy', 'documents.uploadedBy']);

        return Inertia::render('Projects/Show', [
            'project' => ProjectResource::make($project),
            'tasks' => TaskResource::collection($project->tasks),
            'documents' => DocumentResource::collection($project->documents),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project): Response
    {
        // Global scope ensures user only accesses projects within their current organization
        // Policy check will go here: ->authorize('update', $project);
        return Inertia::render('Projects/Edit', [
            'project' => ProjectResource::make($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        // Global scope ensures user only accesses projects within their current organization
        $project->update($request->validated());

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project): RedirectResponse
    {
        // Global scope ensures user only accesses projects within their current organization
        // Policy check will go here: ->authorize('delete', $project);
        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully!');
    }
}