<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SecurityController;
use App\Http\Controllers\BankDetailController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\LeaveBalanceController;
use App\Http\Controllers\InventoryTypeController;
use App\Http\Controllers\InventoryItemsController;
use App\Http\Controllers\InventoryTransactionController;
use App\Http\Controllers\SecurityAssetController;
use App\Http\Controllers\SecurityExpensesController;
use App\Http\Controllers\SecurityLoansController;

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
    Route::put('/{leave}', [LeaveController::class, 'update']);
    Route::delete('/{leave}', [LeaveController::class, 'destroy']);
});

Route::prefix('api/security-leave-balances')->group(function () {
    Route::get('/security/{securityId}', [LeaveBalanceController::class, 'getLeaveBalanceBySecurity']);
    Route::post('/', [LeaveBalanceController::class, 'store']);
});


Route::prefix('api/inventory')->group(function () {
    Route::get('/types', [InventoryTypeController::class, 'index']);
    Route::post('/', [InventoryItemsController::class, 'store']);
    Route::get('/', [InventoryItemsController::class, 'index']);
    Route::put('/{item}', [InventoryItemsController::class, 'update']);
    Route::post('/allocate', [InventoryTransactionController::class, 'store']);
    Route::post('/return', [InventoryTransactionController::class, 'returnInventory']);
    Route::get('/allocations', [InventoryTransactionController::class, 'allAllocatedInventories']);
    Route::get('/allocations/{securityId}', [InventoryTransactionController::class, 'allocatedInventoriesBySecurity']);
   
    //calculate expense from above
    Route::get('/allocations/current-month', [InventoryTransactionController::class, 'allocatedInventoriesForCurrentMonth']);
    Route::get('/allocations/current-month/{securityId}', [InventoryTransactionController::class, 'allocatedInventoriesForSecurityCurrentMonth']);
    //calculate expense from above

    Route::post('/asign-asset', [SecurityAssetController::class, 'allocateInventory']);
    Route::post('/return-asset', [SecurityAssetController::class, 'returnInventory']);
    Route::get('/security/{securityId}', [SecurityAssetController::class, 'getCurrentInventory']);
});


Route::prefix('api/expenses')->group(function () {
    Route::get('/security', [SecurityExpensesController::class, 'index']);
    Route::post('/security', [SecurityExpensesController::class, 'store']);
    Route::put('/security/{securityExpense}', [SecurityExpensesController::class, 'update']);
    Route::delete('/security/{securityExpense}', [SecurityExpensesController::class, 'destroy']);
    Route::get('/security/{securityId}', [SecurityExpensesController::class, 'getBySecurity']);
    Route::get('/security/{securityId}/current-month', [SecurityExpensesController::class, 'getCurrentMonthExpenseBySecurity']);
});

Route::prefix('api/loans')->group(function () {
    Route::get('/security', [SecurityLoansController::class, 'index']);
    Route::post('/security', [SecurityLoansController::class, 'store']);
    Route::put('/security/{securityLoan}', [SecurityLoansController::class, 'update']);
    Route::delete('/security/{securityLoan}', [SecurityLoansController::class, 'destroy']);
    Route::get('/security/{securityId}', [SecurityLoansController::class, 'getBySecurity']);
    Route::get('/security/{securityId}/current-month', [SecurityLoansController::class, 'getActiveLoansBySecurity']);
    Route::get('/security/{securityId}/current-month/payroll', [SecurityLoansController::class, 'getLoansForPayroll']);
});





