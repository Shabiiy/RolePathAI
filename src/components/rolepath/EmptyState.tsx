import { Card, CardContent } from '@/components/ui/card'
import { Rocket } from 'lucide-react'

export default function EmptyState() {
  return (
    <Card className="text-center shadow-sm border-dashed">
      <CardContent className="p-12">
        <div className="mx-auto w-fit bg-primary/10 text-primary p-4 rounded-full mb-6 animate-pulse">
            <Rocket className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-headline font-bold">
          Ready to Launch Your Career?
        </h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Fill out the form above to generate your personalized learning roadmap. Your journey to a new role starts now!
        </p>
      </CardContent>
    </Card>
  )
}
