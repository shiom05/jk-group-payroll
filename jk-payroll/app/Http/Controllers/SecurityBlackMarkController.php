<?php

namespace App\Http\Controllers;

use App\Models\Security;
use App\Models\SecurityBlackMark;
use App\Http\Requests\StoreSecurityBlackMarkRequest;
use App\Http\Requests\UpdateSecurityBlackMarkRequest;
use Illuminate\Validation\Rule;

class SecurityBlackMarkController extends Controller
{
     public function index(StoreSecurityBlackMarkRequest $request)
    {
        $query = SecurityBlackMark::with('security')
            ->latest();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('security_id')) {
            $query->where('security_id', $request->security_id);
        }

        return response()->json($query->get());
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
        //
    }
}
