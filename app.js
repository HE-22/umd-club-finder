function card(club) {
  return `
    <div class="club-card">
      <h3>${club.title}</h3>
      <p>${club.summary || 'No description.'}</p>
      <a href="${club.source_url}" target="_blank">View club</a>
    </div>
  `;
}

function showClubs(clubs, selector) {
  const box = document.querySelector(selector);
  if (!box) return;
  box.innerHTML = clubs.length ? clubs.map(card).join('') : '<p>No clubs found.</p>';
}

async function loadHome() {
  const box = document.querySelector('#featuredClubs');
  if (!box) return;

  const response = await fetch('/api/clubs');
  const clubs = await response.json();
  showClubs(clubs.slice(0, 3), '#featuredClubs');
}

async function loadSearch() {
  const form = document.querySelector('#searchForm');
  if (!form) return;

  const input = document.querySelector('#searchInput');
  const status = document.querySelector('#searchStatus');

  async function showAll() {
    status.textContent = 'Loading...';
    const response = await fetch('/api/clubs');
    const clubs = await response.json();
    showClubs(clubs, '#clubResults');
    status.textContent = 'Showing all clubs.';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = input.value.trim();

    if (!query) {
      showAll();
      return;
    }

    status.textContent = 'Searching...';
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const clubs = await response.json();

    fetch('/api/search-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, matchedCount: clubs.length })
    });

    showClubs(clubs, '#clubResults');
    status.textContent = `Found ${clubs.length} clubs.`;
  });

  showAll();
}

async function loadAbout() {
  const chart = document.querySelector('#categoryChart');
  const list = document.querySelector('#umdCourses');
  if (!chart || !list) return;

  const clubs = await fetch('/api/clubs').then((response) => response.json());
  const counts = { Business: 0, Cultural: 0, Sports: 0, Technology: 0 };

  for (const club of clubs) {
    const text = `${club.title} ${club.summary || ''}`.toLowerCase();
    if (text.includes('business')) counts.Business++;
    if (text.includes('culture')) counts.Cultural++;
    if (text.includes('sport') || text.includes('team')) counts.Sports++;
    if (text.includes('tech') || text.includes('computer')) counts.Technology++;
  }

  new Chart(chart, {
    type: 'bar',
    data: {
      labels: Object.keys(counts),
      datasets: [{ label: 'Clubs', data: Object.values(counts) }]
    }
  });

  const courses = await fetch('/api/umd-courses').then((response) => response.json());
  list.innerHTML = courses.map((course) => `<li>${course}</li>`).join('');
  document.querySelector('#apiDate').textContent = dayjs().format('MMM D, YYYY');
}

loadHome();
loadSearch();
loadAbout();
