<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

trait HasOrganizationScope
{
    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function bootHasOrganizationScope()
    {
        static::addGlobalScope('organization', function (Builder $builder) {
            if (Auth::check() && Auth::user()->current_organization_id) {
                $builder->where(
                    static::getTableName() . '.organization_id',
                    Auth::user()->current_organization_id
                );
            }
        });

        // Automatically assign organization_id on creation
        static::creating(function (Model $model) {
            if (Auth::check() && Auth::user()->current_organization_id) {
                $model->organization_id = Auth::user()->current_organization_id;
            } else {
                // Handle cases where organization_id is required but not set (e.g., user not in an org)
                // You might throw an exception, or prevent creation, depending on your logic.
                // For now, let's assume it's always set when creating tenant-scoped models.
            }
        });
    }

    /**
     * Get the table name of the model.
     *
     * @return string
     */
    public static function getTableName(): string
    {
        return (new static)->getTable();
    }

    /**
     * Disable the global organization scope for a given operation.
     *
     * @param  callable  $callback
     * @return mixed
     */
    public static function withoutOrganizationScope(callable $callback): mixed
    {
        return static::withoutGlobalScope('organization', $callback);
    }
}