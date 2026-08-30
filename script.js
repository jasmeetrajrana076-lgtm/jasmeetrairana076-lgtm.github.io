/**
 * Jasmeet Rajrana Portfolio - Interactive JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Footer Year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Theme Switcher (Dark / Light Mode)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or check user OS preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (!prefersDark) {
    htmlRoot.setAttribute('data-theme', 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      showToast(`Switched to ${newTheme} mode`, 'info');
    });
  }

  // 3. Typewriter Effect
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const roles = [
      'CSE Undergrad @ LPU',
      'Software Developer',
      'Python & C++ Programmer',
      'IoT & Automation Enthusiast',
      'Problem Solver'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 90;
    const deletingSpeed = 45;
    const pauseDelay = 1600;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeout = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentRole.length) {
        timeout = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        timeout = 400;
      }

      setTimeout(typeEffect, timeout);
    }

    typeEffect();
  }

  // 4. Header Scroll Spy & Sticky Navbar
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header blur background
    if (scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }

    // Active Section Spy
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Back to top click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 5. Mobile Drawer Navigation
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');

  function toggleMobileMenu() {
    const isOpen = navMenu?.classList.toggle('active');
    mobileToggle?.classList.toggle('active');
    mobileOverlay?.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    mobileToggle?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  function closeMobileMenu() {
    navMenu?.classList.remove('active');
    mobileToggle?.classList.remove('active');
    mobileOverlay?.classList.remove('active');
    document.body.style.overflow = '';
    mobileToggle?.setAttribute('aria-expanded', 'false');
  }

  mobileToggle?.addEventListener('click', toggleMobileMenu);
  mobileOverlay?.addEventListener('click', closeMobileMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    });
  });

  // 6. Scroll Reveal Animation using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // 7. Click-to-Copy for Contact Details
  const copyableCards = document.querySelectorAll('.copyable-card');
  copyableCards.forEach((card) => {
    card.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = card.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied "${textToCopy}" to clipboard!`, 'success');
      } catch (err) {
        // Fallback copy
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied "${textToCopy}" to clipboard!`, 'success');
      }
    });
  });

  // 8. Contact Form Handling & Validation
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnSpinner = submitBtn?.querySelector('.btn-spinner');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear existing errors
      if (nameError) nameError.textContent = '';
      if (emailError) emailError.textContent = '';
      if (messageError) messageError.textContent = '';
      nameInput?.classList.remove('invalid');
      emailInput?.classList.remove('invalid');
      messageInput?.classList.remove('invalid');

      // Validate Name
      if (!nameInput.value.trim()) {
        if (nameError) nameError.textContent = 'Please enter your name.';
        nameInput.classList.add('invalid');
        isValid = false;
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        if (emailError) emailError.textContent = 'Please enter your email address.';
        emailInput.classList.add('invalid');
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
        emailInput.classList.add('invalid');
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        if (messageError) messageError.textContent = 'Please enter a message.';
        messageInput.classList.add('invalid');
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        if (messageError) messageError.textContent = 'Message should be at least 10 characters.';
        messageInput.classList.add('invalid');
        isValid = false;
      }

      if (!isValid) return;

      // Simulate submission state
      if (submitBtn && btnText && btnSpinner) {
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnSpinner.classList.remove('hidden');

        setTimeout(() => {
          submitBtn.disabled = false;
          btnText.classList.remove('hidden');
          btnSpinner.classList.add('hidden');
          contactForm.reset();

          showToast('Thank you! Your message has been sent successfully.', 'success');
        }, 1200);
      }
    });
  }

  // 9. Toast Notification Dispatcher
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconClass = type === 'success' 
      ? 'fa-solid fa-circle-check' 
      : 'fa-solid fa-circle-info';

    toast.innerHTML = `
      <i class="${iconClass}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});
