// stagger + reveal on scroll
const items = document.querySelectorAll('.reveal');
items.forEach((el,i)=>{ el.style.setProperty('--d', (Math.min(i%6,5)*0.08)+'s'); });

const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

items.forEach(el=>io.observe(el));
