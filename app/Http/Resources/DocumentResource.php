<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DocumentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'organization_id' => $this->organization_id,
            'project_id' => $this->project_id,
            'uploaded_by_user_id' => $this->uploaded_by_user_id,
            'name' => $this->name,
            'path' => $this->path, // Store the raw path
            'url' => $this->path ? Storage::url($this->path) : null, // Generate public URL
            'mime_type' => $this->mime_type,
            'size' => $this->size,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'project' => ProjectResource::make($this->whenLoaded('project')),
            'uploaded_by' => UserResource::make($this->whenLoaded('uploadedBy')),
        ];
    }
}
