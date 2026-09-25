document.querySelectorAll('.psize:not(.off)').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    button.closest('.psizes')?.querySelectorAll('.psize').forEach((item) => item.classList.remove('is-selected'));
    button.classList.add('is-selected');
  });
});
