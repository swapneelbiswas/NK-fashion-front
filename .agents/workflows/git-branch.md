---
description: Git workflow — after completing work, commit changes, checkout dev, pull latest, and create a new feature branch
---

# Git Branch Workflow

Run this workflow after completing a task to properly commit your work and set up a fresh branch for the next task.

## Steps

// turbo
1. **Check for uncommitted changes** — see what files were modified:
```bash
git status
```

2. **Stage all changes**:
```bash
git add .
```

3. **Commit with a descriptive message** — ask the user for a commit message, or generate one based on the work done:
```bash
git commit -m "<descriptive commit message>"
```

// turbo
4. **Push the current branch** to remote:
```bash
git push origin HEAD
```

// turbo
5. **Switch to `dev` branch**:
```bash
git checkout dev
```

// turbo
6. **Pull latest from `dev`**:
```bash
git pull origin dev
```

7. **Create and switch to a new feature branch** — ask the user for the branch name, or suggest one based on the next task:
```bash
git checkout -b <branch-name>
```

## Branch Naming Convention

Use this format: `feature/<short-description>`

Examples:
- `feature/add-session-list`
- `feature/fix-delivery-modal`
- `bugfix/login-redirect`
- `hotfix/api-timeout`

## Notes

- Always branch from `dev`, never from `main` or another feature branch
- Use kebab-case for branch names
- Keep branch names short but descriptive
- If there are merge conflicts during `git pull`, resolve them before creating the new branch
