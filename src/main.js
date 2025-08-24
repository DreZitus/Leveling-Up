import { loadGameState, gameState } from './modules/state.js';
import { updateUI, renderGoalsMap, renderQuests, renderAchievements } from './modules/ui.js';
import { toggleDarkMode, switchTab } from './modules/events.js';
import { handleQuestSubmission, toggleGoalSelection } from './modules/quests.js';
import { addAttributePoint } from './modules/player.js';
import { updateGoalStatus } from './modules/goals.js';

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    loadGameState();
    setupEventListeners();
    updateUI();
    renderGoalsMap();
    renderQuests();
    renderAchievements();
});

// Event Listeners Setup
function setupEventListeners() {
    // Tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

    // Quest form
    document.getElementById('questForm').addEventListener('submit', handleQuestSubmission);
    document.getElementById('questType').addEventListener('change', toggleGoalSelection);

    // Attribute buttons
    const attributeButtons = document.querySelectorAll('.attribute-btn');
    attributeButtons.forEach(btn => {
        btn.addEventListener('click', () => addAttributePoint(btn.dataset.attribute));
    });

    // Goal status selection
    document.getElementById('goalStatusSelect').addEventListener('change', function() {
        const selectedGoal = document.getElementById('goalModal').dataset.goalId;
        if (selectedGoal) {
            updateGoalStatus(parseInt(selectedGoal), this.value);
        }
    });
};