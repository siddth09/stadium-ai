# Contributing to StadiumAI

Thank you for considering contributing to StadiumAI! This document outlines the code standards and workflow.

## Code Standards

### TypeScript
- Use **strict TypeScript** — no `any` types. Use `unknown` and narrow.
- Prefix intentionally unused variables with `_` (e.g., `_event`, `_err`).
- All exported functions and types must have JSDoc comments.

### React
- Use **functional components** only — no class components (except ErrorBoundary).
- Wrap all exported components in `React.memo()` for memoization.
- Use `useCallback` for event handlers and `useMemo` for derived state.
- Avoid inline `style={{}}` — use CSS classes instead.

### CSS
- All styles must use the **CSS design token system** (see `index.css`).
- Create component-specific classes rather than writing inline styles.
- Use BEM-like naming: `component-name__element--modifier`.

### Security
- All user input must pass through `sanitizeInput()` before processing.
- All form data must be validated with **Zod schemas** before submission.
- AI responses rendered with `dangerouslySetInnerHTML` must use `DOMPurify.sanitize()`.
- Never commit API keys or secrets. Use environment variables.

### Testing
- Write tests for all new components, services, and utilities.
- Use `vitest` + `@testing-library/react` for component tests.
- Target **>80% code coverage** on all new code.

## Branch Strategy

- All changes go to the `main` branch (single branch as per challenge rules).
- Keep commits atomic and descriptive.

## Pull Request Guidelines

1. Run `npm run lint` and fix all warnings.
2. Run `npm run test:coverage` and ensure all tests pass.
3. Run `npm run build` to verify production build succeeds.
4. Keep the total repo size under **10 MB**.
