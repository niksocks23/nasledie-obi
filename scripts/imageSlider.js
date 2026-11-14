export function initImageSlider(markers) {
  const slider = document.getElementById('image-slider');
  if (!slider) return;

  // Создаем пути к картинкам на основе маркеров
  const images = markers.map(m => `images/markersImages/${m.img}`);
  
  // Перемешиваем массив для случайного порядка
  images.sort(() => Math.random() - 0.5);

  // Создаем и добавляем img в контейнер
  images.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'slider-img' + (index === 0 ? ' active' : '');
    slider.appendChild(img);
  });

  // Логика смены кадров
  let currentIndex = 0;
  const allImages = document.querySelectorAll('.slider-img');
  
  if (allImages.length <= 1) return;

  setInterval(() => {
    allImages[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % allImages.length;
    allImages[currentIndex].classList.add('active');
  }, 3500); // Смена каждые 3.5 секунды
}