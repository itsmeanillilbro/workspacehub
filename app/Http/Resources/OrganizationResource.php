<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganizationResource extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'users_count' => $this->whenLoaded('users', fn() => $this->users->count()), 
            'current_user_is_member' => $this->whenNotNull($request->user() ? $this->users->contains($request->user()) : null), 
            'is_current_organization' => $this->whenNotNull($request->user() && $request->user()->current_organization_id === $this->id),
        ];
    }
}