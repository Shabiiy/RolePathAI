'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Combobox } from '@/components/ui/combobox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, Sparkles, Goal, Users, Scale, CheckCircle } from 'lucide-react';
import type { RoadmapData } from '@/types';
import { compareJobRolesAction } from '@/app/actions';
import { ROLES } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface CompareRolesTabProps {
  roadmapData: RoadmapData;
}

const compareRolesSchema = z.object({
  roleOne: z.string().min(1, 'Please select the first role.'),
  roleTwo: z.string().min(1, 'Please select the second role.'),
}).refine(data => data.roleOne !== data.roleTwo, {
  message: "Please select two different roles to compare.",
  path: ["roleTwo"],
});
type CompareRolesFormValues = z.infer<typeof compareRolesSchema>;

export default function CompareRolesTab({ roadmapData }: CompareRolesTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [comparison, setComparison] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CompareRolesFormValues>({
    resolver: zodResolver(compareRolesSchema),
    defaultValues: { roleOne: roadmapData?.inputs?.targetJobRole || '', roleTwo: '' },
  });

  const handleCompareRoles = async (values: CompareRolesFormValues) => {
    setIsLoading(true);
    setError(null);
    setComparison(null);
    try {
      const userSkills = roadmapData?.inputs?.currentSkills.split(',').map(s => s.trim()) || [];
      const result = await compareJobRolesAction({ ...values, userSkills });
      if (result.error) throw new Error(result.error);
      setComparison(result.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Scale className="text-primary" />
            AI Role Comparison Tool
          </CardTitle>
          <CardDescription>
            Compare two job roles to understand skill overlap, differences, and which might be a better fit for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCompareRoles)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="roleOne"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role 1</FormLabel>
                      <Combobox
                        options={ROLES.map(r => ({ label: r.title, value: r.title }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select or type a role..."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roleTwo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role 2</FormLabel>
                      <Combobox
                        options={ROLES.map(r => ({ label: r.title, value: r.title }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select or type a role..."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                Compare Roles
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

      {comparison && (
        <Card>
          <CardHeader><CardTitle>Comparison Result: {form.getValues('roleOne')} vs. {form.getValues('roleTwo')}</CardTitle></CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={['overlap', 'diff', 'mindset', 'fit']} className="space-y-4">
              <AccordionItem value="overlap" className="border bg-secondary/30 rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline text-lg"><Users className="mr-2 text-blue-400" />Skill Overlap</AccordionTrigger>
                <AccordionContent className="pt-2">
                  <ul className="list-disc list-inside space-y-1 pl-2 text-muted-foreground">
                    {comparison.skillOverlap.map((skill: string, i: number) => <li key={i}>{skill}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="diff" className="border bg-secondary/30 rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline text-lg"><Goal className="mr-2 text-amber-400" />Key Differences</AccordionTrigger>
                <AccordionContent className="pt-2 space-y-4">
                  {comparison.keyDifferences.map((diff: any, i: number) => (
                    <div key={i}>
                      <h4 className="font-semibold">{diff.role}</h4>
                      <ul className="list-disc list-inside space-y-1 pl-2 text-muted-foreground">
                        {diff.points.map((point: string, p: number) => <li key={p}>{point}</li>)}
                      </ul>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="mindset" className="border bg-secondary/30 rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline text-lg"><Sparkles className="mr-2 text-purple-400" />Required Mindset</AccordionTrigger>
                <AccordionContent className="pt-2 space-y-4">
                  {comparison.requiredMindset.map((item: any, i: number) => (
                    <div key={i}>
                      <h4 className="font-semibold">{item.role}</h4>
                      <p className="text-muted-foreground">{item.mindset}</p>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="fit" className="border bg-secondary/30 rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline text-lg"><CheckCircle className="mr-2 text-green-400" />AI Fit Assessment</AccordionTrigger>
                <AccordionContent className="pt-2">
                  <p className="text-muted-foreground">{comparison.fitAssessment}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
