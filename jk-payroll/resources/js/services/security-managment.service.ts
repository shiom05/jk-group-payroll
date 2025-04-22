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