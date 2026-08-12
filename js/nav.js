// ---------------------------------------------------------------
// nav.js — shared navbar logic for CinemaConnect
// Must be loaded AFTER data.js and BEFORE any page-specific script:
//   <script src="js/data.js"></script>
//   <script src="js/nav.js"></script>
//   <script src="js/home.js"></script>   <!-- or browse.js / admin.js / etc -->
//
// Every page must call ccRenderNav('<page-key>') after the scripts,
// where <page-key> matches a data-page value in the nav <a> tags:
// 'home' | 'browse' | 'bookings' | 'admin' | 'login' | 'register' | 'profile'
// ---------------------------------------------------------------

function ccRenderNav(activePage) {
  // 1) Highlight the current page in the nav links
  document.querySelectorAll('.nav-links a[data-page]').forEach((a) => {
    a.classList.toggle('active', a.dataset.page === activePage);
  });

  // 2) Mobile hamburger toggle
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    // close the mobile menu after tapping a link
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  // 3) Current user (from data.js)
  const user = typeof ccGetCurrentUser === 'function' ? ccGetCurrentUser() : null;

  // 4) Show/hide the Admin link based on role
  const adminLink = document.getElementById('adminNavLink');
  if (adminLink) {
    adminLink.classList.toggle('hidden', !(user && user.role === 'admin'));
  }

  // 5) Right-side nav CTA: Login/Register buttons, or user name + Logout
  const cta = document.getElementById('navCta');
  if (cta) {
    if (user) {
      cta.innerHTML = `
        <a class="nav-user" href="profile.html">Hi, ${user.name}</a>
        <button class="btn btn-outline btn-sm" id="navLogoutBtn" type="button">Logout</button>
      `;
      document.getElementById('navLogoutBtn').addEventListener('click', () => {
        ccLogoutUser();
        window.location.href = 'index.html';
      });
    } else {
      cta.innerHTML = `
        <a class="btn btn-outline btn-sm" href="login.html">Login</a>
        <a class="btn btn-primary btn-sm" href="register.html">Register</a>
      `;
    }
  }
}
