<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected static function booted(): void
    {
        static::addGlobalScope('organization', function (Builder $builder) {
            if (auth()->check() && auth()->user()->currentOrganization) {
                $builder->where('organization_id', auth()->user()->currentOrganization->id);
            }
        });
    }

    // --- Relationships ---

    /**
     * Get the organization that owns the document (many-to-one inverse).
     */
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the project that the document belongs to (many-to-one inverse).
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the user who uploaded the document (many-to-one inverse).
     */
    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by_user_id');
    }

    /**
     * Get all of the document's comments (polymorphic one-to-many).
     */
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
