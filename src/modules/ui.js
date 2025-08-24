import { gameState, saveGameState } from './state.js';
import { completeQuest, deleteQuest } from './quests.js';
import { showGoalModal } from './modals.js';
import { removeGoal } from './goals.js';
import { playSound } from './utils.js';

function updateUI() {
    document.getElementById('playerLevel').textContent = gameState.playerData.level;
    document.getElementById('currentXP').textContent = gameState.playerData.xp;
    document.getElementById('requiredXP').textContent = gameState.playerData.xpRequired;
    
    const xpProgress = (gameState.playerData.xp / gameState.playerData.xpRequired) * 100;
    document.getElementById('xpProgress').style.width = `${xpProgress}%`;
    
    document.getElementById('focoValue').textContent = gameState.playerData.attributes.foco;
    document.getElementById('forcaValue').textContent = gameState.playerData.attributes.forca;
    document.getElementById('inteligenciaValue').textContent = gameState.playerData.attributes.inteligencia;
    
    const availablePointsSection = document.getElementById('availablePointsSection');
    const attributeButtons = document.querySelectorAll('.attribute-btn');
    
    if (gameState.playerData.availablePoints > 0) {
        availablePointsSection.style.display = 'block';
        document.getElementById('availablePoints').textContent = gameState.playerData.availablePoints;
        attributeButtons.forEach(btn => btn.style.display = 'block');
    } else {
        availablePointsSection.style.display = 'none';
        attributeButtons.forEach(btn => btn.style.display = 'none');
    }
}

function renderGoalsMap() {
    const mapContainer = document.getElementById('goalsMap');
    const phases = {
        1: { title: "projetos: ", icon: "🛠️" },
        2: { title: "Corpo:", icon: "💪" },
        3: { title: "Mente:", icon: "🧠" },
        4: { title: "Vida:", icon: "❤️" }
    };
    
    let html = '';
    
    Object.keys(phases).forEach(phaseNum => {
        const phase = phases[phaseNum];
        const phaseGoals = gameState.goals.filter(g => g.phase === parseInt(phaseNum));
        
        html += `
            <div class="phase">
                <div class="phase-header">
                    <div class="phase-title">${phase.icon} ${phase.title}</div>
                </div>
                <div class="phase-goals">
                    ${phaseGoals.map(goal => `
                        <div class="goal-node ${goal.status}" onclick="showGoalModal(${goal.id})">
                            <div class="goal-icon">${getGoalIcon(goal.status)}</div>
                            <div class="goal-name">${goal.name}</div>
                            <button class="btn btn--sm btn--outline" onclick="event.stopPropagation(); removeGoal(${goal.id});">🗑️</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    mapContainer.innerHTML = html;
}

function getGoalIcon(status) {
    switch (status) {
        case 'in_progress':
            return '⏳';
        case 'completed':
            return '✅';
        case 'not_started':
            return '⚪';
        default: return '🔄';
    }
}

function renderQuests() {
    const mainQuestsList = document.getElementById('mainQuestsList');
    const secondaryQuestsList = document.getElementById('secondaryQuestsList');
    
    const mainQuests = gameState.quests.filter(q => q.type === 'main');
    const secondaryQuests = gameState.quests.filter(q => q.type === 'secondary');
    
    mainQuestsList.innerHTML = renderQuestList(mainQuests);
    secondaryQuestsList.innerHTML = renderQuestList(secondaryQuests);
}

function renderQuestList(quests) {
    if (quests.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p>Nenhuma quest criada ainda</p>
            </div>
        `;
    }
    
    return quests.map(quest => `
        <div class="quest-item ${quest.completed ? 'completed' : ''}" data-quest-id="${quest.id}">
            <input 
                type="checkbox" 
                class="quest-checkbox" 
                ${quest.completed ? 'checked' : ''} 
                onchange="completeQuest(${quest.id})"
                ${quest.completed ? 'disabled' : ''}
            >
            <div class="quest-info">
                <h4 class="quest-title">${quest.title}</h4>
                <div class="quest-type ${quest.type}">${quest.type === 'main' ? 'Principal' : 'Secundária'}</div>
            </div>
            <div class="quest-xp">+${quest.xpReward} XP</div>
            <div class="quest-actions">
                <button class="btn btn--sm btn--outline" onclick="deleteQuest(${quest.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function renderAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    
    const html = gameState.achievements.map(achievement => `
        <div class="achievement ${achievement.unlocked ? 'unlocked' : ''}">
            <div class="achievement-icon">${achievement.unlocked ? '🏆' : '🔒'}</div>
            <div class="achievement-info">
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
            </div>
        </div>
    `).join('');
    
    achievementsList.innerHTML = html;
}

export { updateUI, renderGoalsMap, renderQuests, renderAchievements, renderQuestList, getGoalIcon };