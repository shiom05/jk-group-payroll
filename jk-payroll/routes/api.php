<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SecurityController;
use App\Http\Controllers\BankDetailController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\LeaveBalanceController;

Route::apiResource('api/securities', SecurityController::class)->withoutMiddleware(['auth:api']);
// Route::apiResource('api/bank-details', BankDetailController::class)->withoutMiddleware(['auth:api']);

Route::prefix('api/bank-details')->group(function () {
    Route::get('/{securityId}', [BankDetailController::class, 'getBySecurity']);
    Route::post('/', [BankDetailController::class, 'store']);
    Route::put('/{id}', [BankDetailController::class, 'update']);
    // Add other routes as needed
});


Route::prefix('api/security-leaves')->group(function () {
    Route::get('/', [LeaveController::class, 'index']);
    Route::get('/security/{securityId}', [LeaveController::class, 'getLeavesBySecurity']);
    Route::get('/{id}', [LeaveController::class, 'show']);
    Route::post('/', [LeaveController::class, 'store']);
    Route::put('/{id}', [LeaveController::class, 'update']);
    Route::delete('/{id}', [LeaveController::class, 'destroy']);
});

Route::prefix('api/security-leave-balances')->group(function () {
    Route::get('/security/{securityId}', [LeaveBalanceController::class, 'getLeaveBalanceBySecurity']);
    Route::post('/', [LeaveBalanceController::class, 'store']);
});


