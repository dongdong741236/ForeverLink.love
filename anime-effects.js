// ForeverLink - Anime.js 官网风格动画效果实现

// ============= Logo变形动画 =============
class LogoMorph {
    constructor() {
        this.paths = [
            // 心形
            "M300,100 C300,50 250,30 200,50 C150,30 100,50 100,100 C100,150 200,200 300,250 C400,200 500,150 500,100 C500,50 450,30 400,50 C350,30 300,50 300,100",
            // 无限符号
            "M150,100 C150,50 100,50 100,100 C100,150 150,150 150,100 L450,100 C450,150 500,150 500,100 C500,50 450,50 450,100 L150,100",
            // 链条
            "M100,100 L200,100 C220,100 240,120 240,140 C240,160 220,180 200,180 L300,180 C320,180 340,160 340,140 C340,120 320,100 300,100 L400,100 C420,100 440,120 440,140 C440,160 420,180 400,180 L500,180",
            // 波浪
            "M100,150 Q150,50 200,150 T300,150 T400,150 T500,150",
            // 圆形
            "M300,50 A100,100 0 0,1 300,250 A100,100 0 0,1 300,50"
        ];
        this.currentPath = 0;
        this.init();
    }

    init() {
        this.morphAnimation = anime({
            targets: '.logo-path',
            d: [
                { value: this.paths[0] },
                { value: this.paths[1] },
                { value: this.paths[2] },
                { value: this.paths[3] },
                { value: this.paths[4] },
                { value: this.paths[0] }
            ],
            duration: 15000,
            easing: 'easeInOutQuad',
            loop: true
        });
    }
}

// ============= 网格点阵动画 =============
class DotsGrid {
    constructor() {
        this.grid = document.getElementById('dotsGrid');
        this.dots = [];
        this.cols = 30;
        this.rows = 20;
        this.init();
    }

    init() {
        // 创建网格点
        for (let i = 0; i < this.cols * this.rows; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.dataset.index = i;
            this.grid.appendChild(dot);
            this.dots.push(dot);
        }

        // 添加鼠标交互
        this.grid.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.grid.addEventListener('mouseleave', () => this.resetDots());

        // 自动波动动画
        this.startWaveAnimation();
    }

    handleMouseMove(e) {
        const rect = this.grid.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cellWidth = rect.width / this.cols;
        const cellHeight = rect.height / this.rows;
        const col = Math.floor(x / cellWidth);
        const row = Math.floor(y / cellHeight);
        const centerIndex = row * this.cols + col;

        this.dots.forEach((dot, index) => {
            const dotRow = Math.floor(index / this.cols);
            const dotCol = index % this.cols;
            const distance = Math.sqrt(
                Math.pow(dotCol - col, 2) + Math.pow(dotRow - row, 2)
            );

            if (distance < 5) {
                dot.classList.add('active');
                anime({
                    targets: dot,
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 1, 0.1],
                    duration: 1000,
                    delay: distance * 50,
                    easing: 'easeOutElastic(1, 0.5)'
                });
            }
        });
    }

    resetDots() {
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
    }

    startWaveAnimation() {
        anime({
            targets: '.dot',
            scale: [
                { value: 1, duration: 0 },
                { value: 1.5, duration: 500 },
                { value: 1, duration: 500 }
            ],
            opacity: [
                { value: 0.1, duration: 0 },
                { value: 1, duration: 500 },
                { value: 0.1, duration: 500 }
            ],
            delay: anime.stagger(50, {
                grid: [this.cols, this.rows],
                from: 'center'
            }),
            loop: true,
            easing: 'easeInOutQuad'
        });
    }
}

// ============= 交互式演示 =============
class DemoAnimations {
    constructor() {
        this.stage = document.getElementById('demoElements');
        this.buttons = document.querySelectorAll('.demo-btn');
        this.currentAnimation = null;
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const animation = btn.dataset.animation;
                this.playAnimation(animation);
            });
        });

        // 默认播放第一个动画
        this.playAnimation('stagger');
    }

    clearStage() {
        if (this.currentAnimation) {
            this.currentAnimation.pause();
        }
        this.stage.innerHTML = '';
    }

    playAnimation(type) {
        this.clearStage();

        switch(type) {
            case 'stagger':
                this.staggerAnimation();
                break;
            case 'morph':
                this.morphAnimation();
                break;
            case 'chain':
                this.chainAnimation();
                break;
            case 'explode':
                this.explodeAnimation();
                break;
            case 'wave':
                this.waveAnimation();
                break;
        }
    }

    staggerAnimation() {
        // 创建涟漪扩散效果
        const rings = 10;
        for (let i = 0; i < rings; i++) {
            const ring = document.createElement('div');
            ring.className = 'demo-element';
            ring.style.width = ring.style.height = `${(i + 1) * 60}px`;
            ring.style.background = 'none';
            ring.style.border = '2px solid';
            ring.style.borderColor = `hsl(${250 + i * 10}, 70%, 60%)`;
            this.stage.appendChild(ring);
        }

        this.currentAnimation = anime({
            targets: '.demo-element',
            scale: [0, 1],
            opacity: [1, 0],
            duration: 2000,
            delay: anime.stagger(100),
            loop: true,
            easing: 'easeOutExpo'
        });
    }

    morphAnimation() {
        // 形态变换动画
        const element = document.createElement('div');
        element.className = 'demo-element';
        element.style.width = element.style.height = '100px';
        this.stage.appendChild(element);

        this.currentAnimation = anime({
            targets: element,
            keyframes: [
                { borderRadius: '0%', rotate: 0, scale: 1, background: '#667eea' },
                { borderRadius: '50%', rotate: 180, scale: 1.5, background: '#764ba2' },
                { borderRadius: '20%', rotate: 360, scale: 1, background: '#f093fb' },
                { borderRadius: '0%', rotate: 540, scale: 0.5, background: '#667eea' },
                { borderRadius: '50%', rotate: 720, scale: 1, background: '#764ba2' }
            ],
            duration: 4000,
            loop: true,
            easing: 'easeInOutQuad'
        });
    }

    chainAnimation() {
        // 链式反应动画
        const count = 15;
        for (let i = 0; i < count; i++) {
            const element = document.createElement('div');
            element.className = 'demo-element';
            element.style.left = `${50 + (i - count/2) * 40}%`;
            element.style.top = '50%';
            this.stage.appendChild(element);
        }

        this.currentAnimation = anime({
            targets: '.demo-element',
            translateY: [
                { value: -100, duration: 500 },
                { value: 0, duration: 500 }
            ],
            scale: [
                { value: 2, duration: 500 },
                { value: 1, duration: 500 }
            ],
            delay: anime.stagger(50),
            loop: true,
            easing: 'easeInOutQuad'
        });
    }

    explodeAnimation() {
        // 粒子爆炸效果
        const particles = 30;
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'demo-element';
            particle.style.width = particle.style.height = '10px';
            particle.style.left = '50%';
            particle.style.top = '50%';
            this.stage.appendChild(particle);
        }

        this.currentAnimation = anime({
            targets: '.demo-element',
            translateX: () => anime.random(-200, 200),
            translateY: () => anime.random(-200, 200),
            scale: [
                { value: 0, duration: 0 },
                { value: 2, duration: 300 },
                { value: 0, duration: 700 }
            ],
            opacity: [
                { value: 1, duration: 300 },
                { value: 0, duration: 700 }
            ],
            delay: anime.stagger(20),
            duration: 1000,
            loop: true,
            easing: 'easeOutExpo'
        });
    }

    waveAnimation() {
        // 波浪传递效果
        const cols = 20;
        const rows = 5;
        for (let i = 0; i < cols * rows; i++) {
            const element = document.createElement('div');
            element.className = 'demo-element';
            element.style.width = element.style.height = '15px';
            element.style.left = `${20 + (i % cols) * 30}px`;
            element.style.top = `${100 + Math.floor(i / cols) * 30}px`;
            this.stage.appendChild(element);
        }

        this.currentAnimation = anime({
            targets: '.demo-element',
            translateY: [
                { value: -30, duration: 500 },
                { value: 0, duration: 500 }
            ],
            backgroundColor: [
                { value: '#667eea', duration: 500 },
                { value: '#f093fb', duration: 500 }
            ],
            delay: anime.stagger(10, { grid: [cols, rows], from: 'first' }),
            loop: true,
            easing: 'easeInOutSine'
        });
    }
}

// ============= 时间线动画 =============
class TimelineAnimation {
    constructor() {
        this.track = document.getElementById('timelineTrack');
        this.progress = this.track.querySelector('.timeline-progress');
        this.itemsContainer = this.track.querySelector('.timeline-items');
        this.init();
    }

    init() {
        // 创建时间线节点
        for (let i = 0; i < 10; i++) {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.dataset.index = i;
            this.itemsContainer.appendChild(item);
        }

        // 进度条动画
        anime({
            targets: this.progress,
            width: '100%',
            duration: 10000,
            easing: 'linear',
            loop: true,
            update: (anim) => {
                const progress = anim.progress / 100;
                this.updateItems(progress);
            }
        });
    }

    updateItems(progress) {
        const items = this.itemsContainer.querySelectorAll('.timeline-item');
        items.forEach((item, index) => {
            const itemProgress = (index + 1) / items.length;
            if (progress >= itemProgress) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

// ============= 3D方块矩阵 =============
class CubeGrid {
    constructor() {
        this.grid = document.getElementById('cubeGrid');
        this.cubes = [];
        this.init();
    }

    init() {
        // 创建方块矩阵
        for (let i = 0; i < 100; i++) {
            const cube = document.createElement('div');
            cube.className = 'cube';
            cube.dataset.index = i;
            
            // 添加立方体的面
            ['front', 'back', 'left', 'right', 'top', 'bottom'].forEach(face => {
                const faceElement = document.createElement('div');
                faceElement.className = `cube-face cube-face-${face}`;
                cube.appendChild(faceElement);
            });
            
            this.grid.appendChild(cube);
            this.cubes.push(cube);
        }

        // 波浪动画
        this.startWaveAnimation();
    }

    startWaveAnimation() {
        anime({
            targets: '.cube',
            translateZ: [
                { value: 0, duration: 0 },
                { value: 50, duration: 1000 },
                { value: 0, duration: 1000 }
            ],
            rotateX: [
                { value: 0, duration: 0 },
                { value: 180, duration: 1000 },
                { value: 360, duration: 1000 }
            ],
            delay: anime.stagger(50, { grid: [10, 10], from: 'center' }),
            loop: true,
            easing: 'easeInOutQuad'
        });
    }
}

// ============= 背景Canvas动画 =============
class BackgroundCanvas {
    constructor() {
        this.canvas = document.getElementById('bgCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // 创建粒子
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新和绘制粒子
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 边界反弹
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(102, 126, 234, 0.5)';
            this.ctx.fill();
        });
        
        // 绘制连接线
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(102, 126, 234, ${0.2 * (1 - distance / 150)})`;
                    this.ctx.stroke();
                }
            }
        }
    }
}

// ============= 鼠标跟随效果 =============
class CursorFollower {
    constructor() {
        this.cursor = document.getElementById('cursorFollower');
        this.ring = this.cursor.querySelector('.cursor-ring');
        this.dot = this.cursor.querySelector('.cursor-dot');
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.ring.style.left = e.clientX + 'px';
            this.ring.style.top = e.clientY + 'px';
            
            this.dot.style.left = e.clientX + 'px';
            this.dot.style.top = e.clientY + 'px';
        });

        // 悬停交互元素时的效果
        document.querySelectorAll('button, .demo-element, .cube, .timeline-item').forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.ring.style.width = '60px';
                this.ring.style.height = '60px';
                this.ring.style.borderColor = '#f093fb';
            });
            
            element.addEventListener('mouseleave', () => {
                this.ring.style.width = '40px';
                this.ring.style.height = '40px';
                this.ring.style.borderColor = '#667eea';
            });
        });
    }
}

// ============= 控制面板 =============
class ControlPanel {
    constructor() {
        this.speedControl = document.getElementById('speedControl');
        this.densityControl = document.getElementById('densityControl');
        this.connectionControl = document.getElementById('connectionControl');
        this.resetBtn = document.getElementById('resetAnimation');
        this.init();
    }

    init() {
        this.speedControl.addEventListener('input', (e) => {
            anime.speed = parseFloat(e.target.value);
        });

        this.resetBtn.addEventListener('click', () => {
            location.reload();
        });
    }
}

// ============= 初始化所有动画 =============
document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有模块
    const logoMorph = new LogoMorph();
    const dotsGrid = new DotsGrid();
    const demoAnimations = new DemoAnimations();
    const timelineAnimation = new TimelineAnimation();
    const cubeGrid = new CubeGrid();
    const backgroundCanvas = new BackgroundCanvas();
    const cursorFollower = new CursorFollower();
    const controlPanel = new ControlPanel();

    // 文字入场动画
    anime({
        targets: '.logo-text .letter',
        translateY: [-50, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(100),
        easing: 'easeOutExpo'
    });

    // 滚动触发动画
    const observerOptions = {
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.grid-section, .demo-section, .timeline-section, .cube-section').forEach(section => {
        observer.observe(section);
    });

    console.log('✨ ForeverLink - Anime.js 风格动画系统已启动');
});