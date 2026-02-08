// --- SELECT SECTIONS ---
const sections = document.querySelectorAll(".section");

// --- COLOR HELPERS ---
function hexToHsl(hex) {
  let r = parseInt(hex.substring(1, 3), 16) / 255;
  let g = parseInt(hex.substring(3, 5), 16) / 255;
  let b = parseInt(hex.substring(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h, s, l };
}

function interpolateHsl(c1, c2, t) {
  return {
    h: c1.h + (c2.h - c1.h) * t,
    s: Math.min(1, (c1.s + (c2.s - c1.s) * t) * 1.15),
    l: c1.l + (c2.l - c1.l) * t,
  };
}

function hslToString({ h, s, l }) {
  return `hsl(${h * 360}, ${s * 100}%, ${l * 100}%)`;
}

// --- BACKGROUND SCROLL HANDLER ---
function onScrollBackground() {
  const scrollY = window.scrollY;

  for (let i = 0; i < sections.length - 1; i++) {
    const current = sections[i];
    const next = sections[i + 1];

    if (!current.dataset.color || !next.dataset.color) continue;

    const start = current.offsetTop;
    const height = current.offsetHeight;

    if (scrollY >= start && scrollY <= start + height) {
      const progress = (scrollY - start) / height;

      const c1 = hexToHsl(current.dataset.color);
      const c2 = hexToHsl(next.dataset.color);

      document.body.style.backgroundColor =
        hslToString(interpolateHsl(c1, c2, progress));
      break;
    }
  }
}

// --- INITIAL SETUP ---
if (sections[0]?.dataset.color) {
  document.body.style.backgroundColor = sections[0].dataset.color;
}

// --- EVENT LISTENERS ---
window.addEventListener("scroll", onScrollBackground);
window.addEventListener("resize", onScrollBackground);
