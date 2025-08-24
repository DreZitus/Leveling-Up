import { gameState, saveGameState } from './state.js';
import { renderQuests, renderGoalsMap, renderAchievements } from './ui.js';
import { gainXP } from './player.js';
import { unlockAchievement } from './achievements.js';
import { updateGoalStatus } from './goals.js';
import { playSound } from './utils.js';

function handleQuestSubmission(e) {
    e.preventDefault();
    
    const title = document.getElementById('questTitle').value.trim();
    const type = document.getElementById('questType').value;
    const goalId = document.getElementById('questGoal').value || null;
    
    if (!title) return;
    
    const xpReward = calculateQuestXP();
    
    const newQuest = {
        id: ++gameState.questIdCounter,
        title,
        type,
        goalId: goalId ? parseInt(goalId) : null,
        completed: false,
        xpReward
    };
    
    gameState.quests.push(newQuest);
    
    document.getElementById('questForm').reset();
    toggleGoalSelection();
    
    renderQuests();
    saveGameState();
    playSound('create');
}

function calculateQuestXP() {
    return 10 + (gameState.playerData.level * 5);
}

function toggleGoalSelection() {
    const questType = document.getElementById('questType').value;
    const goalSelection = document.getElementById('goalSelection');
    
    if (questType === 'main') {
        goalSelection.style.display = 'block';
        populateGoalOptions();
    } else {
        goalSelection.style.display = 'none';
    }
}

function populateGoalOptions() {
    const select = document.getElementById('questGoal');
    select.innerHTML = '<option value="">Selecione uma meta...</option>';
    
    gameState.goals.forEach(goal => {
        if (goal.status !== 'completed') {
            const option = document.createElement('option');
            option.value = goal.id;
            option.textContent = goal.name;
            select.appendChild(option);
        }
    });
}

function completeQuest(questId) {
    const quest = gameState.quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;
    
    quest.completed = true;
    gameState.totalQuestsCompleted++;
    
    gainXP(quest.xpReward);
    
    if (quest.type === 'main' && quest.goalId) {
        const goal = gameState.goals.find(g => g.id === quest.goalId);
        if (goal && goal.status === 'not_started') {
            updateGoalStatus(quest.goalId, 'in_progress');
        }
    }
    
    if (gameState.totalQuestsCompleted === 1) {
        unlockAchievement(1);
    }
    if (quest.type === 'main') {
        unlockAchievement(3);
    }
    if (gameState.totalQuestsCompleted === 10) {
        unlockAchievement(4);
    }
    
    renderQuests();
    renderGoalsMap();
    renderAchievements();
    saveGameState();
    playSound('complete');
    
    const questElement = document.querySelector(`[data-quest-id="${questId}"]`);
    if (questElement) {
        questElement.classList.add('quest-completed');
        setTimeout(() => questElement.classList.remove('quest-completed'), 600);
    }
}

function deleteQuest(questId) {
    gameState.quests = gameState.quests.filter(q => q.id !== questId);
    renderQuests();
    saveGameState();
}

export { handleQuestSubmission, toggleGoalSelection, completeQuest, deleteQuest };