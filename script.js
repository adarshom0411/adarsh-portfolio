/* ==========================================
   GLOBAL PARTICLE BACKGROUND (always dark)
========================================== */
function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const count = width < 600 ? 40 : 90;
  const maxDist = 140;
  const particles = [];

  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const dotColor = "rgba(129,140,248,0.9)";
    const lineBase = "129,140,248";

    ctx.fillStyle = dotColor;

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.5;
          ctx.strokeStyle = `rgba(${lineBase},${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }

  function update() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  createParticles();
  loop();

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });
}

document.addEventListener("DOMContentLoaded", initParticles);

/* ==========================================
   SECTION SWITCHING VIA ICON NAV
========================================== */
const sections = document.querySelectorAll(".page-section");
const navButtons = document.querySelectorAll(".icon-btn[data-target]");

function showSection(id) {
  sections.forEach((sec) => {
    const isTarget = sec.id === id;
    sec.classList.toggle("active-section", isTarget);
    if (isTarget && sec.classList.contains("reveal")) {
      sec.classList.add("reveal-visible");
    }
  });

  // scroll to top so only that section is visible
  window.scrollTo({ top: 0, behavior: "smooth" });
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    showSection(target);
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// initial state
showSection("home");

/* ==========================================
   RESUME MODAL (View + Download)
========================================== */
const resumeFilePath = "assets/resume.pdf";

const viewResumeBtn = document.getElementById("view-resume-btn");
const resumeModal = document.getElementById("resumeModal");
const resumeFrame = document.getElementById("resumeFrame");
const resumeDownloadBtn = document.getElementById("resumeDownloadBtn");

viewResumeBtn.addEventListener("click", () => {
  resumeFrame.src = resumeFilePath;
  resumeDownloadBtn.href = resumeFilePath;
  resumeModal.style.display = "block";
});

function closeResumeModal() {
  resumeModal.style.display = "none";
  resumeFrame.src = "";
}

/* ==========================================
   CERTIFICATE MODAL (static files)
========================================== */
const certModal = document.getElementById("certModal");
const certFrame = document.getElementById("certFrame");
const certTitleEl = document.getElementById("modalTitle");

const certConfig = {
  "web-dev": {
    title: "Web Development Certificate",
    path: "assets/web-dev-certificate.pdf", 
  },
  "git-github": {
    title: "Git & GitHub Certificate",
    path: "assets/git-github-certificate.pdf",
  },
};

function openCertModal(type) {
  const config = certConfig[type];
  if (!config) return;
  certTitleEl.textContent = config.title;
  certFrame.src = config.path;
  certModal.style.display = "block";
}

function closeCertModal() {
  certModal.style.display = "none";
  certFrame.src = "";
}

/* ==========================================
   GLOBAL CLICK HANDLER FOR MODALS
========================================== */
window.addEventListener("click", (e) => {
  if (e.target === resumeModal) {
    closeResumeModal();
  }
  if (e.target === certModal) {
    closeCertModal();
  }
});

/* expose for inline onclick */
window.openCertModal = openCertModal;
window.closeCertModal = closeCertModal;
window.closeResumeModal = closeResumeModal;
