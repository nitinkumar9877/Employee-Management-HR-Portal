"use client";
import { DepartmentList, DesignationList, EmployeeFetchApi, StatusList } from '@/components/services/EmployeeApi';
import styles from "../styleSheets/employeePage.module.css";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function EmployeeList({ searchByName }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrderByName, setSortOrderByName] = useState(false);
  const [sortOrderByDesignation, setSortOrderByDesignation] = useState(false);
  const [sortOrderByDepartment, setSortOrderByDepartment] = useState(false);
  const [sortOrderByStatus, setSortOrderByStatus] = useState(false);
  const [designationList, setdesignationList] = useState([]);
  const [departmentList, setdepartmentList] = useState([]);
  const [statusList, setstatusList] = useState([]);
  const [desgination, setdesgination] = useState();
  const [department, setdepartment] = useState();
  const [status, setstatus] = useState();
  const router = useRouter();

  useEffect(() => {
    const designationListCheck = async () => {
      try {
        const response = await DesignationList();
        setdesignationList(response);
      } catch (err) {
        console.log("DesignantionList is not fetching");
      }
    }
    designationListCheck();
  }, [])

  useEffect(() => {
    const departmentListCheck = async () => {
      try {
        const response = await DepartmentList();
        setdepartmentList(response);
      } catch (err) {
        console.log("department is not fetching");
      }
    }
    departmentListCheck();
  }, [])

  useEffect(() => {
    const statusListCheck = async () => {
      try {
        const response = await StatusList();
        setstatusList(response);
      } catch (err) {
        console.log("status is not fetching");
      }
    }
    statusListCheck();
  }, [])

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchByName) {
      params.set('firstName', searchByName);
    }
    console.log("params value", params.firstName);
    if (desgination) {
      params.set("designation", desgination);
    }
    if (department) {
      params.set("department", department);
    }
    if (status) {
      params.set('status', status);
    }
    const queryString = params.toString();
    console.log("params value query", queryString);

    router.push(`/employees?${queryString}`);
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}employees?${queryString}`;
    console.log("this is the api url : ", apiUrl);

    const fetchDataFromEmployeeFetchApi = async () => {
      try {
        const response = await EmployeeFetchApi(apiUrl);
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDataFromEmployeeFetchApi();

  }, [searchByName, status, department, desgination])

  // useEffect(()=>{


  // },[toggalDesignation, toggalDepartment, toggalstatus])

  const nameClick = () => {
    console.log('Name clicked');
    employees.sort((a, b) => {
      const nameA = a.firstName.toUpperCase();
      const nameB = b.firstName.toUpperCase();
      if (sortOrderByName) {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      } else {
        return nameA < nameB ? 1 : nameA > nameB ? -1 : 0;
      }
    });
    setEmployees([...employees]);
    setSortOrderByName(!sortOrderByName);
  }

  const designationClick = () => {
    console.log('Designation clicked');
    employees.sort((a, b) => {
      const designationA = a.designation.toUpperCase();
      const designationB = b.designation.toUpperCase();
      if (sortOrderByDesignation) {
        return designationA < designationB ? -1 : designationA > designationB ? 1 : 0;
      } else {
        return designationA < designationB ? 1 : designationA > designationB ? -1 : 0;
      }
    });
    setEmployees([...employees]);
    setSortOrderByDesignation(!sortOrderByDesignation);
  }

  const departmentClick = () => {
    console.log('Department clicked');
    employees.sort((a, b) => {
      const departmentA = a.department.toUpperCase();
      const departmentB = b.department.toUpperCase();
      if (sortOrderByDepartment) {
        return departmentA < departmentB ? -1 : departmentA > departmentB ? 1 : 0;
      } else {
        return departmentA < departmentB ? 1 : departmentA > departmentB ? -1 : 0;
      }
    });
    setEmployees([...employees]);
    setSortOrderByDepartment(!sortOrderByDepartment);
  }

  const statusClick = () => {
    console.log('Status clicked');
    employees.sort((a, b) => {
      const statusA = a.status.toUpperCase();
      const statusB = b.status.toUpperCase();
      if (sortOrderByStatus) {
        return statusA < statusB ? -1 : statusA > statusB ? 1 : 0;
      } else {
        return statusA < statusB ? 1 : statusA > statusB ? -1 : 0;
      }
    });
    setEmployees([...employees]);
    setSortOrderByStatus(!sortOrderByStatus);
  }

  const selectDesination = (desi) => {
    const data = desi;
    setdesgination(data);
    console.log("selected desgination: ", desgination)
    setdepartment(undefined);
    setstatus(undefined);
  }

  const selectDepartment = (depart) => {
    const data = depart;
    setdepartment(data);
    console.log("selected department: ", department);
    setdesgination(undefined);
    setstatus(undefined);
  }

  const selectStatus = (stat) => {
    const data = stat;
    setstatus(data);
    console.log("selected status : ", status)
    setdesgination(undefined);
    setdepartment(undefined);
  }


  const [toggalDesignation, settoggalDesignation] = useState(false);
  const [toggalDepartment, settoggalDepartment] = useState(false);
  const [toggalstatus, settoggalstatus] = useState(false);

  if (loading) {
    return <p>Loading employees...</p>;
  }

  return (
    <>
      <table className={styles.tableDiv}>
        <thead className={styles.employeeTableHeader}>
          <tr>
            <th className={styles.employeeTableCellHead} >Image</th>
            <th> <button className={`${styles.employeeTableCellHead} ${styles.employeeTableSortButton}`} onClick={() => {nameClick();
              settoggalDesignation(false);
              settoggalDepartment(false);
              settoggalstatus(false);
            }}>Name</button></th>
            
            <th className={styles.positionClass} onClick={() => {
              settoggalDesignation(!toggalDesignation);
              settoggalDepartment(false);
              settoggalstatus(false);
            }}>
              <button className={`${styles.employeeTableCellHead} ${styles.employeeTableSortButton}`} onClick={() => designationClick()}>Designation</button>
              {toggalDesignation && (<div className={styles.designationListDropDown}>
                <ul>
                  {designationList.map((obj, index) => (
                    <li key={index} className={styles.listItem} onClick={() => selectDesination(obj)} >{obj}</li>
                  ))}
                </ul>
              </div>
              )}
            </th>

            <th className={styles.positionClass} onClick={() => {
              settoggalDesignation(false);
              settoggalDepartment(!toggalDepartment);
              settoggalstatus(false);
            }}>
              <button className={`${styles.employeeTableCellHead} ${styles.employeeTableSortButton}`} onClick={() => departmentClick()}>Department</button>
              {toggalDepartment && (<div className={styles.designationListDropDown}>
                <ul>
                  {departmentList.map((obj, index) => (
                    <li key={index} className={styles.listItem} onClick={() => selectDepartment(obj)} >{obj}</li>
                  ))}
                </ul>
              </div>
              )}
            </th>

            <th className={styles.positionClass} onClick={() => {
              settoggalDesignation(false);
              settoggalDepartment(false);
              settoggalstatus(!toggalstatus);
            }}>

              <button className={`${styles.employeeTableCellHead} ${styles.employeeTableSortButton}`} onClick={() => statusClick()}>Status</button>
              {toggalstatus && (<div className={styles.designationListDropDown}>
                <ul>
                  {statusList.map((obj, index) => (
                    <li key={index} className={styles.listItem} onClick={() => selectStatus(obj)} >{obj}</li>
                  ))}
                </ul>
              </div>
              )}
            </th>
          </tr>
        </thead>
        <tbody className={styles.employeeTableBody}>
          {employees.map((employee) => (
            <tr key={employee._id} className={styles.employeeTableRow}>
              <td className={styles.employeeTableCell}><Link href={`/employees/${employee._id}`}><img className={styles.employeeImage} src={employee.thumbnail} alt={employee.firstName} /></Link></td>
              <td className={styles.employeeTableCell}>{employee.firstName} {employee.lastName}</td>
              <td className={styles.employeeTableCell}>{employee.designation}</td>
              <td className={styles.employeeTableCell}>{employee.department}</td>
              <td className={`${styles.lastCell} ${styles.employeeTableCell}`}>{employee.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}