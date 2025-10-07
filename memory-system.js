// 记忆管理系统
class MemorySystem {
    constructor() {
        this.memories = this.loadMemories();
        this.connections = new Map();
        this.currentView = null;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderMemories();
        this.generateConnections();
        this.initWelcomeGuide();
    }
    
    loadMemories() {
        const saved = localStorage.getItem('foreverlink_memories');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // 默认示例记忆
        return [
            {
                id: Date.now() - 100000,
                date: '2024-01-15',
                title: '初次相遇',
                type: 'milestone',
                description: '在咖啡馆的角落，阳光透过窗户洒在书页上，我们第一次对视。',
                tags: ['咖啡', '阳光', '书店', '开始'],
                position: { x: 0, y: 0 }
            },
            {
                id: Date.now() - 80000,
                date: '2024-02-14',
                title: '雨中漫步',
                type: 'moment',
                description: '没有伞的雨天，我们在街道上奔跑，笑声混合着雨声。',
                tags: ['雨天', '街道', '欢笑'],
                position: { x: 0, y: 150 }
            },
            {
                id: Date.now() - 60000,
                date: '2024-03-20',
                title: '一起做饭',
                type: 'daily',
                description: '厨房里的小混乱，第一次尝试做意大利面，虽然味道一般但心情很好。',
                tags: ['烹饪', '日常', '意大利面'],
                position: { x: 0, y: 300 }
            },
            {
                id: Date.now() - 40000,
                date: '2024-05-01',
                title: '山顶日出',
                type: 'travel',
                description: '凌晨4点开始爬山，在山顶看到了最美的日出，那一刻感觉拥有了全世界。',
                tags: ['旅行', '日出', '山顶', '自然'],
                position: { x: 0, y: 450 }
            },
            {
                id: Date.now() - 20000,
                date: '2024-07-15',
                title: '深夜谈心',
                type: 'growth',
                description: '坐在阳台上，聊着各自的梦想和恐惧，直到天亮。',
                tags: ['深夜', '交流', '梦想', '成长'],
                position: { x: 0, y: 600 }
            }
        ];
    }
    
    saveMemories() {
        localStorage.setItem('foreverlink_memories', JSON.stringify(this.memories));
    }
    
    setupEventListeners() {
        // 添加记忆按钮
        const addBtn = document.getElementById('addMemoryBtn');
        addBtn.addEventListener('click', () => this.openMemoryModal());
        
        // 表单提交
        const form = document.getElementById('memoryForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // 取消按钮
        const cancelBtn = document.getElementById('cancelMemory');
        cancelBtn.addEventListener('click', () => this.closeMemoryModal());
        
        // 点击模态框外部关闭
        const modal = document.getElementById('memoryModal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeMemoryModal();
            }
        });
        
        // 欢迎引导关闭
        const closeGuide = document.getElementById('closeGuide');
        closeGuide.addEventListener('click', () => {
            const guide = document.getElementById('welcomeGuide');
            guide.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => guide.remove(), 500);
        });
    }
    
    openMemoryModal() {
        const modal = document.getElementById('memoryModal');
        modal.classList.add('active');
        
        // 设置默认日期为今天
        const dateInput = document.getElementById('memoryDate');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
    
    closeMemoryModal() {
        const modal = document.getElementById('memoryModal');
        modal.classList.remove('active');
        document.getElementById('memoryForm').reset();
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        const memory = {
            id: Date.now(),
            date: document.getElementById('memoryDate').value,
            title: document.getElementById('memoryTitle').value,
            type: document.getElementById('memoryType').value,
            description: document.getElementById('memoryDescription').value,
            tags: document.getElementById('memoryTags').value
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag),
            position: { x: 0, y: this.memories.length * 150 }
        };
        
        this.addMemory(memory);
        this.closeMemoryModal();
    }
    
    addMemory(memory) {
        this.memories.push(memory);
        this.saveMemories();
        this.renderMemories();
        this.generateConnections();
        
        // 添加动画效果
        setTimeout(() => {
            const node = document.querySelector(`[data-id="${memory.id}"]`);
            if (node) {
                node.scrollIntoView({ behavior: 'smooth', block: 'center' });
                this.highlightNode(node);
            }
        }, 100);
    }
    
    renderMemories() {
        const container = document.getElementById('memoryNodes');
        container.innerHTML = '';
        
        this.memories.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        this.memories.forEach((memory, index) => {
            const node = this.createMemoryNode(memory, index);
            container.appendChild(node);
        });
    }
    
    createMemoryNode(memory, index) {
        const node = document.createElement('div');
        node.className = `memory-node ${index % 2 === 0 ? 'left' : 'right'}`;
        node.dataset.id = memory.id;
        node.style.top = `${index * 150}px`;
        
        // 格式化日期
        const date = new Date(memory.date);
        const formattedDate = date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        node.innerHTML = `
            <div class="node-date">${formattedDate}</div>
            <div class="node-title">${memory.title}</div>
            <div class="node-type">${this.getTypeLabel(memory.type)}</div>
            <div class="node-preview">${memory.description || '点击查看详情'}</div>
            <div class="node-connections">
                ${memory.tags.map(tag => `
                    <span class="connection-tag">${tag}</span>
                `).join('')}
            </div>
        `;
        
        node.addEventListener('click', () => this.viewMemoryDetail(memory));
        node.addEventListener('mouseenter', () => this.highlightConnections(memory));
        node.addEventListener('mouseleave', () => this.clearHighlights());
        
        // 添加入场动画
        node.style.opacity = '0';
        node.style.transform = index % 2 === 0 
            ? 'translateX(-50px)' 
            : 'translateX(50px)';
        
        setTimeout(() => {
            node.style.transition = 'all 0.5s ease';
            node.style.opacity = '1';
            node.style.transform = 'translateX(0)';
        }, index * 100);
        
        return node;
    }
    
    getTypeLabel(type) {
        const labels = {
            moment: '瞬间',
            milestone: '里程碑',
            daily: '日常',
            travel: '旅行',
            celebration: '庆祝',
            challenge: '挑战',
            growth: '成长'
        };
        return labels[type] || type;
    }
    
    viewMemoryDetail(memory) {
        const viewer = document.getElementById('memoryViewer');
        const date = new Date(memory.date);
        const formattedDate = date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
        
        viewer.querySelector('.viewer-date').textContent = formattedDate;
        viewer.querySelector('.viewer-title').textContent = memory.title;
        viewer.querySelector('.viewer-description').textContent = 
            memory.description || '这个记忆还没有详细描述';
        
        // 显示连接
        const connectionsDiv = viewer.querySelector('.viewer-connections');
        const relatedMemories = this.findRelatedMemories(memory);
        
        if (relatedMemories.length > 0) {
            connectionsDiv.innerHTML = `
                <h4>相关记忆</h4>
                <div class="related-list">
                    ${relatedMemories.map(related => `
                        <div class="related-item">
                            <span>${related.title}</span>
                            <small>${new Date(related.date).toLocaleDateString('zh-CN')}</small>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            connectionsDiv.innerHTML = '';
        }
        
        viewer.classList.add('active');
        
        // 点击外部关闭
        setTimeout(() => {
            const closeHandler = (e) => {
                if (!viewer.contains(e.target)) {
                    viewer.classList.remove('active');
                    document.removeEventListener('click', closeHandler);
                }
            };
            document.addEventListener('click', closeHandler);
        }, 100);
    }
    
    findRelatedMemories(memory) {
        return this.memories.filter(m => {
            if (m.id === memory.id) return false;
            
            // 检查共同标签
            const commonTags = m.tags.filter(tag => 
                memory.tags.includes(tag)
            );
            
            return commonTags.length > 0;
        });
    }
    
    generateConnections() {
        this.connections.clear();
        
        // 基于标签创建连接
        this.memories.forEach((memory, i) => {
            this.memories.forEach((other, j) => {
                if (i >= j) return;
                
                const commonTags = memory.tags.filter(tag => 
                    other.tags.includes(tag)
                );
                
                if (commonTags.length > 0) {
                    const key = `${memory.id}-${other.id}`;
                    this.connections.set(key, {
                        from: memory,
                        to: other,
                        strength: commonTags.length,
                        tags: commonTags
                    });
                }
            });
        });
        
        this.drawConnections();
    }
    
    drawConnections() {
        const svg = document.getElementById('connectionsSvg');
        svg.innerHTML = svg.querySelector('defs').outerHTML;
        
        this.connections.forEach((connection) => {
            const fromNode = document.querySelector(`[data-id="${connection.from.id}"]`);
            const toNode = document.querySelector(`[data-id="${connection.to.id}"]`);
            
            if (fromNode && toNode) {
                const fromRect = fromNode.getBoundingClientRect();
                const toRect = toNode.getBoundingClientRect();
                
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.classList.add('connection-path');
                
                const fromX = fromRect.left + fromRect.width / 2;
                const fromY = fromRect.top + fromRect.height / 2;
                const toX = toRect.left + toRect.width / 2;
                const toY = toRect.top + toRect.height / 2;
                
                const controlX = (fromX + toX) / 2;
                const controlY = Math.min(fromY, toY) - 50;
                
                path.setAttribute('d', `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`);
                path.style.opacity = Math.min(0.3 + connection.strength * 0.2, 0.8);
                
                svg.appendChild(path);
            }
        });
    }
    
    highlightConnections(memory) {
        const relatedIds = new Set();
        
        this.connections.forEach((connection) => {
            if (connection.from.id === memory.id) {
                relatedIds.add(connection.to.id);
            } else if (connection.to.id === memory.id) {
                relatedIds.add(connection.from.id);
            }
        });
        
        // 高亮相关节点
        relatedIds.forEach(id => {
            const node = document.querySelector(`[data-id="${id}"]`);
            if (node) {
                node.style.borderColor = 'var(--accent-color)';
                node.style.transform = 'scale(1.05)';
            }
        });
    }
    
    clearHighlights() {
        document.querySelectorAll('.memory-node').forEach(node => {
            node.style.borderColor = '';
            node.style.transform = '';
        });
    }
    
    highlightNode(node) {
        node.style.animation = 'pulse 1s ease 3';
        setTimeout(() => {
            node.style.animation = '';
        }, 3000);
    }
    
    initWelcomeGuide() {
        const hasVisited = localStorage.getItem('foreverlink_visited');
        if (!hasVisited) {
            localStorage.setItem('foreverlink_visited', 'true');
        } else {
            const guide = document.getElementById('welcomeGuide');
            guide.style.display = 'none';
        }
    }
}

// 创建浮动记忆碎片
class FloatingMemories {
    constructor() {
        this.container = document.getElementById('floatingMemories');
        this.fragments = [];
        this.init();
    }
    
    init() {
        // 创建初始碎片
        for (let i = 0; i < 5; i++) {
            this.createFragment();
        }
        
        // 定期创建新碎片
        setInterval(() => {
            if (this.fragments.length < 10) {
                this.createFragment();
            }
        }, 5000);
    }
    
    createFragment() {
        const fragment = document.createElement('div');
        fragment.className = 'memory-fragment';
        
        // 随机位置和移动方向
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        const endX = (Math.random() - 0.5) * 200;
        const endY = (Math.random() - 0.5) * 200;
        
        fragment.style.left = `${startX}px`;
        fragment.style.top = `${startY}px`;
        fragment.style.setProperty('--float-x', `${endX}px`);
        fragment.style.setProperty('--float-y', `${endY}px`);
        fragment.style.animationDelay = `${Math.random() * 5}s`;
        fragment.style.animationDuration = `${10 + Math.random() * 10}s`;
        
        this.container.appendChild(fragment);
        this.fragments.push(fragment);
        
        // 动画结束后移除
        fragment.addEventListener('animationend', () => {
            fragment.remove();
            const index = this.fragments.indexOf(fragment);
            if (index > -1) {
                this.fragments.splice(index, 1);
            }
        });
    }
}

// 初始化系统
document.addEventListener('DOMContentLoaded', () => {
    window.memorySystem = new MemorySystem();
    window.floatingMemories = new FloatingMemories();
    
    // 窗口大小改变时重绘连接
    window.addEventListener('resize', () => {
        if (window.memorySystem) {
            window.memorySystem.drawConnections();
        }
    });
    
    console.log('ForeverLink - 记忆系统已启动');
});