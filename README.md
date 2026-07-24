# Battle Atlas

An educational visualization platform for exploring famous historical, fantasy, and science-fiction battles through animated tactical maps.

The first expedition follows the Battle of Waterloo with a replayable timeline, animated formations, event narration, commander profiles, force estimates, and historical context.

## Run locally

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm run build
```

## Architecture

The current release is a static React and TypeScript application powered by Vite. Battle content and movement paths are data-driven in `src/data.ts`; shared content types live in `src/types.ts`. The tactical map uses a custom vector renderer so the same replay model can later support historical terrain as well as fictional worlds without depending on proprietary map tiles.
