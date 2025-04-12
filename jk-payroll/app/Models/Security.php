<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Leave;

class Security extends Model
{

    public $incrementing = false;  // Disable auto-increment assumption
    protected $keyType = 'string'; // Declare primary key type as string


    const STATUS_INACTIVE = 400;
    const STATUS_PENDING = 300;
    const STATUS_ACTIVE = 200;
    const STATUS_TERMINATED = 500;

    
    /** @use HasFactory<\Database\Factories\SecurityFactory> */
    use HasFactory;

    
    protected $primaryKey = 'securityId';

    protected $fillable = [
        'securityId',
        'securityName',
        'securityDob',
        'securityNicNumber',
        'securityAddress',
        'securityPrimaryContact',
        'securitySecondaryContact',
        'securityPhoto',
        'securityNicUploaded',
        'securityPoliceReportUploaded',
        'securityBirthCertificateUploaded',
        'securityGramasewakaLetterUploaded',
        'securityStatus',
        'securityDateOfJoin'
    ];

    protected $casts = [
        'securityId' => 'string',
        'securityDob' => 'date',
        'securityDateOfJoin' => 'date',
        'securityNICUploaded' => 'boolean',
        'securityPoliceReportUploaded' => 'boolean',
        'securityBirthCertificateUploaded' => 'boolean',
        'securityGramasewakaLetterUploaded' => 'boolean',
        'securityStatus' => 'integer',
    ];

    // Add this method to get status text
public function getStatusTextAttribute()
{
    return match($this->securityStatus) {
        self::STATUS_ACTIVE => 'Active',
        self::STATUS_PENDING => 'Pending',
        self::STATUS_INACTIVE => 'Inactive',
        self::STATUS_TERMINATED => 'Terminated',
        default => 'Unknown',
    };
}
}
