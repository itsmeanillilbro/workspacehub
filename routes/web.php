<?php

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserOrganizationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

       
       Route::resource('organizations', OrganizationController::class);
       Route::post('organizations/{organization}/switch', [OrganizationController::class, 'switch'])->name('organizations.switch');
   
       Route::prefix('organizations/{organization}')->name('organizations.')->group(function () {
           Route::resource('members', UserOrganizationController::class)->except(['show', 'edit']); // invite, update role, remove
       });
   
   
       Route::resource('projects', ProjectController::class);
       Route::get('/invitations/{token}/accept', [InvitationController::class, 'accept'])->name('invitations.accept');
       Route::post('/invitations/{token}/accept', [InvitationController::class, 'processAcceptance'])->name('invitations.processAcceptance');
       Route::prefix('projects/{project}')->name('projects.')->group(function () {
           Route::resource('tasks', TaskController::class);
       });
   
       Route::prefix('projects/{project}')->name('projects.')->group(function () {
           Route::resource('documents', DocumentController::class);
           Route::get('documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');
       });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
