import { Button, message, Steps, theme, Image } from 'antd';
import React, { useState } from 'react';
import SelectLocation from './SelectLocation';
import SelectSecurity from './SelectSecurity';



const AsignSecuirty = () => {
    

    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [selectedLocation, setSelectedLocation]= useState<any>(null);
    const [selectedSecurity, setSelectedSecurity]= useState<any>(null);
    
    const handleSelectLocation = (loc: any)=>{
        console.log(loc)
        setSelectedLocation(loc)
    }
    const handleSelectSecuirty = (sec: any)=>{
        console.log(sec)
        setSelectedSecurity(sec);
    }


    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: 'Select Location',
            content: <SelectLocation onSelected={handleSelectLocation}  selectedLocation={selectedLocation} />,
        },
        {
            title: 'Select Security',
            content: <SelectSecurity selectedSecurity={selectedSecurity} onSelected={handleSelectSecuirty} />,
        },
        {
            title: 'Complete Assign',
            content: 'Last-content',
        },
    ];
    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
    };

    
    return (
        <div className="p-5">
        
           <div className='pb-10 flex w-full! gap-x-6'>

           <div className='w-1/2'>
                {selectedLocation && (
                    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                    <div className="border-b border-gray-200 bg-blue-50 px-4 py-3">
                      <h3 className="text-lg font-semibold text-green-800">
                        SELECTED LOCATION
                      </h3>
                      <h4 className="text-md font-semibold text-gray-800">
                        {selectedLocation.locationName}
                      </h4>
                      <p className="text-sm text-blue-600">
                        {selectedLocation.locationType}
                        {selectedLocation.isJkPropLocation && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            JK Property
                          </span>
                        )}
                      </p>
                    </div>
                  
                    <div className="p-4">
                      <div className="mb-4">
                        <h4 className="text-xs font-medium tracking-wider text-gray-500 uppercase">Address</h4>
                        <p className="mt-1 whitespace-pre-line text-gray-700">
                          {selectedLocation.address}
                        </p>
                      </div>
                  
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-medium tracking-wider text-gray-500 uppercase mb-2">Billing Rates (LKR/hr)</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded border border-blue-100 bg-blue-50 p-2">
                              <p className="text-xs font-medium text-blue-600">OIC</p>
                              <p className="text-lg font-bold text-blue-800">
                                {selectedLocation.billing_OIC_HourlyRate.toLocaleString()}
                              </p>
                            </div>
                            <div className="rounded border border-green-100 bg-green-50 p-2">
                              <p className="text-xs font-medium text-green-600">JSO</p>
                              <p className="text-lg font-bold text-green-800">
                                {selectedLocation.billing_JSO_HourlyRate.toLocaleString()}
                              </p>
                            </div>
                            <div className="rounded border border-purple-100 bg-purple-50 p-2">
                              <p className="text-xs font-medium text-purple-600">CSO</p>
                              <p className="text-lg font-bold text-purple-800">
                                {selectedLocation.billing_CSO_HourlyRate.toLocaleString()}
                              </p>
                            </div>
                            <div className="rounded border border-amber-100 bg-amber-50 p-2">
                              <p className="text-xs font-medium text-amber-600">LSO</p>
                              <p className="text-lg font-bold text-amber-800">
                                {selectedLocation.billing_LSO_HourlyRate.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                  
                        <div>
                          <h4 className="text-xs font-medium tracking-wider text-gray-500 uppercase mb-2">Paying Rates (LKR/hr)</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded border border-blue-100 bg-blue-50 p-2">
                              <p className="text-xs font-medium text-blue-600">OIC</p>
                              <p className="text-lg font-bold text-blue-800">
                                {selectedLocation.paying_OIC_HourlyRate.toLocaleString()}
                              </p>
                            </div>
                            <div className="rounded border border-green-100 bg-green-50 p-2">
                              <p className="text-xs font-medium text-green-600">JSO</p>
                              <p className="text-lg font-bold text-green-800">
                                {selectedLocation.paying_JSO_HourlyRate.toLocaleString()}
                              </p>
                            </div>
                            <div className="rounded border border-purple-100 bg-purple-50 p-2">
                              <p className="text-xs font-medium text-purple-600">CSO</p>
                              <p className="text-lg font-bold text-purple-800">
                                {selectedLocation.paying_CSO_HourlyRate.toLocaleString()}
                              </p>
                            </div>
                            <div className="rounded border border-amber-100 bg-amber-50 p-2">
                              <p className="text-xs font-medium text-amber-600">LSO</p>
                              <p className="text-lg font-bold text-amber-800">
                                {selectedLocation.paying_LSO_HourlyRate.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
           </div>

           <div>
                {selectedSecurity && (
                    <div className="max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                        <div className="border-b border-gray-200 bg-blue-50 px-4 py-3">
                            <h3 className="text-lg font-semibold text-green-800 mb-2" id="location-name">
                                SELECTED SECURITY
                            </h3>
                            <h4 className="text-md font-semibold text-gray-800" id="location-name">
                                
                                <Image
                                    src={`/storage/${selectedSecurity.securityPhoto}`}
                                    alt="Security Photo"
                                    width={50}
                                    height={50}
                                    className="rounded-full object-cover"
                                    preview={false}
                                />
                            </h4>
                            <p className="text-sm text-blue-600" id="location-type">
                                {selectedSecurity.securityId}
                            </p>
                        </div>

                        <div className="p-4">
                            <div className="mb-4">
                                <h4 className="text-xs font-medium tracking-wider text-gray-500 uppercase">Address</h4>
                                <p className="mt-1 whitespace-pre-line text-gray-700" id="location-address">
                                {selectedSecurity.securityName}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
           </div>

           </div>

            <Steps current={current} items={items} />
            <div style={contentStyle}>{steps[current].content}</div>
            <div style={{ marginTop: 24 }}>
                {current < steps.length - 1 && (
                    <Button disabled={selectedLocation === null} type="primary" onClick={() => next()}>
                        Next
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button disabled={selectedSecurity === null}  type="primary" onClick={() => message.success('Processing complete!')}>
                        Done
                    </Button>
                )}
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        Previous
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AsignSecuirty;
