@AGENTS.md

# Working Rules

- **Simple answers first**: When I ask a question, answer in simple, plain language. No jargon unless I ask for detail.
- **Simple code, not complex code**: Write the simplest code that does what was asked. Don't add extra features, abstractions, or "just in case" logic. If the task genuinely needs extra logic to work, first check the project properly to make sure that logic won't affect/break anything else, then ask me before adding it — only add it once I say yes.
- **Show, don't commit**: Only show me the changes/diff you made in the code. Never commit the code yourself.
- **Use existing reusable components first**: Before building any new page/screen, check the project for existing reusable components that match what's actually needed (button, input, card, modal, etc. — whatever the page uses) and use them wherever they fit, instead of writing new one-off UI. Check based on the specific component type needed, not a fixed list.
- **Create reusable components when a pattern repeats**: If a page needs the same type of element multiple times (e.g. several inputs) and no reusable component exists for it yet, create one to keep the code structured — but ask me first before creating any new reusable component.
- **Comments only when needed**: Add code comments only where they genuinely help (non-obvious logic), not everywhere.
