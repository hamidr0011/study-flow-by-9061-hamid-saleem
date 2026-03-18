'use client'
import React from 'react'
import { useTasks } from '@/lib/hooks/useTasks'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProgressBar } from '@/components/ui/Skeleton'
import { CheckCircleIcon, ClockIcon, FlameIcon, CheckIcon } from 'lucide-react'

export default function ProgressPage() {
  const { tasks, loading } = useTasks()

  const total = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const pending = total - completed
  
  const today = new Date().toISOString().split('T')[0]
  const overdue = tasks.filter(t => !t.completed && t.due_date && t.due_date < today).length
  const dueToday = tasks.filter(t => !t.completed && t.due_date === today).length
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-1">Your Progress</h1>
        <p className="text-text-2 mt-1">See how you&apos;re doing over time.</p>
      </div>

      {total === 0 ? (
        <div className="p-8 text-center border border-dashed border-border rounded-xl bg-bg-surface">
          <p className="text-text-2">Complete tasks to see your progress here.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center gap-8 bg-bg-surface border border-border rounded-2xl p-8 shadow-sm">
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" className="stroke-bg-sunken" strokeWidth="12" fill="none" />
                <circle 
                  cx="80" cy="80" r="70" 
                  className="stroke-accent transition-all duration-1000 ease-out" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - completionRate / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-text-1">{completionRate}%</span>
                <span className="text-xs font-bold uppercase tracking-wider text-text-3">Done</span>
              </div>
            </div>
            
            <div className="flex-1 w-full flex flex-col gap-4">
              <h2 className="text-xl font-bold text-text-1">Great work!</h2>
              <p className="text-text-2">You have completed {completed} out of {total} total tasks. Keep it up!</p>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-sm font-medium text-text-1">Completed ({completed})</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-bg-sunken border border-border" />
                  <span className="text-sm font-medium text-text-1">Pending ({pending})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col">
              <div className="w-10 h-10 rounded-full bg-success-light text-success flex items-center justify-center mb-4">
                <CheckIcon size={20} />
              </div>
              <h3 className="text-3xl font-black text-text-1 mb-1">{completed}</h3>
              <p className="text-sm font-medium text-text-3 uppercase tracking-wider">Completed Tasks</p>
            </div>
            
            <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col">
              <div className="w-10 h-10 rounded-full bg-warning-light text-warning flex items-center justify-center mb-4">
                <ClockIcon size={20} />
              </div>
              <h3 className="text-3xl font-black text-text-1 mb-1">{dueToday}</h3>
              <p className="text-sm font-medium text-text-3 uppercase tracking-wider">Due Today</p>
            </div>
            
            <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col">
              <div className="w-10 h-10 rounded-full bg-danger-light text-danger flex items-center justify-center mb-4">
                <FlameIcon size={20} />
              </div>
              <h3 className="text-3xl font-black text-danger mb-1">{overdue}</h3>
              <p className="text-sm font-medium text-text-3 uppercase tracking-wider">Overdue</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
