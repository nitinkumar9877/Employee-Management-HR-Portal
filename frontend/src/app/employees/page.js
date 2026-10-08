"use client"
import EmployeeList from "@/components/services/EmployeeList";
import styles from "../../components/styleSheets/employeePage.module.css"
import { useState } from "react";

export default function EmployeesPage() {
  const [searchData, setsearchData] = useState("");
  const searchInputData = (event)=>{
    const data =  event.target.value
    console.log("user type for search : ", data);
    setsearchData(data);

  }
  return (
    <section className={styles.employeePage}>
      <div className={styles.headingSeachParent}>
        <h1 className={styles.employeeHeading1}>All Employee List</h1>
        <input className={styles.inputBox} type="text" placeholder="Search by employee name" onChange={searchInputData} />
      </div>
      <EmployeeList searchByName= {searchData}/>
    </section>
  );
}