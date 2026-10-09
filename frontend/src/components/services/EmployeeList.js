"use client";
import { DepartmentList, DesignationList, EmployeeFetchApi, StatusList } from '@/components/services/EmployeeApi';
import styles from "../styleSheets/employeePage.module.css";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { FaArrowsAltV } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoIosArrowUp } from "react-icons/io";
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

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
  const [desgination, setdesgination] = useState([]);
  const [department, setdepartment] = useState([]);
  const [status, setstatus] = useState([]);
  const router = useRouter();
  const [chipsList, setchipsList] = useState([]);
  const [toggalDesignation, settoggalDesignation] = useState(false);
  const [toggalDepartment, settoggalDepartment] = useState(false);
  const [toggalstatus, settoggalstatus] = useState(false);

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

    desgination.forEach(value => params.append("designation", value));
    department.forEach(value => params.append("department", value));
    status.forEach(value => params.append("status", value));

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
    // Convert query parameters into an array of objects
    const chips = [...params.entries()].map(([key, value]) => ({
      id: crypto.randomUUID(),
      key,
      value
    }));

    setchipsList(chips);

    console.log('Chips list:', chips);

  }, [searchByName, status, department, desgination])

  const ChipsRemove = (id) => {
    const removedChip = chipsList.find((item) => item.id === id);

    if (!removedChip) return;

    setchipsList((prev) =>
      prev.filter((item) => item.id !== id)
    );
    const removeItemDesignation = desgination.filter(item => item !== removedChip.value)
    const removeItemDepartment = department.filter(item => item !== removedChip.value)
    const removeItemStatus = status.filter(item => item !== removedChip.value)
    setdesgination(removeItemDesignation);
    setdepartment(removeItemDepartment);
    setstatus(removeItemStatus);
  }

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

  // const designationClick = () => {
  //   console.log('Designation clicked');
  //   employees.sort((a, b) => {
  //     const designationA = a.designation.toUpperCase();
  //     const designationB = b.designation.toUpperCase();
  //     if (sortOrderByDesignation) {
  //       return designationA < designationB ? -1 : designationA > designationB ? 1 : 0;
  //     } else {
  //       return designationA < designationB ? 1 : designationA > designationB ? -1 : 0;
  //     }
  //   });
  //   setEmployees([...employees]);
  //   setSortOrderByDesignation(!sortOrderByDesignation);
  // }

  // const departmentClick = () => {
  //   console.log('Department clicked');
  //   employees.sort((a, b) => {
  //     const departmentA = a.department.toUpperCase();
  //     const departmentB = b.department.toUpperCase();
  //     if (sortOrderByDepartment) {
  //       return departmentA < departmentB ? -1 : departmentA > departmentB ? 1 : 0;
  //     } else {
  //       return departmentA < departmentB ? 1 : departmentA > departmentB ? -1 : 0;
  //     }
  //   });
  //   setEmployees([...employees]);
  //   setSortOrderByDepartment(!sortOrderByDepartment);
  // }

  // const statusClick = () => {
  //   console.log('Status clicked');
  //   employees.sort((a, b) => {
  //     const statusA = a.status.toUpperCase();
  //     const statusB = b.status.toUpperCase();
  //     if (sortOrderByStatus) {
  //       return statusA < statusB ? -1 : statusA > statusB ? 1 : 0;
  //     } else {
  //       return statusA < statusB ? 1 : statusA > statusB ? -1 : 0;
  //     }
  //   });
  //   setEmployees([...employees]);
  //   setSortOrderByStatus(!sortOrderByStatus);
  // }

  const selectDesination = (desi) => {
    setdesgination(previous => previous.includes(desi) ? previous.filter(item => item !== desi) : [...previous, desi]);
    console.log("selected desgination: ", desgination)
  }

  const selectDepartment = (depart) => {
    setdepartment(previous => previous.includes(depart) ? previous.filter(item => item !== depart) : [...previous, depart]);
    console.log("selected department: ", department);
  }

  const selectStatus = (stat) => {
    setstatus(previous => previous.includes(stat) ? previous.filter(item => item !== stat) : [...previous, stat]);
    console.log("selected status : ", status)
  }

  if (loading) {
    return <p>Loading employees...</p>;
  }

  return (
    <>
      <table className={styles.tableDiv}>
        <thead className={styles.employeeTableHeader}>
          <tr className={styles.tableHeadName}>
            <th className={styles.employeeTableCellHead} >Image</th>
            <th> <button className={`${styles.employeeTableCellHead} ${styles.employeeTableSortButton}`} onClick={() => {
              nameClick();
              settoggalDesignation(false);
              settoggalDepartment(false);
              settoggalstatus(false);
            }}>Name
              <FaArrowsAltV className={styles.arrowIcon} />
            </button></th>

            <th className={styles.positionClass} onClick={() => {
              settoggalDesignation(!toggalDesignation);
              settoggalDepartment(false);
              settoggalstatus(false);
            }}>
              <button className={`${styles.employeeTableCellHead} ${styles.employeeTableSortButton}`} >Designation {toggalDesignation ? <TiArrowSortedUp className={styles.DropdownIcon} /> : <TiArrowSortedDown className={styles.DropdownIcon} />} </button>
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
              <button className={`${styles.employeeTableCellHead} ${styles.employeeTableSortButton}`}>Department
                {toggalDepartment ? <TiArrowSortedUp className={styles.DropdownIcon} /> : <TiArrowSortedDown className={styles.DropdownIcon} />}

              </button>
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

              <button className={`${styles.employeeTableCellHead} ${styles.employeeTableSortButton}`} >Status
                {toggalstatus ? <TiArrowSortedUp className={styles.DropdownIcon} /> : <TiArrowSortedDown className={styles.DropdownIcon} />}

              </button>
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
          <tr>
            <th>
              <div className={styles.chipsList}>
                {(chipsList.length > 0) ? chipsList.map(item => (<span className={styles.itemChips} onClick={() => ChipsRemove(item.id)} key={item.id}>{item.value} <RxCross2 className={styles.crossIcon} /></span>)) : " "}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className={styles.employeeTableBody}>
          {employees.map((employee) => (
            <tr key={employee._id} className={styles.employeeTableRow}>
              <td className={styles.employeeTableCell}><Link href={`/employees/${employee._id}`}><img className={styles.employeeImage} src={employee.thumbnail} alt={employee.firstName} /></Link></td>
              <td className={`${styles.employeeTableCell} ${styles.secondClass}`}><Link className={styles.nextPageUrl} href={`/employees/${employee._id}`}>{employee.firstName} {employee.lastName} </Link></td>
              <td className={styles.employeeTableCell}>{employee.designation}</td>
              <td className={styles.employeeTableCell}>{employee.department}</td>
              <td className={`${styles.lastCell} ${styles.employeeTableCell}`}>{employee.status} <Link href={`/employees/edit/${employee._id}`} className={styles.editBtn}>Edit</Link> </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

}