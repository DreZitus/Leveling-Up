import { gameState, saveGameState } from './state.js';

// Tab Navigation
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Dark Mode Toggle
function toggleDarkMode() {
    gameState.darkMode = !gameState.darkMode;
    const icon = document.getElementById('darkModeIcon');
    
    if (gameState.darkMode) {
        document.documentElement.setAttribute('data-color-scheme', 'dark');
        icon.textContent = '☀️';
    } else {
        document.documentElement.setAttribute('data-color-scheme', 'light');
        icon.textContent = '🌙';
    }
    
    saveGameState();
}

export { switchTab, toggleDarkMode };

