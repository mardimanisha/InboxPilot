
import AppLayout from '@/components/layout/AppLayout'
import TaskContent from '@/components/tasks/TaskContent'
import React from 'react'

export default function page() {
    return (
        <AppLayout title='Tasks' badge='✅ Task Manager'>
            <TaskContent />
        </AppLayout>
    )
}
