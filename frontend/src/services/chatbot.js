import { GoogleGenAI } from '@google/genai'

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null
const websiteInstructions = `You are the help assistant for OneCampus, a campus community website.

Only answer questions about using OneCampus and its features: signing up and logging in, profiles, campus navigation, marketplace listings and selling items, lost-and-found reports, events and registration, direct messaging, notifications, image uploads, and contacting support.

Rules:
- Give clear, concise step-by-step guidance based only on these website features.
- If the question is unrelated to OneCampus, campus website usage, or one of the supported features, reply exactly: "I can only help with OneCampus website features and usage."
- Do not answer general knowledge, coding, medical, legal, financial, political, or personal advice questions.
- Do not invent policies, account data, listings, event details, or actions that are not described by the user.
- If you do not know how to handle a OneCampus question, say that you do not have enough information and direct the user to Contact Support.`

export const chatbotApi = {
  send: async (message) => {
    if (!ai) {
      throw new Error('Google AI is not configured. Set VITE_GOOGLE_API_KEY in the frontend environment.')
    }

    const interaction = await ai.interactions.create({
      model: 'gemini-3.6-flash',
      input: `${websiteInstructions}\n\nUser question:\n${message}`,
    })

    return { reply: interaction.output_text }
  },
}