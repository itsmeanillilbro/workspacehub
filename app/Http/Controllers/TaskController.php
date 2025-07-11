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
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     * (Tasks for a specific project)
     */
    public function index(Project $project): Response
    {

        $tasks = $project->tasks()->with(['assignedTo', 'createdBy'])->latest()->get();

        return Inertia::render('tasks/index', [
            'project' => $project->only('id', 'name', 'organization_id'),
            'tasks' => TaskResource::collection($tasks)->resolve(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Project $project): Response
    {
        // Eager load organization with users (id, name) explicitly
        $project->load('organization.users:id,name');

        // Now $project->organization is a full model with 'users' relation loaded
        $organizationUsers = $project->organization->users;

        return Inertia::render('tasks/create', [
            'project' => $project->only('id', 'name', 'organization_id'),
            'organizationUsers' => \App\Http\Resources\UserResource::collection($organizationUsers)->resolve(),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request, Project $project): RedirectResponse
    {
        Log::info('Validated data', $request->validated());
        $task = $project->tasks()->create($request->validated());

        return redirect()->route('projects.show', $project)
            ->with('success', 'Task created successfully!');
    }


    /**
     * Display the specified resource.
     */
    public function show(Project $project, Task $task): Response
    {

        if ($task->project_id !== $project->id) {
            abort(404);
        }

        $task->load(['assignedTo', 'createdBy', 'project']);

        return Inertia::render('tasks/show', [
            'project' => $project->only('id', 'name', 'organization_id'),
            'task' => TaskResource::make($task)->resolve(),
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

        return Inertia::render('tasks/edit', [
            'project' => $project->only('id', 'name', 'organization_id'),
            'task' => TaskResource::make($task)->resolve(),
            'organizationUsers' => \App\Http\Resources\UserResource::collection(
                $project->organization->users()->select('users.id', 'name')->get()
            )->resolve(),

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

        $task->delete();

        return redirect()->route('projects.show', $project)
            ->with('success', 'Task deleted successfully!');
    }
}