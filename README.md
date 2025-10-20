# Slack

A lightweight Slack-like chat application built with Next.js, Convex, and Jotai. This project demonstrates realtime chat, optimistic UI patterns, and a small component library built with Tailwind + Radix primitives.

## Features

- Channels and direct conversations
- Real-time messaging (Convex)
- Optimistic UI for immediate feedback (sidebar selection, optimistic messages)
- File upload support (images) with pre-signed upload URLs
- Reactions and thread counts (UI + backend support)
- Lightweight component library (Radix primitives + Tailwind CSS)
- TypeScript throughout

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Convex (serverless DB + functions)
- Jotai (global state for small atoms)
- Tailwind CSS
- TypeScript

## Local setup

Requirements:

- Node.js 18+ (recommended)
- npm

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000

> Note: This repo uses Convex for backend functions. See `/convex/README.md` for Convex-specific setup (local dev, environment variables). If you don't need Convex locally you can still run the frontend but server features will be unavailable.

## Important project files

- `app/` - Next.js App Router pages and layouts
  - `app/workspace/[workspaceId]/channel/[channelId]/page.tsx` - Channel page
  - `app/workspace/[workspaceId]/member/[memberId]/page.tsx` - Direct conversation page
- `components/` - UI components for channels, messages, sidebar, etc.
- `convex/` - Convex functions and schema
- `features/` - Feature folders (messages, channels, members, workspaces)
  - `features/messages` contains hooks and optimistic message helpers
  - `features/ui/store/navigation-pending.ts` - atom to show global navigation pending state

  ## Demo preview

  Short preview clip (first 40s) showing app interaction:

  <video controls width="720">
    <source src="https://res.cloudinary.com/dp0c5nive/video/upload/v1760127810/Screencast_20251011_010605_lupfke.webm" type="video/webm">
    Your browser does not support the video tag. You can download the preview here:
    [preview.webm](/screenshots/preview.webm)
  </video>

## Optimistic UI

The project uses optimistic UI in multiple places:

- Sidebar selection: updates visually immediately using a local optimistic ID so the active item changes instantly. The `navigation-pending` atom (Jotai) is used to show a loader overlay on the main page while the route fetches data.
- Messages: optimistic messages are added to a local optimistic store while the create message request completes. Reactions and message edits also use optimistic patterns.

Files of interest:

- `features/ui/store/navigation-pending.ts` — global boolean atom
- `components/workspace/workspace-sidebar.tsx` — sets `navigationPendingAtom` on navigation
- `app/workspace/[workspaceId]/channel/[channelId]/page.tsx` and `app/workspace/[workspaceId]/member/[memberId]/page.tsx` — read the atom and show a loader overlay during pending navigation
- `features/messages/store/use-optimistic-messages.ts` — optimistic message store (add/remove messages)

## Scripts

Available npm scripts (from `package.json`):

- `npm run dev` — start local Next.js dev server
- `npm run build` — build for production
- `npm run start` — run production server after build
- `npm run lint` — run Next.js lint

## Development notes

- Keep TypeScript types consistent with `convex/_generated/dataModel` (Convex types). Many components consume `Doc<"messages">` etc.
- When adding optimistic updates, follow existing patterns in `features/messages` and `features/ui`:
  - Add optimistic items to the optimistic store immediately
  - Use `onSuccess`/`onError` callbacks to reconcile or remove optimistic items
  - Use `navigationPendingAtom` when navigation triggers data fetches to show a consistent loader

## Contributing

PRs welcome. Please keep changes small and add types. If you modify Convex schema, run migrations and update generated types.

## Troubleshooting

- If you see type errors after changing Convex schema, run Convex codegen or regenerate the `convex/_generated/` files.
- If uploads fail, verify the upload URL generation Convex function and any required environment variables.

## License

This project is for learning/demo purposes. No license specified.
