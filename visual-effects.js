// 3D记忆网络可视化
class MemoryNetwork3D {
    constructor() {
        this.canvas = document.getElementById('memory-network');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.nodes = [];
        this.connections = [];
        this.particles = [];
        this.time = 0;
        
        this.init();
    }
    
    init() {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x0F0F1E, 100, 1000);
        
        // 设置相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 30;
        this.camera.position.y = 10;
        
        // 设置渲染器
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // 添加光源
        const ambientLight = new THREE.AmbientLight(0x6B46C1, 0.4);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0x9333EA, 1);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
        
        // 创建网络节点
        this.createNetworkNodes();
        
        // 创建连接线
        this.createConnections();
        
        // 创建粒子系统
        this.createParticleSystem();
        
        // 开始动画
        this.animate();
        
        // 响应窗口大小变化
        window.addEventListener('resize', () => this.onWindowResize());
        
        // 添加鼠标交互
        this.setupMouseInteraction();
    }
    
    createNetworkNodes() {
        const nodeGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const nodeMaterial = new THREE.MeshPhongMaterial({
            color: 0x9333EA,
            emissive: 0x6B46C1,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        // 创建节点网格
        for (let i = 0; i < 20; i++) {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
            
            // 随机位置
            node.position.x = (Math.random() - 0.5) * 50;
            node.position.y = (Math.random() - 0.5) * 30;
            node.position.z = (Math.random() - 0.5) * 40;
            
            // 存储初始位置
            node.userData = {
                initialPosition: node.position.clone(),
                offset: Math.random() * Math.PI * 2
            };
            
            this.nodes.push(node);
            this.scene.add(node);
        }
    }
    
    createConnections() {
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x6B46C1,
            transparent: true,
            opacity: 0.3
        });
        
        // 创建节点之间的连接
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.nodes[i].position.distanceTo(this.nodes[j].position);
                
                // 只连接近距离的节点
                if (distance < 15) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([
                        this.nodes[i].position,
                        this.nodes[j].position
                    ]);
                    
                    const line = new THREE.Line(geometry, lineMaterial);
                    this.connections.push({
                        line: line,
                        start: this.nodes[i],
                        end: this.nodes[j]
                    });
                    this.scene.add(line);
                }
            }
        }
    }
    
    createParticleSystem() {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 500;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100;
            positions[i + 1] = (Math.random() - 0.5) * 100;
            positions[i + 2] = (Math.random() - 0.5) * 100;
            
            const color = new THREE.Color();
            color.setHSL(0.8 + Math.random() * 0.2, 0.8, 0.5);
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
    }
    
    setupMouseInteraction() {
        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        
        document.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            // 轻微移动相机
            this.camera.position.x = mouse.x * 5;
            this.camera.position.y = 10 + mouse.y * 5;
            this.camera.lookAt(0, 0, 0);
            
            // 检测节点悬停
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.nodes);
            
            // 重置所有节点
            this.nodes.forEach(node => {
                node.scale.set(1, 1, 1);
                node.material.emissiveIntensity = 0.5;
            });
            
            // 高亮悬停的节点
            if (intersects.length > 0) {
                const hoveredNode = intersects[0].object;
                hoveredNode.scale.set(1.5, 1.5, 1.5);
                hoveredNode.material.emissiveIntensity = 1;
            }
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.01;
        
        // 节点浮动动画
        this.nodes.forEach(node => {
            const offset = node.userData.offset;
            node.position.y = node.userData.initialPosition.y + 
                Math.sin(this.time + offset) * 2;
            node.rotation.y += 0.01;
        });
        
        // 更新连接线
        this.connections.forEach(connection => {
            const positions = [
                connection.start.position,
                connection.end.position
            ];
            connection.line.geometry.setFromPoints(positions);
        });
        
        // 旋转粒子系统
        if (this.particles) {
            this.particles.rotation.y += 0.0005;
            this.particles.rotation.x += 0.0002;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// 时间流动效果
class TimeFlow {
    constructor() {
        this.container = document.getElementById('time-flow');
        this.lines = [];
        this.init();
    }
    
    init() {
        // 创建流动的时间线
        for (let i = 0; i < 5; i++) {
            this.createTimeLine();
        }
    }
    
    createTimeLine() {
        const line = document.createElement('div');
        line.style.cssText = `
            position: absolute;
            width: 2px;
            height: 100%;
            background: linear-gradient(
                to bottom,
                transparent,
                rgba(147, 51, 234, 0.3),
                transparent
            );
            left: ${Math.random() * 100}%;
            animation: flowDown ${10 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        this.container.appendChild(line);
        this.lines.push(line);
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes flowDown {
        from {
            transform: translateY(-100%);
        }
        to {
            transform: translateY(100%);
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 高级交互效果
class AdvancedInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupScrollEffects();
        this.setupHoverEffects();
        this.createConnectionPulse();
    }
    
    setupScrollEffects() {
        // 滚动时的视差效果
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const delta = scrollY - lastScrollY;
            
            // 背景视差
            const timeFlow = document.getElementById('time-flow');
            if (timeFlow) {
                timeFlow.style.transform = `translateY(${scrollY * 0.3}px)`;
            }
            
            // 记忆节点渐入
            document.querySelectorAll('.memory-node').forEach((node, index) => {
                const rect = node.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    const progress = 1 - (rect.top / window.innerHeight);
                    node.style.opacity = Math.min(1, 0.3 + progress);
                    node.style.transform = `translateX(${
                        index % 2 === 0 ? -20 + progress * 20 : 20 - progress * 20
                    }px)`;
                }
            });
            
            lastScrollY = scrollY;
        });
    }
    
    setupHoverEffects() {
        // 为所有可交互元素添加涟漪效果
        document.querySelectorAll('button, .memory-node').forEach(element => {
            element.addEventListener('click', (e) => {
                const rect = element.getBoundingClientRect();
                const ripple = document.createElement('span');
                
                ripple.style.cssText = `
                    position: absolute;
                    background: radial-gradient(circle, rgba(147, 51, 234, 0.5), transparent);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    animation: rippleExpand 0.6s ease-out;
                `;
                
                const size = Math.max(rect.width, rect.height) * 2;
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left) + 'px';
                ripple.style.top = (e.clientY - rect.top) + 'px';
                
                element.style.position = 'relative';
                element.style.overflow = 'hidden';
                element.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
    
    createConnectionPulse() {
        // 定期发送脉冲通过连接线
        setInterval(() => {
            const paths = document.querySelectorAll('.connection-path');
            paths.forEach((path, index) => {
                setTimeout(() => {
                    const pulse = path.cloneNode();
                    pulse.style.strokeWidth = '4';
                    pulse.style.opacity = '1';
                    pulse.style.animation = 'pulsePath 2s ease-out';
                    
                    path.parentElement.appendChild(pulse);
                    setTimeout(() => pulse.remove(), 2000);
                }, index * 100);
            });
        }, 5000);
    }
}

// 添加更多CSS动画
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes rippleExpand {
        to {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
    
    @keyframes pulsePath {
        to {
            stroke-width: 0;
            opacity: 0;
        }
    }
`;
document.head.appendChild(additionalStyles);

// 初始化所有视觉效果
document.addEventListener('DOMContentLoaded', () => {
    // 初始化3D网络
    const network3D = new MemoryNetwork3D();
    
    // 初始化时间流
    const timeFlow = new TimeFlow();
    
    // 初始化高级交互
    const interactions = new AdvancedInteractions();
    
    // 使用GSAP创建进入动画
    if (typeof gsap !== 'undefined') {
        gsap.from('.header', {
            duration: 1.5,
            y: -50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from('.connection-line', {
            duration: 2,
            scaleY: 0,
            transformOrigin: 'top',
            ease: 'power2.inOut'
        });
        
        gsap.from('.memory-creator', {
            duration: 1,
            scale: 0,
            rotation: 180,
            ease: 'back.out(1.7)',
            delay: 1
        });
    }
    
    console.log('ForeverLink - 视觉效果系统已启动');
});