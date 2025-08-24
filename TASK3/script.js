document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const counterDisplay = document.getElementById('counter');
    const incrementBtn = document.getElementById('increment');
    const decrementBtn = document.getElementById('decrement');
    const resetBtn = document.getElementById('reset');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const stepSizeInput = document.getElementById('step-size');
    const maxValueInput = document.getElementById('max-value');
    const darkModeToggle = document.getElementById('dark-mode');
    const historyList = document.getElementById('history-list');
    const changeIndicator = document.getElementById('change-indicator');

    // State
    let count = 0;
    let stepSize = 1;
    let maxValue = 1000;
    let history = [];
    let isAnimating = false;

    // Initialize
    loadSettings();
    updateCounter();

    // Event Listeners
    incrementBtn.addEventListener('click', increment);
    decrementBtn.addEventListener('click', decrement);
    resetBtn.addEventListener('click', reset);
    settingsBtn.addEventListener('click', toggleSettings);
    darkModeToggle.addEventListener('change', toggleDarkMode);
    stepSizeInput.addEventListener('change', updateStepSize);
    maxValueInput.addEventListener('change', updateMaxValue);

    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' || e.key === '+') {
            increment();
            animateButton(incrementBtn);
        } else if (e.key === 'ArrowDown' || e.key === '-') {
            decrement();
            animateButton(decrementBtn);
        } else if (e.key === 'r' || e.key === 'R') {
            reset();
            animateButton(resetBtn);
        } else if (e.key === 's' || e.key === 'S') {
            toggleSettings();
        }
    });

    // Functions
    function increment() {
        const newCount = count + stepSize;
        if (newCount <= maxValue) {
            count = newCount;
            addToHistory(`Incremented by ${stepSize}`);
            updateCounter();
            animateChange('increment');
        } else {
            animateChange('limit');
            showNotification(`Maximum value (${maxValue}) reached!`, 'warning');
        }
    }

    function decrement() {
        const newCount = count - stepSize;
        if (newCount >= 0) {
            count = newCount;
            addToHistory(`Decremented by ${stepSize}`);
            updateCounter();
            animateChange('decrement');
        } else {
            animateChange('limit');
            showNotification("Counter can't go below zero!", 'warning');
        }
    }

    function reset() {
        if (count !== 0) {
            addToHistory(`Reset from ${count} to 0`);
            count = 0;
            updateCounter();
            animateChange('reset');
        }
    }

    function updateCounter() {
        counterDisplay.textContent = count;
        
        // Add pulse animation when value changes
        counterDisplay.classList.add('pulse');
        setTimeout(() => {
            counterDisplay.classList.remove('pulse');
        }, 300);
        
        // Update button states
        decrementBtn.disabled = count === 0;
        incrementBtn.disabled = count >= maxValue;
    }

    function addToHistory(action) {
        const timestamp = new Date().toLocaleTimeString();
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <span class="action">${action}</span>
            <span class="timestamp">${timestamp}</span>
        `;
        historyList.prepend(historyItem);
        
        // Keep only the last 10 history items
        if (historyList.children.length > 10) {
            historyList.removeChild(historyList.lastChild);
        }
    }

    function animateChange(type) {
        if (isAnimating) return;
        isAnimating = true;
        
        changeIndicator.style.opacity = '1';
        
        switch(type) {
            case 'increment':
                changeIndicator.style.backgroundColor = 'rgba(76, 201, 240, 0.2)';
                break;
            case 'decrement':
                changeIndicator.style.backgroundColor = 'rgba(247, 37, 133, 0.2)';
                break;
            case 'reset':
                changeIndicator.style.backgroundColor = 'rgba(67, 97, 238, 0.2)';
                break;
            case 'limit':
                changeIndicator.style.backgroundColor = 'rgba(248, 150, 30, 0.2)';
                break;
        }
        
        changeIndicator.style.animation = 'ripple 0.6s ease-out';
        
        setTimeout(() => {
            changeIndicator.style.opacity = '0';
            changeIndicator.style.animation = '';
            isAnimating = false;
        }, 600);
    }

    function animateButton(button) {
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 200);
    }

    function toggleSettings() {
        settingsPanel.classList.toggle('active');
        settingsBtn.classList.toggle('active');
        
        if (settingsPanel.classList.contains('active')) {
            settingsBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
        }
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', darkModeToggle.checked);
    }

    function updateStepSize() {
        stepSize = parseInt(stepSizeInput.value) || 1;
        localStorage.setItem('stepSize', stepSize);
        showNotification(`Step size set to ${stepSize}`);
    }

    function updateMaxValue() {
        maxValue = parseInt(maxValueInput.value) || 1000;
        localStorage.setItem('maxValue', maxValue);
        showNotification(`Maximum value set to ${maxValue}`);
        
        // Update counter in case new max is lower than current count
        if (count > maxValue) {
            count = maxValue;
            updateCounter();
            addToHistory(`Adjusted to max value ${maxValue}`);
        }
    }

    function loadSettings() {
        // Load step size
        const savedStepSize = localStorage.getItem('stepSize');
        if (savedStepSize) {
            stepSize = parseInt(savedStepSize);
            stepSizeInput.value = stepSize;
        }
        
        // Load dark mode
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            darkModeToggle.checked = true;
            document.body.classList.add('dark-mode');
        }
        
        // Load max value
        const savedMaxValue = localStorage.getItem('maxValue');
        if (savedMaxValue) {
            maxValue = parseInt(savedMaxValue);
            maxValueInput.value = maxValue;
        }
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 500);
            }, 3000);
        }, 10);
    }

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .pulse {
            animation: pulse 0.3s ease;
        }
        .clicked {
            transform: scale(0.95) !important;
        }
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 1000;
            pointer-events: none;
        }
        .notification.show {
            opacity: 1;
            transform: translateX(-50%) translateY(-10px);
        }
        .notification.success {
            background-color: var(--success-color);
            color: white;
        }
        .notification.warning {
            background-color: var(--warning-color);
            color: white;
        }
        .action-btn.active {
            background-color: rgba(67, 97, 238, 0.2);
        }
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }
    `;
    document.head.appendChild(style);
});