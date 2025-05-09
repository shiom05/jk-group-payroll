import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Layout from '@/layouts/Layout';
import ManageLocations from './Locations/ManageLocations';
import AssignSecurity from './AssignSecurity';
import Location from '@/types/jk/location';
import { getLocation } from '@/services/location.service';
import Security from '@/types/jk/security';
import axios from 'axios';
import SecurityShiftLogManager from './LogShift/logshift';

export default function ShiftManagement() {
  const [view, setView] = useState('locations');

  const locationTypes = ['Warehouse', 'Shop', 'House', 'Land'];
  const roleTypes = ['OIC', 'Sargent', 'Costapal'];

  const [locations, setLocations] = useState<Location[]>([]);
  const [securityList, setSecurityList]= useState<Security[]>([]);

    
   const fetchLocations = async()=>{
      const result = await getLocation();
      setLocations(result.data);
   }

   const fetchSecurities = async () => {
    try {
        const response = await axios.get('/api/securities');
        setSecurityList(response.data);
    } catch (error) {
        console.error('Error fetching securities:', error);
    }
    };

    useEffect(()=>{
        fetchLocations();
        fetchSecurities();
    },[]);
      
    
  return (
      <Layout>
          <div className="p-6">
              <h1 className="mb-4 text-2xl font-bold">Shift Management</h1>

              <div className="mb-4 flex gap-2">
                  <Button
                      onClick={() => setView('locations')}
                      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                          view === 'locations'
                              ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                      Manage Locations
                  </Button>

                  <Button
                      onClick={() => setView('assignments')}
                      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                          view === 'assignments'
                              ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                      Assign Securities
                  </Button>

                  <Button
                      onClick={() => setView('logs')}
                      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                          view === 'logs'
                              ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                      Log Shifts
                  </Button>
              </div>

              {view === 'locations' && <ManageLocations></ManageLocations>}

              {view === 'assignments' && (
                <AssignSecurity securities={securityList} locations={locations}></AssignSecurity>
              )}

              {view === 'logs' && (
                <SecurityShiftLogManager />
              )}
          </div>
      </Layout>
  );
}