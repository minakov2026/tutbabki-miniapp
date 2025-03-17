// Отладочный файл для проверки данных в мини-приложении

// Добавляем функцию для проверки данных
function debugApp() {
    console.log('%c--- ОТЛАДКА МИНИ-ПРИЛОЖЕНИЯ ---', 'background: #2196F3; color: white; padding: 5px;');
    
    // Проверяем инициализацию Telegram WebApp
    console.log('📱 Telegram WebApp:', window.Telegram?.WebApp);
    
    // Проверяем данные пользователя
    console.log('👤 Текущий пользователь:', currentUser);
    
    // Выводим все значения, которые могут отображаться на странице
    const elements = {
        'user-name': document.getElementById('user-name')?.textContent,
        'user-balance': document.getElementById('user-balance')?.textContent,
        'user-earned': document.getElementById('user-earned')?.textContent,
        'user-refs': document.getElementById('user-refs')?.textContent,
        'referral-link-display': document.getElementById('referral-link-display')?.textContent
    };
    
    console.log('🔍 Элементы на странице:', elements);
    
    // Статистика загрузки страниц
    console.log('📊 Текущая страница:', document.querySelector('.home-page, .catalog-page, .product-page, .profile-page')?.className);
    
    // Проверяем категории и продукты
    console.log('📋 Загруженные категории:', categories);
    console.log('🏆 Популярные продукты:', popularProducts);
    
    // Проверка текущей категории и продукта
    console.log('📁 Текущая категория:', currentCategory);
    console.log('📦 Текущий продукт:', currentProduct);
    
    // Проверка загрузки API
    fetch('data/api.json')
        .then(response => {
            console.log('📊 API загружен:', response.ok);
            return response.json();
        })
        .then(data => {
            console.log('📊 Данные API:', data);
        })
        .catch(error => {
            console.error('❌ Ошибка загрузки API:', error);
        });
        
    // Проверка состояния Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        console.log('🔐 Telegram данные:', {
            initData: window.Telegram.WebApp.initData,
            colorScheme: window.Telegram.WebApp.colorScheme,
            themeParams: window.Telegram.WebApp.themeParams,
            version: window.Telegram.WebApp.version
        });
    }
}

// Создаем тестовые данные если API не доступен
function createMockData() {
    console.log('%c--- СОЗДАНИЕ ТЕСТОВЫХ ДАННЫХ ---', 'background: #FF9800; color: white; padding: 5px;');
    
    if (!window.categories || categories.length === 0) {
        window.categories = [
            {id: 1, name: 'Кредитные карты', icon: '💳'},
            {id: 2, name: 'Дебетовые карты', icon: '💰'},
            {id: 3, name: 'Ипотека', icon: '🏠'},
            {id: 4, name: 'Инвестиции', icon: '📈'}
        ];
        console.log('✅ Созданы тестовые категории');
    }
    
    if (!window.popularProducts || popularProducts.length === 0) {
        window.popularProducts = [
            {id: 1, name: 'Альфа-Банк 100 дней', reward: 3000, image: 'https://alphabank.ru/f/media/logo.png'},
            {id: 2, name: 'Тинькофф Black', reward: 2500, image: 'https://acdn.tinkoff.ru/static/pages/files/8b969c4e-3.jpg'},
            {id: 3, name: 'Сбер СберПрайм', reward: 1800, image: 'https://sber.ru/logo.png'},
            {id: 4, name: 'ВТБ Мультикарта', reward: 1500, image: 'https://vtb.ru/logo.png'}
        ];
        console.log('✅ Созданы тестовые продукты');
    }
    
    // Создаем тестового пользователя если его нет
    if (!window.currentUser) {
        window.currentUser = {
            id: 7934395190,
            first_name: 'Тестовый',
            last_name: 'Пользователь',
            username: 'test_user',
            language_code: 'ru'
        };
        console.log('✅ Создан тестовый пользователь');
    }
}

// Вызываем функцию отладки через 3 секунды после загрузки документа
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        debugApp();
        createMockData();
    }, 3000);
    
    // Добавляем кнопку отладки если в режиме разработки
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const debugButton = document.createElement('button');
        debugButton.innerText = '🐞 Отладка';
        debugButton.style.position = 'fixed';
        debugButton.style.bottom = '70px';
        debugButton.style.right = '20px';
        debugButton.style.zIndex = '1000';
        debugButton.style.padding = '8px 12px';
        debugButton.style.background = '#F44336';
        debugButton.style.color = 'white';
        debugButton.style.border = 'none';
        debugButton.style.borderRadius = '4px';
        debugButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        
        debugButton.addEventListener('click', () => {
            debugApp();
            createMockData();
            alert('Отладочная информация выведена в консоль разработчика');
        });
        
        document.body.appendChild(debugButton);
    }
});

// Добавляем слушатель для Telegram WebApp событий
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.onEvent('mainButtonClicked', function() {
        console.log('🔘 Нажата основная кнопка');
    });
    
    window.Telegram.WebApp.onEvent('backButtonClicked', function() {
        console.log('⬅️ Нажата кнопка назад');
    });
    
    window.Telegram.WebApp.onEvent('viewportChanged', function() {
        console.log('🔄 Изменен размер окна');
    });
}

// Функция для симуляции Telegram WebApp в браузере
function simulateTelegramWebApp() {
    if (!window.Telegram || !window.Telegram.WebApp) {
        console.warn('⚠️ Telegram WebApp не обнаружен, создаем симуляцию');
        
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
                showPopup: function(params) { alert(params.message); },
                showAlert: function(message) { alert(message); },
                openLink: function(url) { window.open(url, '_blank'); },
                onEvent: function(eventName, callback) { console.log(`Подписка на событие: ${eventName}`); },
                sendData: function(data) { console.log(`Отправка данных: ${data}`); },
                MainButton: {
                    text: "Кнопка",
                    isVisible: false,
                    isActive: true,
                    setText: function(text) { this.text = text; console.log(`MainButton: установлен текст "${text}"`); },
                    show: function() { this.isVisible = true; console.log('MainButton: показана'); },
                    hide: function() { this.isVisible = false; console.log('MainButton: скрыта'); },
                    onClick: function(callback) { console.log('MainButton: установлен обработчик нажатия'); }
                }
            }
        };
        
        console.log('✅ Симуляция Telegram WebApp создана');
    }
}

// Вызываем симуляцию при открытии в обычном браузере
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    simulateTelegramWebApp();
} 