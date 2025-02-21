import { Secret, object, func } from "@dagger.io/dagger";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { Pica as PicaAI } from "@picahq/ai";

@object()
export class Pica {
  picaApiKey: Secret;
  openaiApiKey: Secret;

  constructor(picaApiKey: Secret, openaiApiKey: Secret) {
    this.picaApiKey = picaApiKey;
    this.openaiApiKey = openaiApiKey;
  }

  /**
   * Returns a response from the LLM as a string
   */
  @func()
  async oneTool(prompt: string): Promise<string> {
    const plaintextPicaApiKey = await this.picaApiKey.plaintext();
    const plaintextOpenaiApiKey = await this.openaiApiKey.plaintext();
    const pica = new PicaAI(plaintextPicaApiKey);
    const systemPrompt = await pica.generateSystemPrompt();
    const openai = createOpenAI({ apiKey: plaintextOpenaiApiKey });

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: prompt,
      tools: { ...pica.oneTool },
      maxSteps: 10,
    });

    return text;
  }
}
