# Code Standards Reference

This document defines the coding standards used by the code-standards-checker skill.

---

## 1. Code Formatting

| Rule | Standard | Severity |
|------|----------|----------|
| Indentation | 2 spaces (no tabs) | Medium |
| Quotes | Single quotes for JS/JSX | Low |
| Semicolons | Required at end of statements | Medium |
| Trailing commas | Yes, where valid (ES2017+) | Low |
| Line length | Max 100 characters (soft), 120 (hard) | Low |
| Trailing whitespace | None | Low |
| EOF newline | Required | Low |

## 2. React / JSX Standards

### Component Structure
- Use **functional components** with hooks, not class components
- One component per file
- File name = Component name (PascalCase)

### Hooks Rules
- Only call hooks at the top level (not in conditions/loops/nested functions)
- Only call hooks from React functions (not regular JS functions)
- `useEffect` must have complete dependency array
- `useCallback` / `useMemo` for expensive computations passed as props

### JSX Conventions
- Props: `camelCase` for event handlers (`onClick`, not `onclick`)
- Self-close tags without children: `<Component />`
- Conditional rendering: `{condition && <Component />}` or ternary
- Keys in lists: stable unique IDs (not array index for dynamic lists)

### State Management
- Prefer `useState` for local state
- Use `useReducer` for complex state logic
- Redux Toolkit for global state
- Avoid putting derived state in Redux

## 3. Node.js / Express Standards

### Route Handlers
```javascript
// ✅ Correct: async with error handling
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});
```

### Response Format
```javascript
// Success
{ success: true, data: ..., message: "..." }

// Error
{ success: false, error: "error message" }
```

### Middleware
- Validation middleware before route handlers
- Error middleware at the end of middleware chain
- Auth middleware for protected routes

## 4. Security Standards

### Never Use
- `eval()` — code injection risk
- `new Function()` — code injection risk
- `innerHTML` / `outerHTML` — XSS risk (use `textContent` instead)
- `document.write()` — XSS risk

### Input Validation
- Validate all user input (type, length, format)
- Sanitize inputs before database queries (use parameterized queries)
- Rate limiting on auth endpoints (max 5 attempts per minute)

### Secrets Management
- No hardcoded API keys, passwords, tokens, or secrets
- Use environment variables + config module
- .env files must be in .gitignore

## 5. Performance Standards

### React Performance
- Avoid inline arrow functions in JSX props → use `useCallback`
- Avoid inline objects in JSX → extract to constant outside component
- Large components (>300 lines) should be split
- Large lists should be virtualized (react-window / react-virtualized)
- `React.memo` for pure components that re-render often

### useEffect Cleanup
```javascript
// ✅ Correct: cleanup intervals/subscriptions
useEffect(() => {
  const timer = setInterval(() => { ... }, 1000);
  return () => clearInterval(timer); // cleanup
}, []);
```

### Bundle Size
- Avoid importing entire libraries when tree-shaking is possible
- Code-split routes with `React.lazy()` and `Suspense`
- Remove unused imports

## 6. Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Variables | camelCase | `userName`, `isActive` |
| Functions | camelCase | `fetchData()`, `handleClick()` |
| Components | PascalCase | `UserProfile`, `TodoList` |
| Classes | PascalCase | `UserService`, `AuthManager` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| Files (JS/TS) | camelCase | `userService.js` |
| Files (React) | PascalCase | `UserProfile.jsx` |
| Booleans | is/has/should prefix | `isLoading`, `hasError`, `shouldUpdate` |
| Event handlers | `handle` prefix | `handleSubmit`, `handleChange` |
| Props event handlers | `on` prefix | `onSubmit`, `onClose` |

## 7. OWASP Top 10 (Quick Reference)

1. **Broken Access Control** — Verify user permissions on every request
2. **Cryptographic Failures** — Use HTTPS, encrypt sensitive data at rest
3. **Injection** — Parameterized queries, input sanitization
4. **Insecure Design** — Rate limiting, proper error messages (no stack traces)
5. **Security Misconfiguration** — Remove debug endpoints, disable CORS in prod
6. **Vulnerable Components** — Regular dependency updates
7. **Auth Failures** — Implement MFA, secure session management
8. **Data Integrity Failures** — Verify integrity of serialized data
9. **Logging/Monitoring** — Log security events, alert on anomalies
10. **SSRF** — Validate URLs, restrict outbound traffic
