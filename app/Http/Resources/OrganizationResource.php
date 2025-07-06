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
            'users' => UserResource::collection($this->whenLoaded('users')),
            'users_count' => $this->whenCounted('users'),
            'current_user_is_member' => $this->when(
                $request->user(),
                fn() => $this->users->contains($request->user())
            ),
            'is_current_organization' => $this->when(
                $request->user(),
                fn() => $request->user()->current_organization_id === $this->id
            ),
        ];
    }
}