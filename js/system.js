document.addEventListener('DOMContentLoaded', () => {
    
    const bootTrigger = document.getElementById('boot-trigger');
    const bootScreen = document.getElementById('boot-screen');
    const desktop = document.getElementById('desktop');
    const startBtn = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu');
    const contextMenu = document.getElementById('context-menu');

    // 1. 开机流程
    bootTrigger.addEventListener('click', () => {
        // 尝试全屏
        const de = document.documentElement;
        if (de.requestFullscreen) de.requestFullscreen();
        else if (de.webkitRequestFullScreen) de.webkitRequestFullScreen();

        bootTrigger.style.display = 'none';
        bootScreen.style.display = 'flex';

        // 模拟 BIOS 和 Loading
        setTimeout(() => {
            bootScreen.style.opacity = '0';
            setTimeout(() => {
                bootScreen.style.display = 'none';
                desktop.style.opacity = '1';
            }, 500);
        }, 3000);
    });

    // 2. 时间更新
    function updateClock() {
        const now = new Date();
        document.getElementById('time').innerText = 
            String(now.getHours()).padStart(2,'0') + ":" + String(now.getMinutes()).padStart(2,'0');
        
        document.getElementById('date').innerText = 
            now.getFullYear() + "/" + (now.getMonth()+1) + "/" + now.getDate();
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 3. 开始菜单切换
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.classList.toggle('open');
        startBtn.classList.toggle('active');
    });

    // 点击其他地方关闭菜单
    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
            startMenu.classList.remove('open');
            startBtn.classList.remove('active');
        }
        // 顺便关闭右键菜单
        contextMenu.style.display = 'none';
    });

    // 4. 右键菜单 (自定义)
    desktop.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        // 只在桌面背景或图标上触发，不在窗口内触发
        if (e.target.closest('.window') || e.target.closest('#taskbar')) return;

        const x = e.clientX;
        const y = e.clientY;
        
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.style.display = 'flex';
    });

});