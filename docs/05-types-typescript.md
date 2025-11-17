# Module 5: TypeScript Types and Type Safety

## Overview

This module explains the TypeScript types used throughout the application. Understanding types is crucial for building maintainable, error-free applications.

## Why TypeScript?

TypeScript provides:

1. **Type Safety**: Catch errors at compile time, not runtime
2. **Better IDE Support**: Autocomplete, refactoring, navigation
3. **Documentation**: Types serve as inline documentation
4. **Refactoring Confidence**: Safe to change code with type checking
5. **Team Collaboration**: Clear contracts between components

## Type Definitions File

**Location**: `lib/types.ts`

```typescript
import { ModelKey } from './groqModels';

export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  mode: ModelKey;
}
```

## Code Explanation

### Import Statement

```typescript
import { ModelKey } from './groqModels';
```

- Imports the `ModelKey` type from the models configuration
- This is a type-only import (no runtime code)
- Ensures consistency between model selection and request types

### ChatRequest Interface

```typescript
export interface ChatRequest {
```

**What is an Interface?**

- Defines the shape of an object
- Ensures objects have required properties
- Provides type checking and autocomplete
- Can be extended or implemented by classes

**Why `export`?**

- Makes the interface available to other files
- Used in API route for request validation
- Can be imported wherever needed

### Messages Property

```typescript
messages: Array<{
  role: 'user' | 'assistant' | 'system';
  content: string;
}>;
```

**Breaking it down:**

1. **`messages`**: Property name
2. **`Array<...>`**: TypeScript array type
3. **Object Shape**: Each array element is an object with:
   - **`role`**: Union type (`'user' | 'assistant' | 'system'`)
   - **`content`**: String type

**Union Types:**

```typescript
role: 'user' | 'assistant' | 'system'
```

- **Literal Types**: Specific string values
- **Union (`|`)**: One of the listed types
- **Type Safety**: Only these three values allowed

**Alternative Syntax:**

```typescript
messages: {
  role: 'user' | 'assistant' | 'system';
  content: string;
}[]
```

Both syntaxes are equivalent.

### Mode Property

```typescript
mode: ModelKey;
```

- Uses the `ModelKey` type from `groqModels.ts`
- Ensures only valid model keys can be used
- Type-safe model selection

## ModelKey Type

**Location**: `lib/groqModels.ts`

```typescript
export type ModelKey = keyof typeof MODELS;
```

### Understanding `keyof typeof`

**Step by step:**

1. **`typeof MODELS`**: Gets the type of the MODELS object
   ```typescript
   {
     fast: "llama-3.1-8b-instant",
     default: "llama-3.3-70b-versatile",
     // ...
   }
   ```

2. **`keyof`**: Extracts the keys of that type
   ```typescript
   "fast" | "default" | "reasoning" | "browserLite" | "safety" | "compound"
   ```

3. **Result**: `ModelKey` is a union of all model keys

**Why this is powerful:**

- **Automatic Updates**: Adding a model to MODELS automatically updates ModelKey
- **Type Safety**: TypeScript ensures only valid keys are used
- **Refactoring**: Renaming a key updates all usages

## Type Usage in Application

### In API Route

```typescript
import { ChatRequest } from "@/lib/types";

export async function POST(req: Request) {
  const { messages, mode }: ChatRequest = await req.json();
  // TypeScript knows the shape of messages and mode
}
```

**Benefits:**

- **Destructuring**: TypeScript knows what properties exist
- **Autocomplete**: IDE suggests available properties
- **Validation**: Type errors if structure doesn't match

### In Chat Component

```typescript
import { ModelKey } from '@/lib/groqModels';

const [selectedModel, setSelectedModel] = useState<ModelKey>('default');
```

**Generic Type Parameter:**

- **`useState<ModelKey>`**: Tells TypeScript the state type
- **Type Safety**: Only valid model keys can be set
- **Autocomplete**: IDE suggests valid values

## Type Inference

TypeScript can often infer types automatically:

```typescript
// Type inferred as string
const name = "John";

// Type inferred as number
const age = 30;

// Type inferred as ModelKey
const model = 'default'; // If MODELS is in scope
```

**When to use explicit types:**

- Function parameters
- Function return types
- Complex types
- When inference is unclear

## Common Type Patterns

### Optional Properties

```typescript
interface User {
  name: string;
  email?: string; // Optional
}
```

### Readonly Properties

```typescript
interface Config {
  readonly apiKey: string; // Cannot be changed
}
```

### Index Signatures

```typescript
interface StringMap {
  [key: string]: string;
}
```

### Generic Types

```typescript
interface Response<T> {
  data: T;
  status: number;
}
```

## Type Guards

Type guards help narrow types:

```typescript
function isValidModel(mode: string): mode is ModelKey {
  return mode in MODELS;
}

if (isValidModel(mode)) {
  // TypeScript knows mode is ModelKey here
}
```

## Type Assertions

Sometimes you need to tell TypeScript about a type:

```typescript
const model = e.target.value as ModelKey;
```

**When to use:**

- When you're certain about the type
- Converting between compatible types
- Working with dynamic content (like form inputs)

**Be careful:**

- Type assertions bypass type checking
- Can lead to runtime errors if wrong
- Use sparingly and with validation

## Utility Types

TypeScript provides utility types:

### Partial

```typescript
type PartialChatRequest = Partial<ChatRequest>;
// All properties become optional
```

### Pick

```typescript
type MessagesOnly = Pick<ChatRequest, 'messages'>;
// Only includes 'messages' property
```

### Omit

```typescript
type WithoutMode = Omit<ChatRequest, 'mode'>;
// Excludes 'mode' property
```

## Error Messages

TypeScript provides helpful error messages:

```typescript
// Error: Property 'invalid' does not exist on type 'ChatRequest'
const request: ChatRequest = {
  messages: [],
  mode: 'default',
  invalid: 'value' // Error!
};
```

## Best Practices

1. **Use Types Everywhere**: Don't use `any` unless necessary
2. **Start Strict**: Enable strict mode in `tsconfig.json`
3. **Type as You Go**: Add types incrementally
4. **Use Interfaces**: For object shapes
5. **Use Types**: For unions, intersections, etc.
6. **Leverage Inference**: Let TypeScript infer when possible
7. **Document Complex Types**: Add comments for complex types

## TypeScript Configuration

**Location**: `tsconfig.json`

Key settings:

```json
{
  "compilerOptions": {
    "strict": true,           // Enable all strict checks
    "noImplicitAny": true,    // Error on implicit any
    "strictNullChecks": true, // Null/undefined checking
  }
}
```

## Common Type Errors and Solutions

### Error: Property does not exist

```typescript
// Error
const model = MODELS.invalid;

// Solution: Use valid key
const model = MODELS.default;
```

### Error: Type is not assignable

```typescript
// Error
const mode: ModelKey = 'invalid';

// Solution: Use valid ModelKey
const mode: ModelKey = 'default';
```

### Error: Object is possibly undefined

```typescript
// Error
const value = obj.property;

// Solution: Check first
if (obj) {
  const value = obj.property;
}
```

## Next Steps

Now that you understand TypeScript types, proceed to **06-streaming.md** to learn how streaming works in detail.

