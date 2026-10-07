import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const EmployeeFetchApi = async () => {
  const apiResponse = await axios.get(`${API_URL}/employees/`);
  return apiResponse.data;
};