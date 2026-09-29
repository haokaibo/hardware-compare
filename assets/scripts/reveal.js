/* =============================================
   Shared Scroll Reveal — used across all pages
   =============================================
   Usage: <script src="scripts/reveal.js"></script>
   Set data-reveal-threshold or data-reveal-margin on <body> to
   override the defaults (0.15, '0px 0px -60px 0px').
   ============================================= */
(function () {
  'use strict';

  const body = document.body;
  const threshold = parseFloat(body.getAttribute('data-reveal-threshold')) || 0.15;
  const rootMargin = body.getAttribute('data-reveal-margin') || '0px 0px -60px 0px';

  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: threshold, rootMargin: rootMargin });

  items.forEach(function (el) {
    io.observe(el);
  });
})();
