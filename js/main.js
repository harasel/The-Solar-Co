(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-nav');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menuButton.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      mobileMenu.classList.toggle('open', !open);
    });
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const page = document.body.dataset.page;
  document.querySelectorAll(`[data-page="${page}"]`).forEach(link => {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  });

  document.querySelectorAll('.accordion button').forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
    });
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(item => item.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(item => observer.observe(item));
  }

  const validators = {
    name: value => value.trim().length >= 2 ? '' : 'Please enter your full name.',
    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Please enter a valid email address.',
    phone: value => /^[+\d][\d\s().-]{6,29}$/.test(value.trim()) ? '' : 'Please enter a valid phone number.',
    property: value => value ? '' : 'Please choose a property type.',
    location: value => value.trim().length >= 2 ? '' : 'Please enter your location.'
  };

  document.querySelectorAll('.quote-form').forEach(form => {
    const validate = field => {
      const rule = validators[field.name];
      if (!rule) return true;
      const message = rule(field.value);
      const error = field.parentElement.querySelector('.error');
      field.classList.toggle('invalid', Boolean(message));
      field.setAttribute('aria-invalid', String(Boolean(message)));
      if (error) error.textContent = message;
      return !message;
    };
    form.querySelectorAll('input, select').forEach(field => field.addEventListener('blur', () => validate(field)));
    form.addEventListener('submit', event => {
      event.preventDefault();
      const fields = [...form.querySelectorAll('input, select')];
      const valid = fields.map(validate).every(Boolean);
      if (!valid) {
        form.querySelector('.invalid')?.focus();
        return;
      }
      form.querySelector('.form-grid').hidden = true;
      form.querySelector('.form-submit').hidden = true;
      form.querySelector('.form-note').hidden = true;
      const success = form.querySelector('.form-success');
      success.classList.add('show');
      success.focus();
    });
  });
})();
