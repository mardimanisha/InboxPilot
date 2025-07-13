
import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface FeedbackProps {
  onSubmitFeedback: (feedback: string) => void;
}

const FeedbackSection: React.FC<FeedbackProps> = ({ onSubmitFeedback }) => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmitFeedback(feedback);
      setFeedback("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Feedback</span>
        </CardTitle>
        <CardDescription>Help us improve InboxPilot with your feedback</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Share your thoughts</label>
          <Textarea
            placeholder="Tell us about your experience, feature requests, or any issues you've encountered..."
            className="mt-1"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={!feedback.trim() || isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Feedback"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;