function toggleMenu() {
    const menu = document.getElementById('menu-bar');
    const toggle = document.querySelector('.menu-toggle');
    if (menu.classList.contains('menu-open')) {
        menu.classList.remove('menu-open');
        menu.classList.add('menu-closed');
        toggle.textContent = '☰';
    } else {
        menu.classList.remove('menu-closed');
        menu.classList.add('menu-open');
        toggle.textContent = '✕';
    }
}

document.addEventListener('DOMContentLoaded', function() {
  initLoader(); // Initialize loader animation
  // Typewriter for title
const typewriter = document.querySelector('.typewriter');
  if (typewriter) {
    typewriter.textContent = typewriter.getAttribute('data-text');
  }

  // Typewriter for description
  const descTypewriter = document.querySelector('.description-right');
  if (descTypewriter) {
    const text = descTypewriter.getAttribute('data-text');
    descTypewriter.textContent = ''; 
    
    let j = 0;
    setTimeout(() => {
      const descInterval = setInterval(() => {
        descTypewriter.textContent += text.charAt(j);
        j++;
        if (j > text.length) {
          clearInterval(descInterval);
        }
      }, 30);
    }, 3500);
  }

  const splineIframe = document.querySelector('.content-bottom iframe');
  const inventoryFrame = document.getElementById('inventory-frame');
  const searchBar = document.querySelector('.search-bar');
  const searchBtn = document.querySelector('.search-btn');

  // Global postMessage listener for inventory communication
  window.addEventListener('message', (event) => {
    if (event.data.type === 'select-object' && splineIframe && splineIframe.contentWindow) {
      try {
        splineIframe.contentWindow.postMessage({
          type: 'select',
          data: [{ name: event.data.objectName }]
        }, '*');
      } catch (err) {
        console.error('Failed to select object in spline iframe:', err);
      }
    } else if (event.data.type === 'close-inventory') {
      inventoryFrame.style.display = 'none';
    }
  });

  // Search keypress - toggle inventory overlay
  if (searchBar) {
    searchBar.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        openInventoryPage(searchBar.value);
        searchBar.value = '';
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      openInventoryPage(searchBar.value);
      searchBar.value = '';
    });
  }



window.openInventoryPage = function(query = '') {
  const inventoryFrame = document.getElementById('inventory-frame');
const basePath = 'inventory.html';
  if (inventoryFrame) {
    inventoryFrame.src = query.trim() ? basePath + '?query=' + encodeURIComponent(query.trim()) : basePath;
    inventoryFrame.style.display = 'block';
  }
};


  if (splineIframe) {
    splineIframe.style.cursor = 'pointer';
    splineIframe.addEventListener('click', function(e) {
      // Forward click to Spline for interaction/zoom
      if (splineIframe.contentWindow) {
        splineIframe.contentWindow.postMessage({
          type: 'camera',
          data: 'center'
        }, '*');
      }
      // Visual feedback
      splineIframe.classList.add('clicked');
      setTimeout(() => {
        splineIframe.classList.remove('clicked');
      }, 300);
      e.stopPropagation();
    });
    splineIframe.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      e.stopPropagation();
      inventoryFrame.style.display = inventoryFrame.style.display === 'none' ? 'block' : 'none';
    });
  }

  if (searchBar) {

    searchBar.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        openInventoryPage(searchBar.value);
        searchBar.value = '';
      }
    });
  
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      openInventoryPage(searchBar.value);
      searchBar.value = '';
    });
  
  }
});


  const canvas = document.getElementById('starfield-canvas');
  const ctx = canvas.getContext('2d');
  

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
 
  const stars = [1];
  const shootingStars = [2];
const starCount = Math.floor(canvas.width * canvas.height / 5000);
  
 
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random(),
      speed: Math.random() * 0.05
      
    });
  }
  

  function draw() {
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
  
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      
     
      star.opacity += Math.random() * 0.1 - 0.05;
      if (star.opacity < 0.1) star.opacity = 0.1;
      if (star.opacity > 1) star.opacity = 1;
      
    
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    }
    
  
    if (Math.random() < 0.01) {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: 0,
        length: Math.random() * 80 + 20,
        speed: Math.random() * 10 + 10,
        angle: Math.PI / 4 + Math.random() * Math.PI / 4,
        life: 1
      });
    }
    
  
    for (let i = 0; i < shootingStars.length; i++) {
      const star = shootingStars[i];
      
   
      star.x += Math.cos(star.angle) * star.speed;
      star.y += Math.sin(star.angle) * star.speed;
      
     
      star.life -= 0.01;
      
     
      if (star.life > 0) {
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );
        ctx.strokeStyle = `rgba(255, 255, 255, ${star.life})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
    
        shootingStars.splice(i, 1);
        i--;
      }
    }
    
    requestAnimationFrame(draw);
  }
  
 
  requestAnimationFrame(draw);
  
  window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Loader intro - now uses CSS animations with class toggle
  function initLoader() {
    const introLoader = document.querySelector('.intro-loader');
    if (introLoader) {
      setTimeout(() => {
        introLoader.classList.add('fade-out');
      }, 2500);
    }
  }
    