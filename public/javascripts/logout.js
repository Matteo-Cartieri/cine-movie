'use strict';

const logoutEl = document.getElementById('logout');

if(logoutEl) {
  logoutEl.addEventListener('click', () => {
    fetch('/sessions/logout', { method: 'POST' })
    .then(()=> window.location = '/');
  });
}
