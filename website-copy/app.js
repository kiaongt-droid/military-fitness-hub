const pageButtons = Array.from(document.querySelectorAll('[data-target]'));
const pages = Array.from(document.querySelectorAll('.page'));
const profileForm = document.getElementById('profileForm');
const profileNameInput = document.getElementById('profileNameInput');
const profileAgeInput = document.getElementById('profileAgeInput');
const profileHeightInput = document.getElementById('profileHeightInput');
const profileWeightInput = document.getElementById('profileWeightInput');
const profileWaistInput = document.getElementById('profileWaistInput');
const profileNameEl = document.getElementById('profileName');
const profileDetailsEl = document.getElementById('profileDetails');
const profileAvatarEl = document.getElementById('profileAvatar');
const latestPhysicalSummary = document.getElementById('latestPhysicalSummary');
const latestCombatSummary = document.getElementById('latestCombatSummary');
const physicalForm = document.getElementById('physicalForm');
const combatForm = document.getElementById('combatForm');
const physicalHistory = document.getElementById('physicalHistory');
const combatHistory = document.getElementById('combatHistory');
const physicalHistoryRefresh = document.getElementById('physicalHistoryRefresh');
const combatHistoryRefresh = document.getElementById('combatHistoryRefresh');
const weakExercisesEl = document.getElementById('weakExercises');
const trainingNotes = document.getElementById('trainingNotes');
const generateTrainingPlanBtn = document.getElementById('generateTrainingPlan');
const trainingPlanOutput = document.getElementById('trainingPlanOutput');
const mealForm = document.getElementById('mealForm');
const mealGoal = document.getElementById('mealGoal');
const dietRestrictions = document.getElementById('dietRestrictions');
const mealPlanOutput = document.getElementById('mealPlanOutput');

const run3Chart = document.getElementById('run3Chart');
const plankChart = document.getElementById('plankChart');
const pullupChart = document.getElementById('pullupChart');
const mufChart = document.getElementById('mufChart');
const run880Chart = document.getElementById('run880Chart');
const ammoChart = document.getElementById('ammoChart');

const PROFILE_KEY = 'mfhub-profile';
const PHYSICAL_RECORDS_KEY = 'mfhub-physical-records';
const COMBAT_RECORDS_KEY = 'mfhub-combat-records';

function showPage(pageId) {
  pages.forEach(page => page.classList.toggle('active', page.id === pageId));
  pageButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.target === pageId));
  if (pageId === 'dashboard') {
    renderDashboardSummary();
  }
  if (pageId === 'physical-test') {
    renderPhysicalHistory();
  }
  if (pageId === 'combat-test') {
    renderCombatHistory();
  }
  if (pageId === 'performance-graphs') {
    renderGraphs();
  }
  if (pageId === 'training-ai') {
    renderWeaknesses();
  }
}

pageButtons.forEach(button => {
  button.addEventListener('click', () => showPage(button.dataset.target));
});

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

function getStorage(key) {
  const raw = localStorage.getItem(key);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadProfile() {
  const profile = getStorage(PROFILE_KEY) || {};
  profileNameInput.value = profile.name || '';
  profileAgeInput.value = profile.age || '';
  profileHeightInput.value = profile.height || '';
  profileWeightInput.value = profile.weight || '';
  profileWaistInput.value = profile.waist || '';
  updateProfileSummary(profile);
}

function updateProfileSummary(profile) {
  const name = profile.name || '—';
  const age = profile.age || '—';
  const height = profile.height || '—';
  const weight = profile.weight || '—';
  const waist = profile.waist || '—';

  profileNameEl.textContent = `Name: ${name}`;
  profileDetailsEl.textContent = `Age: ${age} | Height: ${height} | Weight: ${weight} | Waist: ${waist}`;
  profileAvatarEl.textContent = name.trim() ? name.trim().split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase() : 'MF';
}

profileForm.addEventListener('submit', event => {
  event.preventDefault();
  const profile = {
    name: profileNameInput.value.trim(),
    age: profileAgeInput.value.trim(),
    height: profileHeightInput.value.trim(),
    weight: profileWeightInput.value.trim(),
    waist: profileWaistInput.value.trim(),
  };
  setStorage(PROFILE_KEY, profile);
  updateProfileSummary(profile);
  alert('Profile saved.');
});

function createEntry(summary, values) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now(),
    summary,
    values,
  };
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function renderHistory(records, container, metricFormatter) {
  container.innerHTML = '';
  if (!records.length) {
    container.innerHTML = '<p class="empty-state">No entries saved yet.</p>';
    return;
  }

  records.slice(0, 10).forEach(entry => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `<div><strong>${formatDate(entry.timestamp)}</strong><p>${entry.summary}</p></div><span>${metricFormatter(entry.values)}</span>`;
    container.appendChild(item);
  });
}

function renderPhysicalHistory() {
  const records = getStorage(PHYSICAL_RECORDS_KEY) || [];
  renderHistory(records, physicalHistory, values => `${formatTime(values.run3)} | ${formatTime(values.plank)} | ${values.pullups} pull-ups`);
}

function renderCombatHistory() {
  const records = getStorage(COMBAT_RECORDS_KEY) || [];
  renderHistory(records, combatHistory, values => `${formatTime(values.muf)} | ${formatTime(values.run880)} | ${values.ammoLifts} lifts`);
}

function renderDashboardSummary() {
  const physicalRecords = getStorage(PHYSICAL_RECORDS_KEY) || [];
  const combatRecords = getStorage(COMBAT_RECORDS_KEY) || [];

  if (physicalRecords.length) {
    const last = physicalRecords[0];
    latestPhysicalSummary.textContent = `${formatDate(last.timestamp)} — ${formatTime(last.values.run3)} run, ${formatTime(last.values.plank)} plank, ${last.values.pullups} pull-ups`;
  } else {
    latestPhysicalSummary.textContent = 'No physical fitness entries yet.';
  }

  if (combatRecords.length) {
    const last = combatRecords[0];
    latestCombatSummary.textContent = `${formatDate(last.timestamp)} — ${formatTime(last.values.muf)} MUF, ${formatTime(last.values.run880)} 880m, ${last.values.ammoLifts} lifts`;
  } else {
    latestCombatSummary.textContent = 'No combat fitness entries yet.';
  }
}

physicalForm.addEventListener('submit', event => {
  event.preventDefault();
  const run3 = safeNumber(document.getElementById('run3Minutes').value) * 60 + safeNumber(document.getElementById('run3Seconds').value);
  const plank = safeNumber(document.getElementById('plankMinutes').value) * 60 + safeNumber(document.getElementById('plankSeconds').value);
  const pullups = safeNumber(document.getElementById('pullupCount').value);

  const summary = `${formatTime(run3)} run / ${formatTime(plank)} plank / ${pullups} pull-ups`;
  const entry = createEntry(summary, { run3, plank, pullups });
  const records = [entry, ...(getStorage(PHYSICAL_RECORDS_KEY) || [])];
  setStorage(PHYSICAL_RECORDS_KEY, records);
  renderPhysicalHistory();
  renderDashboardSummary();
  alert('Physical fitness entry saved.');
  physicalForm.reset();
});

combatForm.addEventListener('submit', event => {
  event.preventDefault();
  const muf = safeNumber(document.getElementById('mufMinutes').value) * 60 + safeNumber(document.getElementById('mufSeconds').value);
  const run880 = safeNumber(document.getElementById('run880Minutes').value) * 60 + safeNumber(document.getElementById('run880Seconds').value);
  const ammoLifts = safeNumber(document.getElementById('ammoLiftCount').value);

  const summary = `${formatTime(muf)} MUF / ${formatTime(run880)} 880m / ${ammoLifts} lifts`;
  const entry = createEntry(summary, { muf, run880, ammoLifts });
  const records = [entry, ...(getStorage(COMBAT_RECORDS_KEY) || [])];
  setStorage(COMBAT_RECORDS_KEY, records);
  renderCombatHistory();
  renderDashboardSummary();
  alert('Combat fitness entry saved.');
  combatForm.reset();
});

physicalHistoryRefresh.addEventListener('click', renderPhysicalHistory);
combatHistoryRefresh.addEventListener('click', renderCombatHistory);

function chartPoints(records, key) {
  return records.map(entry => ({ x: new Date(entry.timestamp), y: entry.values[key] }));
}

function drawLineChart(canvas, points, color) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  if (!points.length) {
    ctx.fillStyle = '#7d83a5';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('No records yet', 20, height / 2);
    return;
  }

  const padding = 40;
  const xValues = points.map(point => point.x.getTime());
  const yValues = points.map(point => point.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  ctx.strokeStyle = '#6473f0';
  ctx.fillStyle = '#aab3ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = padding + ((point.x.getTime() - minX) / rangeX) * (width - padding * 2);
    const y = height - padding - ((point.y - minY) / rangeY) * (height - padding * 2);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    ctx.arc(x, y, 3, 0, Math.PI * 2);
  });
  ctx.stroke();

  ctx.fillStyle = color;
  points.forEach(point => {
    const x = padding + ((point.x.getTime() - minX) / rangeX) * (width - padding * 2);
    const y = height - padding - ((point.y - minY) / rangeY) * (height - padding * 2);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.strokeStyle = '#3c455f';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= 4; i += 1) {
    const y = padding + ((height - padding * 2) / 4) * i;
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
  }
  ctx.stroke();
}

function renderGraphs() {
  const physicalRecords = (getStorage(PHYSICAL_RECORDS_KEY) || []).slice().reverse();
  const combatRecords = (getStorage(COMBAT_RECORDS_KEY) || []).slice().reverse();

  drawLineChart(run3Chart, chartPoints(physicalRecords, 'run3'), '#81c784');
  drawLineChart(plankChart, chartPoints(physicalRecords, 'plank'), '#64b5f6');
  drawLineChart(pullupChart, chartPoints(physicalRecords, 'pullups'), '#ffb74d');
  drawLineChart(mufChart, chartPoints(combatRecords, 'muf'), '#e57373');
  drawLineChart(run880Chart, chartPoints(combatRecords, 'run880'), '#ba68c8');
  drawLineChart(ammoChart, chartPoints(combatRecords, 'ammoLifts'), '#4db6ac');
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((acc, next) => acc + next, 0) / values.length;
}

function getWeaknesses() {
  const physicalRecords = getStorage(PHYSICAL_RECORDS_KEY) || [];
  const combatRecords = getStorage(COMBAT_RECORDS_KEY) || [];
  const weaknesses = [];

  if (physicalRecords.length) {
    const data = physicalRecords[0].values;
    weaknesses.push({ label: '3-mile run', value: data.run3, direction: 'lower' });
    weaknesses.push({ label: 'Plank', value: data.plank, direction: 'higher' });
    weaknesses.push({ label: 'Pull-ups', value: data.pullups, direction: 'higher' });
  }

  if (combatRecords.length) {
    const data = combatRecords[0].values;
    weaknesses.push({ label: 'MUF', value: data.muf, direction: 'lower' });
    weaknesses.push({ label: '880m run', value: data.run880, direction: 'lower' });
    weaknesses.push({ label: 'Ammo can lifts', value: data.ammoLifts, direction: 'higher' });
  }

  if (!weaknesses.length) {
    return [{ label: 'No data available yet', note: 'Log entries to see weak exercise highlights.' }];
  }

  return weaknesses
    .sort((a, b) => {
      if (a.direction === 'higher' && b.direction === 'lower') return -1;
      if (a.direction === 'lower' && b.direction === 'higher') return 1;
      return a.direction === 'lower' ? b.value - a.value : a.value - b.value;
    })
    .slice(0, 3)
    .map(metric => {
      const note = metric.direction === 'higher'
        ? `Focus on building volume for ${metric.label}.`
        : `Focus on speed for ${metric.label}.`;
      return `${metric.label}: ${metric.direction === 'lower' ? formatTime(metric.value) : metric.value} — ${note}`;
    });
}

function renderWeaknesses() {
  const weaknesses = getWeaknesses();
  weakExercisesEl.innerHTML = weaknesses.map(item => `<div class="weak-item">${item}</div>`).join('');
}

function buildTrainingPlan(weaknesses) {
  if (!weaknesses.length || weaknesses[0].includes('No data')) {
    return 'Log physical and combat fitness entries first, then generate a training plan based on the latest weak events.';
  }

  return `Weekly Training Plan

- Monday: ${weaknesses[0]} with interval work and mobility.
- Wednesday: ${weaknesses[1]} with strength and endurance drills.
- Friday: ${weaknesses[2]} with recovery, core, and technique practice.

Focus on gradual progress, controlled volume, and consistent recovery. Add sprint intervals, plank variation, and pull-up progressions as needed.`;
}

generateTrainingPlanBtn.addEventListener('click', async () => {
  generateTrainingPlanBtn.disabled = true;
  generateTrainingPlanBtn.textContent = 'Generating…';
  const weaknesses = getWeaknesses();
  const manualNotes = trainingNotes.value.trim();

  // Placeholder for AI endpoint integration.
  // Replace with a real API request to OpenAI or another service.
  await new Promise(resolve => setTimeout(resolve, 600));

  const plan = buildTrainingPlan(weaknesses);
  trainingPlanOutput.textContent = `${plan}${manualNotes ? '\n\nNotes: ' + manualNotes : ''}`;

  generateTrainingPlanBtn.disabled = false;
  generateTrainingPlanBtn.textContent = 'Generate Plan';
});

mealForm.addEventListener('submit', async event => {
  event.preventDefault();
  mealForm.querySelector('button').disabled = true;
  mealForm.querySelector('button').textContent = 'Generating…';

  const goal = mealGoal.value;
  const restrictions = dietRestrictions.value.trim();

  await new Promise(resolve => setTimeout(resolve, 500));

  const mealPlan = `Recommended meal plan for ${goal}${restrictions ? ` with ${restrictions}` : ''}:

- Breakfast: Oats with berries, nuts, and a lean protein source.
- Lunch: Grilled chicken or tofu bowl with mixed greens and whole grains.
- Snack: Greek yogurt or a protein shake with fruit.
- Dinner: Salmon or lentil stew with vegetables and a side of complex carbs.

Adjust portion size to support your goal and keep hydration consistent.`;

  mealPlanOutput.textContent = mealPlan;
  mealForm.querySelector('button').disabled = false;
  mealForm.querySelector('button').textContent = 'Generate Meal Plan';
});

function initialize() {
  loadProfile();
  renderDashboardSummary();
  renderWeaknesses();
}

initialize();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Service worker registered.'))
      .catch(error => console.error('Service worker registration failed:', error));
  });
}
