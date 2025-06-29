<?php

use App\Models\Organization;
use App\Models\Project;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Organization::class);
            $table->foreignIdFor(Project::class);
            $table->foreignId('assigned_to_user_id')->nullable()->constrained('users')->cascadeOnDelete(); 
            $table->foreignId('created_by_user_id')->constrained('users')->cascadeOnDelete(); 
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status')->default('pending'); // e.g., 'pending', 'in-progress', 'completed', 'blocked'
            $table->timestamp('due_date')->nullable();
            $table->integer('priority')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
