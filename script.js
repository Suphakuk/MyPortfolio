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
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => openProject(card.dataset.project));
  card.querySelector('.view-btn').addEventListener('click', e => {
    e.stopPropagation();
    openProject(card.dataset.project);
  });
});

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

document.querySelector('.modal-close')?.addEventListener('click', closeProject);
document.querySelector('.modal-backdrop')?.addEventListener('click', closeProject);

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
