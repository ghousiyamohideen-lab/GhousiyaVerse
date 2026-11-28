// Lightweight interactions: mobile navigation, typewriter, reveal-on-scroll and ambient particles.
const menu = document.querySelector(".menu");
const nav = document.querySelector("#nav");
menu?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
});
nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));

const words = ["digital experiences", "useful software", "creative solutions"];
let wordIndex = 0, charIndex = 0, deleting = false;
const typed = document.querySelector("#typed");
function typeLoop() {
  if (!typed) return;
  const word = words[wordIndex];
  typed.textContent = word.slice(0, charIndex);
  if (!deleting && charIndex < word.length) { charIndex++; setTimeout(typeLoop, 85); }
  else if (!deleting) { deleting = true; setTimeout(typeLoop, 1200); }
  else if (charIndex > 0) { charIndex--; setTimeout(typeLoop, 42); }
  else { deleting = false; wordIndex = (wordIndex + 1) % words.length; setTimeout(typeLoop, 250); }
}
typeLoop();

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
}), {threshold: 0.12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

document.querySelector("#year").textContent = new Date().getFullYear();
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
contactForm?.addEventListener("submit", event => {
  event.preventDefault();
  const nameField = contactForm.elements.namedItem("name");
  const emailField = contactForm.elements.namedItem("email");
  const messageField = contactForm.elements.namedItem("message");
  nameField.value = nameField.value.trim();
  emailField.value = emailField.value.trim();
  messageField.value = messageField.value.trim();

  nameField.setCustomValidity(nameField.value.length < 2 ? "Please enter at least 2 characters for your name." : "");
  emailField.setCustomValidity(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailField.value) ? "" : "Please enter a valid email address.");
  messageField.setCustomValidity(messageField.value.length < 10 ? "Please enter a message of at least 10 characters." : "");

  if (!contactForm.reportValidity()) {
    if (formStatus) { formStatus.textContent = "Please correct the highlighted fields."; formStatus.classList.add("error"); }
    return;
  }

  const subject = encodeURIComponent("Portfolio contact from " + nameField.value);
  const body = encodeURIComponent("Name: " + nameField.value + "\nEmail: " + emailField.value + "\n\n" + messageField.value);
  if (formStatus) { formStatus.textContent = "Your details look valid. Opening your email app…"; formStatus.classList.remove("error"); }
  window.location.href = "mailto:ghousiyamohideen@gmail.com?subject=" + subject + "&body=" + body;
});

contactForm?.querySelectorAll("input, textarea").forEach(field => {
  field.addEventListener("input", () => {
    field.setCustomValidity("");
    if (formStatus) { formStatus.textContent = ""; formStatus.classList.remove("error"); }
  });
});

const canvas = document.querySelector("#stars"), ctx = canvas.getContext("2d");
let particles = [];
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  particles = Array.from({length: Math.min(85, Math.floor(innerWidth / 15))}, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    r: Math.random() * 1.4 + .25, speed: Math.random() * .22 + .04, alpha: Math.random() * .5 + .15
  }));
}
function animate() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  particles.forEach(p => {
    p.y -= p.speed; if (p.y < -3) { p.y = innerHeight + 3; p.x = Math.random() * innerWidth; }
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(130,205,218,${p.alpha})`; ctx.fill();
  });
  requestAnimationFrame(animate);
}
resize(); animate(); addEventListener("resize", resize);
const glow = document.querySelector(".pointer-glow");
addEventListener("pointermove", e => { if (glow) { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; } });
