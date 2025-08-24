// Data Persistence
function saveGameState() {
    try {
        localStorage.setItem('gamifiedProductivityState', JSON.stringify(gameState));
    } catch (error) {
        console.warn('Could not save game state:', error);
    }
}

function loadGameState() {
    try {
        const saved = localStorage.getItem('gamifiedProductivityState');
        if (saved) {
            const loadedState = JSON.parse(saved);
            // Merge with default state to handle new properties
            gameState = { ...gameState, ...loadedState };
            
            // Apply dark mode if saved
            if (gameState.darkMode) {
                document.documentElement.setAttribute('data-color-scheme', 'dark');
                document.getElementById('darkModeIcon').textContent = '☀️';
            }
        }
    } catch (error) {
        console.warn('Could not load game state:', error);
    }
}

// Game State Management
export let gameState = {
    playerData: {
        level: 1,
        xp: 0,
        xpRequired: 100,
        attributes: {
            foco: 0,
            forca: 0,
            inteligencia: 0
        },
        availablePoints: 0
    },
    goals: [],
    quests: [
        { id: 1, title: "Crie sua primeira missão", type: "main", goalId: 1, completed: false, xpReward: 15 },
        { id: 2, title: "Exercitar-se por 30 minutos", type: "secondary", goalId: null, completed: false, xpReward: 10 }
    ],
    achievements: [
        { id: 1, name: "Primeira Quest", description: "Complete sua primeira missão", unlocked: false },
        { id: 2, name: "Subindo de Nível", description: "Alcance o nível 2", unlocked: false },
        { id: 3, name: "Construtor", description: "Complete uma quest principal", unlocked: false },
        { id: 4, name: "Dedicado", description: "Complete 10 quests", unlocked: false }
    ],
    questIdCounter: 3,
    totalQuestsCompleted: 0,
    darkMode: false
};

export { saveGameState, loadGameState };
