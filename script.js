/* Advanced filtering + search + sort for smoothie list */

const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const list = document.getElementById('smoothieList');
const items = Array.from(document.querySelectorAll('.smoothie-item'));

// Manage active filters: allow multiple category selection; 'all' resets
filterButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const filter = btn.dataset.filter;
    if (filter === 'all') {
      // reset: make all buttons inactive except 'all'
      filterButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
    } else {
      // toggle button
      const allBtn = filterButtons.find(b => b.dataset.filter === 'all');
      allBtn.classList.remove('active');
      allBtn.setAttribute('aria-pressed','false');
      btn.classList.toggle('active');
      btn.setAttribute('aria-pressed', btn.classList.contains('active'));
      // if no specific filters selected, re-enable 'all'
      const anyActive = filterButtons.some(b => b.dataset.filter !== 'all' && b.classList.contains('active'));
      if (!anyActive) {
        allBtn.classList.add('active'); allBtn.setAttribute('aria-pressed','true');
      }
    }
    applyFilters();
  });
});

searchInput.addEventListener('input', () => applyFilters());
sortSelect.addEventListener('change', () => applyFilters());

function applyFilters() {
  const activeFilters = filterButtons.filter(b => b.classList.contains('active') && b.dataset.filter !== 'all').map(b => b.dataset.filter);
  const query = searchInput.value.trim().toLowerCase();

  // Filter items
  let visible = items.filter(item => {
    const title = item.dataset.title || item.querySelector('h3').textContent.toLowerCase();
    const category = item.dataset.category || '';
    // category filter
    const categoryMatch = activeFilters.length === 0 || activeFilters.includes(category);
    // search filter
    const searchMatch = title.includes(query);
    return categoryMatch && searchMatch;
  });

  // Sort visible items
  const sortVal = sortSelect.value;
  if (sortVal === 'name-asc') {
    visible.sort((a,b) => a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent));
  } else if (sortVal === 'name-desc') {
    visible.sort((a,b) => b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent));
  }

  // Update DOM: hide all then re-append visible in order
  items.forEach(i => { i.classList.add('hide'); i.style.display='none'; });
  visible.forEach(v => {
    v.classList.remove('hide');
    v.style.display = 'flex';
    list.appendChild(v); // keep visible items in sorted order
  });
}

// initial run
applyFilters();
