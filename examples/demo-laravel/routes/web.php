<?php
// Demo: Intentionally vulnerable Laravel routes for AspidaSec testing
// DO NOT deploy this code — it contains deliberate security issues

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

// A03: SQL Injection — raw query with unsanitized input
Route::get('/users', function (Request $request) {
    $name = $request->input('name');
    // Vulnerable: string interpolation in raw SQL
    $users = DB::select("SELECT * FROM users WHERE name = '$name'");
    return response()->json($users);
});

// A01: Broken Access Control — no auth middleware
Route::get('/admin/settings', function () {
    return response()->json(['debug' => true, 'key' => env('APP_KEY')]);
});

// A05: Security Misconfiguration — debug mode leak
Route::get('/debug', function () {
    return response()->json([
        'app_debug' => config('app.debug'),
        'app_key' => config('app.key'),
        'db_password' => config('database.connections.mysql.password'),
    ]);
});

// A04: Insecure Design — mass assignment without guarded fields
Route::post('/users', function (Request $request) {
    // Vulnerable: accepting all input without validation
    $user = \App\Models\User::create($request->all());
    return response()->json($user);
});

// A07: Authentication Failure — hardcoded credentials
Route::post('/login', function (Request $request) {
    if ($request->input('password') === 'admin123') {
        return response()->json(['status' => 'authenticated']);
    }
    return response()->json(['status' => 'failed'], 401);
});
