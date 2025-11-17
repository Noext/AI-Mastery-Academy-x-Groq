# Module 3: API Route Implementation

## Overview

This module explains the API route that handles chat requests. The API route is the backend of the application, processing user messages and streaming responses from Groq.

## File Location

`app/api/chat/route.ts`

This file implements a Next.js API route using the App Router pattern. In Next.js 15, API routes are defined using `route.ts` files that export HTTP method handlers.

## Complete Code

```typescript
import { streamText } from "ai";
import { groqProvider, MODELS } from "@/lib/groqModels";
import { ChatRequest } from "@/lib/types";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, mode }: ChatRequest = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Messages array is required", { status: 400 });
    }

    if (!mode || !MODELS[mode]) {
      return new Response("Valid mode is required", { status: 400 });
    }

    const modelId = MODELS[mode];

    const result = await streamText({
      model: groqProvider(modelId),
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
```

## Line-by-Line Explanation

### Import Statements

```typescript
import { streamText } from "ai";
```

- **`streamText`**: Function from Vercel AI SDK that creates a streaming text generation
- Handles the complexity of streaming responses from LLM providers
- Returns a result object with streaming capabilities

```typescript
import { groqProvider, MODELS } from "@/lib/groqModels";
```

- **`groqProvider`**: The Groq provider instance for creating model instances
- **`MODELS`**: Object mapping model keys to Groq model IDs
- Uses `@/` alias which maps to the root directory (configured in `tsconfig.json`)

```typescript
import { ChatRequest } from "@/lib/types";
```

- **`ChatRequest`**: TypeScript interface defining the expected request structure
- Ensures type safety for request data

### Edge Runtime Configuration

```typescript
export const runtime = "edge";
```

**What is Edge Runtime?**

- Runs on Vercel's Edge Network (distributed globally)
- Faster cold starts (typically < 50ms)
- Lower latency (closer to users)
- Limited Node.js APIs (no file system, no native modules)

**Why Edge Runtime for AI APIs?**

1. **Performance**: AI API calls benefit from low latency
2. **Scalability**: Automatically scales across edge locations
3. **Cost**: More cost-effective for high-traffic applications
4. **User Experience**: Faster responses improve UX

**Limitations:**

- Cannot use Node.js-specific APIs
- No access to file system
- Limited to Web APIs
- Smaller memory limits

### POST Handler

```typescript
export async function POST(req: Request) {
```

- **`export async function`**: Exports an async function that Next.js will call
- **`POST`**: HTTP method this handler responds to
- **`req: Request`**: Standard Web API Request object
- Next.js automatically routes POST requests to `/api/chat` to this function

**HTTP Methods Supported:**

- `GET`: `export async function GET()`
- `POST`: `export async function POST()`
- `PUT`: `export async function PUT()`
- `DELETE`: `export async function DELETE()`
- `PATCH`: `export async function PATCH()`

### Request Parsing

```typescript
const { messages, mode }: ChatRequest = await req.json();
```

**What's happening:**

1. **`await req.json()`**: Parses the request body as JSON
2. **Destructuring**: Extracts `messages` and `mode` from the parsed JSON
3. **Type Annotation**: `ChatRequest` ensures type safety

**Expected Request Format:**

```json
{
  "messages": [
    { "role": "user", "content": "Hello!" },
    { "role": "assistant", "content": "Hi there!" }
  ],
  "mode": "default"
}
```

### Input Validation

```typescript
if (!messages || !Array.isArray(messages)) {
  return new Response("Messages array is required", { status: 400 });
}
```

**Why validate?**

- **Security**: Prevents invalid data from causing errors
- **User Experience**: Provides clear error messages
- **Debugging**: Helps identify issues early

**Validation Checks:**

1. **Existence**: `!messages` checks if messages is null/undefined
2. **Type**: `!Array.isArray(messages)` ensures it's an array
3. **Response**: Returns HTTP 400 (Bad Request) with error message

```typescript
if (!mode || !MODELS[mode]) {
  return new Response("Valid mode is required", { status: 400 });
}
```

**Validation Logic:**

1. **Existence**: Checks if mode is provided
2. **Validity**: `MODELS[mode]` checks if mode exists in MODELS object
3. **Type Safety**: TypeScript ensures only valid ModelKey values pass

### Model Selection

```typescript
const modelId = MODELS[mode];
```

- Retrieves the actual Groq model ID from the MODELS mapping
- Example: `MODELS['default']` → `"llama-3.3-70b-versatile"`
- Type-safe: TypeScript ensures `mode` is a valid key

### Streaming Text Generation

```typescript
const result = await streamText({
  model: groqProvider(modelId),
  messages,
});
```

**Breaking it down:**

1. **`groqProvider(modelId)`**: Creates a model instance
   - Wraps the Groq API with Vercel AI SDK interface
   - Handles authentication (uses `GROQ_API_KEY` env var)
   - Formats requests correctly

2. **`messages`**: Array of message objects
   - Format: `[{ role: 'user' | 'assistant' | 'system', content: string }]`
   - Maintains conversation history
   - System messages can set behavior/context

3. **`streamText()`**: Initiates streaming generation
   - Returns immediately with a result object
   - Doesn't wait for complete response
   - Sets up streaming connection

**What happens internally:**

```
streamText() called
  ↓
Creates connection to Groq API
  ↓
Sends request with messages
  ↓
Groq starts generating response
  ↓
Tokens stream back one by one
  ↓
Result object provides streaming interface
```

### Response Streaming

```typescript
return result.toDataStreamResponse();
```

**What is `toDataStreamResponse()`?**

- Converts the streaming result into a Web API Response
- Uses Server-Sent Events (SSE) protocol
- Returns a `Response` object that streams data

**How streaming works:**

1. **Server**: Sends chunks of data as they're generated
2. **Protocol**: Uses SSE (text/event-stream)
3. **Client**: Receives chunks and updates UI incrementally
4. **Format**: Each chunk is a JSON object with the new token

**Example Stream:**

```
data: {"type":"text-delta","textDelta":"Hello"}

data: {"type":"text-delta","textDelta":" there"}

data: {"type":"text-delta","textDelta":"!"}

data: {"type":"done"}
```

### Error Handling

```typescript
catch (error) {
  console.error("Chat API error:", error);
  return new Response("Internal server error", { status: 500 });
}
```

**Error Handling Strategy:**

1. **Try-Catch**: Catches any errors during processing
2. **Logging**: Logs error for debugging (server-side only)
3. **User-Friendly Response**: Returns generic error message
4. **Status Code**: HTTP 500 indicates server error

**Why generic error message?**

- **Security**: Doesn't expose internal details
- **User Experience**: Prevents confusing technical errors
- **Debugging**: Real error logged server-side

**Common Errors:**

- **Invalid API Key**: Groq API returns 401
- **Rate Limiting**: Groq API returns 429
- **Invalid Model**: Groq API returns 400
- **Network Issues**: Connection timeout

## Request/Response Flow

### Complete Flow Diagram

```
Client (Frontend)
  ↓ POST /api/chat
  ↓ { messages: [...], mode: "default" }
API Route Handler
  ↓ Validates input
  ↓ Selects model: MODELS["default"]
  ↓ Creates model instance: groqProvider("llama-3.3-70b-versatile")
  ↓ Calls streamText()
  ↓
Groq API (External)
  ↓ Processes request
  ↓ Generates response tokens
  ↓ Streams tokens back
  ↓
API Route Handler
  ↓ Receives stream
  ↓ Converts to SSE format
  ↓ Returns Response
  ↓
Client (Frontend)
  ↓ Receives stream chunks
  ↓ Updates UI incrementally
```

## Advanced Topics

### Adding System Messages

```typescript
const messages = [
  { role: "system", content: "You are a helpful assistant." },
  ...requestMessages
];
```

System messages set the AI's behavior and context.

### Adding Parameters

```typescript
const result = await streamText({
  model: groqProvider(modelId),
  messages,
  temperature: 0.7,        // Creativity (0-1)
  maxTokens: 1000,        // Maximum response length
  topP: 0.9,              // Nucleus sampling
});
```

### Error Handling Improvements

```typescript
catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('API key')) {
      return new Response("Invalid API key", { status: 401 });
    }
    if (error.message.includes('rate limit')) {
      return new Response("Rate limit exceeded", { status: 429 });
    }
  }
  return new Response("Internal server error", { status: 500 });
}
```

## Testing the API Route

### Using curl

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}],
    "mode": "default"
  }'
```

### Using fetch (JavaScript)

```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello!' }],
    mode: 'default'
  })
});
```

## Best Practices

1. **Always validate input**: Prevent invalid data from causing errors
2. **Use TypeScript**: Catch errors at compile time
3. **Handle errors gracefully**: Provide user-friendly error messages
4. **Log errors**: Help with debugging in production
5. **Use Edge Runtime**: For better performance with AI APIs
6. **Stream responses**: Improve user experience
7. **Keep routes focused**: One route, one responsibility

## Next Steps

Now that you understand the API route, proceed to **04-chat-interface.md** to learn how the frontend interacts with this API.

