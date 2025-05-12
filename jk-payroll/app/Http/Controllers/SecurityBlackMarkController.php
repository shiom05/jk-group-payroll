<?php

namespace App\Http\Controllers;

use App\Models\Security;
use App\Models\SecurityBlackMark;
use App\Http\Requests\StoreSecurityBlackMarkRequest;
use App\Http\Requests\UpdateSecurityBlackMarkRequest;
use Illuminate\Validation\Rule;
use Carbon\Carbon;


class SecurityBlackMarkController extends Controller
{
     public function index(StoreSecurityBlackMarkRequest $request)
    {
        $query = SecurityBlackMark::with(['security:securityId,securityName,securityType'])
            ->latest();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('security_id')) {
            $query->where('security_id', $request->security_id);
        }

        return response()->json($query->get());
    }


    public function pendingCurrentMonthBlackMarks()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth()->toDateTimeString();
        $endOfMonth = $now->copy()->endOfMonth()->toDateTimeString();

        $blackMarks = SecurityBlackMark::with(['security:securityId,securityName,securityType'])
            ->where('status', 'pending')
            ->whereBetween('incident_date', [$startOfMonth, $endOfMonth])
            ->latest()
            ->get();

        return response()->json($blackMarks);
    }

    public function pendingCurrentMonthBlackMarksForSecurity($security_id)
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth()->toDateTimeString();
        $endOfMonth = $now->copy()->endOfMonth()->toDateTimeString();

        $blackMarks = SecurityBlackMark::with(['security:securityId,securityName,securityType'])
            ->where('security_id', $security_id)
            ->where('status', 'pending')
            ->whereBetween('incident_date', [$startOfMonth, $endOfMonth])
            ->latest()
            ->get();

        return response()->json($blackMarks);
    }

    /**
     * Get COMPLETED black marks (deductible)
     * Filtered by fine_effective_date in current month
     * Only includes marks with completed status
     */
    public function deductibleCurrentMonthBlackMarks()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth()->toDateTimeString();
        $endOfMonth = $now->copy()->endOfMonth()->toDateTimeString();

        $blackMarks = SecurityBlackMark::with(['security:securityId,securityName,securityType'])
            ->where('status', 'completed')
            ->whereBetween('fine_effective_date', [$startOfMonth, $endOfMonth])
            ->latest()
            ->get();

        return response()->json($blackMarks);
    }

    /**
     * Get COMPLETED black marks for specific security (deductible)
     */
    public function deductibleCurrentMonthBlackMarksForSecurity($security_id)
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth()->toDateTimeString();
        $endOfMonth = $now->copy()->endOfMonth()->toDateTimeString();

        $blackMarks = SecurityBlackMark::with(['security:securityId,securityName,securityType'])
            ->where('security_id', $security_id)
            ->where('status', 'completed')
            ->whereBetween('fine_effective_date', [$startOfMonth, $endOfMonth])
            ->latest()
            ->get();

        return response()->json($blackMarks);
    }
 
    public function store(StoreSecurityBlackMarkRequest $request)
    {
        $validated = $request->validate([
            'security_id' => 'required|exists:securities,securityId',
            'type' => ['required', Rule::in([
                'Theft',
                'Vacate a Point',
                'Alcohol/Drug',
                'Leave end date not return',
                'Other'
            ])],
            'incident_description' => 'required|string|max:1000',
            'incident_date' => 'required|date',
        ]);

        $blackMark = SecurityBlackMark::create($validated);

        return response()->json($blackMark, 201);
    }

    public function update(UpdateSecurityBlackMarkRequest $request, $id)
    {
        $blackMark = SecurityBlackMark::findOrFail($id);

        $validated = $request->validate([
            'inquiry_details' => 'required|string|max:2000',
            'fine_amount' => 'required|numeric|min:0',
            'fine_effective_date' => 'required|date|after_or_equal:incident_date',
            'status' => ['required', Rule::in(['pending', 'completed'])],
        ]);

        $blackMark->update($validated);

        return response()->json($blackMark);
    }

    public function destroy(SecurityBlackMark $securityBlackMark)
    {
        $securityBlackMark->delete();
        return response()->json(['message' => 'location deleted']);
    }
}
