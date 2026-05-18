import dotenv from 'dotenv';
import express from 'express';

dotenv.config({ override: true, quiet: true });

const app = express();
const port = process.env.PORT || 3100;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.get('/api/index.js', (req, res) => {
  res.sendFile('index.html', { root: process.cwd() });
});

app.use(express.static(process.cwd()));

app.get('/api/clubs', async (req, res) => {
  try {
    res.json(await getClubs());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/search', async (req, res) => {
  const query = String(req.body.query || '').trim();
  if (!query) return res.status(400).json({ error: 'query is required' });

  try {
    const clubs = await getClubs();
    res.json(searchClubs(clubs, query));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/search-log', async (req, res) => {
  const query = String(req.body.query || '').trim();
  const matchedCount = Number(req.body.matchedCount || 0);
  if (!query) return res.status(400).json({ error: 'query is required' });

  try {
    const rows = await supabase('search_logs', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ query, matched_count: matchedCount })
    });
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/umd-courses', async (req, res) => {
  const response = await fetch('https://api.umd.io/v1/courses?per_page=3');
  const courses = await response.json();
  res.json(courses.map((course) => `${course.course_id}: ${course.name}`));
});

async function getClubs() {
  return supabase('clubs?select=id,title,summary,source_url&order=title.asc');
}

async function supabase(path, options = {}) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (!response.ok) throw new Error('Supabase request failed');
  return response.json();
}

function searchClubs(clubs, query) {
  const words = query.toLowerCase().split(' ');

  return clubs.filter((club) => {
    const text = `${club.title} ${club.summary || ''}`.toLowerCase();
    return words.some((word) => text.includes(word));
  }).slice(0, 12);
}

if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
}

export default app;
