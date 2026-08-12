// ---------------------------------------------------------------
// home.js — logic for the CinemaConnect home page only
// (hero image slide-bar + featured movies grid)
//
// Both the slider and the grid read from ccGetMovies() (data.js) —
// a single source of truth, so there's only one place to edit the
// movie catalog.
// ---------------------------------------------------------------

function ccGetMoviesSafe() {
  if (typeof ccGetMovies === 'function') return ccGetMovies();
  // Fallback so this page still renders something if data.js failed to load
  return [];
}

// --- Hero image slide-bar ---
function ccInitHeroSlider() {
  const sliderEl = document.getElementById('heroSlider');
  const track = document.getElementById('sliderTrack');
  const dotsWrap = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  if (!sliderEl || !track) return;

  // Use the first 5 movies (with a banner image) as hero slides
  const slidesData = ccGetMoviesSafe()
    .filter((m) => typeof m.banner === 'string' && m.banner.trim() !== '')
    .slice(0, 5);

  if (!slidesData.length) {
    track.innerHTML = '';
    if (dotsWrap) dotsWrap.innerHTML = '';
    return;
  }

  track.innerHTML = slidesData
    .map((m) => {
      const tag = ccIsUpcoming(m) ? 'Coming Soon' : 'Now Showing';
      return `
      <div class="slide" style="background-image:url('${m.banner}')">
        <div class="slide-caption">
          <h3>${m.title}</h3>
          <p>${m.genre} · ${tag}</p>
        </div>
      </div>`;
    })
    .join('');

  // Build dots
  dotsWrap.innerHTML = '';
  slidesData.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);
  const slides = Array.from(track.children);

  let index = 0;
  let autoplayId = null;

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(next, 5000);
  }

  function stopAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
  }

  prevBtn?.addEventListener('click', () => {
    prev();
    startAutoplay();
  });
  nextBtn?.addEventListener('click', () => {
    next();
    startAutoplay();
  });

  sliderEl.addEventListener('mouseenter', stopAutoplay);
  sliderEl.addEventListener('mouseleave', startAutoplay);

  render();
  startAutoplay();
}

// --- Featured movies grid ---
function ccRenderFeaturedMovies() {
  const grid = document.getElementById('featuredMovies');
  if (!grid) return;

  const movies = ccGetMoviesSafe().slice(0, 4);

  grid.innerHTML = movies
    .map((m) => {
      const upcoming = ccIsUpcoming(m);
      const meta = upcoming
        ? `${m.genre} · Coming Soon`
        : `${m.genre} · ★ ${m.rating ?? '—'}`;
      return `
      <article class="movie-card">
        <div class="movie-poster" style="background-image:url('${m.poster}')"></div>
        <div class="movie-info">
          <h3>${m.title}</h3>
          <p class="movie-meta${upcoming ? ' upcoming' : ''}">${meta}</p>
          <a class="btn btn-primary btn-sm" href="browse.html">Book Now</a>
        </div>
      </article>`;
    })
    .join('');
}

document.addEventListener('DOMContentLoaded', () => {
  ccInitHeroSlider();
  ccRenderFeaturedMovies();
});
