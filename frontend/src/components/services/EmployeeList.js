import { EmployeeFetchApi } from '@/components/services/EmployeeApi';
import styles from "../styleSheets/employeePage.module.css"

export default async function EmployeeList() {
  const response = await EmployeeFetchApi();
  const employees = response.data;

  return (
    <>
      <table className={styles.tableDiv}>
        <thead className={styles.employeeTableHeader}>
          <tr>
            <th className={styles.employeeTableCellHead} >Image</th>
            <th className={styles.employeeTableCellHead} >Name</th>
            <th className={styles.employeeTableCellHead} >Designation</th>
            <th className={styles.employeeTableCellHead} >Department</th>
            <th className={styles.employeeTableCellHead} >Status</th>
          </tr>
        </thead>
        <tbody className={styles.employeeTableBody}>
          {employees.map((employee) => (
            <tr key={employee._id} className={styles.employeeTableRow}>
              <td className={styles.employeeTableCell}><img className={styles.employeeImage} src={employee.thumbnail} alt={employee.firstName} /></td>
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