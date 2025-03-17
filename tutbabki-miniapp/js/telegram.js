// Работаем с Telegram Web App
const telegram = {
    // Инициализация Telegram WebApp
    init() {
        // Проверяем, запущено ли приложение в Telegram
        const isTelegram = window.Telegram && window.Telegram.WebApp;
        
        if (!isTelegram && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            console.warn('⚠️ Приложение запущено не в Telegram. Создаем симуляцию для разработки.');
            this.createSimulation();
        } else if (!isTelegram) {
            console.error('❌ Ошибка: Приложение должно быть открыто в Telegram.');
            document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Ошибка</h1><p>Это приложение должно быть открыто через Telegram.</p></div>';
            return false;
        }
        
        // Применяем тему
        this.applyTelegramTheme();
        
        // Расширяем приложение
        window.Telegram.WebApp.expand();
        
        // Настраиваем обработчики событий
        this.setupEventHandlers();
        
        return true;
    },
    
    // Получение темы из Telegram
    applyTelegramTheme() {
        const root = document.documentElement;
        const tg = window.Telegram.WebApp;
        
        // Применяем цвета из Telegram
        if (tg.themeParams) {
            root.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
            root.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
            root.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color);
            root.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color);
            root.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
            root.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
            
            // Добавляем класс темы
            document.body.classList.add(tg.colorScheme === 'dark' ? 'dark-theme' : 'light-theme');
        }
    },
    
    // Настройка обработчиков событий Telegram
    setupEventHandlers() {
        const tg = window.Telegram.WebApp;
        
        tg.onEvent('viewportChanged', () => {
            console.log('Изменился размер окна Telegram WebApp');
        });
        
        tg.onEvent('themeChanged', () => {
            console.log('Изменилась тема Telegram');
            this.applyTelegramTheme();
        });
        
        tg.onEvent('mainButtonClicked', () => {
            console.log('Нажата основная кнопка Telegram');
            if (this.mainButtonCallback) {
                this.mainButtonCallback();
            }
        });
    },
    
    // Обратный вызов для основной кнопки
    mainButtonCallback: null,
    
    // Установка основной кнопки
    setMainButton(text, callback) {
        const tg = window.Telegram.WebApp;
        this.mainButtonCallback = callback;
        
        tg.MainButton.setText(text);
        tg.MainButton.show();
    },
    
    // Скрытие основной кнопки
    hideMainButton() {
        window.Telegram.WebApp.MainButton.hide();
        this.mainButtonCallback = null;
    },
    
    // Установка кнопки "Назад"
    showBackButton(callback) {
        const tg = window.Telegram.WebApp;
        this.backButtonCallback = callback;
        
        tg.BackButton.show();
        tg.onEvent('backButtonClicked', () => {
            if (this.backButtonCallback) {
                this.backButtonCallback();
            }
        });
    },
    
    // Скрытие кнопки "Назад"
    hideBackButton() {
        window.Telegram.WebApp.BackButton.hide();
        this.backButtonCallback = null;
    },
    
    // Открытие ссылки в Telegram
    openLink(url) {
        window.Telegram.WebApp.openLink(url);
    },
    
    // Поделиться ссылкой через Telegram
    shareLink(url) {
        window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}`);
    },
    
    // Отправка данных в Telegram бот
    sendData(data) {
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        window.Telegram.WebApp.sendData(data);
    },
    
    // Закрытие приложения
    closeApp() {
        window.Telegram.WebApp.close();
    },
    
    // Показ уведомления в Telegram
    showNotification(message, title = 'TutBabki') {
        window.Telegram.WebApp.showPopup({
            title: title,
            message: message,
            buttons: [{type: 'ok'}]
        });
    },
    
    // Показ всплывающего предупреждения
    showAlert(message) {
        window.Telegram.WebApp.showAlert(message);
    },
    
    // Показ диалога подтверждения
    showConfirm(message, callback) {
        window.Telegram.WebApp.showPopup({
            title: 'Подтверждение',
            message: message,
            buttons: [
                {type: 'cancel', text: 'Отмена'},
                {type: 'ok', text: 'Подтвердить'}
            ]
        }, (buttonId) => {
            if (callback) {
                callback(buttonId === 'ok');
            }
        });
    },
    
    // Получение текущего пользователя
    getUser() {
        const tg = window.Telegram.WebApp;
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            return tg.initDataUnsafe.user;
        }
        return null;
    },
    
    // Создание симуляции Telegram WebApp для локальной разработки
    createSimulation() {
        window.Telegram = {
            WebApp: {
                isExpanded: true,
                initData: "mock_init_data",
                initDataUnsafe: {
                    user: {
                        id: 7934395190,
                        first_name: "Тестовый",
                        last_name: "Пользователь",
                        username: "test_user",
                        language_code: "ru"
                    }
                },
                colorScheme: "light",
                themeParams: {
                    bg_color: "#FFFFFF",
                    text_color: "#000000",
                    hint_color: "#999999",
                    link_color: "#2196F3",
                    button_color: "#2196F3",
                    button_text_color: "#FFFFFF"
                },
                version: "6.0",
                viewportHeight: window.innerHeight,
                viewportStableHeight: window.innerHeight,
                expand: function() { console.log('Вызван метод expand()'); },
                close: function() { console.log('Вызван метод close()'); },
                showPopup: function(params, callback) { 
                    alert(params.message);
                    if (callback) callback('ok');
                },
                showAlert: function(message, callback) { 
                    alert(message);
                    if (callback) callback();
                },
                openLink: function(url) { window.open(url, '_blank'); },
                openTelegramLink: function(url) { window.open(url, '_blank'); },
                onEvent: function(eventName, callback) { 
                    console.log(`Подписка на событие: ${eventName}`); 
                    document.addEventListener('tg:' + eventName, callback);
                },
                sendData: function(data) { console.log(`Отправка данных: ${data}`); },
                MainButton: {
                    text: "Кнопка",
                    isVisible: false,
                    isActive: true,
                    setText: function(text) { 
                        this.text = text; 
                        console.log(`MainButton: установлен текст "${text}"`); 
                        
                        // Создаем кнопку в интерфейсе для симуляции
                        if (!document.getElementById('tg-main-button')) {
                            const btn = document.createElement('button');
                            btn.id = 'tg-main-button';
                            btn.innerText = text;
                            btn.style.position = 'fixed';
                            btn.style.bottom = '10px';
                            btn.style.left = '50%';
                            btn.style.transform = 'translateX(-50%)';
                            btn.style.zIndex = '1000';
                            btn.style.padding = '12px 24px';
                            btn.style.background = '#2196F3';
                            btn.style.color = 'white';
                            btn.style.border = 'none';
                            btn.style.borderRadius = '4px';
                            btn.style.fontWeight = 'bold';
                            btn.style.display = 'none';
                            
                            btn.addEventListener('click', () => {
                                const event = new Event('tg:mainButtonClicked');
                                document.dispatchEvent(event);
                            });
                            
                            document.body.appendChild(btn);
                        } else {
                            document.getElementById('tg-main-button').innerText = text;
                        }
                    },
                    show: function() { 
                        this.isVisible = true; 
                        console.log('MainButton: показана'); 
                        
                        const btn = document.getElementById('tg-main-button');
                        if (btn) btn.style.display = 'block';
                    },
                    hide: function() { 
                        this.isVisible = false; 
                        console.log('MainButton: скрыта'); 
                        
                        const btn = document.getElementById('tg-main-button');
                        if (btn) btn.style.display = 'none';
                    },
                    onClick: function(callback) { 
                        console.log('MainButton: установлен обработчик нажатия');
                        document.addEventListener('tg:mainButtonClicked', callback);
                    }
                },
                BackButton: {
                    isVisible: false,
                    show: function() { 
                        this.isVisible = true; 
                        console.log('BackButton: показана'); 
                        
                        if (!document.getElementById('tg-back-button')) {
                            const btn = document.createElement('button');
                            btn.id = 'tg-back-button';
                            btn.innerText = '← Назад';
                            btn.style.position = 'fixed';
                            btn.style.top = '10px';
                            btn.style.left = '10px';
                            btn.style.zIndex = '1000';
                            btn.style.padding = '8px 12px';
                            btn.style.background = 'transparent';
                            btn.style.color = '#2196F3';
                            btn.style.border = 'none';
                            btn.style.fontWeight = 'bold';
                            
                            btn.addEventListener('click', () => {
                                const event = new Event('tg:backButtonClicked');
                                document.dispatchEvent(event);
                            });
                            
                            document.body.appendChild(btn);
                        } else {
                            document.getElementById('tg-back-button').style.display = 'block';
                        }
                    },
                    hide: function() { 
                        this.isVisible = false; 
                        console.log('BackButton: скрыта'); 
                        
                        const btn = document.getElementById('tg-back-button');
                        if (btn) btn.style.display = 'none';
                    }
                }
            }
        };
        
        console.log('✅ Симуляция Telegram WebApp создана');
    }
};

// Инициализируем Telegram WebApp при загрузке документа
document.addEventListener('DOMContentLoaded', function() {
    telegram.init();
}); 