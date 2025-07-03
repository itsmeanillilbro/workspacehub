<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest; // If you decide to implement it
use App\Http\Resources\DocumentResource;
use App\Models\Project;
use App\Models\Document;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     * (Documents for a specific project)
     */
    public function index(Project $project): Response
    {
       
        $documents = $project->documents()->with('uploadedBy')->latest()->get();

        return Inertia::render('documents/index', [
            'project' => $project->only('id', 'name', 'organization_id'),
            'documents' => DocumentResource::collection($documents),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Project $project): Response
    {
        return Inertia::render('documents/create', [
            'project' => $project->only('id', 'name', 'organization_id'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDocumentRequest $request, Project $project): RedirectResponse
    {
        $validated = $request->validated();

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('documents/' . $project->organization_id . '/' . $project->id, $fileName, 'public');

        $document = $project->documents()->create([
            'organization_id' => $validated['organization_id'],
            'uploaded_by_user_id' => $validated['uploaded_by_user_id'],
            'name' => $validated['name'] ?? $originalName,
            'path' => $filePath,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Document uploaded successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project, Document $document): Response
    {
        // Global scope on Document and Project models handles multi-tenancy.
        if ($document->project_id !== $project->id) {
            abort(404);
        }
        $document->load('uploadedBy');
        return Inertia::render('documents/show', [
            'project' => $project->only('id', 'name', 'organization_id'),
            'document' => DocumentResource::make($document),
        ]);
    }

   
    public function update(UpdateDocumentRequest $request, Project $project, Document $document): RedirectResponse
    {
        if ($document->project_id !== $project->id) {
            abort(404);
        }
        $document->update($request->validated());
        return redirect()->route('projects.show', $project)
            ->with('success', 'Document updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, Document $document): RedirectResponse
    {
        if ($document->project_id !== $project->id) {
            abort(404);
        }
      
        Storage::disk('public')->delete($document->path); 
        $document->delete();

        return redirect()->route('projects.show', $project)
            ->with('success', 'Document deleted successfully!');
    }

    /**
     * Download the specified document.
     */
    public function download(Project $project, Document $document): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        if ($document->project_id !== $project->id) {
            abort(404);
        }
     
        if (!Storage::disk('public')->exists($document->path)) {
            abort(404, 'File not found.');
        }

        return Storage::disk('public')->download($document->path, $document->name);
    }
}