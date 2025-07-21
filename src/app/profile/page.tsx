'use client';
import AppLayout from '@/components/layout/AppLayout'
import ProfileContent from '@/components/profile/ProfileContent'
import { headerConfigs } from '@/data/header'
import React from 'react'

export default function page() {
    return (
        <AppLayout headerConfig={headerConfigs.profile}>
            <ProfileContent />
        </AppLayout>
    )
}