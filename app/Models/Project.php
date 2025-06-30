<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
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
     * Get the organization that owns the project (many-to-one inverse).
     */
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the user who created the project (many-to-one inverse).
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the tasks for the project (one-to-many).
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Get the documents for the project (one-to-many).
     */
    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    /**
     * Get all of the project's comments (polymorphic one-to-many).
     */
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
