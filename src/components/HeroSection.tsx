import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export const HeroSection = () => {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [idea, setIdea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showIdeaDialog, setShowIdeaDialog] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('emails')
        .insert([{ email }]);
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already on the list!",
            description: "This email is already registered. We'll keep sending you proof!",
          });
          setEmail(""); // Clear input on duplicate
        } else {
          throw error;
        }
      } else {
        setShowIdeaDialog(true);
      }
    } catch (error) {
      console.error('Error saving email:', error);
      toast({
          title: "Something went wrong",
          description: "Please try again later.",
          variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIdeaSubmit = async () => {
    try {
      // Update the email record with the idea
      const { error } = await supabase
        .from('emails')
        .update({ idea })
        .eq('email', email);
      
      if (error) {
        console.error('Error saving idea:', error);
      }
    } catch (error) {
      console.error('Error saving idea:', error);
    }
    
    setShowIdeaDialog(false);
  };

  const handleSkipIdea = () => {
    setShowIdeaDialog(false);
  };

  const onDialogChange = (open: boolean) => {
    if (!open) {
      // When dialog closes for any reason, show toast and clear state
      // This ensures a consistent message and UI reset
      toast({
        title: "You're on the list",
        description: "We'll send you proof that your bold idea is possible.",
      });
      setEmail("");
      setIdea("");
    }
    setShowIdeaDialog(open);
  };

  return (
    <>
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-8 leading-[1.1]">
            Thinking of doing<br />
            <span className="font-normal">something bold?</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-light mb-12 max-w-2xl mx-auto">
            You're not alone — and you're not crazy.<br />
            We'll send you proof everyday from real people who've done it.<br />
            <span className="text-base">Free forever. From one builder to another.</span>
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-12 text-base border-2 focus:ring-0 focus:border-primary"
              />
              <Button 
                type="submit"
                className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Join
              </Button>
            </div>
          </form>

          <p className="text-sm text-muted-foreground">
            Free forever. No spam. Just proof you can do it.
          </p>
        </div>
      </section>

      <Dialog open={showIdeaDialog} onOpenChange={onDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>What are you battling with?</DialogTitle>
            <DialogDescription>
              Tell us about your bold idea or challenge. This helps us send you more relevant proof! (Optional)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="I'm thinking of starting a business, but I'm not sure if I have what it takes..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-3">
              <Button onClick={handleIdeaSubmit} className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "..." : "Share & Join"}
              </Button>
              <Button onClick={handleSkipIdea} variant="outline" className="flex-1" disabled={isSubmitting}>
                Skip for now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};