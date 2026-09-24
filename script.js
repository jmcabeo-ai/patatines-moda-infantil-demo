const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.documentElement.classList.add('js');

const intro = document.querySelector('.intro');
const hideIntro = () => intro?.classList.add('is-hidden');
window.setTimeout(hideIntro, prefersReducedMotion ? 0 : 1050);
window.addEventListener('load', () => window.setTimeout(hideIntro, prefersReducedMotion ? 0 : 600));

const header = document.querySelector('[data-header]');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  header?.classList.toggle('is-scrolled', current > 24);
  header?.classList.toggle('is-hidden', current > lastScroll && current > 220);
  lastScroll = current;
}, { passive: true });

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
  text: document.querySelector('#age-text'), tags: document.querySelector('#age-tags'), cta: document.querySelector('#age-cta')
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
  });
  parallax?.addEventListener('pointerleave', () => {
    parallax.style.setProperty('--mx', '0px');
    parallax.style.setProperty('--my', '0px');
  });
}
