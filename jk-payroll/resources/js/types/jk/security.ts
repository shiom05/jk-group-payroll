export default interface Security {
    securityId: string;
    securityName: string;
    securityDob: string | Date; // Can be either string or Date object
    securityNicNumber: string;
    securityAddress: string;
    securityPrimaryContact: string;
    securitySecondaryContact?: string; // Optional secondary contact
    securityPhoto?: string; // URL, base64 string, or file path
    securityNicUploaded: boolean;
    securityPoliceReportUploaded: boolean;
    securityBirthCertificateUploaded: boolean;
    securityGramasewakaLetterUploaded: boolean;
    securityStatus: 'active' | 'pending' | 'exemployee' | 'inactive'; // Union type
    securityDateOfJoin: string | Date; // Can be either string or Date object
  }