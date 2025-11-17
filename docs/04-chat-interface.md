# Module 4: Chat Interface Implementation

## Overview

This module explains the frontend chat interface component. This is where users interact with the application, send messages, and receive streaming responses from the AI.

## File Location

`app/chat/page.tsx`

This is a Next.js page component that renders the chat interface. It's a Client Component (marked with `'use client'`) because it needs interactivity and state management.

## Complete Code

```typescript
'use client';

import { useChat } from 'ai/react';
import { ModelKey, MODELS } from '@/lib/groqModels';
import { useState } from 'react';

export default function ChatPage() {
  const [selectedModel, setSelectedModel] = useState<ModelKey>('default');
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      mode: selectedModel,
    },
  });

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">AI Mastery Academy - Groq Chat</h1>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as ModelKey)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {Object.keys(MODELS).map((key) => (
              <option key={key} value={key}>
                {key} ({MODELS[key as ModelKey]})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-lg">Start a conversation with Groq AI</p>
              <p className="text-sm mt-2">Select a model and type your message below</p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >
                <div className="text-xs font-semibold mb-1 opacity-70">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-800 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

## Code Explanation

### Client Component Directive

```typescript
'use client';
```

**What is this?**

- **Directive**: Tells Next.js this is a Client Component
- **Required**: For components using hooks, event handlers, or browser APIs
- **Server vs Client**: Without this, component runs on server (no interactivity)

**When to use `'use client'`:**

- Using React hooks (`useState`, `useEffect`, etc.)
- Event handlers (`onClick`, `onChange`, etc.)
- Browser APIs (`window`, `localStorage`, etc.)
- Third-party libraries requiring client-side execution

### Imports

```typescript
import { useChat } from 'ai/react';
```

- **`useChat`**: Custom hook from Vercel AI SDK
- Handles all chat functionality: sending messages, receiving streams, managing state
- Provides: `messages`, `input`, `handleInputChange`, `handleSubmit`, `isLoading`

```typescript
import { ModelKey, MODELS } from '@/lib/groqModels';
```

- **`ModelKey`**: TypeScript type for valid model keys
- **`MODELS`**: Object mapping model keys to IDs
- Used for model selection dropdown

```typescript
import { useState } from 'react';
```

- **`useState`**: React hook for managing component state
- Used to track selected model

### Component Function

```typescript
export default function ChatPage() {
```

- **Default Export**: Next.js expects default export for page components
- **Function Component**: Modern React component pattern
- **Page Component**: Next.js automatically routes `/chat` to this component

### State Management

```typescript
const [selectedModel, setSelectedModel] = useState<ModelKey>('default');
```

**useState Hook:**

- **`selectedModel`**: Current value (starts as `'default'`)
- **`setSelectedModel`**: Function to update the value
- **`<ModelKey>`**: TypeScript generic ensures type safety
- **`'default'`**: Initial value

**Why TypeScript generic?**

- Ensures only valid model keys can be set
- TypeScript will error if invalid key is used
- Provides autocomplete in IDE

### useChat Hook

```typescript
const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: '/api/chat',
  body: {
    mode: selectedModel,
  },
});
```

**useChat Configuration:**

- **`api`**: Endpoint URL for chat API
- **`body`**: Additional data sent with each request
- **`mode`**: Current selected model (sent to API)

**Returned Values:**

1. **`messages`**: Array of message objects
   ```typescript
   [
     { id: '1', role: 'user', content: 'Hello!' },
     { id: '2', role: 'assistant', content: 'Hi there!' }
   ]
   ```

2. **`input`**: Current input field value (controlled component)

3. **`handleInputChange`**: Handler for input changes
   ```typescript
   (e: ChangeEvent<HTMLInputElement>) => void
   ```

4. **`handleSubmit`**: Handler for form submission
   ```typescript
   (e: FormEvent) => void
   ```

5. **`isLoading`**: Boolean indicating if request is in progress

**What useChat does internally:**

- Manages message state
- Handles API requests
- Processes streaming responses
- Updates UI as tokens arrive
- Manages loading states
- Handles errors

### Layout Structure

```typescript
<div className="flex flex-col h-screen bg-gray-900 text-gray-100">
```

**Tailwind CSS Classes:**

- **`flex flex-col`**: Flexbox column layout
- **`h-screen`**: Full viewport height
- **`bg-gray-900`**: Dark background color
- **`text-gray-100`**: Light text color

**Layout Structure:**

```
┌─────────────────────────┐
│ Header (fixed)          │
├─────────────────────────┤
│                         │
│ Messages (scrollable)  │
│                         │
├─────────────────────────┤
│ Input Form (fixed)      │
└─────────────────────────┘
```

### Header Section

```typescript
<header className="border-b border-gray-800 p-4">
  <div className="max-w-4xl mx-auto flex items-center justify-between">
    <h1 className="text-2xl font-bold">AI Mastery Academy - Groq Chat</h1>
    <select ...>
```

**Header Features:**

- **Border**: Bottom border for separation
- **Padding**: `p-4` adds spacing
- **Max Width**: `max-w-4xl` limits width, `mx-auto` centers
- **Flex Layout**: `flex items-center justify-between` spaces items

### Model Selector

```typescript
<select
  value={selectedModel}
  onChange={(e) => setSelectedModel(e.target.value as ModelKey)}
  className="..."
  disabled={isLoading}
>
  {Object.keys(MODELS).map((key) => (
    <option key={key} value={key}>
      {key} ({MODELS[key as ModelKey]})
    </option>
  ))}
</select>
```

**How it works:**

1. **Controlled Component**: `value` and `onChange` make it controlled
2. **Dynamic Options**: Maps over `MODELS` keys to create options
3. **Display Format**: Shows key and model ID: `"default (llama-3.3-70b-versatile)"`
4. **Disabled State**: Disabled while loading to prevent changes mid-request
5. **Type Assertion**: `as ModelKey` ensures type safety

### Messages Section

```typescript
<div className="flex-1 overflow-y-auto p-4">
```

- **`flex-1`**: Takes remaining space (between header and input)
- **`overflow-y-auto`**: Enables vertical scrolling
- **`p-4`**: Padding around messages

### Empty State

```typescript
{messages.length === 0 && (
  <div className="text-center text-gray-500 mt-20">
    <p className="text-lg">Start a conversation with Groq AI</p>
    <p className="text-sm mt-2">Select a model and type your message below</p>
  </div>
)}
```

**Conditional Rendering:**

- Shows when no messages exist
- Provides helpful instructions
- Uses `&&` operator for conditional rendering

### Message Rendering

```typescript
{messages.map((message) => (
  <div
    key={message.id}
    className={`flex ${
      message.role === 'user' ? 'justify-end' : 'justify-start'
    }`}
  >
```

**Key Points:**

- **`.map()`**: Iterates over messages array
- **`key`**: Required for React list rendering (uses message.id)
- **Conditional Classes**: Different alignment for user vs assistant
- **Template Literals**: Dynamic class names

**Message Styling:**

```typescript
<div
  className={`max-w-[80%] rounded-lg px-4 py-2 ${
    message.role === 'user'
      ? 'bg-blue-600 text-white'
      : 'bg-gray-800 text-gray-100'
  }`}
>
```

- **Max Width**: `max-w-[80%]` prevents messages from being too wide
- **Rounded Corners**: `rounded-lg` for modern look
- **Padding**: `px-4 py-2` adds spacing
- **Conditional Colors**: Blue for user, gray for assistant

**Message Content:**

```typescript
<div className="text-xs font-semibold mb-1 opacity-70">
  {message.role === 'user' ? 'You' : 'Assistant'}
</div>
<div className="whitespace-pre-wrap">{message.content}</div>
```

- **Role Label**: Shows "You" or "Assistant"
- **`whitespace-pre-wrap`**: Preserves line breaks and spaces
- **Content**: Displays message text

### Loading Indicator

```typescript
{isLoading && (
  <div className="flex justify-start">
    <div className="bg-gray-800 rounded-lg px-4 py-2">
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" 
             style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" 
             style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" 
             style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  </div>
)}
```

**Loading Animation:**

- Three bouncing dots
- Staggered delays create wave effect
- Shows while `isLoading` is true
- Positioned like assistant message

### Input Form

```typescript
<form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
```

- **Form Element**: Wraps input and button
- **`onSubmit`**: Handles form submission (prevents page reload)
- **Max Width**: Matches messages container width

### Input Field

```typescript
<input
  value={input}
  onChange={handleInputChange}
  placeholder="Type your message..."
  className="..."
  disabled={isLoading}
/>
```

**Controlled Input:**

- **`value={input}`**: Controlled by useChat hook
- **`onChange={handleInputChange}`**: Updates on change
- **`disabled={isLoading}`**: Prevents input while loading
- **Placeholder**: Helpful hint text

### Submit Button

```typescript
<button
  type="submit"
  disabled={isLoading || !input.trim()}
  className="..."
>
  Send
</button>
```

**Button States:**

- **Enabled**: When not loading and input has content
- **Disabled**: When loading or input is empty
- **`!input.trim()`**: Checks for non-whitespace content
- **Visual Feedback**: Disabled styles show state

## User Interaction Flow

### Sending a Message

1. **User types** in input field
   - `handleInputChange` updates `input` state
   - Button enables when input has content

2. **User clicks Send** or presses Enter
   - `handleSubmit` is called
   - Form submission prevented (default behavior)

3. **useChat hook**:
   - Adds user message to `messages` array
   - Sets `isLoading` to true
   - Sends POST request to `/api/chat`
   - Includes `mode` in request body

4. **API processes** request:
   - Validates input
   - Selects model
   - Streams response

5. **Frontend receives** stream:
   - `useChat` processes chunks
   - Updates assistant message incrementally
   - UI re-renders with each token

6. **Stream completes**:
   - `isLoading` set to false
   - Input cleared
   - Ready for next message

## Styling with Tailwind CSS

### Color Scheme

- **Background**: `bg-gray-900` (dark)
- **Text**: `text-gray-100` (light)
- **Borders**: `border-gray-800` (medium dark)
- **User Messages**: `bg-blue-600` (blue)
- **Assistant Messages**: `bg-gray-800` (dark gray)

### Responsive Design

- **Max Width**: `max-w-4xl` limits content width
- **Centering**: `mx-auto` centers containers
- **Flexible Layout**: Flexbox adapts to screen size

### Accessibility

- **Semantic HTML**: Uses `<header>`, `<form>`, proper headings
- **Focus States**: `focus:ring-2` shows focus
- **Disabled States**: Visual feedback for disabled elements
- **Keyboard Navigation**: Form works with keyboard

## Best Practices

1. **Use useChat Hook**: Simplifies streaming implementation
2. **Controlled Components**: Full control over form state
3. **Loading States**: Provide feedback during requests
4. **Error Handling**: Handle errors gracefully (can be added)
5. **Accessibility**: Use semantic HTML and ARIA attributes
6. **Performance**: Key props for list rendering
7. **Type Safety**: Use TypeScript for all props and state

## Next Steps

Now that you understand the chat interface, proceed to **05-types-typescript.md** to learn about TypeScript types used throughout the application.

