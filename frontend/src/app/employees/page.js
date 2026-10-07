import EmployeeList from "@/components/services/EmployeeList";
import styles from "../../components/styleSheets/employeePage.module.css"
import { Suspense } from 'react';

export default function EmployeesPage() {
  return (
    <section className={styles.employeePage}>
      <h1 className={styles.employeeHeading1}>Employees</h1>
      <Suspense fallback={<p>Loading employees...</p>}>
        <EmployeeList />
      </Suspense>
    </section>
  );
}