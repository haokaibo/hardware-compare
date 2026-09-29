/* =============================================
   Motherboard Upgrade Calculator - Script
   ============================================= */
(function () {
  'use strict';

  const _t = (key) => typeof t === 'function' ? t(key) : key;

  const ids = ['boardBuy','caseBuy','boardResalePct','caseResalePct','newBoard','newCase','directBoard'];
  ids.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', calc);
    } else {
      console.warn('mobo-calc: element #' + id + ' not found');
    }
  });

  function fmt(n) {
    var sign = n < 0 ? '-' : '';
    return sign + '$' + Math.abs(Math.round(n)).toLocaleString();
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? (parseFloat(el.value) || 0) : 0;
  }

  function text(id, v) {
    var el = document.getElementById(id);
    if (el) el.textContent = v;
  }

  function calc() {
    var boardBuy = val('boardBuy');
    var caseBuy = val('caseBuy');
    var boardResalePct = val('boardResalePct');
    var caseResalePct = val('caseResalePct');
    var newBoard = val('newBoard');
    var newCase = val('newCase');
    var directBoard = val('directBoard');

    var rBoard = boardBuy * (boardResalePct / 100);
    var rCase = caseBuy * (caseResalePct / 100);
    var netSwap = (newBoard + newCase) - (rBoard + rCase);

    text('rBoard', fmt(rBoard));
    text('rCase', fmt(rCase));
    text('rNewBoard', fmt(newBoard));
    text('rNewCase', fmt(newCase));

    var netSwapEl = document.getElementById('netSwap');
    if (netSwapEl) {
      netSwapEl.textContent = fmt(netSwap);
      netSwapEl.className = 'final-value' + (netSwap < 0 ? ' negative' : '');
    }

    var pathATotal = boardBuy + caseBuy + netSwap;
    var pathBTotal = directBoard;

    text('pathA', fmt(pathATotal));
    text('pathB', fmt(pathBTotal));

    var diff = pathATotal - pathBTotal;
    var diffLabelEl = document.getElementById('diffLabel');
    var diffValueEl = document.getElementById('diffValue');
    if (diffLabelEl && diffValueEl) {
      if (diff > 0) {
        diffLabelEl.textContent = _t('mobo.diff-more');
        diffValueEl.className = 'final-value';
      } else if (diff < 0) {
        diffLabelEl.textContent = _t('mobo.diff-less');
        diffValueEl.className = 'final-value negative';
      } else {
        diffLabelEl.textContent = _t('mobo.diff-same');
        diffValueEl.className = 'final-value';
      }
      diffValueEl.textContent = fmt(Math.abs(diff));
    }
  }

  calc();

  // Re-render on language switch
  document.addEventListener('i18n:changed', function () { calc(); });
})();
