// 3.1 应用配置数据
const apps = {
    'pc': { title: '此电脑', icon: 'fa-computer', color: '#333', content: '<div style="padding:20px;text-align:center;color:#333"><h2>C: 盘 (系统)</h2><p>可用空间: 500 GB</p></div>' },
    'recycle': { title: '回收站', icon: 'fa-trash-can', color: '#333', content: '<div style="padding:20px;text-align:center;color:#666"><i class="fa-solid fa-trash fa-3x"></i><p>回收站为空</p></div>' },
    'browser': { title: '浏览器', icon: 'fa-chrome', color: '#E13630', content: '<iframe src="https://bing.com"></iframe>' },
    'calc': { title: '计算器', icon: 'fa-calculator', color: '#28A8EA', type: 'calc' },
    'settings': { title: '设置', icon: 'fa-gear', color: '#999', content: '<div style="padding:20px"><h3>设置</h3><p>系统版本: WebOS 1.0</p><p>开发者: Gemini</p></div>' }
};

// 3.2 状态管理
let zIndexCounter = 100;
const openedApps = {}; // 存储已打开窗口的状态

// 3.3 初始化桌面图标
function initIcons() {
    const container = document.getElementById('icon-container');
    const iconList = ['pc', 'recycle', 'browser', 'calc', 'settings'];
    
    iconList.forEach(id => {
        const app = apps[id];
        const div = document.createElement('div');
        div.className = 'd-icon';
        div.innerHTML = `<i class="fa-solid ${app.icon}" style="color:${app.icon === 'fa-computer' || app.icon === 'fa-trash-can' ? 'white' : app.color}"></i><span>${app.title}</span>`;
        div.onclick = () => openWindow(id);
        container.appendChild(div);
    });
}

// 3.4 打开窗口核心函数
function openWindow(appId) {
    // 如果已存在，则置顶并恢复
    if (openedApps[appId]) {
        const win = document.getElementById(`win-${appId}`);
        win.style.display = 'flex';
        bringToFront(win);
        return;
    }

    const app = apps[appId];
    const layer = document.getElementById('window-layer');
    
    // 创建窗口 DOM
    const win = document.createElement('div');
    win.className = 'window';
    win.id = `win-${appId}`;
    win.style.zIndex = ++zIndexCounter;
    
    // 默认居中位置 (带随机偏移)
    const offsetX = 20 + (Math.random() * 30);
    const offsetY = 20 + (Math.random() * 30);
    win.style.top = `${offsetY}px`;
    win.style.left = `${offsetX}px`;

    // 构建内容 (如果是计算器，特殊处理)
    let bodyContent = app.content || '';
    if (app.type === 'calc') {
        bodyContent = `
        <div class="calc-grid">
            <div class="calc-display" id="calc-out">0</div>
            <div class="calc-btn" onclick="calcInput('C')">C</div><div class="calc-btn" onclick="calcInput('/')">/</div><div class="calc-btn" onclick="calcInput('*')">*</div><div class="calc-btn" onclick="calcInput('del')">←</div>
            <div class="calc-btn" onclick="calcInput('7')">7</div><div class="calc-btn" onclick="calcInput('8')">8</div><div class="calc-btn" onclick="calcInput('9')">9</div><div class="calc-btn" onclick="calcInput('-')">-</div>
            <div class="calc-btn" onclick="calcInput('4')">4</div><div class="calc-btn" onclick="calcInput('5')">5</div><div class="calc-btn" onclick="calcInput('6')">6</div><div class="calc-btn" onclick="calcInput('+')">+</div>
            <div class="calc-btn" onclick="calcInput('1')">1</div><div class="calc-btn" onclick="calcInput('2')">2</div><div class="calc-btn" onclick="calcInput('3')">3</div><div class="calc-btn" style="grid-row:span 2;background:#0078d7;color:white" onclick="calcInput('=')">=</div>
            <div class="calc-btn" onclick="calcInput('0')" style="grid-column:span 2">0</div><div class="calc-btn" onclick="calcInput('.')">.</div>
        </div>`;
    }

    win.innerHTML = `
        <div class="win-header" id="head-${appId}">
            <div class="win-title"><i class="fa-solid ${app.icon}"></i> ${app.title}</div>
            <div class="win-controls">
                <div class="win-btn" onclick="minimizeWindow('${appId}')">_</div>
                <div class="win-btn" onclick="toggleMax('${appId}')">□</div>
                <div class="win-btn close" onclick="closeWindow('${appId}')">✕</div>
            </div>
        </div>
        <div class="win-body">${bodyContent}</div>
    `;

    layer.appendChild(win);
    openedApps[appId] = true;
    addToTaskbar(appId);
    
    // 绑定拖拽和点击置顶
    setupDrag(win, document.getElementById(`head-${appId}`));
    win.addEventListener('mousedown', () => bringToFront(win));
    win.addEventListener('touchstart', () => bringToFront(win), {passive: true});
}

// 3.5 窗口操作
function closeWindow(id) {
    const win = document.getElementById(`win-${id}`);
    if (win) win.remove();
    delete openedApps[id];
    document.getElementById(`task-item-${id}`).remove();
}

function minimizeWindow(id) {
    const win = document.getElementById(`win-${id}`);
    win.style.display = 'none';
    document.getElementById(`task-item-${id}`).classList.remove('active');
}

function toggleMax(id) {
    const win = document.getElementById(`win-${id}`);
    if (win.style.width === '100%') {
        win.style.width = ''; win.style.height = ''; win.style.top = '50px'; win.style.left = '50px';
    } else {
        win.style.width = '100%'; win.style.height = 'calc(100% - 40px)'; win.style.top = '0'; win.style.left = '0';
    }
}

function bringToFront(win) {
    win.style.zIndex = ++zIndexCounter;
    // 更新任务栏高亮
    const id = win.id.replace('win-', '');
    document.querySelectorAll('.task-item').forEach(i => i.classList.remove('active'));
    const taskItem = document.getElementById(`task-item-${id}`);
    if(taskItem) taskItem.classList.add('active');
}

// 3.6 任务栏联动
function addToTaskbar(id) {
    const bar = document.getElementById('task-apps');
    const app = apps[id];
    const item = document.createElement('div');
    item.className = 'task-item active';
    item.id = `task-item-${id}`;
    item.innerHTML = `<i class="fa-solid ${app.icon}" style="color:${app.icon.includes('chrome')?app.color:'white'}"></i>`;
    item.onclick = () => {
        const win = document.getElementById(`win-${id}`);
        if (win.style.display === 'none') {
            win.style.display = 'flex';
            bringToFront(win);
        } else if (!item.classList.contains('active')) {
            bringToFront(win);
        } else {
            minimizeWindow(id);
        }
    };
    bar.appendChild(item);
}

// 3.7 兼容移动端的拖拽逻辑
function setupDrag(element, handle) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    function start(e) {
        // 如果是全屏状态，禁止拖拽
        if(element.style.width === '100%') return;
        
        isDragging = true;
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        startX = clientX;
        startY = clientY;
        initialLeft = element.offsetLeft;
        initialTop = element.offsetTop;
        bringToFront(element);
    }

    function move(e) {
        if (!isDragging) return;
        e.preventDefault(); // 防止手机滚动
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        const dx = clientX - startX;
        const dy = clientY - startY;

        element.style.left = `${initialLeft + dx}px`;
        element.style.top = `${initialTop + dy}px`;
    }

    function end() { isDragging = false; }

    handle.addEventListener('mousedown', start);
    handle.addEventListener('touchstart', start, {passive: false});
    
    document.addEventListener('mousemove', move);
    document.addEventListener('touchmove', move, {passive: false});
    
    document.addEventListener('mouseup', end);
    document.addEventListener('touchend', end);
}

// 计算器简单逻辑
let calcStr = "";
window.calcInput = function(val) {
    const out = document.getElementById('calc-out');
    if (val === 'C') calcStr = "";
    else if (val === 'del') calcStr = calcStr.slice(0, -1);
    else if (val === '=') { try { calcStr = eval(calcStr); } catch { calcStr = "Error"; } }
    else calcStr += val;
    out.innerText = calcStr || "0";
}

// 初始化执行
initIcons();