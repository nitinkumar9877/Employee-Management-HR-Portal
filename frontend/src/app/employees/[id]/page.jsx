import Search from '@/components/services/search'
import { Suspense } from 'react'
 
export default function Page() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Loading search…</p>}>
        <Search />
      </Suspense>
    </main>
  )
}