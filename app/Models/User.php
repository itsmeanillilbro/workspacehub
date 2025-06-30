<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function organizations()
    {
        return $this->belongsToMany(Organization::class)->withPivot('role');
    }

    /**
     * Get the organization the user is currently active in (one-to-many inverse).
     */
    public function currentOrganization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Check if the user belongs to a specific organization.
     */
    public function belongsToOrganization(Organization $organization)
    {
        return $this->organizations->contains($organization);
    }

    /**
     * Get the projects created by the user (one-to-many).
     */
    public function createdProjects()
    {
        return $this->hasMany(Project::class, 'user_id');
    }

    /**
     * Get the tasks assigned to the user (one-to-many).
     */
    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'assigned_to_user_id');
    }

    /**
     * Get the tasks created by the user (one-to-many).
     */
    public function createdTasks()
    {
        return $this->hasMany(Task::class, 'created_by_user_id');
    }

    /**
     * Get the documents uploaded by the user (one-to-many).
     */
    public function uploadedDocuments()
    {
        return $this->hasMany(Document::class, 'uploaded_by_user_id');
    }

    /**
     * Get the comments made by the user (one-to-many).
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
