import { gameState, saveGameState } from './state.js';
import { renderGoalsMap, renderQuests } from './ui.js';
import { completeQuest } from './quests.js';
import { showGoalModal } from './modals.js';
import { removeGoal as removeGoalFunction } from './goals.js'; // Renomeado para evitar conflito

// Forma de objetivo por evento
document.getElementById('goalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('goalName').value.trim();
    const phase = parseInt(document.getElementById('goalPhase').value);
    const description = document.getElementById('goalDescription').value.trim();
    if (!name || !description) return;

    const newId = gameState.goals.length > 0 ? Math.max(...gameState.goals.map(g => g.id)) + 1 : 1;
    gameState.goals.push({
        id: newId,
        name,
        phase,
        status: "not_started",
        description
    });
    document.getElementById('goalForm').reset();
    renderGoalsMap();
    saveGameState();
});


function updateGoalStatus(goalId, newStatus) {
    const goal = gameState.goals.find(g => g.id === goalId);
    if (!goal) return;
    
    goal.status = newStatus;
    
    if (newStatus === 'completed') {
        gameState.quests.forEach(quest => {
            if (quest.goalId === goalId && quest.type === 'main' && !quest.completed) {
                completeQuest(quest.id);
            }
        });
    }
    
    renderGoalsMap();
    saveGameState();
}

function removeGoal(goalId) {
    console.log("Removendo goal:", goalId);
    gameState.quests = gameState.quests.filter(q => q.goalId !== goalId);
    gameState.goals = gameState.goals.filter(g => g.id != goalId);
    
    renderGoalsMap();
    renderQuests();
    saveGameState();
}

export { updateGoalStatus, removeGoal };
