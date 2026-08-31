const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

window.addEventListener('load', () => setTimeout(() => $('.loader').classList.add('done'), 850));

const header = $('.site-header');
const progress = $('.scroll-progress');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 35);
  const height = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${(window.scrollY / height) * 100}%`;
}, { passive: true });

const menuToggle = $('.menu-toggle');
const mobileMenu = $('.mobile-menu');
menuToggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.setAttribute('aria-hidden', !open);
});
$$('.mobile-menu a').forEach(a => a.addEventListener('click', () => menuToggle.click()));

const reveals = $$('.reveal');
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .12 });
reveals.forEach(item => observer.observe(item));

const statObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  $$('[data-count]', entry.target).forEach(el => {
    const target = Number(el.dataset.count), decimal = el.dataset.decimal === 'true';
    const start = performance.now(), duration = 1300;
    const tick = now => { const p = Math.min((now - start) / duration, 1); const eased = 1 - Math.pow(1 - p, 4); const value = target * eased; el.textContent = decimal ? value.toFixed(1) : Math.floor(value).toLocaleString(); if (p < 1) requestAnimationFrame(tick); else el.textContent += el.dataset.suffix || ''; };
    requestAnimationFrame(tick);
  });
  statObserver.unobserve(entry.target);
}), { threshold: .35 });
statObserver.observe($('.stats-grid'));

const featureData = {
  specialists: ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=85', '01 / 04', 'Expertise, with empathy.', 'Every specialist brings deep experience and a distinctly human approach to care.'],
  facilities: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=85', '02 / 04', 'Care in every detail.', 'Thoughtfully designed spaces that make a clinical visit feel calmer and more comfortable.'],
  booking: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=85', '03 / 04', 'Simple from the start.', 'An easy way to find the right specialist and request the time that works for you.'],
  experience: ['https://images.unsplash.com/photo-1579684453377-48ec05c6b659?auto=format&fit=crop&w=1000&q=85', '04 / 04', 'You are at the center.', 'Clear communication, unrushed attention, and care that is built around your needs.']
};
$$('.feature-list button').forEach(button => button.addEventListener('mouseenter', () => {
  $$('.feature-list button').forEach(b => b.classList.remove('active')); button.classList.add('active');
  const [src, count, title, text] = featureData[button.dataset.feature]; const image = $('#featureImage');
  image.style.opacity = .25; setTimeout(() => { image.src = src; image.alt = title; image.style.opacity = .86; }, 180);
  $('#featureCaption').innerHTML = `<span>${count}</span><strong>${title}</strong><p>${text}</p>`;
}));

const doctors = {
  sarah: { name: 'Dr. Sarah Ahmed', specialty: 'Cardiology', exp: '12+ years', rating: '★ 4.9 / 5.0', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85', bio: 'Dr. Sarah combines a decade of cardiovascular experience with an attentive, approachable style. She believes patients make better decisions when they feel heard and clearly informed.' },
  hamza: { name: 'Dr. Hamza Khan', specialty: 'General Medicine', exp: '10+ years', rating: '★ 4.8 / 5.0', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=85', bio: 'Dr. Hamza provides whole-person, preventative care for adults and families. His calm approach helps turn everyday health questions into clear next steps.' },
  ayesha: { name: 'Dr. Ayesha Malik', specialty: 'Dermatology', exp: '9+ years', rating: '★ 4.9 / 5.0', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=85', bio: 'Dr. Ayesha is focused on evidence-led dermatology that feels personal. She helps patients feel confident in a care plan tailored to their skin and lifestyle.' },
  omar: { name: 'Dr. Omar Farooq', specialty: 'Orthopedics', exp: '14+ years', rating: '★ 4.9 / 5.0', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=85', bio: 'Dr. Omar helps people move with more confidence, from first diagnosis through recovery. His care balances medical precision with practical, patient-led rehabilitation.' }
};
const doctorModal = $('.doctor-modal');
$$('.doctor-open').forEach(button => button.addEventListener('click', event => {
  event.stopPropagation(); const d = doctors[button.closest('.doctor-card').dataset.doctor];
  $('.modal-photo img', doctorModal).src = d.img; $('.modal-photo img', doctorModal).alt = d.name; $('.modal-specialty', doctorModal).textContent = d.specialty; $('#modalDoctorName').textContent = d.name; $('.modal-bio', doctorModal).textContent = d.bio; $('.modal-exp', doctorModal).textContent = d.exp; $('.modal-rating', doctorModal).textContent = d.rating; openModal(doctorModal);
}));

const galleryItems = $$('.gallery-item');
const gallery = galleryItems.map(button => ({ src: $('img', button).src, alt: $('img', button).alt, title: $('span', button).childNodes[0].textContent.trim() }));
let galleryIndex = 0; const lightbox = $('.lightbox');
function renderLightbox() { const image = gallery[galleryIndex]; $('figure img', lightbox).src = image.src; $('figure img', lightbox).alt = image.alt; $('figcaption span', lightbox).textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(gallery.length).padStart(2, '0')}`; $('figcaption strong', lightbox).textContent = image.title; }
galleryItems.forEach(button => button.addEventListener('click', () => { galleryIndex = Number(button.dataset.index); renderLightbox(); openModal(lightbox); }));
$('.lightbox-prev').addEventListener('click', () => { galleryIndex = (galleryIndex - 1 + gallery.length) % gallery.length; renderLightbox(); });
$('.lightbox-next').addEventListener('click', () => { galleryIndex = (galleryIndex + 1) % gallery.length; renderLightbox(); });

function openModal(modal) { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; $('.modal-close', modal).focus(); }
function closeModal(modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
$$('.modal').forEach(modal => { $('.modal-close', modal)?.addEventListener('click', () => closeModal(modal)); modal.addEventListener('click', event => { if (event.target === modal) closeModal(modal); }); });
$('.close-success').addEventListener('click', () => closeModal($('.success-modal')));
window.addEventListener('keydown', event => { if (event.key === 'Escape') $$('.modal.open').forEach(closeModal); if ($('.lightbox').classList.contains('open') && event.key === 'ArrowLeft') $('.lightbox-prev').click(); if ($('.lightbox').classList.contains('open') && event.key === 'ArrowRight') $('.lightbox-next').click(); });

const form = $('.appointment-form');
form.addEventListener('submit', event => {
  event.preventDefault(); let valid = true;
  $$('[required]', form).forEach(field => { const wrapper = field.closest('.form-field'); const label = $('label', wrapper).textContent.replace('Preferred ', '').replace('Full ', ''); if (!field.value.trim()) { valid = false; wrapper.classList.add('invalid'); $('small', wrapper).textContent = `Please select or enter ${label.toLowerCase()}.`; } else { wrapper.classList.remove('invalid'); $('small', wrapper).textContent = ''; } });
  if (valid) { form.reset(); openModal($('.success-modal')); }
});
$$('input,select', form).forEach(field => field.addEventListener('input', () => { if (field.value) { field.closest('.form-field').classList.remove('invalid'); $('small', field.closest('.form-field')).textContent = ''; } }));

const accordionButtons = $$('.accordion button');
accordionButtons.forEach(button => button.addEventListener('click', () => { const panel = button.nextElementSibling; const isOpen = button.classList.contains('active'); accordionButtons.forEach(b => { b.classList.remove('active'); b.nextElementSibling.classList.remove('open'); }); if (!isOpen) { button.classList.add('active'); panel.classList.add('open'); } }));

const track = $('.testimonial-track'); const cards = $$('.testimonial-card'); const dots = $('.slider-dots'); let slide = 0; let timer;
cards.forEach((_, index) => { const dot = document.createElement('button'); dot.setAttribute('aria-label', `Show testimonial ${index + 1}`); dot.addEventListener('click', () => showSlide(index)); dots.append(dot); });
function showSlide(index) { slide = (index + cards.length) % cards.length; track.style.transform = `translateX(-${slide * 100}%)`; $$('.slider-dots button').forEach((dot, i) => dot.classList.toggle('active', i === slide)); }
function autoSlide() { clearInterval(timer); timer = setInterval(() => showSlide(slide + 1), 5500); }
$('.slider-next').addEventListener('click', () => { showSlide(slide + 1); autoSlide(); }); $('.slider-prev').addEventListener('click', () => { showSlide(slide - 1); autoSlide(); });
$('.testimonial-viewport').addEventListener('mouseenter', () => clearInterval(timer)); $('.testimonial-viewport').addEventListener('mouseleave', autoSlide); showSlide(0); autoSlide();

if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const dot = $('.cursor-dot'), ring = $('.cursor-ring'); let x = 0, y = 0;
  window.addEventListener('mousemove', event => { x = event.clientX; y = event.clientY; dot.style.left = `${x}px`; dot.style.top = `${y}px`; ring.style.left = `${x}px`; ring.style.top = `${y}px`; });
  $$('a,button,.doctor-card,.gallery-item').forEach(el => { el.addEventListener('mouseenter', () => ring.classList.add('hover')); el.addEventListener('mouseleave', () => ring.classList.remove('hover')); });
  const hero = $('.hero'); hero.addEventListener('mousemove', event => { const dx = (event.clientX / innerWidth - .5) * 9; const dy = (event.clientY / innerHeight - .5) * 9; $('.parallax-bg').style.transform = `translate(${dx}px,${dy}px) scale(1.02)`; $$('.float-card').forEach((card, i) => card.style.margin = `${dy * (i + 1) / 6}px 0 0 ${dx * (i + 1) / 6}px`); }); hero.addEventListener('mouseleave', () => { $('.parallax-bg').style.transform = ''; $$('.float-card').forEach(card => card.style.margin = ''); });
}
