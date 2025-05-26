// use server'
'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting optimal seating arrangements
 * based on student performance, behavior, and other criteria.
 *
 * @exports suggestSeatingArrangements - A function that triggers the seating arrangement suggestion flow.
 * @exports SuggestSeatingArrangementsInput - The input type for the suggestSeatingArrangements function.
 * @exports SuggestSeatingArrangementsOutput - The output type for the suggestSeatingArrangements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentSchema = z.object({
  id: z.string(),
  englishName: z.string().optional(),
  nickname: z.string().optional(),
  chineseName: z.string().optional(),
  rollNo: z.string().optional(),
  studentClass: z.string().optional(),
  role: z.string().optional(),
  performance: z.string().optional().describe('Student performance level (e.g., high, medium, low).'),
  behavior: z.string().optional().describe('Student behavior description (e.g., disruptive, quiet, leader).'),
});

const SuggestSeatingArrangementsInputSchema = z.object({
  students: z.array(StudentSchema).describe('List of students with their attributes.'),
  criteria: z.string().describe('The desired seating arrangement criteria (e.g., mix high and low performers, separate disruptive students).'),
  rows: z.number().describe('Number of rows in the classroom.'),
  cols: z.number().describe('Number of columns in the classroom.'),
});
export type SuggestSeatingArrangementsInput = z.infer<typeof SuggestSeatingArrangementsInputSchema>;

const SuggestSeatingArrangementsOutputSchema = z.object({
  arrangement: z.array(z.array(z.string().nullable())).describe('2D array representing the suggested seating arrangement, with student IDs.'),
  reasoning: z.string().describe('Explanation of why the arrangement was selected.'),
});
export type SuggestSeatingArrangementsOutput = z.infer<typeof SuggestSeatingArrangementsOutputSchema>;

export async function suggestSeatingArrangements(input: SuggestSeatingArrangementsInput): Promise<SuggestSeatingArrangementsOutput> {
  return suggestSeatingArrangementsFlow(input);
}

const summarizeCriteriaTool = ai.defineTool(
  {
    name: 'summarizeCriteria',
    description: 'Analyzes and summarizes the provided seating criteria to determine key factors for the arrangement.',
    inputSchema: z.object({
      criteria: z.string().describe('The seating arrangement criteria provided by the user.'),
    }),
    outputSchema: z.string().describe('A concise summary of the criteria, highlighting key considerations.'),
  },
  async input => {
    // Basic implementation for summarization (can be enhanced with more sophisticated logic)
    return `Summary of criteria: ${input.criteria}`;
  }
);

const suggestSeatingArrangementsPrompt = ai.definePrompt({
  name: 'suggestSeatingArrangementsPrompt',
  input: {schema: SuggestSeatingArrangementsInputSchema},
  output: {schema: SuggestSeatingArrangementsOutputSchema},
  tools: [summarizeCriteriaTool],
  prompt: `You are an AI assistant designed to suggest classroom seating arrangements based on
  student data and specific criteria. You will receive a list of students with their attributes,
  including performance and behavior, and a set of criteria to optimize the seating arrangement.

  First, use the summarizeCriteria tool to summarize the criteria.

  Based on the student data and the summarized criteria, generate a seating arrangement that optimizes for the given criteria.
  The classroom has {{rows}} rows and {{cols}} columns. The seating arrangement should be represented as a 2D array
  where each element is the student ID or null if the seat is empty.

  Explain your reasoning for the arrangement in the reasoning field. Consider student performance, behavior,
  and any other relevant factors.

  Students data:
  {{#each students}}
  - {{englishName}} ({{chineseName}}), Roll No: {{rollNo}}, Performance: {{performance}}, Behavior: {{behavior}}
  {{/each}}

  Criteria: {{criteria}}

  Output the arrangement as a 2D array of student IDs and your reasoning for the arrangement.
  `,
});

const suggestSeatingArrangementsFlow = ai.defineFlow(
  {
    name: 'suggestSeatingArrangementsFlow',
    inputSchema: SuggestSeatingArrangementsInputSchema,
    outputSchema: SuggestSeatingArrangementsOutputSchema,
  },
  async input => {
    const {output} = await suggestSeatingArrangementsPrompt(input);
    return output!;
  }
);
