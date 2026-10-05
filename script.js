const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const form = document.getElementById('form');
const toast = document.getElementById('toast');
const toTop = document.getElementById('toTop');
const year = document.getElementById('year');
const installBtn = document.getElementById('installBtn');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const button = item.querySelector('.faq-q');
  if (!button) return;

  button.addEventListener('click', () => {
    const isOpen = item.classList.contains('active');
    faqItems.forEach((faq) => {
      faq.classList.remove('active');
    });
    if (!isOpen) {
      item.classList.add('active');
    }
  });
});

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');

    if (!name || !phone) return;

    if (!name.value.trim() || !phone.value.trim()) {
      showToast('Please fill in your name and phone number.');
      return;
    }

    showToast('Thanks! Our team will contact you shortly.');
    form.reset();
  });
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

window.addEventListener('scroll', () => {
  const current = window.scrollY || document.documentElement.scrollTop;
  const bar = document.getElementById('progressBar');
  if (bar) {
    const max = document.body.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (current / max) * 100 : 0;
    bar.style.width = `${percent}%`;
  }

  if (toTop) {
    toTop.style.display = current > 400 ? 'grid' : 'none';
    toTop.style.placeItems = 'center';
  }
});

if (toTop) {
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const countEls = document.querySelectorAll('[data-count]');
countEls.forEach((el) => {
  const target = Number(el.dataset.count || 0);
  const suffix = el.dataset.suffix || '';
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 90));

  const tick = () => {
    current += step;
    if (current >= target) {
      current = target;
    }
    el.textContent = current + suffix;
    if (current < target) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
});

let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  if (installBtn) installBtn.hidden = false;
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
      showToast('App install is not available from this browser yet.');
      return;
    }
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      showToast('App installed successfully.');
    }
    deferredPrompt = null;
    installBtn.hidden = true;
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // ignore registration issues when run from unsupported local contexts
    });
  });
}

const canvas = document.getElementById('scentCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const particles = [];

  const resize = () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    createParticles();
  };

  const createParticles = () => {
    particles.length = 0;
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    const count = Math.min(40, Math.max(18, Math.floor((w * h) / 18)));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.6 + 0.8,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.45 + 0.25
      });
    }
  };

  const render = () => {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 12);
      grad.addColorStop(0, `rgba(212,175,55,${p.alpha})`);
      grad.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 12, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(render);
  };

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(render);
}

