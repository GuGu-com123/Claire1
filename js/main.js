/* ============================================================
   交互脚本：作品列表的卡片可以拖动
   拖动时卡片变白色，松手恢复浅蓝色
   ============================================================ */

document.querySelectorAll('.work-card').forEach(function (card) {

  var screen = card.closest('.screen');
  var dragging = false;   // 是否正在拖动
  var moved = false;      // 是否真的移动了（用来阻止跳转）
  var startX = 0, startY = 0, baseX = 0, baseY = 0;

  // 手指/鼠标按下去：开始拖动，卡片变白
  card.addEventListener('pointerdown', function (e) {
    dragging = true;
    moved = false;
    var cardRect = card.getBoundingClientRect();
    var screenRect = screen.getBoundingClientRect();
    baseX = cardRect.left - screenRect.left;   // 卡片原来的位置（相对画布）
    baseY = cardRect.top - screenRect.top;
    startX = e.clientX;
    startY = e.clientY;
    card.classList.add('dragging');
    try {
      if (card.setPointerCapture) card.setPointerCapture(e.pointerId);
    } catch (err) { /* 某些环境下无法捕获指针，不影响拖动 */ }
  });

  // 移动：卡片跟着指针走
  card.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    var dy = e.clientY - startY;
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
    card.style.left = (baseX + dx) + 'px';
    card.style.top = (baseY + dy) + 'px';
  });

  // 松手：拖动结束，卡片恢复浅蓝
  function stopDrag() {
    if (!dragging) return;
    dragging = false;
    card.classList.remove('dragging');
  }
  card.addEventListener('pointerup', stopDrag);
  card.addEventListener('pointercancel', stopDrag);

  // 如果刚才只是点了一下（没拖动），才允许跳转到项目详情页
  card.addEventListener('click', function (e) {
    if (moved) e.preventDefault();
  });
});

/* ============================================================
   语言切换：点击右上角“中/英 language”，
   在英文和中文之间切换页面的文字
   ============================================================ */
(function () {
  var langBtn = document.querySelector('.lang-btn');
  if (!langBtn) return;
  var isZh = false;   // 当前是不是中文

  function applyLang() {
    document.querySelectorAll('[data-en][data-zh]').forEach(function (el) {
      el.innerHTML = isZh ? el.getAttribute('data-zh') : el.getAttribute('data-en');
    });
    langBtn.textContent = isZh ? 'English / 中' : '中/英 language';
  }

  langBtn.addEventListener('click', function () {
    isZh = !isZh;
    applyLang();
  });
})();
