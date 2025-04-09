<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SecurityController;
use App\Http\Controllers\BankDetailController;

Route::apiResource('api/securities', SecurityController::class)->withoutMiddleware(['auth:api']);
// Route::apiResource('api/bank-details', BankDetailController::class)->withoutMiddleware(['auth:api']);

Route::prefix('api/bank-details')->group(function () {
    Route::get('/{securityId}', [BankDetailController::class, 'getBySecurity']);
    Route::post('/', [BankDetailController::class, 'store']);
    Route::put('/{id}', [BankDetailController::class, 'update']);
    // Add other routes as needed
});