document.addEventListener('DOMContentLoaded', () => {
  const questions = document.querySelectorAll(".faq-question");

  questions.forEach(question => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      const isOpen = answer.style.display === "block";

      document.querySelectorAll('.faq-answer').forEach(ans => {
        ans.style.display = "none";
      });
      document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('active');
      });

      if (!isOpen) {
        answer.style.display = "block";
        question.classList.add('active');
      }
    });
  });
});
