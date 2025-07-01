<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Project; // Assuming tasks are nested under projects
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     * (Tasks for a specific project)
     */
    public function index(Project $project): Response
    {
        // Global scope on Task and Project models ensures user only accesses tasks
        // within their current organization and associated with the given project.
        $tasks = $project->tasks()->with(['assignedTo', 'createdBy'])->latest()->get();

        return Inertia::render('Tasks/Index', [
            'project' => $project->only('id', 'name', 'organization_id'), // Pass minimal project data
            'tasks' => TaskResource::collection($tasks),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Project $project): Response
    {
        return Inertia::render('Tasks/Create', [
            'project' => $project->only('id', 'name', 'organization_id'),
            // You might want to pass a list of users for assignment
            'organizationUsers' => \App\Http\Resources\UserResource::collection(
                $project->organization->users()->select('id', 'name')->get()
            ),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request, Project $project): RedirectResponse
    {
        $task = $project->tasks()->create($request->validated());

        return redirect()->route('projects.show', $project)
            ->with('success', 'Task created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project, Task $task): Response
    {
        // Global scope on Task and Project models handles multi-tenancy.
        // Ensure the task belongs to the given project:
        if ($task->project_id !== $project->id) {
            abort(404);
        }

        $task->load(['assignedTo', 'createdBy', 'project']);

        return Inertia::render('Tasks/Show', [
            'project' => $project->only('id', 'name', 'organization_id'),
            'task' => TaskResource::make($task),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project, Task $task): Response
    {
        if ($task->project_id !== $project->id) {
            abort(404);
        }
        // Policy check will go here: ->authorize('update', $task);
        return Inertia::render('Tasks/Edit', [
            'project' => $project->only('id', 'name', 'organization_id'),
            'task' => TaskResource::make($task),
            'organizationUsers' => \App\Http\Resources\UserResource::collection(
                $project->organization->users()->select('id', 'name')->get()
            ),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Project $project, Task $task): RedirectResponse
    {
        if ($task->project_id !== $project->id) {
            abort(404);
        }
        // Global scope on Task and Project models handles multi-tenancy.
        $task->update($request->validated());

        return redirect()->route('projects.show', $project)
            ->with('success', 'Task updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, Task $task): RedirectResponse
    {
        if ($task->project_id !== $project->id) {
            abort(404);
        }
        // Global scope on Task and Project models handles multi-tenancy.
        // Policy check will go here: ->authorize('delete', $task);
        $task->delete();

        return redirect()->route('projects.show', $project)
            ->with('success', 'Task deleted successfully!');
    }
}