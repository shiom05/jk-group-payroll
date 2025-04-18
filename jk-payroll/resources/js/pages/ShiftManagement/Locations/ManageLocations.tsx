import { useState } from 'react';
import CreateLocation from './CreateLocation';
import EditLocation from './EditLocation';

export default function ManageLocations() {

  const [toEditLcoation, setToEditocation] = useState<any>(null);
  const [locations, setLocations] = useState<any>([
    {
      locationName: 'Downtown Office',
      locationType: 'Office Building',
      address: '123 Main St, Anytown, AT 12345',
      oicRate: '45.00',
      sargentRate: '50.00',
      costapalRate: '40.00'
    },
    {
      locationName: 'Northside Warehouse',
      locationType: 'Industrial',
      address: '500 Industrial Blvd, Anytown, AT 12345',
      oicRate: '35.00',
      sargentRate: '42.00',
      costapalRate: '32.00'
    },
    {
      locationName: 'Riverside Retail Center',
      locationType: 'Retail',
      address: '88 Commerce Ave, Anytown, AT 12345',
      oicRate: '55.00',
      sargentRate: '60.00',
      costapalRate: '48.00'
    }
  ]);
//   const router = useRouter();

    const saveEditedLocation = (location: any)=>{

    }

  return (
      <div className="rounded-2xl bg-gray-100 p-10 pt-10 pb-10 shadow-md">
          {!toEditLcoation ? <CreateLocation></CreateLocation> : <EditLocation onSave={saveEditedLocation} onCancel={()=>setToEditocation(null)} location={toEditLcoation}></EditLocation>}

          <h3 className="mb-4 pb-2 text-xl font-bold text-gray-800">Client Locations</h3>
          {locations.length > 0 && (
              <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
                  <table className="w-full min-w-full border-collapse">
                      <thead>
                          <tr className="bg-gray-200 text-gray-700">
                              <th className="px-4 py-3 text-left">Name</th>
                              <th className="px-4 py-3 text-left">Type</th>
                              <th className="px-4 py-3 text-left">Address</th>
                              <th className="px-4 py-3 text-left">OIC Rate</th>
                              <th className="px-4 py-3 text-center">Sargent Rate</th>
                              <th className="px-4 py-3 text-center">Costapal Rate</th>
                              <th className="px-4 py-3 text-center">#</th>
                          </tr>
                      </thead>
                      <tbody>
                          {locations.length ? (
                              locations.map((location: any) => (
                                  <tr key={location.locationId} className="border-b hover:bg-gray-100">
                                      <td className="px-4 py-3">{location.locationName}</td>
                                      <td className="px-4 py-3">{location.locationType}</td>
                                      <td className="px-4 py-3">{location.address}</td>
                                      <td className="px-4 py-3">{location.oicRate}</td>
                                      <td className="px-4 py-3">{location.sargentRate}</td>
                                      <td className="px-4 py-3">{location.costapalRate}</td>
                                      <td className="flex justify-center gap-2 px-4 py-3">
                                          <button
                                                onClick={() => setToEditocation(location)}
                                              className="rounded bg-yellow-500 px-3 py-1 text-white shadow hover:bg-yellow-600 cursor-pointer"
                                          >
                                              Edit
                                          </button>
                                          <button
                                              //   onClick={() => setToViewSecuritySelected(security)}
                                              className="rounded bg-red-500 px-3 py-1 text-white shadow hover:bg-red-600 cursor-pointer"
                                          >
                                              View
                                          </button>
                                      </td>
                                  </tr>
                              ))
                          ) : (
                              <tr>
                                  <td className="flex w-full items-center p-9 font-bold">
                                      <p>No Securities .....</p>{' '}
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>

              // <div className="mt-10 max-w-4xl mx-auto">
              //   <h3 className="text-xl font-semibold text-gray-700 mb-4">Location List</h3>
              //   <table className="w-full border-collapse border border-gray-300">
              //     <thead>
              //       <tr className="bg-gray-100">
              //         <th className="border border-gray-300 px-4 py-2">Name</th>
              //         <th className="border border-gray-300 px-4 py-2">Type</th>
              //         <th className="border border-gray-300 px-4 py-2">Address</th>
              //         <th className="border border-gray-300 px-4 py-2">OIC Rate</th>
              //         <th className="border border-gray-300 px-4 py-2">Sargent Rate</th>
              //         <th className="border border-gray-300 px-4 py-2">Costapal Rate</th>
              //       </tr>
              //     </thead>
              //     <tbody>
              //       {locations.map((loc: any, index: number) => (
              //         <tr key={index} className="text-center">
              //           <td className="border border-gray-300 px-4 py-2">{loc.locationName}</td>
              //           <td className="border border-gray-300 px-4 py-2">{loc.locationType}</td>
              //           <td className="border border-gray-300 px-4 py-2">{loc.address}</td>
              //           <td className="border border-gray-300 px-4 py-2">{loc.oicRate}</td>
              //           <td className="border border-gray-300 px-4 py-2">{loc.sargentRate}</td>
              //           <td className="border border-gray-300 px-4 py-2">{loc.costapalRate}</td>
              //         </tr>
              //       ))}
              //     </tbody>
              //   </table>
              // </div>
          )}
      </div>
  );
}