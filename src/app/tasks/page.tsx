
import AppLayout from '@/components/layout/AppLayout'
import TaskContent from '@/components/tasks/TaskContent'
import { headerConfigs } from '@/data/header'
import React from 'react'

export default function page() {
    return (
        <AppLayout headerConfig={headerConfigs.tasks}>
            <TaskContent />
        </AppLayout>
    )
}