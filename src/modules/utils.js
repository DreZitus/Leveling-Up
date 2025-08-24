import { gameState } from './state.js';

function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
        case 'complete':
            oscillator.frequency.value = 523.25;
            break;
        case 'levelup':
            oscillator.frequency.value = 659.25;
            break;
        case 'achievement':
            oscillator.frequency.value = 783.99;
            break;
        case 'create':
            oscillator.frequency.value = 440;
            break;
        case 'attribute':
            oscillator.frequency.value = 493.88;
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

function unlockAchievement(achievementId) {
    const achievement = gameState.achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        showAchievementNotification(achievement);
    }
}

function showAchievementNotification(achievement) {
    // Implemente a lógica de notificação aqui
}

export { playSound, unlockAchievement };