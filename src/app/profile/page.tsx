
import AppLayout from '@/components/layout/AppLayout'
import ProfileContent from '@/components/profile/ProfileContent'
import React from 'react'

export default function page() {
    return (
        <AppLayout title='Profile' badge='👤 Profile'>
            <ProfileContent />
        </AppLayout>
    )
}
