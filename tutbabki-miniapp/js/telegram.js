// Работаем с Telegram Web App
const telegram = {
    // Получение темы из Telegram
    applyTelegramTheme() {
        const root = document.documentElement;
        
        // Применяем цвета из Telegram
        if (tg.themeParams) {
            root.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
            root.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
            root.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color);
            root.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color);
            root.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
            root.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
        }
    },
    
    // Открытие ссылки в Telegram
    openLink(url) {
        tg.openLink(url);
    },
    
    // Поделиться ссылкой через Telegram
    shareLink(url) {
        // Показываем кнопку "Поделиться"
        tg.MainButton.setText('Поделиться');
        tg.MainButton.show();
        
        tg.MainButton.onClick(() => {
            tg.shareUrl(url);
            tg.MainButton.hide();
        });
    },
    
    // Закрытие приложения
    closeApp() {
        tg.close();
    },
    
    // Показ уведомления в Telegram
    showNotification(message) {
        tg.showPopup({
            title: 'TutBabki',
            message: message,
            buttons: [{type: 'ok'}]
        });
    }
};

// Применяем тему из Telegram при загрузке
document.addEventListener('DOMContentLoaded', function() {
    telegram.applyTelegramTheme();
}); 