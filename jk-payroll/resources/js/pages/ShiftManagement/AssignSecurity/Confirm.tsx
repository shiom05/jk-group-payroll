import { assignSecurityToLocation } from '@/services/securityLocationAllocation.service';
import Location from '@/types/jk/location';
import Security from '@/types/jk/security';
import { Image, Button } from 'antd';

interface ConfirmProps {
    selectedLocation: Location;
    selectedSecurity: Security;
}


const Confirm = ({ selectedLocation, selectedSecurity }: ConfirmProps) => {

    const handleAllocation = async()=>{
        const data = {
            security_id: selectedSecurity.securityId,
            location_id: selectedLocation.locationId 
        }
        const result = await assignSecurityToLocation(data);
        console.log(result);
    }

    
    return (
        <>

        <div className='flex flex-col gap-y-1! p-5 items-center leading-normal'>
            {selectedLocation &&  <h1>Locations Name: {selectedLocation.locationName}</h1>}
            {selectedSecurity && <h1>Security Name: {selectedSecurity.securityName}</h1>}

            <Button type="primary" onClick={handleAllocation} disabled={!selectedLocation || !selectedSecurity} htmlType="button">
                Add Allocation
            </Button>
        </div>
      

        </>
    );
};

export default Confirm;
