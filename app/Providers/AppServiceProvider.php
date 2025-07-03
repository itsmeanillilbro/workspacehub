<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::unguard();
        Inertia::share([
            'flash' => function () {
                return [
                    'success' => Session::get('success'),
                    'warning' => Session::get('warning'),
                    'error' => Session::get('error'),
                ];
            },
        ]);
    }
}
