export const loadEffect = () => {
  document.body.style.opacity = 0;
  document.body.style.transition = "opacity 1s ease-in-out";
  setTimeout(() => {
    document.body.style.opacity = 1;
  }, 500);
};
