import axios from 'axios';

export const getBankDetails = (id: string)=>{
    return axios.get(`/api/bank-details/${id}`);
}

export const leaveDetails = (id: string)=> {
    return axios.get(`/api/security-leaves/security/${id}`);
    
}
export const fetchSecurities = ()=> {
    return axios.get('/api/securities'); 
}

export const fetchInventoryTypes = ()=> {
    return axios.get('/api/inventory/types'); 
}

export const saveInventory = (data: any)=> {
    return axios.post('/api/inventory', data); 
}

export const getInventoryitems = ()=>{
    return axios.get('/api/inventory')
}
export const editInventoryitems = (id: any, data: any)=>{
    return axios.put(`/api/inventory/${id}`, data);
}
export const allocateInventory = (data: any)=> {
    return axios.post('/api/inventory/allocate', data); 
}