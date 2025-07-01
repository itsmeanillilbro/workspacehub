<?php

namespace App\Models;

use App\Models\Concerns\HasOrganizationScope;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasOrganizationScope;
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
     * Get the organization that owns the comment (many-to-one inverse).
     */
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the user who made the comment (many-to-one inverse).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent commentable model (project, task, document, etc.) that this comment belongs to (polymorphic inverse).
     */
    public function commentable()
    {
        return $this->morphTo();
    }
}
