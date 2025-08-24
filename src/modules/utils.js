import { gameState } from './state.js';
import { renderAchievements } from './ui.js';

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

export { playSound, unlockAchievement };