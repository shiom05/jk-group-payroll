<?php

namespace App\Http\Controllers;

use App\Models\Security;
use App\Http\Requests\StoreSecurityRequest;
use App\Http\Requests\UpdateSecurityRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SecurityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $securities = Security::all();
        return response()->json($securities);   
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSecurityRequest $request)
    {
        $validator = Validator::make($request->all(), [
            'securityName' => ['required'],
            'securityDob' => ['required'],
            'securityNicNumber' => ['required'],
            'securityAddress' => ['required'],
            'securityPrimaryContact' => ['required'],
            'securitySecondaryContact' => ['required'],
            'securityPhoto' => ['required'],
            'securityDateOfJoin' => ['required'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->except('securityPhoto');
        $datePart = now()->format('Ymd');
        $randomNumber = mt_rand(1, 9999);
        $randomPart = str_pad($randomNumber, 4, '0', STR_PAD_LEFT);
        $securityId = 'JK' . $datePart . $randomPart;
        $data['securityId'] = $securityId;

        if (isset($data['securityStatus'])) {
            $data['securityStatus'] = (int) $data['securityStatus'];
        }

        if ($request->hasFile('securityPhoto')) {
            $path = $request->file('securityPhoto')->store('security_photos', 'public');
            $data['securityPhoto'] = $path;
        }

        $security = Security::create($data);

        return response()->json($security, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Security $security)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Security $security)
    {
      
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSecurityRequest $request, Security $security)
    {
        $securityId = $security->securityId;
        $security = Security::where('securityId', $securityId)->first();

        if (!$security) {
            return response()->json(['message' => 'Security not found'], 404);
        }

        $validatedData = $request->validate([
            'securityName' => ['required'],
            'securityDob' => ['required'],
            'securityNicNumber' => ['required'],
            'securityAddress' => ['required'],
            'securityPrimaryContact' => ['required'],
            'securitySecondaryContact' => ['required'],
            'securityPhoto' => ['required'],
            'securityDateOfJoin' => ['required'],
        ]);

        Log::info("Validated data: ", $validatedData);

        $security->update($validatedData);
        return response()->json($security);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Security $security)
    {
        //
    }
}
