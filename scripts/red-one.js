// stagger delay for reveal animations
const items = document.querySelectorAll('.reveal');
items.forEach((el,i)=>{ el.style.setProperty('--d', (Math.min(i%6,5)*0.08)+'s'); });
