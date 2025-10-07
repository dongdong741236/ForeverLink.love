// ===== 1. 标题字母动画 =====
anime.timeline()
    .add({
        targets: '.main-title .letter',
        translateY: [-100, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1400,
        delay: (el, i) => 30 * i
    })
    .add({
        targets: '.subtitle',
        opacity: [0, 1],
        translateY: [20, 0],
        easing: 'easeOutExpo',
        duration: 1000
    }, '-=600');

// ===== 2. 网格点阵动画 =====
function createGrid() {
    const container = document.querySelector('.grid-container');
    const cols = 20;
    const rows = 10;
    
    for (let i = 0; i < cols * rows; i++) {
        const dot = document.createElement('div');
        dot.classList.add('grid-dot');
        container.appendChild(dot);
    }
    
    // 波浪动画
    anime({
        targets: '.grid-dot',
        scale: [
            {value: 0, duration: 0},
            {value: 1.2, duration: 500},
            {value: 1, duration: 500}
        ],
        translateY: [
            {value: -20, duration: 500},
            {value: 0, duration: 500}
        ],
        delay: anime.stagger(50, {grid: [cols, rows], from: 'center'}),
        loop: true,
        easing: 'easeInOutSine'
    });
}

// ===== 3. Demo 1: 变形动画 =====
anime({
    targets: '.square',
    rotate: '1turn',
    borderRadius: ['0%', '50%'],
    duration: 2000,
    loop: true,
    direction: 'alternate',
    easing: 'easeInOutQuad'
});

// ===== 4. Demo 2: 交错动画 =====
function createCircles() {
    const container = document.querySelector('.circles-container');
    for (let i = 0; i < 5; i++) {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        container.appendChild(circle);
    }
    
    anime({
        targets: '.circle',
        translateY: -30,
        scale: [1, 1.5],
        duration: 800,
        delay: anime.stagger(100),
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine'
    });
}

// ===== 5. Demo 3: 时间线动画 =====
function createTimeline() {
    const container = document.querySelector('.timeline-dots');
    for (let i = 0; i < 5; i++) {
        const dot = document.createElement('div');
        dot.classList.add('timeline-dot');
        container.appendChild(dot);
    }
    
    anime.timeline({loop: true})
        .add({
            targets: '.timeline-dot',
            scale: [0, 1.5],
            duration: 500,
            delay: anime.stagger(100),
            easing: 'easeOutElastic(1, .5)'
        })
        .add({
            targets: '.timeline-dot',
            scale: 1,
            duration: 300,
            delay: anime.stagger(100),
            easing: 'easeInQuad'
        });
}

// ===== 6. Demo 4: SVG路径变形 =====
const morphPaths = [
    "M 25,50 Q 50,25 75,50 T 25,50",
    "M 20,50 L 50,20 L 80,50 L 50,80 Z",
    "M 30,50 Q 50,30 70,50 Q 50,70 30,50"
];

let pathIndex = 0;
function morphSVG() {
    anime({
        targets: '.morph-path',
        d: [{value: morphPaths[pathIndex]}],
        duration: 1500,
        easing: 'easeInOutQuad',
        complete: function() {
            pathIndex = (pathIndex + 1) % morphPaths.length;
            setTimeout(morphSVG, 500);
        }
    });
}

// ===== 7. 鼠标跟随效果 =====
const interactiveSection = document.querySelector('.interactive');
const cursor = document.querySelector('.follow-cursor');

interactiveSection.addEventListener('mousemove', (e) => {
    const rect = interactiveSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
});

// ===== 8. 点击涟漪效果 =====
interactiveSection.addEventListener('click', (e) => {
    const rect = interactiveSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    interactiveSection.appendChild(ripple);
    
    anime({
        targets: ripple,
        width: [0, 300],
        height: [0, 300],
        opacity: [1, 0],
        duration: 1000,
        easing: 'easeOutExpo',
        complete: function() {
            ripple.remove();
        }
    });
});

// ===== 初始化所有动画 =====
document.addEventListener('DOMContentLoaded', () => {
    createGrid();
    createCircles();
    createTimeline();
    setTimeout(morphSVG, 1000);
    
    // 滚动触发动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 当元素进入视口时触发动画
                if (entry.target.classList.contains('demo-card')) {
                    anime({
                        targets: entry.target,
                        translateY: [50, 0],
                        opacity: [0, 1],
                        duration: 800,
                        easing: 'easeOutExpo'
                    });
                }
            }
        });
    }, {threshold: 0.3});
    
    document.querySelectorAll('.demo-card').forEach(card => {
        observer.observe(card);
    });
    
    console.log('✨ Anime.js 动画系统启动成功！');
});