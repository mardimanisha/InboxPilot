
import AppLayout from '@/components/layout/AppLayout'
import SettingsContent from '@/components/settings/SettingsContent'
import React from 'react'

export default function page() {
    return (
        <AppLayout title='Settings' badge='⚙️ Settings'>
            <SettingsContent />
        </AppLayout>
    )
}
