# UMD Club Finder

A simple website for searching UMD clubs.

Live site: https://umd-club-finder-theta.vercel.app

## Target Browsers

Chrome, Safari, Firefox, and Edge.

## Pages

- `index.html`
- `finder.html`
- `about.html`

## Libraries

- Chart.js
- Day.js

Developer manual: `docs/developer-manual.md`

## Developer Notes

### Install

```bash
npm install
```

### Environment

Create a `.env` file:

```text
PORT=3100
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Run

```bash
npm run dev
```

Open `http://localhost:3100`.

### API Routes

- `GET /api/clubs` - gets clubs
- `POST /api/search` - searches clubs
- `POST /api/search-log` - saves a search
- `GET /api/umd-courses` - gets data from umd.io

### Known Bugs

- Search is basic keyword search.

### Future Work

- Add better categories.
- Add better filters.
