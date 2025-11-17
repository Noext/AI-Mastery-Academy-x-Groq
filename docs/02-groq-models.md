# Module 2: Groq Models Configuration

## Overview

This module explains how Groq models are configured and used in the application. Understanding model selection is crucial for building effective AI applications.

## What is Groq?

Groq is a high-performance AI inference platform that provides:

- **Ultra-fast inference**: Optimized hardware for LLM inference
- **Multiple models**: Access to various open-source and proprietary models
- **Cost-effective**: Pay-per-use pricing model
- **Developer-friendly**: Simple API integration

## Model Configuration File

The file `lib/groqModels.ts` contains all model configurations:

```typescript
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
```

## Code Explanation

### 1. Import Statement

```typescript
import { groq } from "@ai-sdk/groq";
```

- Imports the `groq` provider from the Vercel AI SDK Groq package
- This provider wraps the Groq API and makes it compatible with Vercel AI SDK
- The provider handles authentication, request formatting, and response parsing

### 2. Export Provider

```typescript
export const groqProvider = groq;
```

- Exports the provider for use in API routes
- This is a simple re-export for consistency and potential future customization
- Could be extended to add default parameters or middleware

### 3. Models Mapping

```typescript
export const MODELS = {
  fast: "llama-3.1-8b-instant",
  default: "llama-3.3-70b-versatile",
  reasoning: "openai/gpt-oss-120b",
  browserLite: "openai/gpt-oss-20b",
  safety: "meta-llama/llama-guard-4-12b",
  compound: "groq/compound",
} as const;
```

**Key Points:**

- **`as const`**: TypeScript assertion that makes the object readonly and preserves literal types
- **Key-Value Mapping**: Maps human-readable keys to Groq model IDs
- **Centralized Configuration**: All model IDs in one place for easy maintenance

**Why use `as const`?**

```typescript
// Without 'as const'
const MODELS = { fast: "llama-3.1-8b-instant" };
type Key = keyof typeof MODELS; // string | number | symbol

// With 'as const'
const MODELS = { fast: "llama-3.1-8b-instant" } as const;
type Key = keyof typeof MODELS; // "fast" (literal type)
```

### 4. Type Definition

```typescript
export type ModelKey = keyof typeof MODELS;
```

- Creates a type that represents all valid model keys
- `keyof typeof MODELS` extracts the keys: `"fast" | "default" | "reasoning" | ...`
- Used throughout the application for type safety

## Available Models Explained

### 1. Fast Model (`fast`)

**Model ID**: `llama-3.1-8b-instant`

**Use Cases:**
- Quick responses needed
- Simple questions and answers
- High-volume, low-latency applications
- Cost-sensitive applications

**Characteristics:**
- Smallest model (8B parameters)
- Fastest inference time
- Lower cost per token
- Good for general tasks

### 2. Default Model (`default`)

**Model ID**: `llama-3.3-70b-versatile`

**Use Cases:**
- General-purpose conversations
- Balanced performance and quality
- Most common use cases
- Production applications

**Characteristics:**
- Medium-sized model (70B parameters)
- Balanced speed and quality
- Versatile capabilities
- Recommended for most applications

### 3. Reasoning Model (`reasoning`)

**Model ID**: `openai/gpt-oss-120b`

**Use Cases:**
- Complex reasoning tasks
- Mathematical problems
- Logical analysis
- Multi-step problem solving

**Characteristics:**
- Large model (120B parameters)
- Advanced reasoning capabilities
- Slower but more accurate
- Higher cost per token

### 4. Browser Lite Model (`browserLite`)

**Model ID**: `openai/gpt-oss-20b`

**Use Cases:**
- Browser-based applications
- Lightweight tasks
- Quick responses in web contexts

**Characteristics:**
- Medium-small model (20B parameters)
- Optimized for browser environments
- Good balance of speed and capability

### 5. Safety Model (`safety`)

**Model ID**: `meta-llama/llama-guard-4-12b`

**Use Cases:**
- Content moderation
- Safety checking
- Filtering inappropriate content
- Compliance applications

**Characteristics:**
- Specialized model (12B parameters)
- Trained for safety and moderation
- Can be used as a filter layer
- Not for general conversation

### 6. Compound Model (`compound`)

**Model ID**: `groq/compound`

**Use Cases:**
- Multi-model orchestration
- Complex workflows
- When you need multiple model capabilities

**Characteristics:**
- Specialized model
- Combines multiple capabilities
- Advanced use cases

## Using Models in the Application

### In API Route

```typescript
import { groqProvider, MODELS } from "@/lib/groqModels";

const modelId = MODELS[mode]; // Get model ID from mode key
const model = groqProvider(modelId); // Create model instance
```

### In Frontend

```typescript
import { ModelKey, MODELS } from "@/lib/groqModels";

const [selectedModel, setSelectedModel] = useState<ModelKey>('default');
// TypeScript ensures only valid model keys can be selected
```

## Model Selection Strategy

### When to Use Each Model

1. **Start with `default`**: Best balance for most applications
2. **Use `fast`**: When speed is critical and quality is less important
3. **Use `reasoning`**: For complex problems requiring deep thinking
4. **Use `safety`**: As a filter layer before displaying content
5. **Use `compound`**: For advanced multi-model workflows

### Performance Considerations

- **Latency**: Smaller models respond faster
- **Cost**: Smaller models cost less per token
- **Quality**: Larger models generally provide better responses
- **Throughput**: Smaller models can handle more concurrent requests

## Environment Configuration

The Groq API key is configured via environment variables:

```bash
# .env.local
GROQ_API_KEY=your_groq_api_key_here
```

The `@ai-sdk/groq` package automatically reads this environment variable. No explicit configuration needed in code.

## Adding New Models

To add a new model:

1. **Add to MODELS object**:
```typescript
export const MODELS = {
  // ... existing models
  newModel: "groq/new-model-id",
} as const;
```

2. **TypeScript will automatically update** `ModelKey` type
3. **Update UI** to include new model in dropdown (already dynamic)
4. **Test** the new model with various inputs

## Best Practices

1. **Centralize Configuration**: Keep all model IDs in one file
2. **Use TypeScript**: Leverage types for safety
3. **Document Models**: Add comments explaining each model's use case
4. **Test Different Models**: Understand performance characteristics
5. **Monitor Costs**: Track usage per model for cost optimization

## Common Patterns

### Model Selection Based on User Input

```typescript
function selectModel(userInput: string): ModelKey {
  if (userInput.includes('calculate') || userInput.includes('solve')) {
    return 'reasoning';
  }
  if (userInput.length < 50) {
    return 'fast';
  }
  return 'default';
}
```

### Fallback Strategy

```typescript
try {
  // Try with default model
  const result = await streamText({ model: groqProvider(MODELS.default) });
} catch (error) {
  // Fallback to fast model
  const result = await streamText({ model: groqProvider(MODELS.fast) });
}
```

## Next Steps

Now that you understand model configuration, proceed to **03-api-route.md** to learn how the API route uses these models to handle chat requests.

