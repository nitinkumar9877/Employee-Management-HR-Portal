import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const EmployeeFetchApi = async (apiUrl) => {
  const apiResponse = await axios.get(apiUrl);
  return apiResponse.data;
};

export const DesignationList = async () => {
  const response = await axios.get(`${API_URL}employees`);

  const designationList = [
    ...new Set(
      response.data.data.map(employee => employee.designation)
    )
  ];
  console.log("designationList :::: ", designationList)
  return designationList;
};

export const DepartmentList = async ()=>{

  const response = await axios.get(`${API_URL}employees`);
  const departmentList = [
    ...new Set(
      response.data.data.map(employee => employee.department)
    )
  ];
  return departmentList;
}

export const StatusList = async ()=>{
  const response = await axios.get(`${API_URL}employees`);
  const statuslist = [
    ...new Set(
      response.data.data.map(employee => employee.status)
    )
  ];
  return statuslist;
}

// export const dataFindById = async () =>{
  // const response = await axios.get()
// }