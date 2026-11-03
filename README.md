# Smart Campus Room Availability Checker (Assignment #04)

React + TypeScript + Vite prototype. Fictional data only, fixed current time (09:00), no login, payments, API or database.

## Setup
```
npm install
npm install -D jsdom @testing-library/react @testing-library/dom   # needed once, for the UI tests
```

## Run
```
npm run dev        # development server
npm run build      # production build
npm run lint
npm run typecheck
```

## Test
```
npm test           # vitest run (all tests)
```

## Versions (git tags)
- `v0` - starting point (Practice #06 prototype, 1 test file, 19 tests)
- `v1-feature` - room catalog (5 rooms), capacity/equipment filters, empty state
- `v2-final` - refactored into data / rules / filtering / time / components

## Structure (v2-final)
- `src/types.ts` - shared types
- `src/data/rooms.ts` - fictional room catalog, equipment list, fixed time
- `src/utils/availability.ts` - availability rules (AC1-AC5), unchanged behavior
- `src/utils/filtering.ts` - capacity/equipment filters (F1, F2), attendees parsing
- `src/utils/time.ts`, `src/utils/request.ts` - time formatting and parsing
- `src/components/*` - presentation components
- `src/App.tsx` - state and composition
