<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('role');
    }

    /**
     * Get the projects for the organization (one-to-many).
     */
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    /**
     * Get the tasks for the organization (one-to-many).
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Get the documents for the organization (one-to-many).
     */
    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    /**
     * Get the comments for the organization (one-to-many).
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
