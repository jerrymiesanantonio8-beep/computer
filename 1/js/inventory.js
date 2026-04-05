document.addEventListener('DOMContentLoaded', () => {
  const faqContainer = document.querySelector('.faq-container');
  if (!faqContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('query') || '';
  const iframeMode = urlParams.get('iframe') === 'true';

  const faqQuestions = document.querySelectorAll('.faq-question');
  const faqItems = document.querySelectorAll('.faq');
  const h2 = document.querySelector('h2');

  // Search input
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search components...';
  searchInput.className = 'inventory-search';
  if (h2) h2.insertAdjacentElement('afterend', searchInput);

  function filterFaqs(searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    faqItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) || q === '' ? 'block' : 'none';
    });
  }

  if (query.trim()) {
    filterFaqs(query);
  }

  searchInput.addEventListener('input', (e) => {
    filterFaqs(e.target.value);
  });

  if (query.trim()) {
    const matchingQuestion = Array.from(faqQuestions).find(q => 
      q.textContent.trim().toLowerCase().includes(query.toLowerCase())
    );
    if (matchingQuestion) {
      setTimeout(() => matchingQuestion.click(), 100);
    }
  }

  faqQuestions.forEach((question) => {
    question.setAttribute('tabindex', '0');
    question.addEventListener("click", () => toggleFaq(question));

    question.addEventListener('keydown', (e) => {
      let currentIndex = Array.from(faqQuestions).indexOf(question);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % faqQuestions.length;
        faqQuestions[nextIndex].focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + faqQuestions.length) % faqQuestions.length;
        faqQuestions[prevIndex].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFaq(question);
      }
    });

    if (iframeMode) {
      question.addEventListener('dblclick', () => {
        const objectName = question.dataset.object;
        if (objectName) {
          window.parent.postMessage({
            type: 'select-object',
            objectName: objectName
          }, '*');
        }
      });
    }
  });

  function toggleFaq(question) {
    const answer = question.nextElementSibling;
    const isOpen = answer.style.display === "block";

    document.querySelectorAll('.faq-answer').forEach(ans => ans.style.display = "none");
    document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));

    if (!isOpen) {
      answer.style.display = "block";
      question.classList.add('active');
      setTimeout(initCarousels, 100);
    }
  }

  function initCarousels() {
    document.querySelectorAll('.faq-answer[style*="block"]').forEach(answer => {
      const carousel = answer.querySelector('.carousel');
      if (carousel && !carousel.dataset.initialized) {
        const slides = carousel.querySelector('.slides');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        const cards = slides ? slides.querySelectorAll('.card') : [];

        if (cards.length > 1) {
          let currentIndex = 0;
          const totalSlides = cards.length;
          const slideWidth = 260;

          carousel.dataset.initialized = 'true';

          function showSlide(index) {
            currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
            slides.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalSlides - 1;
          }

          prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
          nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));

          carousel.tabIndex = 0;
          carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
          });

          showSlide(0);
        }
      }
    });
  }

  
  document.querySelectorAll('.card img').forEach(img => {
    img.style.cursor = "pointer";

    img.addEventListener('click', () => {
      const faqAnswer = img.closest('.faq-answer');
      if (!faqAnswer) return;

      const textEl = faqAnswer.querySelector('p');
      const video = faqAnswer.querySelector('iframe');

      const newText = img.dataset.text || "No description available.";

      if (video) video.style.display = "none";

      textEl.textContent = "";
      let i = 0;

      function typeEffect() {
        if (i < newText.length) {
          textEl.textContent += newText.charAt(i);
          i++;
          setTimeout(typeEffect, 25);
        }
      }

      typeEffect();
    });
  });

});