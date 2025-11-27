'use client'

import type { UseFormReturn } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader, Sparkles } from 'lucide-react'
import type { FormValues } from '@/app/home/page'
import type { Role } from '@/types'
import { Combobox } from '@/components/ui/combobox'

interface MainFormProps {
  form: UseFormReturn<FormValues>
  onSubmit: (values: FormValues) => void
  isLoading: boolean
  roles: Role[]
}

export default function MainForm({
  form,
  onSubmit,
  isLoading,
  roles,
}: MainFormProps) {

  const roleOptions = roles.map(role => ({ label: role.title, value: role.title }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="targetJobRole"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Target Job Role</FormLabel>
               <Combobox
                options={roleOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select or type a custom role..."
              />
              <FormDescription>
                You can select a role from the list or type your own.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <FormField
              control={form.control}
              name="currentSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Skills (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., JavaScript, Python, or None" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter skills, separated by commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-1">
            <FormField
              control={form.control}
              name="weeklyHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weekly Hours Commitment</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-1">
            <FormField
              control={form.control}
              name="desiredWeeks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desired Timeline (Weeks)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit" disabled={isLoading} size="lg" className="w-full md:w-auto">
          {isLoading ? (
            <Loader className="animate-spin" />
          ) : (
            <Sparkles />
          )}
          Generate My Roadmap
        </Button>
      </form>
    </Form>
  )
}
