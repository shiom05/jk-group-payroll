import Security from "@/types/jk/security";

    export const getStatusText = (status: number) => {
        switch (status) {
            case 200:
                return 'Active';
            case 300:
                return 'Pending';
            case 400:
                return 'Inactive';
            case 500:
                return 'Terminated';
            default:
                return 'Unknown';
        }
    };

export const formatDate = (dateStr: string | Date) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' }); // or 'short' for Apr
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

export function getLeaveStatus(startDate: string | Date, endDate: string | Date) {
        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
      
        if (today < start) return "Pending";
        if (today >= start && today <= end) return "Active";
        return "Completed";
      }


export const getSecuiryDropdownOptions = (securites: Security[]) =>{

    const arrayOptions: {value: string, label: string}[] = [];

    securites.forEach((security: Security)=>{
        arrayOptions.push({
            value: security.securityId,
            label: security.securityName
        })
    });

    return arrayOptions;

}