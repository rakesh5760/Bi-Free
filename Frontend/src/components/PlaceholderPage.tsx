import { Hammer } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({ title, description = "This module is currently under construction." }: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center h-[60vh]"
    >
      <Card className="max-w-md w-full bg-card/50 backdrop-blur-sm border-border/50 text-center p-8 shadow-sm">
        <CardContent className="pt-6 pb-6 space-y-6">
          <div className="mx-auto h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center relative shadow-inner">
            <Hammer className="h-8 w-8 text-muted-foreground animate-pulse" />
            <div className="absolute inset-0 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description} We are actively building this feature to provide a premium SaaS experience.
            </p>
          </div>

          <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
