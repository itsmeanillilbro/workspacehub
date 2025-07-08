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
            return Inertia::render('projects/index', ['projects' => []])
                ->with('warning', 'Please select an organization to view projects.');
        }


        $projects = Project::with('creator')->latest()->get();

        return Inertia::render('projects/index', [
            'projects' => ProjectResource::collection($projects)->resolve(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('projects/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $user = $request->user();

        $project = Project::create([

            ...$request->validated(),
            'user_id' => $user->id,
            'organization_id' => $user->current_organization_id,
        ]);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project): Response
    {
        $project->load(['creator', 'documents.uploadedBy']);
    
        $tasks = $project->tasks()->with(['assignedTo', 'createdBy'])->get();
        foreach ($tasks as $task) {
            \Log::debug('Task assignedTo:', ['task_id' => $task->id, 'assignedTo' => $task->assignedTo]);
        }
        return Inertia::render('projects/show', [
            'project' => ProjectResource::make($project)->resolve(),
            'tasks' => TaskResource::collection($tasks)->resolve(),
            'documents' => DocumentResource::collection($project->documents)->resolve(),
        ]);
    }
    
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project): Response
    {

        return Inertia::render('projects/edit', [
            'project' => ProjectResource::make($project)->resolve(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {

        $project->update($request->validated());

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project): RedirectResponse
    {

        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully!');
    }
}