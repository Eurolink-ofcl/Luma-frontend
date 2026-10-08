/* ==========================================================================
   LUMA HOMEPAGE SCRIPTS
   Interactive Navbar, Currency Selector, Cart Drawer, and Scroll States
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Elements ---
  const siteHeader = document.getElementById('siteHeader');
  const currencySelector = document.getElementById('currencySelector');
  const currencyBtn = document.getElementById('currencyBtn');
  const currencyDropdown = document.getElementById('currencyDropdown');
  const cartBtn = document.getElementById('cartBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartDrawerClose = document.getElementById('cartDrawerClose');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const userBtn = document.getElementById('userBtn');

  // --- Sticky Header Scroll Effect ---
  const handleScroll = () => {
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Announcement Bar Rotation ---
  const announcements = [
    document.getElementById('announcement1'),
    document.getElementById('announcement2')
  ].filter(Boolean);

  let currentAnnouncementIdx = 0;
  if (announcements.length > 1) {
    setInterval(() => {
      announcements[currentAnnouncementIdx].classList.remove('active');
      currentAnnouncementIdx = (currentAnnouncementIdx + 1) % announcements.length;
      announcements[currentAnnouncementIdx].classList.add('active');
    }, 4500);
  }

  // --- Currency Selector Dropdown ---
  if (currencyBtn && currencySelector) {
    currencyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = currencySelector.classList.contains('open');
      currencySelector.classList.toggle('open', !isOpen);
      currencyBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!currencySelector.contains(e.target)) {
        currencySelector.classList.remove('open');
        currencyBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Option selection
    const currencyOptions = currencyDropdown.querySelectorAll('.currency-option');
    currencyOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        currencyOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        
        const currencyCode = opt.getAttribute('data-currency');
        const flagSrc = opt.getAttribute('data-flag');
        const symbol = opt.getAttribute('data-symbol');

        // Update button text
        const labelEl = currencyBtn.querySelector('.currency-label');
        if (currencyCode === 'AED') {
          labelEl.innerHTML = 'AED <span class="currency-ar">د.إ</span>';
        } else {
          labelEl.textContent = `${currencyCode} ${symbol || ''}`;
        }

        // Update flag if image available
        const flagImg = currencyBtn.querySelector('.currency-flag');
        if (flagSrc && flagImg) {
          flagImg.src = flagSrc;
        }

        currencySelector.classList.remove('open');
        currencyBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Shopping Bag Drawer ---
  const openCart = () => {
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (cartBtn && cartOverlay) {
    cartBtn.addEventListener('click', openCart);
    cartDrawerClose.addEventListener('click', closeCart);
    
    // Close on clicking backdrop
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) {
        closeCart();
      }
    });
  }

  // --- Mobile Navigation Drawer ---
  const openMobileDrawer = () => {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileDrawer = () => {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openMobileDrawer);
    closeDrawerBtn.addEventListener('click', closeMobileDrawer);
    drawerBackdrop.addEventListener('click', closeMobileDrawer);

    // Close when clicking mobile links
    const mobileLinks = mobileDrawer.querySelectorAll('.mobile-nav-link, .mobile-cta');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileDrawer);
    });
  }

  // --- Account Icon Click Feedback ---
  if (userBtn) {
    userBtn.addEventListener('click', () => {
      // Smooth visual feedback or open sign-in modal
      alert('Welcome to LUMA. Sign in or create an account to view your device registration and order history.');
    });
  }

  // --- Keyboard Shortcuts (ESC to close drawers) ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (cartOverlay.classList.contains('open')) closeCart();
      if (mobileDrawer.classList.contains('open')) closeMobileDrawer();
      if (currencySelector.classList.contains('open')) {
        currencySelector.classList.remove('open');
        currencyBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // --- Hero Pagination Dots Interaction ---
  const dotBtns = document.querySelectorAll('.hero-pagination .dot-btn');
  dotBtns.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      dotBtns.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });

  console.log('LUMA Navigation Bar initialized successfully.');
});
