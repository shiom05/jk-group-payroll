<?php

namespace App\Http\Controllers;

use App\Models\SecurityShiftLog;
use App\Models\Locations;

use App\Http\Requests\StoreSecurityShiftLogRequest;
use App\Http\Requests\UpdateSecurityShiftLogRequest;
use Illuminate\Support\Carbon;

class SecurityShiftLogController extends Controller
{
 
    public function index()
    {
        $shifts = SecurityShiftLog::with(['security', 'location'])->get();

        return response()->json($shifts);
    }

    public function getBySecurityId($securityId)
    {
        $shifts = SecurityShiftLog::with(['security', 'location'])
            ->where('security_id', $securityId)
            ->get()
            ->map(function ($shift) {
                return [
                    'id' => $shift->id,
                    'shift_date' => $shift->shift_date,
                    'start_time' => $shift->start_time,
                    'end_time' => $shift->end_time,
                    'notes' => $shift->notes,
                    'total_hours' => $shift->total_hours,
                    'security_total_pay_for_shift' => $shift->security_total_pay_for_shift,
                    'total_bill_pay_for_shift' => $shift->total_bill_pay_for_shift,
                    'security' => [
                        'securityName' => $shift->security->securityName ?? null,
                        // Include other security fields if needed
                    ],
                    'location' => [
                        'locationName' => $shift->location->locationName ?? null,
                        // Include other location fields if needed
                    ],
                ];
            });
    
        return response()->json($shifts);
    }

    public function getByLocationId($locationId)
    {
        $shifts = SecurityShiftLog::where('location_id', $locationId)->get();
        return response()->json($shifts);
    }

    public function getCurrentMonthShiftsForSecurity($securityId)
    {
        $startOfMonth = Carbon::now()->startOfMonth()->toDateString();
        $today = Carbon::now()->toDateString();

        $shifts = SecurityShiftLog::where('security_id', $securityId)
            ->whereBetween('shift_date', [$startOfMonth, $today])
            ->get();

        return response()->json($shifts);
    }
    
    public function store(StoreSecurityShiftLogRequest $request)
    {
        
        $validated = $request->validate([
            'security_id' => 'required|exists:securities,securityId',
            'location_id' => 'required|exists:locations,locationId',
            'shift_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'notes' => 'nullable|string',
        ]);

        // Calculate total hours
        $start = Carbon::createFromFormat('H:i', $validated['start_time']);
        $end = Carbon::createFromFormat('H:i', $validated['end_time']);
        $totalHours = $start->diffInMinutes($end) / 60;

        // Get hourly rate based on security type
        $location = Locations::where('locationId', $validated['location_id'])->first();
        $security = $location->securities()->where('securityId', $validated['security_id'])->first();

        $type = $security->securityType; // JSO, CSO, etc.
        $payRateField = 'paying_' . strtoupper($type) . '_HourlyRate';
        $hourlyRate = $location->$payRateField ?? 0;

        $billRateField = 'billing_' . strtoupper($type) . '_HourlyRate';
        $hourlyBillRate = $location->$billRateField ?? 0;

        $validated['total_hours'] = round($totalHours, 2);
        $validated['security_total_pay_for_shift'] = round($totalHours * $hourlyRate, 2);
        $validated['total_bill_pay_for_shift'] = round($totalHours * $hourlyBillRate, 2);

        $shift = SecurityShiftLog::create($validated);

        return response()->json([
            'message' => 'Shift log created',
             'data' => $shift,
             'location'=> $location,
             'payRateField'=> $payRateField,
             'billRateField'=> $billRateField,
             'hourlyBillRate'=> $hourlyBillRate,
             'hourlyRate'=> $hourlyRate,
            ], 201);
   
    }

    public function update(UpdateSecurityShiftLogRequest $request,$id)
    {
        
        $shift = SecurityShiftLog::findOrFail($id);

        $validated = $request->validate([
            'shift_date' => 'sometimes|date',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'notes' => 'nullable|string',
        ]);

        $shift->fill($validated);

        // Recalculate if time fields updated
        if (isset($validated['start_time']) && isset($validated['end_time'])) {
            $start = Carbon::createFromFormat('H:i', $validated['start_time']);
            $end = Carbon::createFromFormat('H:i', $validated['end_time']);
            $totalHours = $start->diffInMinutes($end) / 60;

            $location = Locations::where('locationId', $shift->location_id)->first();
            $security = $location->securities()->where('securityId', $shift->security_id)->first();

            $type = $security->securityType;
            $payRateField = 'paying_' . strtoupper($type) . '_HourlyRate';
            $hourlyRate = $location->$payRateField ?? 0;

            $billRateField = 'billing_' . strtoupper($type) . '_HourlyRate';
            $hourlyBillRate = $location->$billRateField ?? 0;

            $shift->total_hours = round($totalHours, 2);
            $shift->security_total_pay_for_shift = round($totalHours * $hourlyRate, 2);
            $shift->total_bill_pay_for_shift = round($totalHours * $hourlyBillRate, 2);
        }

        $shift->save();

        return response()->json(['message' => 'Shift log updated', 'data' => $shift]);
    
    }

    public function destroy($id)
    {
        $shift = SecurityShiftLog::findOrFail($id);
        $shift->delete();

        return response()->json(['message' => 'Shift log deleted']);
    }
}
