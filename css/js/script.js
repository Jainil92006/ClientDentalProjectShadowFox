// main.js — handles nav toggle, testimonials, form validation, treatment toggles

document.addEventListener('DOMContentLoaded', function () {
  // mobile nav
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
  }

  // testimonials (simple slider)
  const testimonials = [
    "“The doctors are extremely kind and attentive. My braces treatment is progressing really well. 5/5.” – Manisha M",
    "“I got my teeth cleaned and whitened here, and the results were amazing. The staff is so humble and professional.” — Mr. Arun Kumar",
    "“Their attention to detail is outstanding. My daughter needed braces and the entire process has been so smooth.” — Mrs. Revathi S."
  ];
  let tIndex = 0;
  const testEl = document.getElementById('testimonials');
  function showTest(i) {
    if (!testEl) return;
    testEl.innerHTML = `<blockquote class="text-gray-700">${testimonials[i]}</blockquote>`;
  }
  if (testEl) showTest(0);
  let testInterval = setInterval(() => {
    tIndex = (tIndex + 1) % testimonials.length;
    showTest(tIndex);
  }, 4500);

  const prevBtn = document.getElementById('prevTest');
  const nextBtn = document.getElementById('nextTest');
  if (prevBtn) prevBtn.addEventListener('click', () => { tIndex = (tIndex - 1 + testimonials.length) % testimonials.length; showTest(tIndex); clearInterval(testInterval); });
  if (nextBtn) nextBtn.addEventListener('click', () => { tIndex = (tIndex + 1) % testimonials.length; showTest(tIndex); clearInterval(testInterval); });

  // contact form validation
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let ok = true;

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');

      const nameErr = document.getElementById('nameErr');
      const emailErr = document.getElementById('emailErr');
      const phoneErr = document.getElementById('phoneErr');
      const formSuccess = document.getElementById('formSuccess');

      // reset
      [nameErr, emailErr, phoneErr].forEach(el => el && (el.classList.add('hidden')));

      if (!name.value.trim()) { ok = false; nameErr.classList.remove('hidden'); }
      if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) { ok = false; emailErr.classList.remove('hidden'); }
      if (!phone.value.trim()) { ok = false; phoneErr.classList.remove('hidden'); }

      if (!ok) return;

      // simulate success (in real-life submit to server)
      form.reset();
      if (formSuccess) {
        formSuccess.classList.remove('hidden');
        setTimeout(() => formSuccess.classList.add('hidden'), 5000);
      }
    });
  }

  // treatment collapsible toggles
  const toggles = document.querySelectorAll('.treatment-toggle');
  const allPanels = document.querySelectorAll('.treatment-panel');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentCard = btn.closest('.treatment-card') || btn.parentElement;
      const panel = parentCard && parentCard.querySelector('.treatment-panel');
      if (!panel) return;

      // close others (accordion single-open)
      allPanels.forEach(p => {
        if (p !== panel) {
          p.classList.add('hidden');
          const siblingToggle = (p.closest('.treatment-card') || p.parentElement).querySelector('.treatment-toggle');
          if (siblingToggle) {
            siblingToggle.setAttribute('aria-expanded', 'false');
          }
          p.setAttribute('aria-hidden', 'true');
          const icon = (siblingToggle && siblingToggle.querySelector('svg'));
          if (icon) icon.style.transform = 'rotate(0deg)';
        }
      });

      const isHidden = panel.classList.contains('hidden');
      panel.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', String(isHidden));
      panel.setAttribute('aria-hidden', String(!isHidden));
      const icon = btn.querySelector('svg');
      if (icon) icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    });
  });

  // search and filter for treatments
  const searchInput = document.getElementById('treatmentSearch');
  const filterButtons = document.querySelectorAll('[data-filter]');
  const grid = document.getElementById('treatmentsGrid');
  const noResults = document.getElementById('noResults');

  function applyFilters() {
    if (!grid) return;
    const cards = grid.querySelectorAll('.treatment-card');
    const term = (searchInput && searchInput.value.trim().toLowerCase()) || '';
    const activeBtn = Array.from(filterButtons).find(b => b.getAttribute('data-active') === 'true');
    const category = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

    let anyVisible = false;
    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
      const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
      const body = (card.querySelector('.treatment-panel')?.textContent || '').toLowerCase();

      const matchesCategory = category === 'all' || cardCategory === category;
      const matchesTerm = !term || keywords.includes(term) || title.includes(term) || body.includes(term);
      const show = matchesCategory && matchesTerm;
      card.style.display = show ? '' : 'none';
      if (show) anyVisible = true;
    });

    if (noResults) noResults.classList.toggle('hidden', anyVisible);
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  if (filterButtons.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.removeAttribute('data-active'));
        btn.setAttribute('data-active', 'true');
        applyFilters();
      });
    });
  }
  // Run once on load to honor defaults
  applyFilters();

  // Back to top reveal
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      const show = window.scrollY > 400;
      backToTop.classList.toggle('hidden', !show);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // hero image auto-rotator (every 3s) if heroImage exists
  const heroImageEl = document.getElementById('heroImage');
  if (heroImageEl) {
    const imagesAttr = heroImageEl.getAttribute('data-images') || '';
    const imageList = imagesAttr.split(',').map(s => s.trim()).filter(Boolean);
    let heroIndex = 0;
    if (imageList.length > 1) {
      setInterval(() => {
        heroIndex = (heroIndex + 1) % imageList.length;
        heroImageEl.style.opacity = '0';
        setTimeout(() => {
          heroImageEl.src = imageList[heroIndex];
          heroImageEl.style.opacity = '1';
        }, 300);
      }, 3000);
    }
  }
});
