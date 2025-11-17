# Module 6: Understanding Streaming

## Overview

This module explains how streaming works in the application. Streaming is crucial for providing a good user experience with AI applications, as it allows users to see responses as they're generated rather than waiting for the complete response.

## What is Streaming?

**Streaming** is a technique where data is sent incrementally as it becomes available, rather than waiting for all data to be ready before sending.

### Traditional Request/Response (Non-Streaming)

```
User Request
    ↓
[Wait for complete response]
    ↓
[Response generated: "Hello, how are you today?"]
    ↓
Send complete response
    ↓
User sees: "Hello, how are you today?"
```

**Problems:**
- Long wait time (Time to First Token - TTFT)
- No feedback during generation
- Poor user experience

### Streaming Request/Response

```
User Request
    ↓
Token 1: "Hello"
    ↓ (sent immediately)
User sees: "Hello"
    ↓
Token 2: ","
    ↓ (sent immediately)
User sees: "Hello,"
    ↓
Token 3: " how"
    ↓ (sent immediately)
User sees: "Hello, how"
    ↓
... continues until complete
```

**Benefits:**
- Immediate feedback
- Better perceived performance
- Users can read while AI generates
- More engaging experience

## How Streaming Works in This Application

### Architecture Overview

```
Frontend (React)
    ↓ useChat hook
    ↓ POST /api/chat
API Route (Next.js Edge)
    ↓ streamText()
    ↓ Groq Provider
Groq API (External)
    ↓ Generates tokens
    ↓ Streams tokens back
API Route
    ↓ Converts to SSE
    ↓ Streams to frontend
Frontend
    ↓ Receives chunks
    ↓ Updates UI
```

## Server-Sent Events (SSE)

The application uses **Server-Sent Events** (SSE) for streaming.

### What is SSE?

SSE is a web standard that allows a server to push data to a client over HTTP. It's simpler than WebSockets and perfect for one-way streaming (server → client).

### SSE Format

```
data: {"type":"text-delta","textDelta":"Hello"}

data: {"type":"text-delta","textDelta":" there"}

data: {"type":"done"}

```

Each line:
- Starts with `data: `
- Contains JSON data
- Ends with two newlines (`\n\n`)

## Implementation Details

### Backend: API Route

```typescript
const result = await streamText({
  model: groqProvider(modelId),
  messages,
});

return result.toDataStreamResponse();
```

**What happens:**

1. **`streamText()`**: Creates a streaming connection
   - Doesn't wait for complete response
   - Returns immediately with a result object
   - Sets up streaming pipeline

2. **`toDataStreamResponse()`**: Converts to HTTP Response
   - Creates SSE-compatible response
   - Sets correct headers (`text/event-stream`)
   - Returns Response object that streams data

**Response Headers:**

```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

### Frontend: useChat Hook

```typescript
const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: '/api/chat',
  body: {
    mode: selectedModel,
  },
});
```

**What useChat does:**

1. **Sends Request**: POST to `/api/chat`
2. **Opens Stream**: Establishes SSE connection
3. **Receives Chunks**: Listens for data events
4. **Updates State**: Adds tokens to message as they arrive
5. **Re-renders**: React updates UI automatically

**Internal Flow:**

```typescript
// Simplified version of what useChat does
fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages, mode }),
})
  .then(response => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    function readChunk() {
      reader.read().then(({ done, value }) => {
        if (done) return;
        
        const chunk = decoder.decode(value);
        const data = JSON.parse(chunk);
        
        // Update message with new token
        updateMessage(data.textDelta);
        
        // Read next chunk
        readChunk();
      });
    }
    
    readChunk();
  });
```

## Message Updates

### How Messages Are Updated

```typescript
// Initial state
messages: []

// User sends: "Hello"
messages: [
  { id: '1', role: 'user', content: 'Hello' }
]

// AI starts responding: "Hi"
messages: [
  { id: '1', role: 'user', content: 'Hello' },
  { id: '2', role: 'assistant', content: 'Hi' }
]

// AI continues: "Hi there"
messages: [
  { id: '1', role: 'user', content: 'Hello' },
  { id: '2', role: 'assistant', content: 'Hi there' }
]

// AI completes: "Hi there! How can I help?"
messages: [
  { id: '1', role: 'user', content: 'Hello' },
  { id: '2', role: 'assistant', content: 'Hi there! How can I help?' }
]
```

**Key Points:**

- Same message object is updated
- Content grows incrementally
- React re-renders on each update
- UI shows streaming effect

## Visual Representation

### Timeline

```
Time →
│
├─ User types message
│
├─ User clicks Send
│
├─ Request sent ────────────────────────────────┐
│                                                │
├─ API receives request                          │
│                                                │
├─ Groq API starts generating                    │
│                                                │ Streaming
├─ Token 1: "Hello" ────────────────────────────┤
│  ↓ Sent to frontend                            │
│  ↓ UI updates: "Hello"                          │
│                                                │
├─ Token 2: " there" ───────────────────────────┤
│  ↓ Sent to frontend                            │
│  ↓ UI updates: "Hello there"                   │
│                                                │
├─ Token 3: "!" ────────────────────────────────┤
│  ↓ Sent to frontend                            │
│  ↓ UI updates: "Hello there!"                   │
│                                                │
└─ Stream complete ──────────────────────────────┘
   ↓ Loading state cleared
   ↓ Ready for next message
```

## Benefits of Streaming

### 1. Perceived Performance

- **Without Streaming**: User waits 3 seconds, then sees full response
- **With Streaming**: User sees response starting in 0.5 seconds

**Perceived latency is much lower!**

### 2. User Engagement

- Users can start reading while AI generates
- More interactive experience
- Feels more conversational

### 3. Error Handling

- Can detect errors early
- Don't waste time on failed generations
- Better error messages

### 4. Long Responses

- For long responses, streaming is essential
- Without streaming, users wait minutes
- With streaming, content appears immediately

## Technical Details

### Stream Format (Vercel AI SDK)

The Vercel AI SDK uses a specific format:

```json
{"type":"text-delta","textDelta":"Hello"}
{"type":"text-delta","textDelta":" there"}
{"type":"done"}
```

**Message Types:**

- **`text-delta`**: New text token
- **`done`**: Stream complete
- **`error`**: Error occurred

### Buffer Management

The browser buffers incoming data:

```
Network → Buffer → Parser → State Update → UI
```

**Considerations:**

- Small buffers = more frequent updates
- Large buffers = less frequent updates
- Balance needed for smooth experience

### Error Handling in Streams

```typescript
try {
  const result = await streamText({ ... });
  return result.toDataStreamResponse();
} catch (error) {
  // Stream already started? Can't send error through stream
  // Need to handle before streaming starts
}
```

**Best Practice:**

- Validate before streaming
- Handle errors in useChat hook
- Show error messages in UI

## Performance Considerations

### Network Impact

- **More Requests**: Each token = network packet
- **Overhead**: SSE has some overhead per message
- **Still Faster**: Perceived performance is better

### Server Load

- **Connection Duration**: Longer connections
- **Memory**: Need to maintain connection state
- **Scalability**: Edge runtime helps with this

### Client Performance

- **Re-renders**: Each token triggers re-render
- **Optimization**: React batches updates when possible
- **Smooth**: Usually smooth due to batching

## Debugging Streaming

### Check Network Tab

1. Open browser DevTools
2. Go to Network tab
3. Find `/api/chat` request
4. Click on it
5. Go to "Response" or "Preview" tab
6. See streaming data

### Console Logging

```typescript
// In API route (for debugging)
console.log('Streaming started');

// In frontend
useChat({
  onFinish: (message) => {
    console.log('Stream complete:', message);
  },
});
```

## Common Issues

### Issue: Stream Not Starting

**Causes:**
- API key invalid
- Network error
- CORS issue

**Solution:**
- Check API key
- Check network tab
- Verify CORS headers

### Issue: Stream Stops Midway

**Causes:**
- Network interruption
- Server timeout
- Rate limiting

**Solution:**
- Check server logs
- Implement retry logic
- Handle errors gracefully

### Issue: UI Not Updating

**Causes:**
- React not re-rendering
- State update issue
- Component not connected

**Solution:**
- Check React DevTools
- Verify state updates
- Check component structure

## Best Practices

1. **Always Stream**: For AI applications, always use streaming
2. **Handle Errors**: Implement proper error handling
3. **Loading States**: Show loading indicators
4. **Cancel Support**: Allow users to cancel streams
5. **Retry Logic**: Implement retry for failed streams
6. **Timeout Handling**: Set reasonable timeouts
7. **User Feedback**: Always provide feedback

## Next Steps

Now that you understand streaming, proceed to **07-configuration.md** to learn about project configuration files.

