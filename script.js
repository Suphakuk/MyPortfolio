const projectData = {
  freeze: {
    eyebrow: "PROJECT 01 / FREEZE",
    title: "Freeze: Website Wireframe & Prototype",
    description: "ออกแบบโครงสร้างเว็บไซต์และ Interactive Prototype สำหรับแบรนด์ Freeze ด้วยแนวคิด Clean UI ผสมโทนชมพูพาสเทล โดยยึดหลัก User Experience และทำให้ทุกปุ่มสามารถโต้ตอบได้เหมือนการใช้งานจริง",
    folder: "freeze",
    count: 6
  },
  canteen: {
    eyebrow: "PROJECT 02 / CANTEEN",
    title: "ระบบเติมเงินบัตรโรงอาหาร",
    description: "แพลตฟอร์มสำหรับผู้ใช้งานทั่วไป ร้านค้า และ Admin รองรับ Responsive Design ทั้ง Web Browser และมือถือ ช่วยให้การเติมเงินและจัดการข้อมูลทำได้สะดวกและรวดเร็ว",
    folder: "canteen",
    count: 18
  },
  fridge: {
    eyebrow: "PROJECT 03 / AI FOOD",
    title: "ระบบแนะนำเมนูอาหารจากรูปวัตถุดิบ",
    description: "Web Application ที่ผสานเทคโนโลยี AI เข้ากับ UX/UI เพื่อช่วยแก้ปัญหา Food Waste และอำนวยความสะดวกในการตัดสินใจเลือกเมนูอาหาร ตั้งแต่ User Flow ไปจนถึง Front-end ด้วย React.js",
    folder: "fridge",
    count: 26
  }
};

const modal = document.querySelector('#projectModal');
const gallery = document.querySelector('#modalGallery');
const modalTitle = document.querySelector('#modalTitle');
const modalEyebrow = document.querySelector('#modalEyebrow');
const modalDescription = document.querySelector('#modalDescription');
const modalCount = document.querySelector('#modalCount');

// ---------- Project case studies ----------
const projectList = document.querySelector('#projectList');

function openProject(key){
  const p = projectData[key];
  if(!p) return;
  modalEyebrow.textContent = p.eyebrow;
  modalTitle.textContent = p.title;
  modalDescription.textContent = p.description;
  modalCount.textContent = `${String(p.count).padStart(2,'0')} SCREENS`;
  gallery.innerHTML = '';

  for(let i=1;i<=p.count;i++){
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = `assets/projects/${p.folder}/${p.folder}-${String(i).padStart(2,'0')}.png`;
    img.alt = `${p.title} screen ${i}`;
    img.onerror = () => img.remove();
    gallery.appendChild(img);
  }
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}

function closeProject(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}

// Modal close controls.
document.querySelector('.modal-close')?.addEventListener('click', closeProject);
document.querySelector('.modal-backdrop')?.addEventListener('click', closeProject);

// ---------- Projects carousel ----------
const projectViewport = document.querySelector('#projectViewport');
const projectCarousel = document.querySelector('#projectCarousel');
const projectProgressBar = document.querySelector('#projectProgressBar');
const projectSlideCount = document.querySelector('#projectSlideCount');
const projectPrev = document.querySelector('.project-prev');
const projectNext = document.querySelector('.project-next');
const projectDots = [...document.querySelectorAll('#projectDots button')];

if(projectViewport && projectList){
  const originalCards = [...projectList.querySelectorAll('.project-card')];
  const totalProjects = originalCards.length;
  let autoTimer = null;
  let normalizeTimer = null;
  let isPointerDown = false;
  let startX = 0;
  let startScroll = 0;
  let suppressClick = false;
  let pressedCard = null;
  let isNormalizing = false;

  // Five copies give the carousel a large invisible buffer on both sides.
  // We start in the middle copy and silently recenter only after a movement
  // has finished. This prevents the visible "jump" at either end.
  const copiesBefore = 2;
  for(let copy=0; copy<copiesBefore; copy++){
    originalCards.slice().reverse().forEach(card => {
      const clone = card.cloneNode(true);
      clone.classList.remove('reveal','show','is-active');
      clone.classList.add('show');
      projectList.insertBefore(clone, projectList.firstChild);
    });
  }
  for(let copy=0; copy<2; copy++){
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.classList.remove('reveal','show','is-active');
      clone.classList.add('show');
      projectList.appendChild(clone);
    });
  }

  const allCards = [...projectList.querySelectorAll('.project-card')];
  const middleStart = totalProjects * copiesBefore;
  const middleEnd = middleStart + totalProjects;
  const getGap = () => parseFloat(getComputedStyle(projectList).gap) || 0;
  const getCardCenterLeft = card => card.offsetLeft - (projectViewport.clientWidth - card.offsetWidth) / 2;

  const getActivePhysicalIndex = () => {
    const viewportCenter = projectViewport.scrollLeft + projectViewport.clientWidth / 2;
    let best = middleStart, bestDistance = Infinity;
    allCards.forEach((card, i) => {
      const center = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(center - viewportCenter);
      if(distance < bestDistance){ bestDistance = distance; best = i; }
    });
    return best;
  };

  const physicalToLogical = physical =>
    ((physical - middleStart) % totalProjects + totalProjects) % totalProjects;

  const updateActiveCard = () => {
    const physical = getActivePhysicalIndex();
    allCards.forEach((card, i) => card.classList.toggle('is-active', i === physical));
    return physical;
  };

  const updateCarouselUI = () => {
    const index = physicalToLogical(getActivePhysicalIndex());
    updateActiveCard();
    if(projectSlideCount) projectSlideCount.textContent = `${String(index + 1).padStart(2,'0')} / ${String(totalProjects).padStart(2,'0')}`;
    if(projectProgressBar) projectProgressBar.style.width = `${((index + 1) / totalProjects) * 100}%`;
    projectDots.forEach((dot,i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
  };

  const goToPhysical = (physicalIndex, behavior='smooth') => {
    const card = allCards[physicalIndex];
    if(!card) return;
    projectViewport.scrollTo({left:getCardCenterLeft(card), behavior});
  };

  // Recenter after motion is over. Because the target card has an identical
  // copy in the middle, the user sees no discontinuity.
  const normalizeLoop = () => {
    if(isNormalizing || isPointerDown) return;
    const physical = getActivePhysicalIndex();
    if(physical < middleStart || physical >= middleEnd){
      const logical = physicalToLogical(physical);
      const target = middleStart + logical;
      isNormalizing = true;
      projectViewport.scrollLeft = getCardCenterLeft(allCards[target]);
      isNormalizing = false;
    }
    updateCarouselUI();
  };

  const scheduleNormalize = (delay=760) => {
    clearTimeout(normalizeTimer);
    normalizeTimer = setTimeout(normalizeLoop, delay);
  };

  const getLogicalIndex = () => physicalToLogical(getActivePhysicalIndex());

  const goTo = (logicalIndex, behavior='smooth') => {
    const currentPhysical = getActivePhysicalIndex();
    const currentLogical = getLogicalIndex();
    const direction = logicalIndex > currentLogical && logicalIndex - currentLogical > totalProjects/2 ? -1 :
                      logicalIndex < currentLogical && currentLogical - logicalIndex > totalProjects/2 ? 1 :
                      Math.sign(logicalIndex - currentLogical);
    let target;

    if(Math.abs(logicalIndex - currentLogical) <= 1){
      target = currentPhysical + direction;
    }else{
      const logical = ((logicalIndex % totalProjects) + totalProjects) % totalProjects;
      target = middleStart + logical;
      // Prefer the nearest physical copy to keep the movement short.
      const candidates = [logical, logical + totalProjects, logical + totalProjects*2, logical + totalProjects*3, logical + totalProjects*4];
      target = candidates.map(i => ({i, d:Math.abs(i-currentPhysical)})).sort((a,b)=>a.d-b.d)[0].i;
    }

    // Keep at least one full copy on either side during normal navigation.
    target = Math.max(1, Math.min(allCards.length-2, target));
    goToPhysical(target, behavior);
    scheduleNormalize(behavior === 'smooth' ? 780 : 30);
  };

  const nextProject = () => goTo(getLogicalIndex() + 1);
  const prevProject = () => goTo(getLogicalIndex() - 1);

  projectNext?.addEventListener('click', () => { nextProject(); restartAuto(); });
  projectPrev?.addEventListener('click', () => { prevProject(); restartAuto(); });
  projectDots.forEach(dot => dot.addEventListener('click', () => { goTo(Number(dot.dataset.slide)); restartAuto(); }));

  let scrollTick = null;
  projectViewport.addEventListener('scroll', () => {
    if(scrollTick) return;
    scrollTick = requestAnimationFrame(() => {
      updateCarouselUI();
      // Never recenter while the browser is animating. That was the source of
      // the visible snap/jitter in the previous version.
      if(!isPointerDown) scheduleNormalize(820);
      scrollTick = null;
    });
  }, {passive:true});

  projectViewport.addEventListener('pointerdown', e => {
    if(e.pointerType === 'mouse' && e.button !== 0) return;
    pressedCard = e.target.closest('.project-card');
    isPointerDown = true;
    suppressClick = false;
    startX = e.clientX;
    startScroll = projectViewport.scrollLeft;
    projectViewport.classList.add('is-dragging');
    clearTimeout(normalizeTimer);
    stopAuto();
  });

  projectViewport.addEventListener('pointermove', e => {
    if(!isPointerDown) return;
    if(Math.abs(e.clientX - startX) > 7) suppressClick = true;
    projectViewport.scrollLeft = startScroll - (e.clientX - startX);
  });

  const endDrag = () => {
    if(!isPointerDown) return;
    isPointerDown = false;
    projectViewport.classList.remove('is-dragging');
    const delta = projectViewport.scrollLeft - startScroll;
    const wasDrag = Math.abs(delta) > 7 || suppressClick;
    goToPhysical(getActivePhysicalIndex(), 'smooth');
    scheduleNormalize(820);
    if(!wasDrag && pressedCard) openProject(pressedCard.dataset.project);
    pressedCard = null;
    restartAuto();
    setTimeout(() => { suppressClick = false; }, 80);
  };
  projectViewport.addEventListener('pointerup', endDrag);
  projectViewport.addEventListener('pointercancel', endDrag);
  projectViewport.addEventListener('click', e => {
    if(suppressClick){ e.preventDefault(); e.stopPropagation(); }
  }, true);

  allCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        openProject(card.dataset.project);
      }
    });
  });

  projectViewport.addEventListener('keydown', e => {
    if(e.key === 'ArrowRight'){ e.preventDefault(); nextProject(); restartAuto(); }
    if(e.key === 'ArrowLeft'){ e.preventDefault(); prevProject(); restartAuto(); }
    if(e.key === 'Home'){ e.preventDefault(); goTo(0); restartAuto(); }
    if(e.key === 'End'){ e.preventDefault(); goTo(totalProjects - 1); restartAuto(); }
  });

  projectCarousel?.addEventListener('mouseenter', stopAuto);
  projectCarousel?.addEventListener('mouseleave', restartAuto);
  projectCarousel?.addEventListener('focusin', stopAuto);
  projectCarousel?.addEventListener('focusout', e => { if(!projectCarousel.contains(e.relatedTarget)) restartAuto(); });

  function stopAuto(){ if(autoTimer) clearInterval(autoTimer); autoTimer = null; }
  function restartAuto(){
    stopAuto();
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    autoTimer = setInterval(nextProject, 5600);
  }

  const setInitialPosition = () => {
    const target = allCards[middleStart];
    if(!target) return;
    projectViewport.scrollLeft = getCardCenterLeft(target);
    updateCarouselUI();
  };

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const logical = getLogicalIndex();
      const target = allCards[middleStart + logical];
      if(target) projectViewport.scrollLeft = getCardCenterLeft(target);
      updateCarouselUI();
    }, 120);
  });

  requestAnimationFrame(() => requestAnimationFrame(() => {
    setInitialPosition();
    restartAuto();
  }));
}

// ---------- Scroll reveal ----------
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add('show');
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ---------- Mobile navigation ----------
const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav nav');
menu?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('mobile-open');
  menu.setAttribute('aria-expanded', String(isOpen));
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('mobile-open')));

// ---------- Accessible light / dark theme ----------
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('suphakon-theme');
if(savedTheme === 'dark') document.body.classList.add('dark');

function updateThemeButton(){
  const dark = document.body.classList.contains('dark');
  themeToggle?.setAttribute('aria-pressed', String(dark));
  themeToggle?.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
}
updateThemeButton();

themeToggle?.addEventListener('click', () => {
  document.body.classList.add('theme-changing');
  document.body.classList.toggle('dark');
  localStorage.setItem('suphakon-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  updateThemeButton();
  window.setTimeout(() => document.body.classList.remove('theme-changing'), 420);
});

// ---------- Seamless Base44-style marquee ----------
const marqueeTrack = document.getElementById('marqueeTrack');
if(marqueeTrack){
  const original = marqueeTrack.querySelector('.marquee-group');
  for(let i=0;i<2;i++) marqueeTrack.appendChild(original.cloneNode(true));
}

// ---------- Interactive skills ----------
const skillData = {
  coding: {
    label: 'CODING',
    title: 'Build-ready foundation',
    description: 'พื้นฐานด้านการพัฒนา Front-end และการเขียนโปรแกรมที่ช่วยให้การออกแบบสามารถสื่อสารกับทีม Developer ได้ดีขึ้น',
    items: ['Python', 'Java', 'React.js', 'Git / GitHub', 'MySQL']
  },
  design: {
    label: 'TOOLS & DESIGN',
    title: 'Design toolkit',
    description: 'เครื่องมือสำหรับสร้าง UI, visual assets และงาน 3D/creative ที่ใช้ประกอบการออกแบบ',
    items: ['Figma', 'Canva', 'Blender', 'AI Image Generation']
  },
  language: {
    label: 'LANGUAGE',
    title: 'Communication',
    description: 'ข้อมูลด้านภาษาตามที่ระบุไว้ใน Portfolio',
    items: ['Thai — Native', 'English — A2']
  },
  process: {
    label: 'DESIGN PROCESS',
    title: 'From structure to interface',
    description: 'กระบวนการออกแบบที่เน้นการวางโครงสร้าง ทดลอง และพัฒนา visual ให้ชัดเจน',
    items: ['Wireframing', 'Prototyping', 'Visual Design']
  }
};

const skillDisplay = document.getElementById('skillDisplay');
const skillTabs = document.querySelectorAll('.skill-tab');

function renderSkill(key){
  const skill = skillData[key];
  if(!skillDisplay || !skill) return;
  skillDisplay.innerHTML = `
    <div class="skill-copy">
      <span>${skill.label}</span>
      <h4>${skill.title}</h4>
      <p>${skill.description}</p>
    </div>
    <div class="skill-list">
      ${skill.items.map((item, i) => `<div class="skill-pill"><b>${String(i+1).padStart(2,'0')}</b>${item}</div>`).join('')}
    </div>
  `;
  skillTabs.forEach(tab => {
    const active = tab.dataset.skill === key;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
}

skillTabs.forEach(tab => tab.addEventListener('click', () => renderSkill(tab.dataset.skill)));
renderSkill('coding');

// ---------- Gentle card tilt: desktop only, no cursor theme ----------
const finePointer = window.matchMedia('(pointer:fine)');
if(finePointer.matches){
  document.querySelectorAll('.profile-card, .profile-intro-panel, .project-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      card.style.setProperty('--rx', `${(-y * 2.2).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${(x * 2.2).toFixed(2)}deg`);
      card.classList.add('tilting');
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('tilting');
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });
}


// ---------- Active section in navigation ----------
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav nav a')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
},{rootMargin:'-35% 0px -55% 0px', threshold:0});
sections.forEach(section => sectionObserver.observe(section));

// Escape closes modal and mobile navigation.
document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){
    closeProject();
    nav?.classList.remove('mobile-open');
  }
});

// ---------- Home: smooth local dark-theme lens reveal ----------
const home = document.getElementById('home');
const homeThemeLens = document.getElementById('homeThemeLens');
const homeDarkLayer = document.getElementById('homeDarkLayer');
const homeDarkContent = document.getElementById('homeDarkContent');
const homeFinePointer = window.matchMedia('(pointer:fine)');

if(home && homeThemeLens && homeDarkLayer && homeDarkContent && homeFinePointer.matches){
  // Clone only the visual Home composition. The clone is never part of document flow.
  const sourceNodes = [...home.children].filter(node =>
    node !== homeDarkLayer && node !== homeThemeLens
  );
  sourceNodes.forEach(node => {
    const clone = node.cloneNode(true);
    clone.removeAttribute('id');
    clone.classList.remove('reveal','show');
    clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    clone.querySelectorAll('.reveal').forEach(el => el.classList.remove('reveal','show'));
    homeDarkContent.appendChild(clone);
  });

  // v8-style smooth lens: target follows the pointer, rendered position eases behind it.
  let targetX = home.clientWidth * .72;
  let targetY = home.clientHeight * .34;
  let currentX = targetX;
  let currentY = targetY;
  let targetRadius = 180;
  let currentRadius = targetRadius;
  let raf = 0;
  let active = false;
  let dragging = false;

  const updateTarget = (e) => {
    const rect = home.getBoundingClientRect();
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
  };

  const render = () => {
    currentX += (targetX - currentX) * .16;
    currentY += (targetY - currentY) * .16;
    currentRadius += (targetRadius - currentRadius) * .14;

    home.style.setProperty('--theme-x', `${currentX}px`);
    home.style.setProperty('--theme-y', `${currentY}px`);
    home.style.setProperty('--theme-size', `${currentRadius}px`);

    const moving =
      Math.abs(targetX - currentX) > .08 ||
      Math.abs(targetY - currentY) > .08 ||
      Math.abs(targetRadius - currentRadius) > .08;

    if(active || moving) raf = requestAnimationFrame(render);
    else raf = 0;
  };

  const wake = () => {
    if(!raf) raf = requestAnimationFrame(render);
  };

  home.addEventListener('pointerenter', e => {
    updateTarget(e);
    currentX = targetX;
    currentY = targetY;
    active = true;
    home.classList.add('theme-lens-active');
    wake();
  });

  home.addEventListener('pointermove', e => {
    updateTarget(e);
    active = true;
    home.classList.add('theme-lens-active');
    wake();
  });

  home.addEventListener('pointerdown', e => {
    if(e.pointerType === 'mouse'){
      dragging = true;
      targetRadius = 195;
      home.classList.add('theme-lens-dragging');
      wake();
    }
  });

  window.addEventListener('pointerup', () => {
    if(!dragging) return;
    dragging = false;
    targetRadius = 180;
    home.classList.remove('theme-lens-dragging');
    wake();
  });

  home.addEventListener('pointerleave', () => {
    if(dragging) return;
    active = false;
    home.classList.remove('theme-lens-active','theme-lens-dragging');
    wake();
  });

  window.addEventListener('resize', () => {
    if(!active){
      targetX = home.clientWidth * .72;
      targetY = home.clientHeight * .34;
      currentX = targetX;
      currentY = targetY;
      home.style.setProperty('--theme-x', `${currentX}px`);
      home.style.setProperty('--theme-y', `${currentY}px`);
    }
  });
}
