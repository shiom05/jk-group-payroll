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