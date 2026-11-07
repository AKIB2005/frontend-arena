# Grantly
A personal scholarship workspace: set your profile, see a match score and eligibility checklist on every scholarship, then track applications.
Stack: Vite, React, TypeScript, Tailwind CSS, React Router, Zustand (persisted to localStorage).
Run: `npm install && npm run dev`. Build: `npm run build`. Deploy: import on Vercel (vercel.json handles SPA routing).
Match logic lives in `src/match.ts`: score = criteria met / criteria that can be judged; unknown profile values are not penalised.
Data in `src/data.ts` is fictional sample data.
