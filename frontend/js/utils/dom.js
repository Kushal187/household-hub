export const $ = (selector) => document.querySelector(selector);

export const showMessage = (el, text, type = 'danger') => {
  el.textContent = text;
  el.className = `alert alert-${type}`;
  el.classList.remove('d-none');
  setTimeout(() => el.classList.add('d-none'), 4000);
};
