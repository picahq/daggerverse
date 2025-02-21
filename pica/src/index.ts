/**
 * Use Pica OneTool with Dagger
 *
 * Pica provides powerful APIs and tools to build, deploy, and scale AI agents with seamless access to over 100+ integrations
 */
import { Secret, object, func } from "@dagger.io/dagger";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { Pica as PicaAI } from "@picahq/ai";

@object()
export class Pica {
  @func()
  picaApiKey: Secret;
  @func()
  openaiApiKey: Secret;

  constructor(
    /*
     * Pica API key
     */
    picaApiKey: Secret,
    /*
     * OpenAI API key
     */
    openaiApiKey: Secret,
  ) {
    this.picaApiKey = picaApiKey;
    this.openaiApiKey = openaiApiKey;
  }

  /**
   * Returns the response from ChatGPT using the supplied prompt and any connected integrations
   *
   * @param prompt The prompt to send to the ChatGPT
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
