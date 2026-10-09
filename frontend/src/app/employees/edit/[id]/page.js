import React, { Suspense } from 'react'
import { EditProfileUsingId } from '@/components/services/search'

const EditProfile = () => {
  return (
    <div>
      <Suspense>
        <EditProfileUsingId />
      </Suspense>
    </div>
  )
}

export default EditProfile;