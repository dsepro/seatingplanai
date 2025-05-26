"use client";
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Wand2, Sparkles } from 'lucide-react'; // Using Wand2 for AI/Magic
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AiSuggestionsPanelProps {
  aiCriteria: string;
  setAiCriteria: (value: string) => void;
  aiReasoning: string;
  isAiSuggestionLoading: boolean;
  handleGetAiSuggestion: () => void;
  T: any;
}

export const AiSuggestionsPanel: React.FC<AiSuggestionsPanelProps> = ({
  aiCriteria,
  setAiCriteria,
  aiReasoning,
  isAiSuggestionLoading,
  handleGetAiSuggestion,
  T,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center">
        <Wand2 size={20} className="mr-2 text-primary" /> {T.aiSuggestionsTab}
      </h3>
      <div>
        <Label htmlFor="aiCriteria">{T.aiCriteriaLabel}</Label>
        <Textarea
          id="aiCriteria"
          value={aiCriteria}
          onChange={(e) => setAiCriteria(e.target.value)}
          placeholder={T.aiCriteriaPlaceholder}
          className="min-h-[80px]"
          aria-label={T.aiCriteriaLabel}
        />
      </div>
      <Button onClick={handleGetAiSuggestion} disabled={isAiSuggestionLoading} className="w-full">
        {isAiSuggestionLoading ? (
          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        {isAiSuggestionLoading ? T.aiSuggestionInProgress : T.getAiSuggestionButton}
      </Button>
      {aiReasoning && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertTitle>{T.aiReasoningTitle}</AlertTitle>
          <AlertDescription className="text-sm whitespace-pre-wrap">
            {aiReasoning}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
