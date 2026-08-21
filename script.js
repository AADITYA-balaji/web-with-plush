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

// Load saved dashboard order from localStorage
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