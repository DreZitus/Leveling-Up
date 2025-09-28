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
    if (tabButtons.length) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // Quest form
    const questForm = document.getElementById('questForm');
    if (questForm) {
        questForm.addEventListener('submit', handleQuestSubmission);
    }
    const questType = document.getElementById('questType');
    if (questType) {
        questType.addEventListener('change', toggleGoalSelection);
    }

    // Attribute buttons
    const attributeButtons = document.querySelectorAll('.attribute-btn');
    if (attributeButtons.length) {
        attributeButtons.forEach(btn => {
            btn.addEventListener('click', () => addAttributePoint(btn.dataset.attribute));
        });
    }

    // Goal status selection
    const goalStatusSelect = document.getElementById('goalStatusSelect');
    if (goalStatusSelect) {
        goalStatusSelect.addEventListener('change', function() {
            const selectedGoal = document.getElementById('goalModal').dataset.goalId;
            if (selectedGoal) {
                updateGoalStatus(parseInt(selectedGoal), this.value);
            }
        });
    }
};  