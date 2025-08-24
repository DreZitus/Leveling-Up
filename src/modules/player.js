import { gameState, saveGameState } from './state.js';
import { updateUI } from './ui.js';
import { showLevelUpModal } from './modals.js';
import { unlockAchievement } from './achievements.js';
import { playSound } from './utils.js';

function gainXP(amount) {
    gameState.playerData.xp += amount;
    
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
    
    showLevelUpModal();
    
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

export { gainXP, levelUp, addAttributePoint };