const wallpapers = [
    { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80', name: 'Mountains / Starry Night' },
    { url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2000&q=80', name: 'Space / Nebula' },
    { url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=2000&q=80', name: 'Deep Space Stars' },
    { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80', name: 'Snowy Mountain Peak' },
    { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80', name: 'Tropical Beach' },
    { url: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=2000&q=80', name: 'Misty Forest' },
    { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=80', name: 'Pine Forest Sunset' }
];

function applyWallpaper(index) {
    const backgroundOverlay = document.querySelector('.background-overlay');
    if (!backgroundOverlay) return;
    
    const selectedWallpaper = wallpapers[index];
    backgroundOverlay.style.backgroundImage = `url('${selectedWallpaper.url}')`;
}

function initWallpaper() {
    const customWallpaper = localStorage.getItem('customWallpaper');
    if (customWallpaper) {
        const backgroundOverlay = document.querySelector('.background-overlay');
        if (backgroundOverlay) {
            backgroundOverlay.style.backgroundImage = `url('${customWallpaper}')`;
        }
        return;
    }

    const savedIndex = localStorage.getItem('wallpaperIndex');
    if (savedIndex !== null) {
        applyWallpaper(parseInt(savedIndex, 10));
    } else {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const defaultIndex = dayOfYear % wallpapers.length;
        applyWallpaper(defaultIndex);
    }
}

initWallpaper();

const wallpaperButton = document.getElementById('rotate-wallpaper');
wallpaperButton.addEventListener('click', () => {
    localStorage.removeItem('customWallpaper'); // switch back to rotation pool
    
    let currentIndex = parseInt(localStorage.getItem('wallpaperIndex'), 10);
    if (isNaN(currentIndex)) {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        currentIndex = Math.floor(diff / (1000 * 60 * 60 * 24)) % wallpapers.length;
    }

    const nextIndex = (currentIndex + 1) % wallpapers.length;
    localStorage.setItem('wallpaperIndex', nextIndex);
    applyWallpaper(nextIndex);
});

const uploadBtn = document.getElementById('upload-wallpaper-btn');
const fileInput = document.getElementById('wallpaper-file-input');

uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Image = e.target.result;
            localStorage.setItem('customWallpaper', base64Image);
            localStorage.removeItem('wallpaperIndex');
            
            const backgroundOverlay = document.querySelector('.background-overlay');
            if (backgroundOverlay) {
                backgroundOverlay.style.backgroundImage = `url('${base64Image}')`;
            }
        };
        reader.readAsDataURL(file);
    }
});

function updateClock() {
    const now = new Date();
    
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    document.getElementById('clock').innerText = `${hours}:${formattedMinutes} ${ampm}`;
    
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date').innerText = now.toLocaleDateString('en-US', dateOptions);

    const currentHour = now.getHours();
    let greetingText = "Welcome";
    if (currentHour < 12) {
        greetingText = "Good morning";
    } else if (currentHour < 18) {
        greetingText = "Good afternoon";
    } else {
        greetingText = "Good evening";
    }
    document.getElementById('greeting').innerText = greetingText;
}

setInterval(updateClock, 1000);
updateClock();

const noteArea = document.getElementById('quick-note');
const clearButton = document.getElementById('clear-note');

if (localStorage.getItem('savedNote')) {
    noteArea.value = localStorage.getItem('savedNote');
}

noteArea.addEventListener('input', () => {
    localStorage.setItem('savedNote', noteArea.value);
});

clearButton.addEventListener('click', () => {
    noteArea.value = '';
    localStorage.removeItem('savedNote');
});


const dashboard = document.getElementById('dashboard');
const draggableItems = document.querySelectorAll('.draggable-item');
const resetButton = document.getElementById('reset-layout');

let draggedItem = null;
const defaultOrder = ['widget-anime', 'widget-center', 'widget-note'];

const savedOrder = localStorage.getItem('dashboardOrder');
if (savedOrder) {
    const orderIds = JSON.parse(savedOrder);
    orderIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            dashboard.appendChild(element);
        }
    });
}

resetButton.addEventListener('click', () => {
    localStorage.removeItem('dashboardOrder');
    defaultOrder.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            dashboard.appendChild(element);
        }
    });
});

draggableItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        draggedItem = item;
        setTimeout(() => item.classList.add('dragging'), 0);
    });

    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        draggedItem = null;
        
        draggableItems.forEach(el => el.classList.remove('drag-over'));

        const currentItems = dashboard.querySelectorAll('.draggable-item');
        const orderIds = Array.from(currentItems).map(el => el.id);
        localStorage.setItem('dashboardOrder', JSON.stringify(orderIds));
    });

    item.addEventListener('dragover', (e) => {
        e.preventDefault();
        const targetItem = e.target.closest('.draggable-item');
        if (targetItem && targetItem !== draggedItem) {
            targetItem.classList.add('drag-over');
        }
    });

    item.addEventListener('dragleave', (e) => {
        const targetItem = e.target.closest('.draggable-item');
        if (targetItem) {
            targetItem.classList.remove('drag-over');
        }
    });

    item.addEventListener('drop', (e) => {
        e.preventDefault();
        const targetItem = e.target.closest('.draggable-item');
        if (targetItem && draggedItem && targetItem !== draggedItem) {
            targetItem.classList.remove('drag-over');
            
            const allItems = Array.from(dashboard.querySelectorAll('.draggable-item'));
            const draggedIndex = allItems.indexOf(draggedItem);
            const targetIndex = allItems.indexOf(targetItem);

            if (draggedIndex < targetIndex) {
                dashboard.insertBefore(draggedItem, targetItem.nextSibling);
            } else {
                dashboard.insertBefore(draggedItem, targetItem);
            }
        }
    });
});
