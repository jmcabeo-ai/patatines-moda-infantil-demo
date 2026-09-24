const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

document.documentElement.classList.add('js');

const intro = document.querySelector('.intro');
const hideIntro = () => intro?.classList.add('is-hidden');
window.setTimeout(hideIntro, prefersReducedMotion ? 0 : 1050);
window.addEventListener('load', () => window.setTimeout(hideIntro, prefersReducedMotion ? 0 : 600));

const replayClass = (element, className) => {
  if (!element || prefersReducedMotion) return;
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
};

const cursorAura = document.querySelector('.cursor-aura');
if (!prefersReducedMotion && hasFinePointer && cursorAura) {
  let cursorFrame;
  document.addEventListener('pointermove', event => {
    if (cursorFrame) window.cancelAnimationFrame(cursorFrame);
    cursorFrame = window.requestAnimationFrame(() => {
      cursorAura.classList.add('is-active');
      cursorAura.style.transform = `translate3d(${event.clientX - cursorAura.offsetWidth / 2}px, ${event.clientY - cursorAura.offsetHeight / 2}px, 0)`;
    });
  }, { passive: true });
  document.addEventListener('pointerleave', () => cursorAura.classList.remove('is-active'));
  document.querySelectorAll('a, button, summary').forEach(element => {
    element.addEventListener('pointerenter', () => cursorAura.classList.add('is-over-action'));
    element.addEventListener('pointerleave', () => cursorAura.classList.remove('is-over-action'));
  });
  document.addEventListener('pointerdown', event => {
    const colors = ['#f25f68', '#ffe18a', '#78bca7', '#c6afe8'];
    Array.from({ length: 6 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 6;
      const distance = 30 + (index % 2) * 14;
      const spark = document.createElement('i');
      spark.className = 'click-spark';
      spark.style.left = `${event.clientX}px`;
      spark.style.top = `${event.clientY}px`;
      spark.style.setProperty('--spark-x', `${Math.cos(angle) * distance}px`);
      spark.style.setProperty('--spark-y', `${Math.sin(angle) * distance}px`);
      spark.style.setProperty('--spark-r', `${120 + index * 48}deg`);
      spark.style.setProperty('--spark-color', colors[index % colors.length]);
      document.body.appendChild(spark);
      spark.addEventListener('animationend', () => spark.remove(), { once: true });
    });
  });
}

const header = document.querySelector('[data-header]');
const mascotHelper = document.querySelector('.mascot-helper');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  header?.classList.toggle('is-scrolled', current > 24);
  header?.classList.toggle('is-hidden', current > lastScroll && current > 220);
  mascotHelper?.classList.toggle('is-visible', current > 620);
  lastScroll = current;
}, { passive: true });
mascotHelper?.classList.toggle('is-visible', window.scrollY > 620);

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  mobileMenu.hidden = open;
  document.body.classList.toggle('menu-open', !open);
});
mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
}));

const reveals = document.querySelectorAll('.reveal');
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px' });
  reveals.forEach(element => revealObserver.observe(element));
} else {
  reveals.forEach(element => element.classList.add('is-visible'));
}

const ageData = {
  newborn: {
    number: '01', image: 'assets/instagram-11.jpg', alt: 'Conjunto rosa de primera puesta', kicker: 'Su primera puesta',
    title: 'Suave para su piel.<br>Bonito para siempre.',
    text: 'Peleles, conjuntos de varias piezas y prendas pensadas para regalar —o para guardar en la memoria.',
    tags: ['Peleles', 'Conjuntos', 'Regalos'], query: 'ropa de primera puesta'
  },
  mini: {
    number: '02', image: 'assets/instagram-10.jpg', alt: 'Conjunto infantil de punto verde agua', kicker: 'Sus pequeños planes',
    title: 'Comodidad que sigue<br>su propio ritmo.',
    text: 'Prendas para explorar, celebrar y volver a empezar mañana. Cómodas, especiales y fáciles de combinar.',
    tags: ['Punto', 'Conjuntos', 'Complementos'], query: 'ropa para 2 a 5 años'
  },
  kids: {
    number: '03', image: 'assets/instagram-02.jpg', alt: 'Chaquetón infantil con capucha', kicker: 'Sus días imparables',
    title: 'Abrigo, juego<br>y mucho estilo.',
    text: 'Opciones para diario y ocasiones especiales, seleccionadas para aguantar su energía sin renunciar al detalle.',
    tags: ['Abrigos', 'Sudaderas', 'Ocasiones'], query: 'ropa para 6 a 10 años'
  },
  junior: {
    number: '04', image: 'assets/instagram-05.jpg', alt: 'Sudadera juvenil verde con cinturón', kicker: 'Su estilo propio',
    title: 'Ya saben lo que quieren.<br>Y se nota.',
    text: 'Prendas con más personalidad para esa etapa en la que cada look empieza a decir quiénes son.',
    tags: ['Sudaderas', 'Looks', 'Tallas 11—14'], query: 'ropa para 11 a 14 años'
  }
};

const ageEls = {
  image: document.querySelector('#age-image'), number: document.querySelector('#age-number'),
  kicker: document.querySelector('#age-kicker'), title: document.querySelector('#age-title'),
  text: document.querySelector('#age-text'), tags: document.querySelector('#age-tags'), cta: document.querySelector('#age-cta'),
  card: document.querySelector('.age-card')
};
document.querySelectorAll('.age-tab').forEach(tab => tab.addEventListener('click', () => {
  const data = ageData[tab.dataset.age];
  document.querySelectorAll('.age-tab').forEach(item => {
    item.classList.toggle('is-active', item === tab);
    item.setAttribute('aria-selected', String(item === tab));
  });
  ageEls.image.classList.add('is-changing');
  window.setTimeout(() => {
    ageEls.image.src = data.image;
    ageEls.image.alt = data.alt;
    ageEls.number.textContent = data.number;
    ageEls.kicker.textContent = data.kicker;
    ageEls.title.innerHTML = data.title;
    ageEls.text.textContent = data.text;
    ageEls.tags.innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join('');
    ageEls.cta.href = `https://wa.me/34623992413?text=${encodeURIComponent(`Hola Patatines, busco ${data.query}. ¿Me ayudáis a elegir?`)}`;
    ageEls.image.classList.remove('is-changing');
    replayClass(ageEls.card, 'is-celebrating');
  }, prefersReducedMotion ? 0 : 180);
}));

const giftChoices = { 1: '', 2: '' };
document.querySelectorAll('.builder-step').forEach(step => {
  step.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    step.querySelectorAll('button').forEach(item => item.classList.toggle('is-selected', item === button));
    giftChoices[step.dataset.step] = button.dataset.value;
    updateGiftResult();
  }));
});

function updateGiftResult() {
  const result = document.querySelector('#gift-result');
  const cta = document.querySelector('#gift-cta');
  if (!giftChoices[1] || !giftChoices[2]) return;
  result.querySelector('span').textContent = 'La misión: acertar';
  result.querySelector('p').textContent = `Buscas un regalo para ${giftChoices[1]} pensado para ${giftChoices[2]}. Patatines puede enseñarte opciones disponibles.`;
  cta.classList.remove('is-disabled');
  cta.removeAttribute('aria-disabled');
  cta.href = `https://wa.me/34623992413?text=${encodeURIComponent(`Hola Patatines, busco un regalo para ${giftChoices[1]}, para ${giftChoices[2]}. ¿Me enseñáis algunas opciones?`)}`;
  cta.target = '_blank';
  cta.rel = 'noopener';
  replayClass(result, 'is-celebrating');
}

document.querySelectorAll('.faq details').forEach(detail => detail.addEventListener('toggle', () => {
  if (!detail.open) return;
  document.querySelectorAll('.faq details').forEach(other => {
    if (other !== detail) other.open = false;
  });
}));

if (!prefersReducedMotion) {
  const parallax = document.querySelector('[data-parallax]');
  parallax?.addEventListener('pointermove', event => {
    const rect = parallax.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    parallax.style.setProperty('--mx', `${x * 12}px`);
    parallax.style.setProperty('--my', `${y * 12}px`);
    parallax.style.setProperty('--toy-x', `${x * -22}px`);
    parallax.style.setProperty('--toy-y', `${y * -18}px`);
  });
  parallax?.addEventListener('pointerleave', () => {
    parallax.style.setProperty('--mx', '0px');
    parallax.style.setProperty('--my', '0px');
    parallax.style.setProperty('--toy-x', '0px');
    parallax.style.setProperty('--toy-y', '0px');
  });

  if (hasFinePointer) {
    document.querySelectorAll('.look-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty('--pointer-x', `${x * 100}%`);
        card.style.setProperty('--pointer-y', `${y * 100}%`);
        card.style.setProperty('--shift-x', `${(x - .5) * -16}px`);
        card.style.setProperty('--shift-y', `${(y - .5) * -12}px`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--pointer-x', '50%');
        card.style.setProperty('--pointer-y', '50%');
        card.style.setProperty('--shift-x', '0px');
        card.style.setProperty('--shift-y', '0px');
      });
    });

    const finalCta = document.querySelector('.final-cta');
    finalCta?.addEventListener('pointermove', event => {
      const rect = finalCta.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      finalCta.style.setProperty('--cta-x', `${x * 24}px`);
      finalCta.style.setProperty('--cta-y', `${y * 18}px`);
    });
    finalCta?.addEventListener('pointerleave', () => {
      finalCta.style.setProperty('--cta-x', '0px');
      finalCta.style.setProperty('--cta-y', '0px');
    });
  }
}
