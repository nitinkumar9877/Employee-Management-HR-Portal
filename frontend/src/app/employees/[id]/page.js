import {Search} from '@/components/services/search'
import { Suspense } from 'react'
import styles from "../../../components/styleSheets/userById.module.css"

export default function Page() {
  return (
    <section className={styles.userIdPageSection}>
      <h1 className={styles.headingOfUserIdPage}>Dashboard</h1>
      <Suspense fallback={<p>Loading search…</p>}>
        <Search />
      </Suspense>
    </section>
  )
}