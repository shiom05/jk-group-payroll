<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;
use App\Http\Controllers\SecurityController;
use App\Http\Controllers\WorkOSController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->name('dashboard');

Route::get('/security-management', function () {
    return Inertia::render('SecurityManagment/index');
})->name('SecurityManagment');

Route::get('/security-management/create-security', function () {
    return Inertia::render('SecurityManagment/CreateSecurity');
})->name('CreateSecurity');


// Route::middleware([
//     'auth',
//     ValidateSessionWithWorkOS::class,
// ])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

Route::get('/workos-data', [WorkOSController::class, 'fetchData']);

require __DIR__.'/api.php';
require __DIR__.'/auth.php';

