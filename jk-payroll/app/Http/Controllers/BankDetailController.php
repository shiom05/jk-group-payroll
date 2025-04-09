<?php

namespace App\Http\Controllers;

use App\Models\BankDetail;
use App\Models\Security;
use App\Http\Requests\StoreBankDetailRequest;
use App\Http\Requests\UpdateBankDetailRequest;
use Illuminate\Support\Facades\Validator;

class BankDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function getBySecurity($securityId)
    {
        // Validate security exists
        $security = Security::find($securityId);
        if (!$security) {
            return response()->json(['message' => 'Security personnel not found'], 404);
        }

        // Find bank details
        $bankDetail = BankDetail::where('security_id', $securityId)->first();

        if (!$bankDetail) {
            return response()->json(['message' => 'No bank details found for this security personnel'], 404);
        }

        return response()->json($bankDetail);
    }

   
    public function store(StoreBankDetailRequest $request)
    {

        $validator = Validator::make($request->all(), [
            'security_id' => 'required|exists:securities,securityId',
            'bank_name' => 'required|string',
            'bank_branch' => 'required|string',
            'account_number' => 'required|string|unique:bank_details,account_number',
            'bank_code' => 'required|string',
            'branch_code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Check if bank details already exist
    if (BankDetail::where('security_id', $request->security_id)->exists()) {
        return response()->json([
            'message' => 'Bank details already exist for this security personnel'
        ], 409);
    }

       // Create new bank details
    $bankDetail = BankDetail::create([
        'security_id' => $request->security_id,
        'bank_name' => $request->bank_name,
        'bank_branch' => $request->bank_branch,
        'account_number' => $request->account_number,
        'bank_code' => $request->bank_code,
        'branch_code' => $request->branch_code,
    ]);
    return response()->json($bankDetail, 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(BankDetail $bankDetail)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BankDetail $bankDetail)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBankDetailRequest $request, BankDetail $id)
    {
        $bankDetail = BankDetail::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'bank_name' => 'sometimes|required|string',
            'bank_branch' => 'sometimes|required|string',
            'account_number' => 'sometimes|required|string|unique:bank_details,account_number,'.$id,
            'bank_code' => 'sometimes|required|string',
            'branch_code' => 'sometimes|required|string',
            'security_id' => [
                'required',
                'string',
                Rule::exists('securities', 'securityId')
            ],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $bankDetail->update($validator->validated());
        return response()->json($bankDetail);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BankDetail $bankDetail)
    {
        //
    }
}
