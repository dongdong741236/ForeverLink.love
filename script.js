// 初始化粒子背景
particlesJS('particles-js', {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ['#ff6b9d', '#feca57', '#48dbfb', '#ff9ff3']
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.6,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'bounce',
            bounce: false,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 0.5
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// Three.js 3D场景
let scene, camera, renderer, hearts = [];

function initThreeJS() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('three-canvas'),
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // 添加点光源
    const pointLight = new THREE.PointLight(0xff6b9d, 1);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);
    
    // 创建3D心形几何体
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    
    heartShape.moveTo(x + 0.5, y + 0.5);
    heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    heartShape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    heartShape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y);
    heartShape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
    
    const extrudeSettings = {
        depth: 0.4,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 0.1,
        bevelThickness: 0.1
    };
    
    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    
    // 创建多个浮动的3D心形
    for (let i = 0; i < 5; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(`hsl(${340 + i * 10}, 70%, 60%)`),
            emissive: new THREE.Color(`hsl(${340 + i * 10}, 70%, 30%)`),
            shininess: 100,
            transparent: true,
            opacity: 0.7
        });
        
        const heart = new THREE.Mesh(geometry, material);
        heart.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        heart.scale.set(0.3, 0.3, 0.3);
        scene.add(heart);
        hearts.push(heart);
    }
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    // 旋转心形
    hearts.forEach((heart, index) => {
        heart.rotation.x += 0.01 * (index + 1) * 0.5;
        heart.rotation.y += 0.01 * (index + 1) * 0.5;
        heart.position.y = Math.sin(Date.now() * 0.001 + index) * 2;
    });
    
    renderer.render(scene, camera);
}

// GSAP动画
gsap.registerPlugin(MotionPathPlugin);

// 标题字母动画
gsap.from(".main-title .letter", {
    duration: 1,
    opacity: 0,
    y: 50,
    rotationX: 90,
    stagger: 0.1,
    ease: "back.out(1.7)"
});

// 副标题动画
gsap.from(".subtitle", {
    duration: 1.5,
    opacity: 0,
    y: 30,
    delay: 1,
    ease: "power3.out"
});

// 心形链接动画
gsap.timeline({ repeat: -1 })
    .to(".heart-left", {
        duration: 2,
        rotationY: 360,
        ease: "none"
    })
    .to(".heart-right", {
        duration: 2,
        rotationY: -360,
        ease: "none"
    }, "<");

// 无限符号路径动画
const infinityPath = anime.path('.infinity path');

// 创建沿路径移动的粒子
function createPathParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        background: radial-gradient(circle, #fff, #ff6b9d);
        border-radius: 50%;
        box-shadow: 0 0 10px #ff6b9d;
    `;
    document.querySelector('.infinity-container').appendChild(particle);
    
    anime({
        targets: particle,
        translateX: infinityPath('x'),
        translateY: infinityPath('y'),
        rotate: infinityPath('angle'),
        duration: 4000,
        loop: true,
        easing: 'linear'
    });
}

// 创建多个路径粒子
for (let i = 0; i < 3; i++) {
    setTimeout(() => createPathParticle(), i * 1333);
}

// 爱的宣言文字动画
anime({
    targets: '.word',
    translateY: [-20, 0],
    opacity: [0, 1],
    delay: anime.stagger(200, {start: 1000}),
    duration: 1000,
    easing: 'easeOutElastic(1, 0.5)'
});

// 按钮交互
const loveButton = document.getElementById('createLink');
const floatingHeartsContainer = document.getElementById('floatingHearts');
const nameModal = document.getElementById('nameModal');
const generateLinkBtn = document.getElementById('generateLink');
const eternalLinkDisplay = document.getElementById('eternalLinkDisplay');

loveButton.addEventListener('click', function(e) {
    // 按钮波纹效果
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: ripple 0.6s ease-out;
    `;
    
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    
    // 显示名字输入模态框
    nameModal.classList.add('active');
    
    // 创建爱心雨
    createHeartRain();
    
    // 触发链接动画
    triggerLinkAnimation();
});

// 生成永恒链接
generateLinkBtn.addEventListener('click', function() {
    const name1 = document.getElementById('name1').value.trim();
    const name2 = document.getElementById('name2').value.trim();
    
    if (name1 && name2) {
        // 创建永恒链接
        createEternalLink(name1, name2);
        
        // 关闭模态框
        nameModal.classList.remove('active');
        
        // 清空输入
        document.getElementById('name1').value = '';
        document.getElementById('name2').value = '';
        
        // 创建庆祝效果
        createCelebrationEffect();
    } else {
        // 摇动输入框提示
        document.querySelectorAll('.input-group input').forEach(input => {
            if (!input.value.trim()) {
                input.style.animation = 'shake 0.5s';
                setTimeout(() => input.style.animation = '', 500);
            }
        });
    }
});

// 创建永恒链接
function createEternalLink(name1, name2) {
    const namesDisplay = document.getElementById('namesDisplay');
    const linkUrl = document.getElementById('linkUrl');
    
    namesDisplay.innerHTML = `${name1} <span style="color: #ff6b9d;">❤️</span> ${name2}`;
    linkUrl.textContent = `foreverlink.love/${name1}-${name2}-${Date.now()}`;
    
    eternalLinkDisplay.classList.add('show');
    
    // 5秒后自动隐藏
    setTimeout(() => {
        eternalLinkDisplay.classList.remove('show');
    }, 8000);
}

// 创建庆祝效果
function createCelebrationEffect() {
    // 创建粒子爆炸
    const explosion = document.createElement('div');
    explosion.className = 'particle-explosion';
    explosion.style.left = '50%';
    explosion.style.top = '50%';
    document.body.appendChild(explosion);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const angle = (Math.PI * 2 * i) / 50;
        const velocity = 100 + Math.random() * 200;
        particle.style.setProperty('--x', `${Math.cos(angle) * velocity}px`);
        particle.style.setProperty('--y', `${Math.sin(angle) * velocity}px`);
        particle.style.background = `radial-gradient(circle, hsl(${Math.random() * 60 + 330}, 70%, 60%), transparent)`;
        explosion.appendChild(particle);
    }
    
    setTimeout(() => explosion.remove(), 1000);
    
    // 创建更多爱心
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
            heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
            floatingHeartsContainer.appendChild(heart);
            setTimeout(() => heart.remove(), 5000);
        }, i * 50);
    }
}

// 添加摇动动画
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// 点击模态框外部关闭
nameModal.addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('active');
    }
});

// 创建爱心雨效果
function createHeartRain() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = ['❤️', '💕', '💖', '💝', '💗'][Math.floor(Math.random() * 5)];
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
            heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
            
            floatingHeartsContainer.appendChild(heart);
            
            setTimeout(() => heart.remove(), 4000);
        }, i * 100);
    }
}

// 触发链接动画
function triggerLinkAnimation() {
    // GSAP 链条动画
    gsap.timeline()
        .to('.chain-links', {
            duration: 0.5,
            scale: 1.2,
            ease: "elastic.out(1, 0.3)"
        })
        .to('.chain-links', {
            duration: 0.5,
            scale: 1,
            ease: "elastic.out(1, 0.3)"
        });
    
    // 心形脉冲
    gsap.timeline()
        .to('.heart', {
            duration: 0.3,
            scale: 1.3,
            ease: "power2.out"
        })
        .to('.heart', {
            duration: 0.3,
            scale: 1,
            ease: "elastic.out(1, 0.5)"
        });
    
    // 创建连接特效
    createLinkEffect();
}

// 创建链接特效
function createLinkEffect() {
    const particles = 50;
    const container = document.querySelector('.heart-container');
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: linear-gradient(45deg, #ff6b9d, #feca57);
            border-radius: 50%;
            left: 50%;
            top: 50%;
            pointer-events: none;
        `;
        container.appendChild(particle);
        
        gsap.to(particle, {
            duration: Math.random() * 2 + 1,
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300,
            scale: 0,
            opacity: 0,
            ease: "power2.out",
            onComplete: () => particle.remove()
        });
    }
}

// 鼠标跟随效果
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    gsap.to('.heart-container', {
        duration: 1,
        rotationY: mouseX * 20,
        rotationX: -mouseY * 20,
        ease: "power2.out"
    });
});

// 滚动视差效果
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.title-section');
    if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// 初始化Three.js
initThreeJS();

// 窗口大小调整
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// 添加键盘交互 - 按空格键触发特效
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        loveButton.click();
    }
});

// 创建动态链条
function createDynamicChain() {
    const chainPath = document.getElementById('chain-path');
    const points = [];
    const numPoints = 20;
    
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const x = 50 + t * 300;
        const y = 50 + Math.sin(t * Math.PI * 2) * 20;
        points.push(`${x},${y}`);
    }
    
    anime({
        targets: chainPath,
        d: `M ${points.join(' L ')}`,
        duration: 2000,
        easing: 'easeInOutQuad',
        loop: true,
        direction: 'alternate'
    });
}

// 启动动态链条
createDynamicChain();

// 创建星星背景
function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    `;
    document.body.appendChild(starsContainer);
    
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
        `;
        starsContainer.appendChild(star);
    }
}

// 创建星星
createStars();

// 添加闪烁动画CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes twinkle {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
    }
    @keyframes ripple {
        to {
            width: 300px !important;
            height: 300px !important;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 页面加载完成动画
window.addEventListener('load', () => {
    gsap.from('body', {
        duration: 1,
        opacity: 0,
        ease: "power2.inOut"
    });
});

console.log('ForeverLink.love - 爱的永恒链接已启动 💕');