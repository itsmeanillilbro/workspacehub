<?php

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
        Schema::create('invitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->string('email')->unique(); // Email of the invited person
            $table->string('token')->unique(); // Unique token for the invitation link
            $table->string('role')->default('member'); // Role they will have if they join
            $table->timestamp('expires_at')->nullable(); // When the invitation expires
            $table->timestamp('accepted_at')->nullable(); // When the invitation was accepted
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invitations');
    }
};
