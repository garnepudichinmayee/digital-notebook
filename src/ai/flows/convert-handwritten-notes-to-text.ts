'use server';

/**
 * @fileOverview Converts handwritten notes to digital text.
 *
 * - convertHandwrittenNotesToText - A function that converts handwritten notes to digital text.
 * - ConvertHandwrittenNotesToTextInput - The input type for the convertHandwrittenNotesToText function.
 * - ConvertHandwrittenNotesToTextOutput - The return type for the convertHandwrittenNotesToText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertHandwrittenNotesToTextInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of handwritten notes, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ConvertHandwrittenNotesToTextInput = z.infer<typeof ConvertHandwrittenNotesToTextInputSchema>;

const ConvertHandwrittenNotesToTextOutputSchema = z.object({
  text: z.string().describe('The converted text from the handwritten notes.'),
});
export type ConvertHandwrittenNotesToTextOutput = z.infer<typeof ConvertHandwrittenNotesToTextOutputSchema>;

export async function convertHandwrittenNotesToText(input: ConvertHandwrittenNotesToTextInput): Promise<ConvertHandwrittenNotesToTextOutput> {
  return convertHandwrittenNotesToTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertHandwrittenNotesToTextPrompt',
  input: {schema: ConvertHandwrittenNotesToTextInputSchema},
  output: {schema: ConvertHandwrittenNotesToTextOutputSchema},
  prompt: `You are a highly skilled OCR (Optical Character Recognition) system.

You will receive an image of handwritten notes and your task is to convert the handwriting into digital text.

Here is the image of the handwritten notes: {{media url=photoDataUri}}

Transcribe the text as accurately as possible.`,
});

const convertHandwrittenNotesToTextFlow = ai.defineFlow(
  {
    name: 'convertHandwrittenNotesToTextFlow',
    inputSchema: ConvertHandwrittenNotesToTextInputSchema,
    outputSchema: ConvertHandwrittenNotesToTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
