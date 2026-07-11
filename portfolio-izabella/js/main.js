document.addEventListener('DOMContentLoaded', () => {

  /* SCROLL PROGRESS */
  const prog = document.getElementById('prog');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    prog.style.width = pct + '%';
  });

  /* TOC ATIVO CONFORME SCROLL */
  const sections = document.querySelectorAll('section[id]');
  const tocLinks = document.querySelectorAll('.toc a');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        tocLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });
  sections.forEach(s => obs.observe(s));

  /* SMOOTH SCROLL NO MENU */
  tocLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ANIMAÇÕES AO ENTRAR NO VIEWPORT */
  const animObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
  }, { threshold: .12 });
  document.querySelectorAll('.au, .as').forEach(el => animObs.observe(el));

  /* GLOW SEGUINDO O MOUSE NOS CARDS PREMIUM */
  document.querySelectorAll('.cp').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  });

  /* TIMELINE — NODES CLICÁVEIS + PAINEL DE DETALHE */
  const tlNodes = document.querySelectorAll('.tl-node');
  const detailPanel = document.getElementById('tl-detail-panel');
  const dpRole = document.getElementById('dp-role');
  const dpCompany = document.getElementById('dp-company');
  const dpPeriod = document.getElementById('dp-period');
  const dpBullets = document.getElementById('dp-bullets');
  const dpClose = document.getElementById('dp-close');

  tlNodes.forEach(node => {
    node.addEventListener('click', () => {
      const isActive = node.classList.contains('active');
      tlNodes.forEach(n => n.classList.remove('active'));

      if (isActive) {
        detailPanel.classList.remove('visible');
        return;
      }

      node.classList.add('active');

      // Pega os dados do próprio node via atributos data-*
      dpRole.textContent = node.dataset.role || '';
      dpCompany.textContent = node.dataset.company || '';
      dpPeriod.textContent = node.dataset.period || '';

      dpBullets.innerHTML = '';
      const bullets = (node.dataset.bullets || '').split('|').filter(b => b.trim());
      bullets.forEach(b => {
        const li = document.createElement('li');
        li.textContent = b.trim();
        dpBullets.appendChild(li);
      });

      detailPanel.classList.add('visible');
      detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  if (dpClose) {
    dpClose.addEventListener('click', () => {
      tlNodes.forEach(n => n.classList.remove('active'));
      detailPanel.classList.remove('visible');
    });
  }

  /* TELA CHEIA */
  window.toggleFs = function () {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  /* EXPORTAR PDF */
  window.doPrint = function () { window.print(); };

});
