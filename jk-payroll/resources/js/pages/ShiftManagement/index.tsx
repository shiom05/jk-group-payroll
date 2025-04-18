import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Layout from '@/layouts/Layout';
import ManageLocations from './Locations/ManageLocations';
import AssignSecurity from './AssignSecurity';


export default function ShiftManagement() {
  const [view, setView] = useState('locations');

  const locationTypes = ['Warehouse', 'Shop', 'House', 'Land'];
  const roleTypes = ['OIC', 'Sargent', 'Costapal'];

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
                <AssignSecurity></AssignSecurity>
              )}

              {view === 'logs' && (
                  <Card className="mb-6">
                      <CardContent className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
                          <div>
                              <Label>Location</Label>
                              <Select>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select Location" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="loc1">ABC Warehouse</SelectItem>
                                      <SelectItem value="loc2">XYZ Shop</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>
                          <div>
                              <Label>Security</Label>
                              <Select>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select Security" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="sec1">John Doe</SelectItem>
                                      <SelectItem value="sec2">Jane Smith</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>
                          <div>
                              <Label>Shift Start</Label>
                              <Input type="datetime-local" />
                          </div>
                          <div>
                              <Label>Shift End</Label>
                              <Input type="datetime-local" />
                          </div>
                          <div className="col-span-full">
                              <Button>Log Shift</Button>
                          </div>
                      </CardContent>
                  </Card>
              )}
          </div>
      </Layout>
  );
}