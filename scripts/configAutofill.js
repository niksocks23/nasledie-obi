// Импортируем функцию карусели из нового файла
import { initImageSlider } from './imageSlider.js';

export function initDataAutofill() {
  loadData();
}

async function loadData() {
  try {
    // 1. Загружаем конфиг
    const configRes = await fetch('config.json');
    const config = await configRes.json();

    // Подставляем данные из конфига
    document.title = config.pageTitle;
    document.getElementById('page-title').textContent = config.pageTitle;
    document.getElementById('site-name').textContent = config.siteName;
    
    document.getElementById('project-name').textContent = config.siteName;
    document.getElementById('project-version').textContent = config.version;
    document.getElementById('author-name').textContent = config.authorName;
    document.getElementById('author-desc-text').textContent = config.authorDescription;
    document.getElementById('github-link').href = config.githubUrl;
    
    document.getElementById('footer-site-name').textContent = config.siteName;
    document.getElementById('cur-year').textContent = new Date().getFullYear();

    // 2. Загружаем маркеры для счетчика и карусели
    const markersRes = await fetch('markers.json');
    const markersData = await markersRes.json();
    
    document.getElementById('marker-count').textContent = markersData.markers.length;

    // Передаем массив маркеров в карусель
    initImageSlider(markersData.markers);

  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    const countEl = document.getElementById('marker-count');
    if (countEl) countEl.textContent = '15';
  }
}