// ==========================================
// ANIME.JS OFFICIAL WEBSITE RECREATION
// ==========================================

// ------------------------------------------
// 1. LOGO ANIMATION (Like official site)
// ------------------------------------------
function initLogoAnimation() {
    const logoEl = document.querySelector('.logo-letter');
    
    // Create the animated line drawings
    const paths = [
        'M 70 140 L 140 70 L 210 140',
        'M 70 140 L 140 210 L 210 140',
    ];
    
    paths.forEach((d, i) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.style.opacity = '0';
        logoEl.appendChild(path);
    });
    
    // Animate logo paths
    anime.timeline({loop: true})
        .add({
            targets: '.logo-letter path',
            strokeDashoffset: [anime.setDashoffset, 0],
            opacity: [0, 1],
            easing: 'easeInOutSine',
            duration: 1500,
            delay: (el, i) => i * 250
        })
        .add({
            targets: '.logo-letter path',
            opacity: 0,
            duration: 1000,
            easing: 'easeInOutSine',
            delay: 1000
        });
}

// ------------------------------------------
// 2. HERO TITLE ANIMATION
// ------------------------------------------
function initHeroAnimation() {
    // Letter by letter animation
    anime.timeline()
        .add({
            targets: '.hero-title .letter',
            scale: [4, 1],
            opacity: [0, 1],
            translateZ: 0,
            easing: 'easeOutExpo',
            duration: 950,
            delay: (el, i) => 70 * i
        })
        .add({
            targets: '.hero-subtitle',
            opacity: [0, 1],
            translateY: [20, 0],
            easing: 'easeOutExpo',
            duration: 800
        }, '-=600');
}

// ------------------------------------------
// 3. STAGGER GRID VISUALIZATION
// ------------------------------------------
function initStaggerGrid() {
    const gridContainer = document.querySelector('.stagger-grid');
    const fragment = document.createDocumentFragment();
    const columns = Math.floor(gridContainer.offsetWidth / 30);
    const rows = 10;
    const numberOfElements = columns * rows;
    
    for (let i = 0; i < numberOfElements; i++) {
        const el = document.createElement('div');
        el.classList.add('el');
        fragment.appendChild(el);
    }
    
    gridContainer.appendChild(fragment);
    
    // Stagger animation from center
    anime({
        targets: '.stagger-grid .el',
        scale: [
            {value: 0, duration: 0},
            {value: 1, duration: 500, easing: 'easeOutSine'},
            {value: 0, duration: 500, easing: 'easeInSine'}
        ],
        delay: anime.stagger(50, {grid: [columns, rows], from: 'center'}),
        loop: true,
        loopDelay: 1000
    });
}

// ------------------------------------------
// 4. FEATURE DEMOS
// ------------------------------------------
function initFeatureDemos() {
    // Transform demo
    anime({
        targets: '#transform-demo .el',
        translateX: [
            {value: 100, duration: 1000},
            {value: 0, duration: 1000}
        ],
        rotate: [
            {value: '1turn', duration: 1000},
            {value: '0turn', duration: 1000}
        ],
        borderRadius: [
            {value: '50%', duration: 500},
            {value: '4px', duration: 500}
        ],
        delay: 500,
        loop: true,
        easing: 'easeInOutQuad'
    });
    
    // SVG Morph demo
    const morphPath = document.querySelector('.morph-path');
    anime({
        targets: morphPath,
        d: [
            {value: 'M 10,50 Q 25,10 40,50 T 70,50 T 100,50'},
            {value: 'M 10,50 Q 25,90 40,50 T 70,50 T 100,50'}
        ],
        duration: 2000,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutQuad'
    });
    
    // Timeline demo
    const tl = anime.timeline({
        loop: true,
        direction: 'alternate'
    });
    
    tl.add({
        targets: '.timeline-el',
        translateX: 50,
        scale: [1, 1.5],
        duration: 500,
        delay: anime.stagger(100),
        easing: 'easeInOutQuad'
    })
    .add({
        targets: '.timeline-el',
        rotate: '1turn',
        duration: 500,
        delay: anime.stagger(100),
        easing: 'easeInOutQuad'
    }, '-=400');
}

// ------------------------------------------
// 5. INTERACTIVE DEMO SECTION
// ------------------------------------------
function initInteractiveDemo() {
    const buttons = document.querySelectorAll('.demo-btn');
    const demos = document.querySelectorAll('.demo-content');
    const codeDisplay = document.getElementById('code-display');
    
    // Code snippets for each demo
    const codeSnippets = {
        basic: `anime({
  targets: '.basic-square',
  translateX: 250,
  rotate: '1turn',
  backgroundColor: '#FFF',
  duration: 800
});`,
        stagger: `anime({
  targets: '.stagger-el',
  translateX: 270,
  delay: anime.stagger(100),
  easing: 'easeOutElastic(1, .8)',
  loop: true
});`,
        timeline: `anime.timeline({loop: true})
  .add({
    targets: '.timeline-item',
    translateX: 270,
    duration: 800
  })
  .add({
    targets: '.timeline-item',
    rotate: 360,
    duration: 800
  }, '-=600');`,
        easing: `anime({
  targets: '.easing-ball',
  translateX: 270,
  easing: function(i) {
    return ['linear', 'easeInQuad', 'easeOutQuad', 
            'easeInOutQuad', 'easeOutElastic'][i];
  },
  delay: anime.stagger(100),
  loop: true
});`
    };
    
    // Button click handlers
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const demoType = btn.dataset.demo;
            
            // Update active button
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update demo content
            demos.forEach(d => d.style.display = 'none');
            const targetDemo = document.getElementById(`${demoType}-demo`);
            if (targetDemo) targetDemo.style.display = 'flex';
            
            // Update code display
            codeDisplay.textContent = codeSnippets[demoType];
            
            // Run the demo
            runDemo(demoType);
        });
    });
    
    // Initialize demos
    initBasicDemo();
    initStaggerDemo();
    initTimelineDemo();
    initEasingDemo();
}

function runDemo(type) {
    switch(type) {
        case 'basic':
            runBasicDemo();
            break;
        case 'stagger':
            runStaggerDemo();
            break;
        case 'timeline':
            runTimelineDemo();
            break;
        case 'easing':
            runEasingDemo();
            break;
    }
}

function initBasicDemo() {
    // Basic animation demo - runs continuously
    anime({
        targets: '.basic-square',
        translateX: [0, 200, 0],
        rotate: [0, '1turn', '0turn'],
        backgroundColor: [
            {value: '#FF1461'},
            {value: '#FFF'},
            {value: '#FF1461'}
        ],
        duration: 2000,
        loop: true,
        easing: 'easeInOutQuad'
    });
}

function runBasicDemo() {
    anime.remove('.basic-square');
    anime({
        targets: '.basic-square',
        translateX: [0, 200, 0],
        rotate: [0, '1turn', '0turn'],
        backgroundColor: [
            {value: '#FF1461'},
            {value: '#FFF'},
            {value: '#FF1461'}
        ],
        duration: 2000,
        loop: true,
        easing: 'easeInOutQuad'
    });
}

function initStaggerDemo() {
    const container = document.querySelector('.stagger-container');
    container.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const el = document.createElement('div');
        el.classList.add('stagger-el');
        container.appendChild(el);
    }
}

function runStaggerDemo() {
    anime.remove('.stagger-el');
    anime({
        targets: '.stagger-el',
        translateX: [0, 200, 0],
        scale: [1, 1.5, 1],
        delay: anime.stagger(100),
        duration: 1500,
        loop: true,
        easing: 'easeOutElastic(1, .8)'
    });
}

function initTimelineDemo() {
    const container = document.querySelector('.timeline-container');
    container.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const el = document.createElement('div');
        el.classList.add('timeline-item');
        container.appendChild(el);
    }
}

function runTimelineDemo() {
    anime.remove('.timeline-item');
    anime.timeline({loop: true})
        .add({
            targets: '.timeline-item',
            translateX: 200,
            duration: 800,
            easing: 'easeOutQuad'
        })
        .add({
            targets: '.timeline-item',
            rotate: 360,
            duration: 800,
            easing: 'easeInOutQuad'
        }, '-=600')
        .add({
            targets: '.timeline-item',
            translateX: 0,
            rotate: 0,
            duration: 800,
            easing: 'easeInQuad'
        });
}

function initEasingDemo() {
    const container = document.querySelector('.easing-grid');
    container.innerHTML = '';
    const easings = ['linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeOutElastic'];
    easings.forEach(() => {
        const el = document.createElement('div');
        el.classList.add('easing-ball');
        container.appendChild(el);
    });
}

function runEasingDemo() {
    anime.remove('.easing-ball');
    const easings = ['linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeOutElastic'];
    
    document.querySelectorAll('.easing-ball').forEach((ball, i) => {
        anime({
            targets: ball,
            translateX: [0, 200, 0],
            duration: 2000,
            delay: i * 100,
            easing: easings[i],
            loop: true
        });
    });
}

// ------------------------------------------
// 6. LAYERED ANIMATIONS
// ------------------------------------------
function initLayeredAnimations() {
    anime({
        targets: '.layer-1',
        scale: [1, 1.5, 1],
        opacity: [0.1, 0.3, 0.1],
        duration: 4000,
        loop: true,
        easing: 'easeInOutSine'
    });
    
    anime({
        targets: '.layer-2',
        scale: [1, 1.3, 1],
        opacity: [0.05, 0.15, 0.05],
        duration: 5000,
        loop: true,
        easing: 'easeInOutSine',
        delay: 500
    });
    
    anime({
        targets: '.layer-3',
        scale: [1, 1.2, 1],
        opacity: [0.02, 0.08, 0.02],
        duration: 6000,
        loop: true,
        easing: 'easeInOutSine',
        delay: 1000
    });
}

// ------------------------------------------
// 7. SCROLL ANIMATIONS
// ------------------------------------------
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                if (entry.target.classList.contains('feature-card')) {
                    anime({
                        targets: entry.target,
                        translateY: [50, 0],
                        opacity: [0, 1],
                        duration: 800,
                        easing: 'easeOutQuad'
                    });
                }
            }
        });
    }, {threshold: 0.2});
    
    document.querySelectorAll('.feature-card, section').forEach(el => {
        observer.observe(el);
    });
}

// ------------------------------------------
// INITIALIZATION
// ------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initLogoAnimation();
    initHeroAnimation();
    
    // Initialize grid when in view
    const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('initialized')) {
                initStaggerGrid();
                entry.target.classList.add('initialized');
            }
        });
    }, {threshold: 0.1});
    
    const gridSection = document.querySelector('.grid-section');
    if (gridSection) {
        gridObserver.observe(gridSection);
    }
    
    initFeatureDemos();
    initInteractiveDemo();
    initLayeredAnimations();
    initScrollAnimations();
    
    console.log('anime.js website recreation initialized');
});