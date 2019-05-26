const openSidebar = document.querySelector('#openSidebar').addEventListener('click', sidebarOpenFunc);
const closeSidebar = document.querySelector('#closeSidebar').addEventListener('click', sidebarCloseFunc);
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');
overlay.addEventListener('click', closeOverlay);

function sidebarOpenFunc() {
  sidebar.style.marginLeft = '0';
  overlay.style.display = 'block';
}

function sidebarCloseFunc() {
  sidebar.style.marginLeft = '-300px';
  overlay.style.display = 'none';
}

function closeOverlay() {
  sidebar.style.marginLeft = '-300px';
  overlay.style.display = 'none';
}