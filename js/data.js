// ---------------------------------------------------------------
// data.js — shared data layer for CinemaConnect
// Must be loaded BEFORE nav.js and any page-specific script on
// every page: <script src="js/data.js"></script>
//
// No backend in this project, so everything persists in the
// browser via localStorage. That's enough for the training
// project's requirements (Admin can manage content, users can
// register/login, bookings persist per browser).
// ---------------------------------------------------------------

const CC_KEYS = {
  MOVIES: 'cc_movies',
  USERS: 'cc_users',
  SESSION: 'cc_session',
  BOOKINGS: 'cc_bookings',
};

// ---- Seed data (written to localStorage only the first time the site loads) ----
// `releaseDate` drives the "Now Showing" / "Coming Soon" badge automatically —
// no need to update a status field by hand as the calendar moves forward.
// `rating` is left out for movies that haven't released yet.
const CC_SEED_MOVIES = [
  {
    id: 'm1',
    title: 'Evil Dead Burn',
    genre: 'Horror',
    rating: 6.9,
    duration: 106,
    poster: 'images/posters/evil-dead-burn.jpg',
    banner: 'images/banners/evil-dead-burn-banner.jpg',
    description: 'After losing her husband, a woman turns to her in-laws for comfort — only to watch them turn into deadites one by one, forcing her to fight for survival.',
    releaseDate: '2026-07-24',
    showtimes: ['13:00', '16:30', '20:00', '22:45'],
    price: 120,
  },
  {
    id: 'm2',
    title: 'Insidious: Out of the Further',
    genre: 'Horror',
    duration: 107,
    poster: 'images/posters/insidious-out-of-the-further.jpg',
    banner: 'images/banners/insidious-6-banner.jpg',
    description: 'A trio of stalkers drag a new family into the astral plane, revealing a chilling truth: the Further is starting to bleed into our world.',
    releaseDate: '2026-08-21',
    showtimes: ['14:00', '17:30', '20:15'],
    price: 110,
  },
  {
    id: 'm3',
    title: 'Scream 7',
    genre: 'Horror',
    rating: 5.8,
    duration: 111,
    poster: 'images/posters/scream-7.jpg',
    banner: 'images/banners/scream-7-banner.jpg',
    description: "A new Ghostface killer surfaces in the quiet town where Sidney Prescott rebuilt her life, and this time her own daughter becomes the target.",
    releaseDate: '2026-02-27',
    showtimes: ['13:15', '16:00', '19:30', '22:00'],
    price: 110,
  },
  {
    id: 'm4',
    title: 'Spider-Man: Brand New Day',
    genre: 'Action',
    rating: 7.8,
    duration: 150,
    poster: 'images/posters/spider-man-brand-new-day.jpg',
    banner: 'images/banners/spiderman-bnd-banner.jpg',
    description: 'The world has forgotten Peter Parker ever existed, but he keeps protecting it anyway — until a threat he can barely see forces a change he may not be able to control.',
    releaseDate: '2026-07-31',
    showtimes: ['12:00', '15:30', '19:00', '22:15'],
    price: 150,
  },
  {
    id: 'm5',
    title: 'The Odyssey',
    genre: 'Adventure',
    rating: 8.6,
    duration: 165,
    poster: 'images/posters/the-odyssey.jpg',
    banner: 'images/banners/the-odyssey-banner.jpg',
    description: "Christopher Nolan's epic take on Homer's poem: after the Trojan War, Odysseus battles gods, monsters, and the sea itself on a perilous voyage back to Ithaca.",
    releaseDate: '2026-07-17',
    showtimes: ['13:00', '17:00', '21:00'],
    price: 160,
  },
  {
    id: 'm6',
    title: 'Avengers: Doomsday',
    genre: 'Action',
    duration: 170,
    poster: 'images/posters/avengers-doomsday.jpg',
    banner: 'images/banners/avengers-doomsday-banner.jpg',
    description: 'Heroes from three different universes join forces against Doctor Doom in the biggest Avengers team-up yet.',
    releaseDate: '2026-12-18',
    showtimes: ['13:00', '16:45', '20:30'],
    price: 170,
  },
  {
    id: 'm7',
    title: 'Backrooms',
    genre: 'Horror',
    rating: 7.1,
    duration: 110,
    poster: 'images/posters/backrooms.jpg',
    banner: 'images/banners/backrooms-banner.jpg',
    description: 'A therapist follows her missing patient through a strange doorway into an endless maze of liminal rooms that shouldn\u2019t exist.',
    releaseDate: '2026-05-29',
    showtimes: ['14:30', '17:45', '20:45'],
    price: 100,
  },
  {
    id: 'm8',
    title: 'Obsession',
    genre: 'Horror',
    rating: 7.4,
    duration: 108,
    poster: 'images/posters/obsession.jpg',
    banner: 'images/banners/obsession-banner.jpg',
    description: 'A lonely music-store clerk breaks a mysterious novelty toy to win his crush\u2019s heart — and gets exactly what he wished for, at a horrifying price.',
    releaseDate: '2026-05-15',
    showtimes: ['13:30', '16:15', '19:15', '21:45'],
    price: 100,
  },
];

// True if a movie's release date is still in the future.
function ccIsUpcoming(movie) {
  if (!movie.releaseDate) return false;
  return new Date(movie.releaseDate) > new Date();
}

// Demo admin account — email: admin@cinemaconnect.test / password: Admin@123
// (plain-text password is fine here since this is a training project with
// no real backend; never do this in a production app)
const CC_SEED_ADMIN = {
  id: 'u_admin',
  name: 'Admin',
  email: 'admin@cinemaconnect.test',
  password: 'Admin@123',
  role: 'admin',
};

function ccInitData() {
  // Keep existing user/admin changes, but always backfill missing fields
  // from the current seed data. This is important when the project is
  // updated after the browser already has an older cc_movies snapshot.
  const storedMovies = JSON.parse(localStorage.getItem(CC_KEYS.MOVIES) || 'null');

  if (!Array.isArray(storedMovies)) {
    localStorage.setItem(CC_KEYS.MOVIES, JSON.stringify(CC_SEED_MOVIES));
  } else {
    const storedById = new Map(storedMovies.map((movie) => [movie.id, movie]));
    const mergedMovies = CC_SEED_MOVIES.map((seedMovie) => ({
      ...seedMovie,
      ...(storedById.get(seedMovie.id) || {}),
    }));

    // Preserve movies that were added later through the Admin page.
    const seedIds = new Set(CC_SEED_MOVIES.map((movie) => movie.id));
    const customMovies = storedMovies.filter((movie) => !seedIds.has(movie.id));
    const finalMovies = [...mergedMovies, ...customMovies];

    localStorage.setItem(CC_KEYS.MOVIES, JSON.stringify(finalMovies));
  }

  if (!localStorage.getItem(CC_KEYS.USERS)) {
    localStorage.setItem(CC_KEYS.USERS, JSON.stringify([CC_SEED_ADMIN]));
  }
  if (!localStorage.getItem(CC_KEYS.BOOKINGS)) {
    localStorage.setItem(CC_KEYS.BOOKINGS, JSON.stringify([]));
  }
}
ccInitData();

// ---- Movies ----
function ccGetMovies() {
  return JSON.parse(localStorage.getItem(CC_KEYS.MOVIES) || '[]');
}
function ccSaveMovies(movies) {
  localStorage.setItem(CC_KEYS.MOVIES, JSON.stringify(movies));
}
function ccGetMovieById(id) {
  return ccGetMovies().find((m) => m.id === id) || null;
}
function ccAddMovie(movie) {
  const movies = ccGetMovies();
  movie.id = movie.id || 'm' + Date.now();
  movies.push(movie);
  ccSaveMovies(movies);
  return movie;
}
function ccUpdateMovie(id, updates) {
  const movies = ccGetMovies();
  const idx = movies.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  movies[idx] = { ...movies[idx], ...updates };
  ccSaveMovies(movies);
  return movies[idx];
}
function ccDeleteMovie(id) {
  ccSaveMovies(ccGetMovies().filter((m) => m.id !== id));
}

// Convenience: a plain array snapshot, for pages/scripts that just
// want to read the movie list once at page load (e.g. home.js).
// Pages doing add/edit/delete (Admin) should use the functions above
// instead, since this snapshot won't auto-update.
const ccMovies = ccGetMovies();

// ---- Users & auth ----
function ccGetUsers() {
  return JSON.parse(localStorage.getItem(CC_KEYS.USERS) || '[]');
}
function ccSaveUsers(users) {
  localStorage.setItem(CC_KEYS.USERS, JSON.stringify(users));
}
function ccFindUserByEmail(email) {
  return ccGetUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}
function ccRegisterUser({ name, email, password }) {
  if (ccFindUserByEmail(email)) {
    return { ok: false, error: 'Email already registered.' };
  }
  const users = ccGetUsers();
  const user = { id: 'u_' + Date.now(), name, email, password, role: 'user' };
  users.push(user);
  ccSaveUsers(users);
  return { ok: true, user };
}
function ccLoginUser(email, password) {
  const user = ccFindUserByEmail(email);
  if (!user || user.password !== password) {
    return { ok: false, error: 'Invalid email or password.' };
  }
  localStorage.setItem(CC_KEYS.SESSION, JSON.stringify({ userId: user.id }));
  return { ok: true, user };
}
function ccLogoutUser() {
  localStorage.removeItem(CC_KEYS.SESSION);
}
function ccGetCurrentUser() {
  const session = JSON.parse(localStorage.getItem(CC_KEYS.SESSION) || 'null');
  if (!session) return null;
  return ccGetUsers().find((u) => u.id === session.userId) || null;
}

// ---- Bookings ----
function ccGetBookings() {
  return JSON.parse(localStorage.getItem(CC_KEYS.BOOKINGS) || '[]');
}
function ccSaveBookings(bookings) {
  localStorage.setItem(CC_KEYS.BOOKINGS, JSON.stringify(bookings));
}
function ccAddBooking(booking) {
  const bookings = ccGetBookings();
  booking.id = 'b_' + Date.now();
  booking.createdAt = new Date().toISOString();
  bookings.push(booking);
  ccSaveBookings(bookings);
  return booking;
}
function ccGetBookingsForUser(userId) {
  return ccGetBookings().filter((b) => b.userId === userId);
}
function ccCancelBooking(bookingId) {
  ccSaveBookings(ccGetBookings().filter((b) => b.id !== bookingId));
}
