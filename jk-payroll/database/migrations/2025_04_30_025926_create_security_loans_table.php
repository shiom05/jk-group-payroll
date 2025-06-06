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
        Schema::create('security_loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('security_id')->constrained('securities', 'securityId')->onDelete('cascade');
            $table->decimal('total_amount', 10, 2);
            $table->integer('installments');
            $table->string('description')->nullable();
            $table->date('start_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('security_loans');
    }
};
