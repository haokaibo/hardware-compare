/* =============================================
   Motherboard Upgrade Calculator - Script
   ============================================= */
const ids = ['boardBuy','caseBuy','boardResalePct','caseResalePct','newBoard','newCase','directBoard'];
ids.forEach(id => document.getElementById(id).addEventListener('input', calc));

function fmt(n) {
  const sign = n < 0 ? '-' : '';
  return sign + '$' + Math.abs(Math.round(n)).toLocaleString();
}

function calc() {
  const boardBuy = parseFloat(document.getElementById('boardBuy').value) || 0;
  const caseBuy = parseFloat(document.getElementById('caseBuy').value) || 0;
  const boardResalePct = parseFloat(document.getElementById('boardResalePct').value) || 0;
  const caseResalePct = parseFloat(document.getElementById('caseResalePct').value) || 0;
  const newBoard = parseFloat(document.getElementById('newBoard').value) || 0;
  const newCase = parseFloat(document.getElementById('newCase').value) || 0;
  const directBoard = parseFloat(document.getElementById('directBoard').value) || 0;

  const rBoard = boardBuy * (boardResalePct / 100);
  const rCase = caseBuy * (caseResalePct / 100);
  const netSwap = (newBoard + newCase) - (rBoard + rCase);

  document.getElementById('rBoard').textContent = fmt(rBoard);
  document.getElementById('rCase').textContent = fmt(rCase);
  document.getElementById('rNewBoard').textContent = fmt(newBoard);
  document.getElementById('rNewCase').textContent = fmt(newCase);

  const netSwapEl = document.getElementById('netSwap');
  netSwapEl.textContent = fmt(netSwap);
  netSwapEl.className = 'final-value' + (netSwap < 0 ? ' negative' : '');

  const pathATotal = boardBuy + caseBuy + netSwap;
  const pathBTotal = directBoard;

  document.getElementById('pathA').textContent = fmt(pathATotal);
  document.getElementById('pathB').textContent = fmt(pathBTotal);

  const diff = pathATotal - pathBTotal;
  const diffLabelEl = document.getElementById('diffLabel');
  const diffValueEl = document.getElementById('diffValue');
  if (diff > 0) {
    diffLabelEl.textContent = '路线一比路线二多花';
    diffValueEl.className = 'final-value';
  } else if (diff < 0) {
    diffLabelEl.textContent = '路线一比路线二反而省下';
    diffValueEl.className = 'final-value negative';
  } else {
    diffLabelEl.textContent = '两条路线花费相同';
    diffValueEl.className = 'final-value';
  }
  diffValueEl.textContent = fmt(Math.abs(diff));
}

calc();
