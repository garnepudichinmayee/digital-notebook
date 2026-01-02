'use server';
/**
 * @fileOverview An AI flow to extract key points from a block of text.
 *
 * - highlightPoints - A function that takes text and returns a list of key points.
 * - HighlightPointsInput - The input type for the highlightPoints function.
 * - HighlightPointsOutput - The return type for the highlightPoints function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HighlightPointsInputSchema = z.object({
  text: z.string().describe('The text content to be summarized.'),
});
export type HighlightPointsInput = z.infer<typeof HighlightPointsInputSchema>;

const HighlightPointsOutputSchema = z.object({
  points: z
    .array(z.string())
    .describe('An array of key points or highlights from the text.'),
});
export type HighlightPointsOutput = z.infer<typeof HighlightPointsOutputSchema>;

export async function highlightPoints(
  input: HighlightPointsInput
): Promise<HighlightPointsOutput> {
  return highlightPointsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'highlightPointsPrompt',
  input: {schema: HighlightPointsInputSchema},
  output: {schema: HighlightPointsOutputSchema},
  prompt: `You are a helpful study assistant. Your goal is to extract the most important key points from the provided text.

Analyze the following text and identify the main ideas, key facts, and critical concepts. Return them as a concise list of bullet points.

Text to analyze:
{{{text}}}
`,
});

const highlightPointsFlow = ai.defineFlow(
  {
    name: 'highlightPointsFlow',
    inputSchema: HighlightPointsInputSchema,
    outputSchema: HighlightPointsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
