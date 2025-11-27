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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, Sparkles, BookOpen, ExternalLink, ThumbsUp, DollarSign, Gift } from 'lucide-react';
import type { RoadmapData } from '@/types';
import { generateResourceRecommendationsAction } from '@/app/actions';
import { parseTopics } from '@/lib/parser';

interface RecommendResourcesTabProps {
  roadmapData: RoadmapData;
}

const recommendSchema = z.object({
  topic: z.string().min(1, 'Please select a topic.'),
});
type RecommendFormValues = z.infer<typeof recommendSchema>;

const categoryIcons: { [key: string]: React.ReactNode } = {
  "Best Course": <BookOpen className="text-blue-500" />,
  "Best Book": <BookOpen className="text-orange-500" />,
  "Best Tool/API Documentation": <BookOpen className="text-purple-500" />,
  "Fastest Introduction": <BookOpen className="text-teal-500" />,
  "Budget-Friendly Option": <DollarSign className="text-yellow-500" />,
  "Free Alternative": <Gift className="text-green-500" />,
}

export default function RecommendResourcesTab({ roadmapData }: RecommendResourcesTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const topics = parseTopics(roadmapData?.roadmap || '');

  const form = useForm<RecommendFormValues>({
    resolver: zodResolver(recommendSchema),
    defaultValues: { topic: '' },
  });

  const handleGetRecommendations = async (values: RecommendFormValues) => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    try {
      const result = await generateResourceRecommendationsAction(values);
      if (result.error) throw new Error(result.error);
      setRecommendations(result.data?.recommendations || []);
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
            <ThumbsUp className="text-primary" />
            AI Resource Curator
          </CardTitle>
          <CardDescription>
            Get a curated list of the best learning resources for any topic in your roadmap.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGetRecommendations)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select a Topic</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic from your roadmap..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {topics.map(topic => (
                          <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                Get Recommendations
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

      {recommendations && (
        <Card>
            <CardHeader><CardTitle>Recommendations for: {form.getValues('topic')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {recommendations.map((rec, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-secondary/30">
                        <h3 className="font-semibold flex items-center gap-2">
                           {categoryIcons[rec.category] || <BookOpen />}
                           {rec.category}
                        </h3>
                         <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium my-1 block">
                            {rec.title} <ExternalLink className="inline h-4 w-4 ml-1" />
                        </a>
                        <p className="text-sm text-muted-foreground italic">"{rec.justification}"</p>
                    </div>
                ))}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
