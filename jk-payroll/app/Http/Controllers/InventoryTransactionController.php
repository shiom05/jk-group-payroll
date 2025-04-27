<?php

namespace App\Http\Controllers;

use App\Models\InventoryTransaction;
use App\Http\Requests\StoreInventoryTransactionRequest;
use App\Http\Requests\UpdateInventoryTransactionRequest;
use Illuminate\Support\Facades\DB;

use App\Models\InventoryItems;
use Carbon\Carbon; 

class InventoryTransactionController extends Controller
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

    public function allAllocatedInventories()
    {
        $allocations = InventoryTransaction::with(['items', 'security'])
            ->where('type', 'allocation')
            ->orderBy('transaction_date', 'desc')
            ->get();

        return response()->json([
            'message' => 'All allocated inventories retrieved successfully.',
            'data' => $allocations
        ]);
    }

    public function allocatedInventoriesBySecurity($securityId)
    {
        $allocations = InventoryTransaction::with(['items', 'security'])
            ->where('type', 'allocation')
            ->where('security_id', $securityId)
            ->orderBy('transaction_date', 'desc')
            ->get();

        return response()->json([
            'message' => "Allocated inventories for Security ID: $securityId retrieved successfully.",
            'data' => $allocations
        ]);
    }

        public function allocatedInventoriesForCurrentMonth()
        {
            $now = Carbon::now(); // Current date and time
            $startOfMonth = $now->copy()->startOfMonth()->toDateString();
            $endOfMonth = $now->copy()->endOfMonth()->toDateString();

            $allocations = InventoryTransaction::with(['items', 'security'])
                ->where('type', 'allocation')
                ->whereBetween('transaction_date', [$startOfMonth, $endOfMonth])
                ->orderBy('transaction_date', 'asc')
                ->get();

            return response()->json([
                'message' => "Allocated inventories for the month of " . $now->format('F') . " retrieved successfully.",
                'data' => $allocations
            ]);
        }


        public function allocatedInventoriesForSecurityCurrentMonth($securityId)
        {
            $now = Carbon::now();
            $startOfMonth = $now->copy()->startOfMonth()->toDateString();
            $endOfMonth = $now->copy()->endOfMonth()->toDateString();

            $allocations = InventoryTransaction::with(['items', 'security'])
                ->where('type', 'allocation')
                ->where('security_id', $securityId)
                ->whereBetween('transaction_date', [$startOfMonth, $endOfMonth])
                ->orderBy('transaction_date', 'asc')
                ->get();

            $totalCost = $allocations->sum('total_value');

            return response()->json([
                'message' => "Allocated inventories for Security ID: {$securityId} in " . $now->format('F') . " retrieved successfully.",
                'total_allocated_value' => $totalCost,
                'data' => $allocations
            ]);
        }


    public function return(Request $request)
    {
        $validated = $request->validate([
            // 'employee_id' => 'required|exists:users,id',
            'security_id' => 'required|exists:securities,securityId',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'transaction_date' => 'required|date',
            'original_transaction_id' => 'nullable|exists:inventory_transactions,id'
        ]);

        return DB::transaction(function () use ($validated) {
            $transaction = InventoryTransaction::create([
                'type' => 'return',
                'security_id' => $validated['security_id'],
                'transaction_date' => $validated['transaction_date'],
                'notes' => $validated['original_transaction_id'] 
                    ? "Return for transaction #{$validated['original_transaction_id']}" 
                    : null
            ]);

            foreach ($validated['items'] as $item) {
                $originalItem = InventoryItems::find($item['id']);
                
                // Create returned inventory record
                $returnedItem = $originalItem->replicate();
                $returnedItem->condition = 'returned';
                $returnedItem->quantity = $item['quantity'];
                $returnedItem->save();

                $transaction->items()->create([
                    'inventory_item_id' => $returnedItem->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $returnedItem->current_value,
                    'condition' => 'returned'
                ]);
            }

            return response()->json([
                'message' => 'Items returned successfully',
                'transaction_id' => $transaction->id
            ]);
        });
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInventoryTransactionRequest $request)
    {
        $validated = $request->validate([
            'security_id' => 'required|exists:securities,securityId',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'transaction_date' => 'required|date'
        ]);

        return DB::transaction(function () use ($validated) {
            $transaction = InventoryTransaction::create([
                'type' => 'allocation',
                'security_id' => $validated['security_id'],
                'transaction_date' => $validated['transaction_date']
            ]);

            foreach ($validated['items'] as $item) {
                $inventoryItem = InventoryItems::find($item['id']);
                
                if ($inventoryItem->quantity < $item['quantity']) {
                    throw new \Exception("Not enough stock for {$inventoryItem->type->name}");
                }

                $transaction->items()->create([
                    'inventory_item_id' => $inventoryItem->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $inventoryItem->current_value,
                    'condition' => $inventoryItem->condition
                ]);

                $inventoryItem->decrement('quantity', $item['quantity']);
            }

            return response()->json([
                'message' => 'Inventory allocated successfully',
                'transaction_id' => $transaction->id
            ]);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(InventoryTransaction $inventoryTransaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InventoryTransaction $inventoryTransaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInventoryTransactionRequest $request, InventoryTransaction $inventoryTransaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InventoryTransaction $inventoryTransaction)
    {
        //
    }
}
