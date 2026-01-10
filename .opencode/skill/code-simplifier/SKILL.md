---
name: code-simplifier
description: Code simplification principles and techniques for writing clear, maintainable code
license: MIT
---

# Code Simplifier Skill

This skill provides guidance and techniques for simplifying code while preserving its behavior. The goal is to create a bias toward simple, readable code throughout the development process.

## How Each Agent Uses This Skill

### Orchestrator
- **Use code-simplifier skill directly** when planning tasks and reviewing specs
- **Encourage simplification** when delegating to @developer and @code_reviewer
- **Coordinate simplification efforts** across the development lifecycle
- **Balance trade-offs** between simplicity and other concerns (performance, deadlines)
- **Apply simplification criteria** when evaluating code during reviews and planning

### Developer
- **Apply simplification techniques actively** when implementing features
- **Simplify incrementally** as you write code, not as a separate phase
- **Make the refactoring** when simplification is needed
- **Verify behavior** with tests after each simplification
- **Use Serena** to search for existing simple patterns before implementing
- **Extract complex logic** into smaller, focused functions

### Code Reviewer
- **Identify complexity** and code smells during review
- **Propose simplifications** with specific examples and rationale
- **Do NOT make changes** - provide suggestions and let developer implement
- **Classify simplification urgency** (CRITICAL, HIGH, MEDIUM, LOW) based on impact
- **Check against project patterns** using `code-search` skill
- **Explain why** the simplification improves code quality

## When to Use This Skill

Apply code simplification when:
- **Orchestrator:** Planning tasks, reviewing PRs, coordinating complex refactors
- **Developer:** Implementing new features, refactoring existing code, reducing technical debt
- **Code Reviewer:** Reviewing complex code, identifying code smells, suggesting improvements

## Core Principles of Simple Code

### 1. Clarity Over Cleverness
- Write code that humans can easily read and understand
- Avoid obscure language features or clever tricks
- Choose explicit over implicit
- Prefer clear variable names over short abbreviations

### 2. Reduce Cognitive Load
- Minimize nesting depth (aim for ≤ 3 levels)
- Avoid deeply nested conditionals
- Keep functions focused and small (≤ 50 lines)
- One responsibility per function/class

### 3. Remove Unnecessary Complexity
- Simplify complex expressions
- Replace nested ternaries with if/else when clearer
- Extract repeated patterns into helper functions
- Avoid premature optimization

### 4. Preserve Behavior
- Simplification must not change functionality
- Maintain the same edge cases and error handling
- Verify through tests when possible
- Document any non-obvious simplifications

## Simplification Techniques

### Reducing Nesting

**Before:**
```typescript
async function processUser(userId: string) {
  const user = await db.users.findById(userId);
  if (user) {
    const profile = await db.profiles.findByUserId(userId);
    if (profile) {
      const settings = await db.settings.findByUserId(userId);
      if (settings && settings.notificationsEnabled) {
        await sendNotification(user, profile);
        if (user.referrerId) {
          await creditReferral(user.referrerId);
        }
      }
    }
  }
}
```

**After:**
```typescript
async function processUser(userId: string) {
  const user = await db.users.findById(userId);
  if (!user) return;

  const profile = await db.profiles.findByUserId(userId);
  if (!profile) return;

  const settings = await db.settings.findByUserId(userId);
  if (!shouldSendNotification(settings)) return;

  await sendNotification(user, profile);

  if (user.referrerId) {
    await creditReferral(user.referrerId);
  }
}

function shouldSendNotification(settings: Settings | null): boolean {
  return settings !== null && settings.notificationsEnabled;
}
```

**Techniques:**
- Use guard clauses (early returns)
- Extract validation into helper functions
- Flatten the happy path

### Simplifying Complex Expressions

**Before:**
```typescript
const result = x > 0 ? (a && (b || c) ? 1 : 0) : (d ? 2 : 3);
```

**After:**
```typescript
function calculateResult(x: number, a: boolean, b: boolean, c: boolean, d: boolean): number {
  if (x <= 0) {
    return d ? 2 : 3;
  }

  if (a && (b || c)) {
    return 1;
  }

  return 0;
}

const result = calculateResult(x, a, b, c, d);
```

**Techniques:**
- Break down complex boolean logic
- Use intermediate variables for clarity
- Replace nested ternaries with functions or if/else statements

### Extracting Logic

**Before:**
```typescript
function calculateDiscount(price: number, customer: Customer, date: Date): number {
  if (customer.isPremium && (date.getDay() === 1 || date.getDay() === 4)) {
    return price * 0.9;
  } else if (customer.isPremium) {
    return price * 0.95;
  } else if (date.getDay() === 1 || date.getDay() === 4) {
    return price * 0.98;
  } else {
    return price;
  }
}
```

**After:**
```typescript
function isPremium(customer: Customer): boolean {
  return customer.isPremium;
}

function isDiscountDay(date: Date): boolean {
  const day = date.getDay();
  return day === 1 || day === 4;
}

function getDiscountRate(customer: Customer, date: Date): number {
  if (isPremium(customer) && isDiscountDay(date)) {
    return 0.9;
  } else if (isPremium(customer)) {
    return 0.95;
  } else if (isDiscountDay(date)) {
    return 0.98;
  }
  return 1.0;
}

function calculateDiscount(price: number, customer: Customer, date: Date): number {
  return price * getDiscountRate(customer, date);
}
```

**Techniques:**
- Extract boolean predicates into named functions
- Separate calculation logic from application
- Use descriptive function names

### Go: Avoiding Deep Nesting with Error Handling

**Before:**
```go
func processUser(id string) error {
    user, err := db.FindUser(id)
    if err == nil {
        profile, err := db.FindProfile(id)
        if err == nil {
            settings, err := db.FindSettings(id)
            if err == nil && settings.NotificationsEnabled {
                if err := sendNotification(user, profile); err != nil {
                    return err
                }
                if user.ReferrerID != "" {
                    if err := creditReferral(user.ReferrerID); err != nil {
                        return err
                    }
                }
            }
        }
    }
    return nil
}
```

**After:**
```go
func shouldSendNotification(settings *Settings) bool {
    return settings != nil && settings.NotificationsEnabled
}

func processUser(id string) error {
    user, err := db.FindUser(id)
    if err != nil {
        return fmt.Errorf("user not found: %w", err)
    }

    profile, err := db.FindProfile(id)
    if err != nil {
        return fmt.Errorf("profile not found: %w", err)
    }

    settings, err := db.FindSettings(id)
    if err != nil {
        return fmt.Errorf("settings not found: %w", err)
    }

    if !shouldSendNotification(settings) {
        return nil
    }

    if err := sendNotification(user, profile); err != nil {
        return fmt.Errorf("notification failed: %w", err)
    }

    if user.ReferrerID != "" {
        if err := creditReferral(user.ReferrerID); err != nil {
            return fmt.Errorf("referral credit failed: %w", err)
        }
    }

    return nil
}
```

**Techniques:**
- Return early on errors
- Extract predicates into helper functions
- Flatten the happy path
- Use explicit error returns

## Code Smells to Address

| Code Smell | Simplification Strategy | Severity |
|-------------|----------------------|-----------|
| Deeply nested conditionals (>3 levels) | Use guard clauses, extract functions | HIGH |
| Long functions (>50 lines) | Break into smaller, focused functions | MEDIUM |
| Complex boolean expressions | Extract into named predicates | MEDIUM |
| Magic numbers/strings | Use named constants | LOW |
| Duplicated code | Extract into reusable functions | HIGH |
| Nested ternary operators | Use if/else for clarity | MEDIUM |
| Complex array methods (chained map/filter) | Break into steps with intermediate variables | LOW |
| Unused variables | Remove them | LOW |

## JavaScript/TypeScript Specific Guidelines

### Prefer Readable Array Methods

**Prefer:**
```typescript
const activeUsers = users
  .filter(user => user.isActive)
  .map(user => user.name);
```

**Avoid (unless clearer):**
```typescript
const activeUsers = [];
for (const user of users) {
  if (user.isActive) {
    activeUsers.push(user.name);
  }
}
```

### Use Optional Chaining

**Before:**
```typescript
const name = user && user.profile && user.profile.name || 'Unknown';
```

**After:**
```typescript
const name = user?.profile?.name ?? 'Unknown';
```

### Prefer async/await

**Before:**
```typescript
function getUser(id: string) {
  return fetch(`/api/users/${id}`)
    .then(res => res.json())
    .then(user => user.name);
}
```

**After:**
```typescript
async function getUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  const user = await res.json();
  return user.name;
}
```

### Use Template Literals

**Before:**
```typescript
const message = 'Hello ' + user.name + ', you have ' + user.notifications.length + ' notifications';
```

**After:**
```typescript
const message = `Hello ${user.name}, you have ${user.notifications.length} notifications`;
```

## Go Specific Guidelines

### Handle Errors Explicitly

**Prefer:**
```go
func processData(data []byte) error {
    result, err := parseData(data)
    if err != nil {
        return fmt.Errorf("parse failed: %w", err)
    }
    // ... use result
    return nil
}
```

**Avoid:**
```go
func processData(data []byte) error {
    result, err := parseData(data)
    if err != nil {
        return nil  // Swallowing error
    }
    // ... use result
    return nil
}
```

### Use Named Returns for Clarity

**Prefer:**
```go
func calculate(a, b int) (sum int, product int) {
    sum = a + b
    product = a * b
    return
}
```

### Keep Goroutines Simple

**Prefer:**
```go
func main() {
    results := make(chan Result, 10)

    for _, task := range tasks {
        go func(t Task) {
            results <- process(t)
        }(task)
    }

    // Collect results
}
```

**Avoid (unless necessary):**
```go
func main() {
    // Complex goroutine management, channels, select statements
    // Keep this as simple as possible
}
```

## Agent-Specific Workflows

### Orchestrator Workflow

1. **Detect complexity** - When reviewing specs, PRs, or task descriptions
2. **Decide action**:
   - If code needs simplification before implementation → Delegate to @developer
   - If existing code review shows complexity → Ask @code_reviewer to suggest simplifications
   - If coordinating refactor → Create simplification tasks in OpenSpec
3. **Track simplification** - Use Serena to store patterns from simplifications

### Developer Workflow

1. **Write simple first** - Start with the most straightforward implementation
2. **Search patterns** - Use `code-search` skill to find similar simple implementations
3. **Review complexity** - Check nesting depth, function length, clarity
4. **Simplify incrementally** - Apply techniques one at a time
5. **Test after changes** - Ensure behavior is preserved
6. **Store patterns** - Save successful simplifications in Serena memory

### Code Reviewer Workflow

1. **Identify complexity** - Look for code smells during review
2. **Propose simplifications** - Suggest specific techniques with before/after examples
3. **Classify urgency**:
   - **CRITICAL**: Deeply nested code, duplicated logic, hard to understand
   - **HIGH**: Long functions, complex boolean expressions
   - **MEDIUM**: Magic values, unclear variable names
   - **LOW**: Minor style improvements
4. **Explain rationale** - Why the simplification improves maintainability
5. **Check patterns** - Use `code-search` to verify proposal matches project conventions
6. **Do NOT implement** - Let developer make the changes

## When NOT to Simplify

Sometimes complexity is justified:

- **Performance-critical code** - Optimizations may introduce complexity
- **External constraints** - API contracts, data formats may require specific patterns
- **Temporary implementations** - Technical debt tracked for later cleanup
- **Domain complexity** - Some business logic is inherently complex
- **Security-sensitive code** - Certain patterns may be security requirements

When in doubt, prefer readability unless there's a clear, documented reason for complexity.

## Simplification Checklist

Before considering code "done," verify:

- [ ] No functions exceed 50 lines
- [ ] Nesting depth ≤ 3 levels
- [ ] All variables have descriptive names
- [ ] No nested ternary operators
- [ ] Complex boolean expressions extracted to predicates
- [ ] Duplicated code extracted to functions
- [ ] Magic numbers/strings replaced with constants
- [ ] Early returns used to reduce nesting
- [ ] Behavior preserved (tests pass)
- [ ] Changes documented if non-obvious

## Examples

### Example 1: Simplifying TypeScript Data Processing

**Complex:**
```typescript
interface Item {
  active?: boolean;
  type: string;
  value?: number;
}

function processData(data: Item[]): number[] {
  const result: number[] = [];
  for (const item of data) {
    if (item.active !== undefined && item.active) {
      if (item.type === 'A' || item.type === 'B') {
        const val = item.value !== undefined ? item.value : 0;
        if (val > 0) {
          result.push(val * 2);
        }
      }
    }
  }
  return result;
}
```

**Simple:**
```typescript
interface Item {
  active?: boolean;
  type: string;
  value?: number;
}

function isActive(item: Item): boolean {
  return item.active === true;
}

function isValidType(item: Item): boolean {
  return item.type === 'A' || item.type === 'B';
}

function getPositiveValue(item: Item): number | null {
  const value = item.value ?? 0;
  return value > 0 ? value : null;
}

function processData(data: Item[]): number[] {
  const result: number[] = [];

  for (const item of data) {
    if (!isActive(item)) continue;
    if (!isValidType(item)) continue;

    const value = getPositiveValue(item);
    if (value) {
      result.push(value * 2);
    }
  }

  return result;
}
```

### Example 2: Simplifying TypeScript API Handler

**Complex:**
```typescript
export async function handleRequest(req: Request, res: Response) {
  if (req.method === 'GET') {
    if (req.url === '/api/users') {
      const users = await db.users.findAll();
      if (users.length > 0) {
        res.json(users);
      } else {
        res.status(404).json({error: 'No users found'});
      }
    } else if (req.url === '/api/orders') {
      const orders = await db.orders.findAll();
      res.json(orders);
    } else {
      res.status(404).json({error: 'Not found'});
    }
  } else if (req.method === 'POST') {
    if (req.url === '/api/users') {
      const user = await db.users.create(req.body);
      res.status(201).json(user);
    } else if (req.url === '/api/orders') {
      const order = await db.orders.create(req.body);
      res.status(201).json(order);
    } else {
      res.status(404).json({error: 'Not found'});
    }
  } else {
    res.status(405).json({error: 'Method not allowed'});
  }
}
```

**Simple:**
```typescript
type Handler = (req: Request, res: Response) => Promise<void>;

async function getAllUsers(req: Request, res: Response) {
  const users = await db.users.findAll();
  if (users.length === 0) {
    return res.status(404).json({error: 'No users found'});
  }
  res.json(users);
}

async function getAllOrders(req: Request, res: Response) {
  const orders = await db.orders.findAll();
  res.json(orders);
}

async function createUser(req: Request, res: Response) {
  const user = await db.users.create(req.body);
  res.status(201).json(user);
}

async function createOrder(req: Request, res: Response) {
  const order = await db.orders.create(req.body);
  res.status(201).json(order);
}

function methodNotAllowed(res: Response) {
  res.status(405).json({error: 'Method not allowed'});
}

function notFound(res: Response) {
  res.status(404).json({error: 'Not found'});
}

interface RouteMap {
  [method: string]: {
    [path: string]: Handler;
  };
}

const routes: RouteMap = {
  'GET': {
    '/api/users': getAllUsers,
    '/api/orders': getAllOrders,
  },
  'POST': {
    '/api/users': createUser,
    '/api/orders': createOrder,
  }
};

export async function handleRequest(req: Request, res: Response) {
  const methodHandlers = routes[req.method];
  if (!methodHandlers) {
    return methodNotAllowed(res);
  }

  const handler = methodHandlers[req.url];
  if (!handler) {
    return notFound(res);
  }

  await handler(req, res);
}
```

### Example 3: Simplifying Go Error Handling

**Complex:**
```go
func ProcessUser(id string) (*User, error) {
    var user *User
    var err error

    db, err := sql.Open("postgres", connStr)
    if err == nil {
        defer db.Close()

        user, err = db.FindUser(id)
        if err == nil && user != nil {
            if user.Disabled {
                return nil, errors.New("user is disabled")
            } else {
                return user, nil
            }
        } else {
            return nil, err
        }
    } else {
        return nil, err
    }
}
```

**Simple:**
```go
func ProcessUser(id string) (*User, error) {
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        return nil, fmt.Errorf("database connection failed: %w", err)
    }
    defer db.Close()

    user, err := db.FindUser(id)
    if err != nil {
        return nil, fmt.Errorf("user lookup failed: %w", err)
    }

    if user == nil {
        return nil, fmt.Errorf("user not found: %s", id)
    }

    if user.Disabled {
        return nil, errors.New("user is disabled")
    }

    return user, nil
}
```

## Best Practices

1. **Simplify in context** - Consider surrounding code and project patterns
2. **Document your reasons** - Explain non-obvious simplifications in comments
3. **Test after each change** - Verify behavior is preserved
4. **Collaborate on complex areas** - Some code requires team discussion
5. **Learn from simple code** - Use `code-search` skill to find examples
6. **Store patterns** - Save useful simplification techniques in Serena memory
7. **Balance simplicity and performance** - Don't sacrifice clarity for premature optimization
8. **Refactor iteratively** - Small, focused changes over large rewrites
