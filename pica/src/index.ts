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
  picaSecretKey: Secret;
  @func()
  openaiApiKey: Secret;

  constructor(
    /*
     * Pica API key
     */
    picaSecretKey: Secret,
    /*
     * OpenAI API key
     */
    openaiApiKey: Secret,
  ) {
    this.picaSecretKey = picaSecretKey;
    this.openaiApiKey = openaiApiKey;
  }

  /**
   * Returns the response from ChatGPT using the supplied prompt and any connected integrations
   *
   * @param prompt The prompt to send to ChatGPT
   */
  @func()
  async oneTool(prompt: string): Promise<string> {
    const plaintextPicaSecretKey = await this.picaSecretKey.plaintext();
    const plaintextOpenaiApiKey = await this.openaiApiKey.plaintext();
    const pica = new PicaAI(plaintextPicaSecretKey);
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
