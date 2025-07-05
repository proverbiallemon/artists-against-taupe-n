# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Artists Against Taupe is a community-driven website dedicated to transforming institutional spaces through art. The project showcases the work of artists who bring color and creativity to sterile environments.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite 5
- **Styling**: Tailwind CSS with custom color theme
- **Current Backend**: AWS Amplify Gen 2 (planned migration to Cloudflare)
- **Database**: DynamoDB (via Amplify)
- **Form Handling**: Formspree
- **State Management**: AWS Amplify DataStore

## Common Commands

```bash
# Development
npm run dev          # Start dev server on http://localhost:5173

# Build & Production
npm run build        # Build for production (outputs to /dist)
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint checks
```

## Architecture

### Frontend Structure
- `/src/components/` - React components for each website section
  - `Header.tsx` - Navigation
  - `ContactForm.tsx` - Formspree-integrated contact form
  - `Slideshow.tsx` - Image carousel component
  - Other section components (WhatWeStandFor, SpotlightFeature, etc.)

### AWS Amplify Integration (Current)
- `/amplify/backend/` - Backend resources defined with CDK
- `/src/API.ts` - Generated GraphQL types
- `/src/graphql/` - GraphQL operations (queries, mutations, subscriptions)
- GraphQL schema defines a Contact model for form submissions

### Key Configuration Files
- `vite.config.ts` - Vite bundler configuration
- `tailwind.config.js` - Custom theme colors: primary (#FF6B6B), secondary (#4ECDC4), accent (#FFA07A)
- `amplify.yml` - AWS Amplify build configuration

## Migration Notes for Cloudflare

When migrating from AWS Amplify to Cloudflare:

1. **Static Site**: The built output in `/dist` can be deployed directly to Cloudflare Pages
2. **Contact Form**: Migrate from Formspree to Resend
   - Use Cloudflare Pages Functions for the API endpoint
   - Store Resend API key in GitHub Secrets
   - Deploy via GitHub Actions to Cloudflare Pages
3. **GraphQL/Database**: Need to replace Amplify DataStore with Cloudflare alternatives:
   - Consider Cloudflare Workers + D1 for serverless functions and database
   - Or remove database dependency if using Resend for contact form is sufficient
4. **Environment Variables**: Check `aws-exports.js` and `amplifyconfiguration.json` for any API keys to migrate

## Resend + Cloudflare Pages Setup

### Contact Form Migration Plan
1. **Create Cloudflare Pages Function** at `/functions/api/contact.ts`:
   - Handle POST requests from the contact form
   - Verify Cloudflare Turnstile token
   - Use Resend API to send emails
   - Return appropriate response

2. **GitHub Secrets Required**:
   - `RESEND_API_KEY` - Your Resend API key
   - `CLOUDFLARE_API_TOKEN` - For Pages deployment
   - `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
   - `TURNSTILE_SECRET_KEY` - Server-side Turnstile secret

3. **Environment Variables for Build**:
   - `VITE_TURNSTILE_SITE_KEY` - Client-side Turnstile site key (public)

4. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
   - Build the Vite project
   - Deploy to Cloudflare Pages
   - Pass secrets as environment variables

5. **Update ContactForm.tsx**:
   - Add Cloudflare Turnstile widget
   - Change form action from Formspree to `/api/contact`
   - Include Turnstile token in form submission
   - Handle response from Cloudflare Function

### Cloudflare Turnstile Integration
1. **Install Turnstile React package**: `@marsidev/react-turnstile`
2. **Add to ContactForm.tsx**:
   - Import and render Turnstile component
   - Capture token on successful verification
   - Include token in form submission
3. **Verify in Pages Function**:
   - Check token validity with Turnstile API
   - Reject submissions with invalid tokens

## Development Workflow

1. The project uses Vite for fast HMR development
2. TypeScript for type safety - ensure all new components have proper types
3. Tailwind CSS for styling - use existing theme colors from config
4. Images are stored in `/public/images/` with organized subdirectories

## Testing

Currently no test suite configured. Consider adding:
- Vitest for unit testing (works well with Vite)
- React Testing Library for component tests