/* ─────────────────────────────────────────────
   Om Luhar — Portfolio interactions
   ───────────────────────────────────────────── */

// ── Year ──────────────────────────────────────
document.getElementById("year").textContent = new Date().getFullYear();

// ── Custom cursor ─────────────────────────────
const cursor    = document.getElementById("cursor");
const cursorDot = cursor?.querySelector(".cursor-dot");
const cursorRing = cursor?.querySelector(".cursor-ring");

if (cursor && window.matchMedia("(pointer: fine)").matches) {
  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let raf;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = mx + "px";
      cursorDot.style.top  = my + "px";
    }
  });

  // Ring follows with lerp
  function lerpCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    if (cursorRing) {
      cursorRing.style.left = rx + "px";
      cursorRing.style.top  = ry + "px";
    }
    raf = requestAnimationFrame(lerpCursor);
  }
  lerpCursor();

  // Hover state
  document.querySelectorAll("a, button, [data-magnetic]").forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });

  document.addEventListener("mousedown", () => document.body.classList.add("cursor-click"));
  document.addEventListener("mouseup",   () => document.body.classList.remove("cursor-click"));
} else {
  // No fine pointer — hide cursor element
  if (cursor) cursor.style.display = "none";
}

// ── Navbar scroll state ───────────────────────
const topBar = document.getElementById("top-bar");
const onScroll = () => {
  topBar?.classList.toggle("scrolled", window.scrollY > 60);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ── Mobile menu ───────────────────────────────
const menuToggle = document.getElementById("menu-toggle");
const drawer     = document.getElementById("drawer");
const overlay    = document.getElementById("drawer-overlay");

function openMenu() {
  document.body.classList.add("menu-open");
  menuToggle?.setAttribute("aria-expanded", "true");
  drawer?.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeMenu() {
  document.body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  drawer?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

menuToggle?.addEventListener("click", () => {
  document.body.classList.contains("menu-open") ? closeMenu() : openMenu();
});
overlay?.addEventListener("click", closeMenu);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// Drawer links — smooth scroll + close
drawer?.querySelectorAll(".drawer-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = link.getAttribute("data-target");
    const el = document.getElementById(target);
    if (el) {
      e.preventDefault();
      closeMenu();
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 350);
    }
  });
});

// ── Scroll reveal ─────────────────────────────
const revealEls = document.querySelectorAll(".reveal-up, .reveal-clip");

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// ── Magnetic buttons ──────────────────────────
const MAGNETIC_STRENGTH = 0.38;

document.querySelectorAll("[data-magnetic]").forEach((el) => {
  if (!window.matchMedia("(pointer: fine)").matches) return;

  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * MAGNETIC_STRENGTH;
    const dy = (e.clientY - cy) * MAGNETIC_STRENGTH;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  el.addEventListener("mouseleave", () => {
    el.style.transform = "";
  });
});

// ── Hero name — wrap each line for clip reveal ─
// The HTML already has .hero-name-line spans; wrap inner text in a child span
document.querySelectorAll(".hero-name-line").forEach((line) => {
  const text = line.textContent;
  line.textContent = "";
  const inner = document.createElement("span");
  inner.textContent = text;
  line.appendChild(inner);
});

// Trigger hero reveals immediately (they're above the fold)
document.querySelectorAll(".hero .reveal-up, .hero .reveal-clip").forEach((el) => {
  // Small delay so the transition fires
  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add("is-visible"));
  });
});
