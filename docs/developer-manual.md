# Developer Manual

## Install

```bash
npm install
```

## Environment

```text
PORT=3100
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## Run

```bash
npm run dev
```

## API

- `GET /api/clubs`
- `POST /api/search`
- `POST /api/search-log`
- `GET /api/umd-courses`

## Known Bugs

- Search only matches words in the club title or description.

## Future Work

- Better categories.
- More search filters.
