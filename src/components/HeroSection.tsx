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
  const [isSubmittingIdea, setIsSubmittingIdea] = useState(false);
  const [showIdeaDialog, setShowIdeaDialog] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Client-side email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the secure function instead of direct insert
      const { data, error } = await supabase
        .rpc('secure_insert_email', {
          email_address: email,
          idea_text: null
        });
      
      if (error) {
        throw error;
      }
      
      if (data && data.error) {
        if (data.error === 'Rate limit exceeded') {
          toast({
            title: "Too many attempts",
            description: "Please wait a bit before trying again.",
            variant: "destructive",
          });
        } else if (data.error === 'Invalid input data') {
          toast({
            title: "Invalid input",
            description: "Please check your email format.",
            variant: "destructive",
          });
        } else {
          throw new Error(data.error);
        }
      } else {
        setSubmittedEmail(email); // Store the submitted email for idea update
        setShowIdeaDialog(true);
      }
    } catch (error: unknown) {
      console.error('Error saving email:', error);
      
      // Check for specific error codes
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') { // Unique constraint violation
        toast({
          title: "Already on the list!",
          description: "This email is already registered. We'll keep sending you proof!",
        });
        setEmail(""); // Clear input on duplicate
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIdeaSubmit = async () => {
    if (!submittedEmail) {
      console.error('No submitted email found');
      return;
    }

    // Client-side validation for idea length
    if (idea.length > 1000) {
      toast({
        title: "Idea too long",
        description: "Please keep your idea under 1000 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingIdea(true);
    
    try {
      // Use the secure function to update with idea
      const { data, error } = await supabase
        .rpc('secure_insert_email', {
          email_address: submittedEmail,
          idea_text: idea
        });
      
      if (error) {
        throw error;
      }
      
      if (data && data.error) {
        toast({
          title: "Couldn't save your idea",
          description: "Your email was saved, but we couldn't save your idea. We'll still send you proof!",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Thanks for sharing!",
          description: "We'll send you proof that your bold idea is possible.",
        });
      }
    } catch (error) {
      console.error('Error saving idea:', error);
      toast({
        title: "Couldn't save your idea",
        description: "Your email was saved, but we couldn't save your idea. We'll still send you proof!",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingIdea(false);
      setShowIdeaDialog(false);
      setEmail("");
      setIdea("");
      setSubmittedEmail("");
    }
  };

  const handleSkipIdea = () => {
    setShowIdeaDialog(false);
    setEmail("");
    setIdea("");
    setSubmittedEmail("");
    toast({
      title: "You're on the list",
      description: "We'll send you proof that your bold idea is possible.",
    });
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
      setSubmittedEmail("");
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
              <Button onClick={handleIdeaSubmit} className="flex-1" disabled={isSubmittingIdea}>
                {isSubmittingIdea ? "..." : "Share & Join"}
              </Button>
              <Button onClick={handleSkipIdea} variant="outline" className="flex-1" disabled={isSubmittingIdea}>
                Skip for now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};