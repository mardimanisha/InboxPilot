
import AppLayout from '@/components/layout/AppLayout'
import SettingsContent from '@/components/settings/SettingsContent'
import { headerConfigs } from '@/data/header'
import React from 'react'

export default function page() {
    return (
        <AppLayout headerConfig={headerConfigs.settings}>
            <SettingsContent />
        </AppLayout>
    )
}