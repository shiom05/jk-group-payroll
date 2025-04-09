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
        Schema::create('securities', function (Blueprint $table) {
            $table->string('securityId')->primary();
            $table->string('securityName');
            $table->date('securityDob');
            $table->string('securityNicNumber')->unique();
            $table->text('securityAddress');
            $table->string('securityPrimaryContact');
            $table->string('securitySecondaryContact')->nullable();
            $table->string('securityPhoto')->nullable();
            $table->boolean('securityNicUploaded')->default(false);
            $table->boolean('securityPoliceReportUploaded')->default(false);
            $table->boolean('securityBirthCertificateUploaded')->default(false);
            $table->boolean('securityGramasewakaLetterUploaded')->default(false);
            $table->date('securityDateOfJoin');
            $table->smallInteger('securityStatus')->default(300);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('securities');
    }
};

//   