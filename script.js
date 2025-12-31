document.addEventListener('DOMContentLoaded', function() {
    // 1. 全量接口 (【纯净1】已移至首位，总计40+条)
    const parseApis = [
        {"name": "纯净1 (首选)", "url": "https://im1907.top/?jx="},
        {"name": "七哥 (推荐)", "url": "https://jx.nnxv.cn/tv.php?url="},
        {"name": "虾米 (稳定)", "url": "https://jx.xmflv.cc/?url="},
        {"name": "B站1", "url": "https://jx.jsonplayer.com/player/?url="},
        {"name": "爱豆", "url": "https://jx.aidouer.net/?url="},
        {"name": "BL", "url": "https://vip.bljiex.com/?v="},
        {"name": "冰豆", "url": "https://api.qianqi.net/vip/?url="},
        {"name": "百域", "url": "https://jx.618g.com/?url="},
        {"name": "CK", "url": "https://www.ckplayer.vip/jiexi/?url="},
        {"name": "CHok", "url": "https://www.gai4.com/?url="},
        {"name": "ckmov", "url": "https://www.ckmov.vip/api.php?url="},
        {"name": "H8", "url": "https://www.h8jx.com/jiexi.php?url="},
        {"name": "JY", "url": "https://jx.playerjy.com/?url="},
        {"name": "解析", "url": "https://ckmov.ccyjjd.com/ckmov/?url="},
        {"name": "解析la", "url": "https://api.jiexi.la/?url="},
        {"name": "老板", "url": "https://vip.laobandq.com/jiexi.php?url="},
        {"name": "MAO", "url": "https://www.mtosz.com/m3u8.php?url="},
        {"name": "M3U8", "url": "https://jx.m3u8.tv/jiexi/?url="},
        {"name": "诺讯", "url": "https://www.nxflv.com/?url="},
        {"name": "OK", "url": "https://okjx.cc/?url="},
        {"name": "PM", "url": "https://www.playm3u8.cn/jiexi.php?url="},
        {"name": "盘古", "url": "https://www.pangujiexi.cc/jiexi.php?url="},
        {"name": "RDHK", "url": "https://jx.rdhk.net/?v="},
        {"name": "人人迷", "url": "https://jx.blbo.cc:4433/?url="},
        {"name": "思云", "url": "https://jx.ap2p.cn/?url="},
        {"name": "思古3", "url": "https://jsap.attakids.com/?url="},
        {"name": "听乐", "url": "https://jx.dj6u.com/?url="},
        {"name": "维多", "url": "https://jx.ivito.cn/?url="},
        {"name": "YT", "url": "https://jx.yangtu.top/?url="},
        {"name": "云端", "url": "https://sb.5gseo.net/?url="},
        {"name": "0523", "url": "https://go.yh0523.cn/y.cy?url="},
        {"name": "17云", "url": "https://www.1717yun.com/jx/ty.php?url="},
        {"name": "180", "url": "https://jx.000180.top/jx/?url="},
        {"name": "4K", "url": "https://jx.4kdv.com/?url="},
        {"name": "8090", "url": "https://www.8090g.cn/?url="},
        {"name": "剖元", "url": "https://www.pouyun.com/?url="},
        {"name": "全民", "url": "https://43.240.74.102:4433?url="},
        {"name": "夜幕", "url": "https://www.yemu.xyz/?url="},
        {"name": "M3U8TV", "url": "https://jx.m3u8.tv/jiexi/?url="},
        {"name": "playm3u8", "url": "https://www.playm3u8.cn/jiexi.php?url="},
        {"name": "综合", "url": "https://jx.jsonplayer.com/player/?url="},
        {"name": "云析", "url": "https://jx.yparse.com/index.php?url="}
    ];

    // 2. DOM 元素
    const apiListContainer = document.getElementById('api-list');
    const urlInput = document.getElementById('video-url');
    const playBtn = document.getElementById('play-btn');
    const clearBtn = document.getElementById('clear-btn');
    const pasteBtn = document.getElementById('smart-paste-btn');
    const iframe = document.getElementById('player-iframe');
    const overlay = document.getElementById('player-overlay');
    const overlayText = document.getElementById('overlay-text');
    const loadingBar = document.getElementById('loading-bar');
    const currentLineName = document.getElementById('current-line-name');
    const linesCountTip = document.getElementById('lines-count-tip');

    // 侧边栏 & Tab 元素
    const sidebarTrigger = document.getElementById('sidebar-trigger');
    const sidebarDrawer = document.getElementById('sidebar-drawer');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebarClose = document.getElementById('sidebar-close');
    const tabs = document.querySelectorAll('.tab-item');
    const tabPanes = document.querySelectorAll('.tab-pane');

    linesCountTip.textContent = `共 ${parseApis.length} 条魔径`;

    // 3. 记忆 & 初始化
    let savedApiIndex = localStorage.getItem('clover_v8_api_index');
    let currentApiIndex = savedApiIndex ? parseInt(savedApiIndex) : 0;
    if(currentApiIndex >= parseApis.length) currentApiIndex = 0;
    
    function updateCurrentLineDisplay() {
        const api = parseApis[currentApiIndex];
        currentLineName.textContent = api.name;
    }

    // 4. 渲染线路列表
    function renderApiList() {
        apiListContainer.innerHTML = '';
        parseApis.forEach((api, index) => {
            const btn = document.createElement('div');
            btn.className = 'api-item';
            btn.textContent = api.name;
            
            if (index === currentApiIndex) btn.classList.add('active');

            btn.addEventListener('click', () => {
                document.querySelectorAll('.api-item').forEach(item => item.classList.remove('active'));
                btn.classList.add('active');
                
                currentApiIndex = index;
                localStorage.setItem('clover_v8_api_index', index);
                updateCurrentLineDisplay();

                if (urlInput.value.trim()) {
                    playVideo(false);
                    if (window.innerWidth < 600) {
                        toggleSidebar(false);
                    }
                }
            });
            apiListContainer.appendChild(btn);
        });
        updateCurrentLineDisplay();
    }

    // 5. 播放核心 (诗意化文案)
    function playVideo(checkEmpty = true) {
        const url = urlInput.value.trim();
        if (checkEmpty && !url) {
            Swal.fire({
                icon: 'question',
                title: '四叶草还没收到种子呢',
                text: '请先粘贴视频地址，让我为您施展魔法~',
                background: '#081410', color: '#fff', confirmButtonColor: '#00e676',
                confirmButtonText: '这就去拿'
            });
            return;
        }

        const api = parseApis[currentApiIndex];
        iframe.style.display = 'none';
        overlay.style.display = 'flex';
        loadingBar.style.display = 'block';
        overlayText.innerHTML = `正在通过 <span style="color:#00e676">[${api.name}]</span> 魔径编织光影梦境...`;

        setTimeout(() => {
            iframe.src = api.url + url;
            iframe.onload = () => {
                loadingBar.style.display = 'none';
                overlay.style.display = 'none';
                iframe.style.display = 'block';
            };
            setTimeout(() => {
                 loadingBar.style.display = 'none';
                 overlay.style.display = 'none';
                 iframe.style.display = 'block';
            }, 2000);
        }, 500);
    }

    // 6. 侧边栏 & Tab 交互
    function toggleSidebar(show) {
        if (show) {
            sidebarDrawer.classList.add('active');
            sidebarOverlay.classList.add('active');
        } else {
            sidebarDrawer.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const targetId = `tab-${tab.dataset.tab}`;
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 7. 事件绑定
    sidebarTrigger.addEventListener('click', () => toggleSidebar(true));
    sidebarClose.addEventListener('click', () => toggleSidebar(false));
    sidebarOverlay.addEventListener('click', () => toggleSidebar(false));

    playBtn.addEventListener('click', () => playVideo());
    urlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') playVideo(); });
    
    clearBtn.addEventListener('click', () => {
        urlInput.value = '';
        iframe.src = '';
        iframe.style.display = 'none';
        overlay.style.display = 'flex';
        loadingBar.style.display = 'none';
        overlayText.textContent = '静候光影降临，请赐予视频链接...';
        urlInput.focus();
    });

    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                urlInput.value = text;
                const Toast = Swal.mixin({
                    toast: true, position: 'top', showConfirmButton: false,
                    timer: 2000, background: '#00e676', color: '#000'
                });
                Toast.fire({ icon: 'success', title: '魔力注入成功，正在解析' });
                playVideo();
            } else {
                Swal.fire({ icon: 'info', title: '剪贴板空空如也', background: '#081410', color: '#fff'});
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: '无法读取', text: '请手动粘贴', background: '#081410', color: '#fff'});
        }
    });

    renderApiList();
});
