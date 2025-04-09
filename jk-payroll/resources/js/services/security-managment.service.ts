import axios from 'axios';

export const getBankDetails = (id: string)=>{
    return axios.get(`/api/bank-details/${id}`);
}