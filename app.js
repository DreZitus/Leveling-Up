// Game State Management
let gameState = {
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
    goals: [

    ],
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

// ...existing code...

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



// ...saida do codigo

//

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

// ...saida do codigo...

function renderGoalsMap() {
    const mapContainer = document.getElementById('goalsMap');
    const phases = {
        1: { title: "projetos", icon: "🏗️" },
        2: { title: "saúde", icon: "👥" },
        3: { title: "Estudo", icon: "📦" },
        4: { title: "vida", icon: "🚀" }
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

// ...existing code...

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
}

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

// Player Level and XP System
function gainXP(amount) {
    gameState.playerData.xp += amount;
    
    // Check for level up
    while (gameState.playerData.xp >= gameState.playerData.xpRequired) {
        levelUp();
    }
    
    updateUI();
    saveGameState();
}

function levelUp() {
    gameState.playerData.xp -= gameState.playerData.xpRequired;
    gameState.playerData.level++;
    gameState.playerData.availablePoints += 3;
    gameState.playerData.xpRequired = Math.floor(100 * Math.pow(1.2, gameState.playerData.level - 1));
    
    // Show level up modal
    showLevelUpModal();
    
    // Check achievements
    if (gameState.playerData.level === 2) {
        unlockAchievement(2);
    }
    
    playSound('levelup');
}

function addAttributePoint(attribute) {
    if (gameState.playerData.availablePoints > 0) {
        gameState.playerData.attributes[attribute]++;
        gameState.playerData.availablePoints--;
        updateUI();
        saveGameState();
        playSound('attribute');
    }
}

// Quest Management
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
    
    // Reset form
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
    
    // Grant XP
    gainXP(quest.xpReward);
    
    // Update related goal if main quest
    if (quest.type === 'main' && quest.goalId) {
        const goal = gameState.goals.find(g => g.id === quest.goalId);
        if (goal && goal.status === 'not_started') {
            goal.status = 'in_progress';
        }
    }
    
    // Check achievements
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
    
    // Add completion animation
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

// Goals Management
function updateGoalStatus(goalId, newStatus) {
    const goal = gameState.goals.find(g => g.id === goalId);
    if (!goal) return;
    
    goal.status = newStatus;
    
    // If goal is completed, complete related main quests
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

// Achievements System
function unlockAchievement(achievementId) {
    const achievement = gameState.achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        showAchievementNotification(achievement);
        renderAchievements();
    }
}

function showAchievementNotification(achievement) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-notification-content">
            <h4>🏆 Conquista Desbloqueada!</h4>
            <p><strong>${achievement.name}</strong></p>
            <p>${achievement.description}</p>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-success);
        color: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
    
    playSound('achievement');
}

// UI Rendering Functions
function updateUI() {
    // Update player level and XP
    document.getElementById('playerLevel').textContent = gameState.playerData.level;
    document.getElementById('currentXP').textContent = gameState.playerData.xp;
    document.getElementById('requiredXP').textContent = gameState.playerData.xpRequired;
    
    // Update XP bar
    const xpProgress = (gameState.playerData.xp / gameState.playerData.xpRequired) * 100;
    document.getElementById('xpProgress').style.width = `${xpProgress}%`;
    
    // Update attributes
    document.getElementById('focoValue').textContent = gameState.playerData.attributes.foco;
    document.getElementById('forcaValue').textContent = gameState.playerData.attributes.forca;
    document.getElementById('inteligenciaValue').textContent = gameState.playerData.attributes.inteligencia;
    
    // Show/hide attribute points section
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

// Modal Functions
function showLevelUpModal() {
    const modal = document.getElementById('levelUpModal');
    document.getElementById('newLevel').textContent = gameState.playerData.level;
    modal.classList.add('show');
    
    // Add level up animation to player level
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

function updateGoalStatus() {
    const modal = document.getElementById('goalModal');
    const goalId = parseInt(modal.dataset.goalId);
    const newStatus = document.getElementById('goalStatusSelect').value;
    
    updateGoalStatus(goalId, newStatus);
    closeGoalModal();
}

// Audio Functions
function playSound(type) {
    // Create simple audio feedback using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different sounds for different actions
    switch (type) {
        case 'complete':
            oscillator.frequency.value = 523.25; // C5
            break;
        case 'levelup':
            oscillator.frequency.value = 659.25; // E5
            break;
        case 'achievement':
            oscillator.frequency.value = 783.99; // G5
            break;
        case 'create':
            oscillator.frequency.value = 440; // A4
            break;
        case 'attribute':
            oscillator.frequency.value = 493.88; // B4
            break;
        default:
            oscillator.frequency.value = 440;
    }
    
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// Remove objetivoa
function removeGoal(goalId) {
    console.log("Removendo goal:", goalId);
    // Remove quests associadas ao objetivo
    gameState.quests = gameState.quests.filter(q => q.goalId !== goalId);
    // Remove o objetivo
    gameState.goals = gameState.goals.filter(g => g.id != goalId);

    renderGoalsMap();
    renderQuests();
    saveGameState();
}

// Remove o objetivo do modal

function removeGoalFromModal() {
    if (window.currentGoalId) {
        removeGoal(window.currentGoalId);
        closeGoalModal();
    }
}

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

// Utility Functions
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// Add dynamic CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);