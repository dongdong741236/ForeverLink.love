// 高级动画效果和交互增强

// 创建自定义光标效果
class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursorTrail = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursorTrail.className = 'cursor-trail';
        
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid #ff6b9d;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `;
        
        this.cursorTrail.style.cssText = `
            position: fixed;
            width: 40px;
            height: 40px;
            background: radial-gradient(circle, rgba(255, 107, 157, 0.3), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorTrail);
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 10 + 'px';
            this.cursor.style.top = e.clientY - 10 + 'px';
            
            setTimeout(() => {
                this.cursorTrail.style.left = e.clientX - 20 + 'px';
                this.cursorTrail.style.top = e.clientY - 20 + 'px';
            }, 100);
            
            // 创建光标轨迹粒子
            if (Math.random() > 0.9) {
                this.createTrailParticle(e.clientX, e.clientY);
            }
        });
        
        document.addEventListener('mousedown', () => {
            this.cursor.style.transform = 'scale(0.8)';
            this.cursorTrail.style.transform = 'scale(1.5)';
        });
        
        document.addEventListener('mouseup', () => {
            this.cursor.style.transform = 'scale(1)';
            this.cursorTrail.style.transform = 'scale(1)';
        });
    }
    
    createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: #ff6b9d;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            animation: fadeOut 1s ease-out forwards;
        `;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// 创建音效系统
class SoundSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.init();
    }
    
    init() {
        // 初始化音频上下文
        window.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.createSounds();
            }
        }, { once: true });
    }
    
    createSounds() {
        // 创建心跳声
        this.sounds.heartbeat = () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
        
        // 创建魔法音效
        this.sounds.magic = () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1046.50, this.audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        };
        
        // 创建叮当声
        this.sounds.chime = () => {
            const frequencies = [523.25, 659.25, 783.99];
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.5);
                }, index * 100);
            });
        };
    }
    
    play(soundName) {
        if (this.audioContext && this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }
}

// 创建高级粒子系统
class AdvancedParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        `;
        document.body.appendChild(this.canvas);
        this.resize();
        this.init();
    }
    
    init() {
        window.addEventListener('resize', () => this.resize());
        this.animate();
        
        // 定期创建新粒子
        setInterval(() => {
            if (this.particles.length < 100) {
                this.createParticle();
            }
        }, 100);
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticle() {
        this.particles.push({
            x: Math.random() * this.canvas.width,
            y: this.canvas.height + 10,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 3 - 1,
            size: Math.random() * 3 + 1,
            color: `hsl(${Math.random() * 60 + 330}, 70%, 60%)`,
            life: 1
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.01;
            p.vy += 0.05; // 重力
            
            if (p.life <= 0 || p.y < -10) {
                this.particles.splice(i, 1);
                continue;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// 创建文字动画效果
class TextAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        // 为所有标题添加悬停效果
        document.querySelectorAll('h1, h2, h3').forEach(heading => {
            heading.addEventListener('mouseenter', () => {
                this.glitchEffect(heading);
            });
        });
    }
    
    glitchEffect(element) {
        const originalText = element.textContent;
        const glitchChars = '♥♡❤💕💖💗💝💞💟';
        let iterations = 0;
        
        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                })
                .join('');
            
            iterations += 1;
            
            if (iterations > originalText.length) {
                clearInterval(interval);
            }
        }, 30);
    }
}

// 创建高级背景效果
class AdvancedBackground {
    constructor() {
        this.createGradientAnimation();
        this.createFloatingShapes();
    }
    
    createGradientAnimation() {
        const gradientOverlay = document.createElement('div');
        gradientOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, 
                rgba(255, 107, 157, 0.1),
                rgba(254, 202, 87, 0.1),
                rgba(72, 219, 251, 0.1),
                rgba(255, 159, 243, 0.1)
            );
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            pointer-events: none;
            z-index: 4;
        `;
        document.body.appendChild(gradientOverlay);
    }
    
    createFloatingShapes() {
        for (let i = 0; i < 5; i++) {
            const shape = document.createElement('div');
            const shapeType = ['circle', 'heart', 'star'][Math.floor(Math.random() * 3)];
            
            shape.style.cssText = `
                position: fixed;
                width: ${Math.random() * 100 + 50}px;
                height: ${Math.random() * 100 + 50}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                background: radial-gradient(circle, 
                    rgba(255, 107, 157, 0.2),
                    transparent
                );
                border-radius: ${shapeType === 'circle' ? '50%' : '0'};
                filter: blur(3px);
                animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
                pointer-events: none;
                z-index: 3;
            `;
            
            if (shapeType === 'heart') {
                shape.innerHTML = '❤️';
                shape.style.fontSize = shape.style.width;
                shape.style.background = 'none';
                shape.style.filter = 'blur(2px)';
                shape.style.opacity = '0.1';
            }
            
            document.body.appendChild(shape);
        }
    }
}

// 添加浮动动画CSS
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
        }
        25% {
            transform: translateY(-30px) translateX(20px) rotate(90deg);
        }
        50% {
            transform: translateY(20px) translateX(-20px) rotate(180deg);
        }
        75% {
            transform: translateY(-20px) translateX(30px) rotate(270deg);
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(floatStyle);

// 初始化所有高级效果
window.addEventListener('DOMContentLoaded', () => {
    const customCursor = new CustomCursor();
    const soundSystem = new SoundSystem();
    const particleSystem = new AdvancedParticleSystem();
    const textAnimations = new TextAnimations();
    const advancedBackground = new AdvancedBackground();
    
    // 将音效系统挂载到全局
    window.soundSystem = soundSystem;
    
    // 添加按钮音效
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            soundSystem.play('chime');
        });
    });
    
    // 心形动画音效
    document.querySelectorAll('.heart').forEach(heart => {
        heart.addEventListener('animationiteration', () => {
            soundSystem.play('heartbeat');
        });
    });
    
    console.log('✨ 高级效果系统已启动');
});