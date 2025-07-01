<?php

namespace App\Models;

use App\Models\Concerns\HasOrganizationScope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasOrganizationScope;
    protected $casts = [
        'due_date' => 'datetime',
    ];

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
     * Get the organization that owns the task (many-to-one inverse).
     */
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the project that the task belongs to (many-to-one inverse).
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the user this task is assigned to (many-to-one inverse).
     */
    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    /**
     * Get the user who created this task (many-to-one inverse).
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    /**
     * Get all of the task's comments (polymorphic one-to-many).
     */
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
