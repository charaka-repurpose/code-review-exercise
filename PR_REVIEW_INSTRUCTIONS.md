# PR Review Exercise - Instructions for Candidate

## Overview

You are reviewing a Pull Request for a user management system with authentication. The PR adds new features for password reset and user statistics.

**Time Limit:** 20 minutes

---

## Context

This is a Node.js/Express backend with a React frontend. The application manages users with authentication and role-based authorization (admin/user roles).

The existing codebase already has basic user management, authentication, and CRUD operations working.

---

## The PR

**Branch:** `feature/password-reset-and-stats`

**Description:**
> feat: Add password reset and user statistics endpoints
> 
> - Added POST /api/users/:id/password endpoint for users to change their passwords
> - Added GET /api/users/stats/summary endpoint to get user role statistics  
> - Refactored authorizeRole middleware for better readability
> - Added corresponding API functions in frontend services
> 
> Closes #123

**Files Changed:**
- `backend/routes/users.js` - Added 2 new endpoints
- `backend/middleware/auth.js` - Refactored authorization logic
- `frontend/src/services/api.js` - Added API functions for new endpoints

---

## Your Task

Review this PR as you would in a real work environment. Document:

1. **Issues Found** - List any problems, bugs, or concerns (prioritized by severity)
2. **Severity Level** - Critical, High, Medium, or Low for each issue
3. **Suggested Fixes** - How would you fix each issue?
4. **Overall Recommendation** - Should this PR be:
   - ✅ Approved
   - 🔄 Request Changes
   - ❌ Rejected

---

## What to Look For

Focus on what matters most:
- **Security vulnerabilities** (authentication, authorization, injection, data exposure)
- **Logic bugs** (incorrect business logic, edge cases)
- **Functional correctness** (will it work as intended?)
- **Best practices** (but prioritize security and correctness over style)

---

## Instructions

1. Check out the PR branch:
   ```bash
   git checkout feature/password-reset-and-stats
   ```

2. Review the changes:
   ```bash
   git diff main...feature/password-reset-and-stats
   ```

3. Or review files directly:
   - `backend/routes/users.js`
   - `backend/middleware/auth.js`
   - `frontend/src/services/api.js`

4. Document your findings in whatever format you prefer (comments, doc, etc.)

5. Submit your review when done or when time is up

---

## Tips

- Don't try to find everything - focus on the most important issues
- Think about what could go wrong in production
- Consider: "What would an attacker try to exploit?"
- Prioritize your findings - what should be fixed first?
- You're reviewing for a production system with real users

---

## Evaluation Criteria

You will be evaluated on:
- ✅ Ability to identify critical security issues
- ✅ Understanding of authentication and authorization
- ✅ Prioritization skills (critical vs. nice-to-have)
- ✅ Quality of suggested fixes
- ✅ Communication clarity

Good luck! 🚀


