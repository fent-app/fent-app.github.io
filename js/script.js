document.addEventListener('DOMContentLoaded', () => {
    
    const bootTrigger = document.getElementById('boot-trigger');
    const bootScreen = document.getElementById('boot-screen');
    const desktop = document.getElementById('desktop-environment');
    const startBtn = document.getElementById('start-menu-toggle'); // Note: In HTML I used #start-btn
    const startBtnReal = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu');
    
    // 1. 开机与全屏逻辑
    bootTrigger.addEventListener('click', () => {
        // 尝试进入全屏
        const docElm = document.documentElement;
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }

        // 隐藏触发层，显示Boot动画
        bootTrigger.style.display = 'none';
        bootScreen.style.display = 'flex';

        // 模拟开机加载时间 (3.5秒)
        setTimeout(() => {
            bootScreen.style.opacity = '0';
            
            // 动画结束后完全隐藏Boot层并显示桌面
            setTimeout(() => {
                bootScreen.style.display = 'none';
                desktop.style.opacity = '1';
            }, 500);
            
        }, 3500);
    });

    // 2. 任务栏时钟
    function updateClock() {
        const now = new Date();
        const timeEl = document.getElementById('time');
        const dateEl = document.getElementById('date');

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        timeEl.textContent = `${hours}:${minutes}`;
        dateEl.textContent = `${year}/${month}/${day}`;
    }
    setInterval(updateClock, 1000);
    updateClock(); // 初始化

    // 3. 开始菜单交互
    startBtnReal.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止冒泡到 document
        startMenu.classList.toggle('open');
        startBtnReal.classList.toggle('active');
    });

    // 点击桌面其他地方关闭开始菜单
    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && !startBtnReal.contains(e.target)) {
            startMenu.classList.remove('open');
            startBtnReal.classList.remove('active');
        }
    });

    // 4. 简单的图标交互
    const desktopIcons = document.querySelectorAll('.app-icon');
    desktopIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // 移除其他图标的选中状态
            desktopIcons.forEach(i => i.style.backgroundColor = 'transparent');
            desktopIcons.forEach(i => i.style.border = '1px solid transparent');
            
            // 选中当前
            this.style.backgroundColor = 'rgba(255,255,255,0.2)';
            this.style.border = '1px solid rgba(255,255,255,0.3)';
        });
    });
});
