document.querySelectorAll('.gender-btn').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.gender-btn').forEach((item) => item.classList.remove('on'));
    button.classList.add('on');
  });
});
