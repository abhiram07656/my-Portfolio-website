/**
 * Abhiram Muduli Personal Portfolio - Interactive Futuristic JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. PARTICLE NEURAL MESH CANVAS BACKGROUND
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: null, y: null, radius: 120 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255, ' : 'rgba(139, 92, 246, ';
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse attraction / interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 3;
            this.y -= (dy / dist) * force * 3;
          }
        }
      }
    }

    function initParticles() {
      particles = [];
      const particleCount = Math.floor((width * height) / 14000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDistance = 115;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacity = 1 - dist / maxDistance;
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.15})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animateCanvas);
    }

    initParticles();
    animateCanvas();
  }

  /* --------------------------------------------------------------------------
     2. GLOWING CUSTOM CURSOR
     -------------------------------------------------------------------------- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e;
      cursorDot.style.left = `${x}px`;
      cursorDot.style.top = `${y}px`;

      cursorOutline.animate({
        left: `${x}px`,
        top: `${y}px`
      }, { duration: 400, fill: 'forwards' });
    });

    // Enlarge cursor on interactive elements
    const hoverables = document.querySelectorAll('a, button, .project-card, .achievement-card, .filter-btn');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.6)';
        cursorOutline.style.borderColor = 'var(--accent-purple)';
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.borderColor = 'var(--primary-cyan)';
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. TYPING EFFECT FOR HERO SECTION
     -------------------------------------------------------------------------- */
  const typingTextEl = document.getElementById('typing-text');
  if (typingTextEl) {
    const roles = [
      'Artificial Intelligence & ML',
      'Computer Vision Systems',
      'Deep Learning Models',
      'Python & Algorithmic Design',
      'Innovative AI Solutions'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
      }

      setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
  }

  /* --------------------------------------------------------------------------
     4. NAVBAR SCROLL EFFECT & MOBILE MENU TOGGLE
     -------------------------------------------------------------------------- */
  const header = document.querySelector('.navbar-container');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. SKILL BAR PLOTS (INTERSECTION OBSERVER ANIMATED FILL)
     -------------------------------------------------------------------------- */
  const skillCards = document.querySelectorAll('.skill-card');
  const barFills = document.querySelectorAll('.bar-plot-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.bar-plot-fill');
        if (fill) {
          const targetWidth = fill.getAttribute('data-progress');
          fill.style.width = targetWidth;
        }
      }
    });
  }, { threshold: 0.2 });

  skillCards.forEach(card => skillObserver.observe(card));

  // Skill Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          card.style.display = 'block';
          // Re-trigger animation
          const fill = card.querySelector('.bar-plot-fill');
          if (fill) {
            fill.style.width = '0%';
            setTimeout(() => {
              fill.style.width = fill.getAttribute('data-progress');
            }, 100);
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     6. PROJECTS SECTION - CLICK BOX OPENS LINK IN NEW TAB
     -------------------------------------------------------------------------- */
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const url = card.getAttribute('data-url');
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  });

  /* --------------------------------------------------------------------------
     7. ACHIEVEMENTS SECTION - LIGHTBOX MODAL FOR PHOTO / VIDEO VIEWER
     -------------------------------------------------------------------------- */
  const lightboxDialog = document.getElementById('lightbox-dialog');
  const lightboxMediaContainer = document.getElementById('lightbox-media-container');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxIssuer = document.getElementById('lightbox-issuer');
  const lightboxDate = document.getElementById('lightbox-date');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');

  const achievementCards = document.querySelectorAll('.achievement-card');

  achievementCards.forEach(card => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-type');
      const src = card.getAttribute('data-src');
      const title = card.getAttribute('data-title');
      const issuer = card.getAttribute('data-issuer');
      const date = card.getAttribute('data-date');
      const desc = card.getAttribute('data-desc');

      // Clear previous media
      lightboxMediaContainer.innerHTML = '';

      if (type === 'image') {
        const img = document.createElement('img');
        img.src = src;
        img.alt = title;
        lightboxMediaContainer.appendChild(img);
      } else if (type === 'video') {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.setAttribute('playsinline', 'playsinline');
        video.setAttribute('webkit-playsinline', 'webkit-playsinline');
        video.setAttribute('controlsList', 'nodownload');
        video.preload = 'metadata';
        lightboxMediaContainer.appendChild(video);
      }

      lightboxTitle.textContent = title;
      lightboxIssuer.textContent = issuer;
      lightboxDate.textContent = date;
      lightboxDesc.textContent = desc;

      if (lightboxDialog) {
        lightboxDialog.showModal();
      }
    });
  });

  // Close lightbox event handlers
  function closeLightbox() {
    if (lightboxDialog) {
      lightboxDialog.close();
      // Pause any playing video when closing
      const video = lightboxMediaContainer.querySelector('video');
      if (video) video.pause();
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Light dismiss: Close on clicking backdrop
  if (lightboxDialog) {
    lightboxDialog.addEventListener('click', (e) => {
      const rect = lightboxDialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeLightbox();
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. HERO STATS COUNTER ANIMATION ON SCROLL
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedStats) {
        animatedStats = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'));
          let count = 0;
          const increment = Math.ceil(target / 40);
          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              stat.textContent = target;
              clearInterval(timer);
            } else {
              stat.textContent = count;
            }
          }, 35);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStatsSection = document.querySelector('.hero-stats');
  if (heroStatsSection) {
    statsObserver.observe(heroStatsSection);
  }

  /* --------------------------------------------------------------------------
     9. CONTACT FORM SUBMISSION TO ABHIRAMMDL@GMAIL.COM
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('form-submit-btn');
      const originalText = submitBtn.innerHTML;

      const name = document.getElementById('user-name').value;
      const email = document.getElementById('user-email').value;
      const subject = document.getElementById('user-subject').value;
      const message = document.getElementById('user-message').value;

      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Email...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('https://formsubmit.co/ajax/4a9df7efa152ed16d0e1e09e502e0785', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: `[Portfolio Contact] ${subject}`,
            message: message
          })
        });

        if (response.ok) {
          submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent to Email!';
          formStatus.className = 'form-status success';
          formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent directly to <strong>abhirammdl@gmail.com</strong>.';
          contactForm.reset();
        } else {
          throw new Error('Form submission response not ok');
        }
      } catch (err) {
        // Fallback: trigger user's native mail client directly addressed to abhirammdl@gmail.com
        const mailtoLink = `mailto:abhirammdl@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;
        window.location.href = mailtoLink;

        submitBtn.innerHTML = '<i class="fa-solid fa-envelope"></i> Opening Email App...';
        formStatus.className = 'form-status success';
        formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Opening your mail client to send to <strong>abhirammdl@gmail.com</strong>...';
      } finally {
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 4000);
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. DYNAMIC YEAR
     -------------------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     11. SMART SOCIAL LINK HANDLER (DESKTOP BROWSER VS ANDROID APP)
     -------------------------------------------------------------------------- */
  const socialLinks = document.querySelectorAll('.social-btn');
  const isAndroid = /Android/i.test(navigator.userAgent);

  socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const androidIntent = link.getAttribute('data-android-intent');
      
      // On Android mobile devices, trigger Android Intent to open in native app (if installed)
      // or fallback to browser. On Desktop, default to opening standard web link in a new tab.
      if (isAndroid && androidIntent) {
        e.preventDefault();
        window.location.href = androidIntent;
      }
    });
  });

});
