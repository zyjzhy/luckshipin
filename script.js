document.addEventListener('DOMContentLoaded', function() {
    // 1. 全量接口列表（从原脚本中完整提取）
    const parseApis = [
        {"name": "七哥", "url": "https://jx.nnxv.cn/tv.php?url="},
        {"name": "虾米", "url": "https://jx.xmflv.cc/?url="},
        {"name": "纯净1", "url": "https://im1907.top/?jx="},
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
        {"name": "im1907", "url": "https://im1907.top/?jx="},
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
    const loadingSpinner = document.getElementById('loading-spinner');
    const apiCountTip = document.getElementById('api-count-tip');

    // 显示线路总数
    apiCountTip.textContent = `共加载 ${parseApis.length} 条优质线路`;

    // 3. 智能记忆：获取上次使用的线路
    let savedApiIndex = localStorage.getItem('clover_last_api_index');
    let currentApiIndex = savedApiIndex ? parseInt(savedApiIndex) : 0;
    
    // 防止索引越界
    if(currentApiIndex >= parseApis.length) currentApiIndex = 0;
    let currentApiUrl = parseApis[currentApiIndex].url;

    // 4. 渲染接口列表
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
                currentApiUrl = api.url;
                localStorage.setItem('clover_last_api_index', index);

                if (urlInput.value.trim()) {
                    playVideo(false);
                }
            });
            apiListContainer.appendChild(btn);
        });
    }

    // 5. 播放逻辑
    function playVideo(checkEmpty = true) {
        const url = urlInput.value.trim();

        if (checkEmpty && !url) {
            Swal.fire({
                icon: 'info',
                title: '请输入地址',
                text: '请先在上方的平台点击进入视频页，复制地址后粘贴到这里',
                background: '#051a10',
                color: '#fff',
                confirmButtonColor: '#42e695'
            });
            return;
        }

        iframe.style.display = 'none';
        overlay.style.display = 'flex';
        loadingSpinner.style.display = 'block';
        overlayText.textContent = `🍀 正在通过 [${parseApis[currentApiIndex].name}] 线路加速解析...`;

        setTimeout(() => {
            iframe.src = currentApiUrl + url;
            iframe.onload = () => {
                loadingSpinner.style.display = 'none';
                overlay.style.display = 'none';
                iframe.style.display = 'block';
            };
            // 兜底超时
            setTimeout(() => {
                 loadingSpinner.style.display = 'none';
                 overlay.style.display = 'none';
                 iframe.style.display = 'block';
            }, 1000);
        }, 500);
    }

    // 6. 事件绑定
    playBtn.addEventListener('click', () => playVideo());
    urlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') playVideo(); });
    
    clearBtn.addEventListener('click', () => {
        urlInput.value = '';
        iframe.src = '';
        iframe.style.display = 'none';
        overlay.style.display = 'flex';
        loadingSpinner.style.display = 'none';
        overlayText.textContent = '请粘贴地址，寻找属于你的四叶草...';
        urlInput.focus();
    });

    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                urlInput.value = text;
                const Toast = Swal.mixin({
                    toast: true, position: 'top-end', showConfirmButton: false,
                    timer: 2000, background: '#42e695', color: '#004d40'
                });
                Toast.fire({ icon: 'success', title: '已自动粘贴并解析' });
                playVideo();
            } else {
                Swal.fire({ icon: 'warning', title: '剪贴板为空', background: '#051a10', color: '#fff'});
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: '无法读取', text: '请手动粘贴', background: '#051a10', color: '#fff'});
        }
    });

    renderApiList();
});