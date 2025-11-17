import { groq } from "@ai-sdk/groq";

export const groqProvider = groq;

export const MODELS = {
  fast: "llama-3.1-8b-instant",
  default: "llama-3.3-70b-versatile",
  reasoning: "openai/gpt-oss-120b",
  browserLite: "openai/gpt-oss-20b",
  safety: "meta-llama/llama-guard-4-12b",
  compound: "groq/compound",
} as const;

export type ModelKey = keyof typeof MODELS;
