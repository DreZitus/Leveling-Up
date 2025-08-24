import { gameState } from './state.js';
import { updateGoalStatus } from './goals.js';

function showLevelUpModal() {
    const modal = document.getElementById('levelUpModal');
    document.getElementById('newLevel').textContent = gameState.playerData.level;
    modal.classList.add('show');
    
    const levelElement = document.getElementById('playerLevel');
    levelElement.classList.add('level-up-animation');
    setTimeout(() => levelElement.classList.remove('level-up-animation'), 800);
}

function closeLevelUpModal() {
    document.getElementById('levelUpModal').classList.remove('show');
}

function showGoalModal(goalId) {
    const goal = gameState.goals.find(g => g.id === goalId);
    if (!goal) return;
    
    const modal = document.getElementById('goalModal');
    modal.dataset.goalId = goalId;
    
    document.getElementById('goalModalTitle').textContent = goal.name;
    document.getElementById('goalModalDescription').textContent = goal.description;
    document.getElementById('goalStatusSelect').value = goal.status;
    
    modal.classList.add('show');
}

function closeGoalModal() {
    document.getElementById('goalModal').classList.remove('show');
}

export { showLevelUpModal, closeLevelUpModal, showGoalModal, closeGoalModal };
