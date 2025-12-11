---
name: code-search
description: Semantic code search methodology and best practices for finding code patterns and information
license: MIT
---

# Code Search Skill

This skill provides guidance on how to effectively search your codebase using semantic code search capabilities.

## When to Use This Skill

Use semantic code search when you need to:
- Find code patterns or implementations
- Locate specific functionality across the codebase
- Understand how certain concepts are implemented
- Discover related code or dependencies
- Search for architectural patterns or design decisions

## Search Strategy

### 1. Formulate Specific Search Terms

Instead of searching for generic terms, be specific about what you're looking for:

**Good searches:**
- "authentication patterns" - Finds how auth is implemented
- "error handling in API" - Finds error handling strategies
- "database connection pooling" - Finds connection management
- "caching strategy" - Finds caching implementations

**Avoid:**
- "function" - Too generic
- "code" - Too broad
- "implementation" - Unclear intent

### 2. Search for Patterns, Not Just Names

Semantic search understands meaning, so search for:
- **Patterns**: "how we handle async operations"
- **Concepts**: "validation logic"
- **Architectural decisions**: "dependency injection"
- **Best practices**: "error recovery patterns"

### 3. Use Context from Your Project

Before searching, understand:
- What problem are you trying to solve?
- What similar functionality might already exist?
- What patterns does your project follow?
- Where might this code logically live?

## Search Execution

When performing a semantic search:

1. **Formulate the query** - Be specific and descriptive
2. **Execute the search** - Use Serena's semantic search capabilities
3. **Review results** - Look for relevant patterns and implementations
4. **Extract insights** - Understand how similar problems are solved
5. **Apply learning** - Use discovered patterns in your implementation

## Common Search Scenarios

### Finding Existing Implementations

**Scenario:** You need to implement a feature similar to something that exists

**Search approach:**
```
"how we implement [feature]"
"[feature] implementation pattern"
"existing [feature] code"
```

**Example:**
```
"how we implement user authentication"
"payment processing pattern"
"API error handling"
```

### Understanding Architectural Decisions

**Scenario:** You want to understand why something was implemented a certain way

**Search approach:**
```
"[component] architecture"
"[system] design decisions"
"[feature] implementation approach"
```

**Example:**
```
"database layer architecture"
"caching strategy design"
"API versioning approach"
```

### Finding Related Code

**Scenario:** You're working on a feature and need to find related components

**Search approach:**
```
"[feature] related code"
"[component] dependencies"
"[system] integration points"
```

**Example:**
```
"user profile related code"
"authentication dependencies"
"payment system integration"
```

## Tips for Effective Searching

1. **Be descriptive** - More context = better results
2. **Use domain language** - Use terms from your project
3. **Search iteratively** - Refine searches based on results
4. **Look for patterns** - Focus on how things are done, not just where
5. **Document findings** - Store useful patterns in project memory

## Integration with Development

Use semantic search during:
- **Planning** - Understand existing patterns before designing
- **Implementation** - Find similar code to follow conventions
- **Review** - Verify consistency with existing patterns
- **Refactoring** - Identify all related code that needs changes

## After Searching

Once you've found relevant code:
1. Review the implementation details
2. Understand the context and constraints
3. Check for related tests or documentation
4. Consider edge cases and error handling
5. Apply the pattern consistently in your changes
