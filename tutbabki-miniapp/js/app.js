// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Расширяем на весь экран

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Основные переменные
let currentUser = null;
let categories = [];
let popularProducts = [];
let currentCategory = null;
let currentProduct = null;

// Инициализация приложения
async function initApp() {
    try {
        // Получаем данные пользователя из Telegram
        initTelegramUser();
        
        // Загружаем главную страницу
        loadPage('home');
        
        // Настраиваем навигацию
        setupNavigation();
        
        // Скрываем прелоадер после загрузки
        hideLoader();
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        showError('Не удалось загрузить приложение. Пожалуйста, попробуйте позже.');
    }
}

// Инициализация пользователя из Telegram
function initTelegramUser() {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        // Успешно получаем данные из Telegram WebApp
        currentUser = tg.initDataUnsafe.user;
        console.log('Данные пользователя получены из Telegram:', currentUser);
    } else {
        // Режим тестирования или открытие вне Telegram
        console.warn('Не удалось получить данные пользователя из Telegram, используем тестовые данные');
        currentUser = {
            id: 7934395190, // Ваш ID для тестирования
            first_name: 'Пользователь',
            last_name: '',
            username: 'username',
            language_code: 'ru'
        };
    }
    
    // Загружаем данные пользователя
    loadUserData(currentUser.id);
}

// Загрузка реальных данных пользователя
async function loadUserData(userId) {
    try {
        // Запрос к API
        const userData = await api.getUserData(userId);
        updateUserInterface(userData);
    } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
        // Загружаем тестовые данные в случае ошибки
        loadMockUserData();
    }
}

// Загрузка тестовых данных
async function loadMockUserData() {
    try {
        const mockData = {
            balance: 2500,
            totalEarned: 5800,
            refCount: 3,
            categories: [
                {id: 1, name: 'Кредитные карты', icon: '💳'},
                {id: 2, name: 'Дебетовые карты', icon: '💰'},
                {id: 3, name: 'Ипотека', icon: '🏠'},
                {id: 4, name: 'Инвестиции', icon: '📈'}
            ],
            popularProducts: [
                {id: 1, name: 'Альфа-Банк 100 дней', reward: 3000, image: 'https://alfabank.ru/f/media/logo.png'},
                {id: 2, name: 'Тинькофф Black', reward: 2500, image: 'https://acdn.tinkoff.ru/static/pages/files/8b969c4e-3.jpg'},
                {id: 3, name: 'Сбер СберПрайм', reward: 1800, image: 'https://sber.ru/logo.png'},
                {id: 4, name: 'ВТБ Мультикарта', reward: 1500, image: 'https://vtb.ru/logo.png'}
            ]
        };

        // Обновляем интерфейс тестовыми данными
        updateUserInterface(mockData);
    } catch (error) {
        console.error('Ошибка загрузки тестовых данных:', error);
        showError('Не удалось загрузить тестовые данные');
    }
}

// Обновление интерфейса данными пользователя
function updateUserInterface(userData) {
    // Обновляем имя пользователя если есть
    const nameElement = document.getElementById('user-name');
    if (nameElement) {
        nameElement.textContent = currentUser.first_name;
    }

    // Обновляем статистику
    updateStats(userData, 'user');
    
    // Сохраняем категории и продукты
    categories = userData.categories;
    popularProducts = userData.popularProducts;

    // Отрисовываем категории
    renderCategories(categories);
    // Отрисовываем популярные продукты
    renderPopularProducts(popularProducts);
}

// Обновление статистики на странице
function updateStats(userData, prefix = 'user') {
    const balanceElement = document.getElementById(`${prefix}-balance`);
    const earnedElement = document.getElementById(`${prefix}-earned`);
    const refsElement = document.getElementById(`${prefix}-refs`);
    
    if (balanceElement) balanceElement.textContent = `${userData.balance}₽`;
    if (earnedElement) earnedElement.textContent = `${userData.totalEarned}₽`;
    if (refsElement) refsElement.textContent = userData.refCount;
}

// Отрисовка категорий
function renderCategories(categories) {
    const categoriesContainer = document.getElementById('categories-list');
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = categories.map(category => `
        <div class="category-card" data-id="${category.id}" onclick="loadCategoryProducts(${category.id})">
            <div class="category-icon">${category.icon}</div>
            <div class="category-name">${category.name}</div>
        </div>
    `).join('');
}

// Отрисовка популярных продуктов
function renderPopularProducts(products) {
    const productsContainer = document.getElementById('popular-products');
    if (!productsContainer) return;

    productsContainer.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}" onclick="loadProductDetails(${product.id})">
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-reward">Награда: ${product.reward}₽</div>
            </div>
        </div>
    `).join('');
}

// Загрузка страницы
function loadPage(pageName) {
    const contentContainer = document.getElementById('content');
    const templateId = `${pageName}-template`;
    const template = document.getElementById(templateId);
    
    if (!template) {
        console.error(`Шаблон ${templateId} не найден`);
        return;
    }
    
    // Клонируем шаблон
    const pageContent = template.content.cloneNode(true);
    
    // Очищаем контейнер и добавляем новый контент
    contentContainer.innerHTML = '';
    contentContainer.appendChild(pageContent);
    
    // Активируем соответствующую кнопку навигации
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === pageName);
    });
    
    // Инициализируем контент в зависимости от страницы
    switch(pageName) {
        case 'home':
            initHomePage();
            break;
        case 'catalog':
            initCatalogPage();
            break;
        case 'profile':
            initProfilePage();
            break;
        case 'product':
            // Инициализация происходит в loadProductDetails
            break;
    }
    
    // Прокручиваем страницу вверх
    window.scrollTo(0, 0);
}

// Инициализация домашней страницы
function initHomePage() {
    // Настраиваем кнопку "Начать зарабатывать"
    const startButton = document.getElementById('start-earning');
    if (startButton) {
        startButton.addEventListener('click', function() {
            loadPage('catalog');
        });
    }
    
    // Если данные уже загружены, обновляем UI
    if (categories.length > 0) {
        renderCategories(categories);
        renderPopularProducts(popularProducts);
    }
}

// Инициализация страницы каталога
function initCatalogPage() {
    // Отображаем категории, если они загружены
    if (categories.length > 0) {
        renderCategoryTabs();
        
        // Если выбрана категория, загружаем её продукты
        if (currentCategory) {
            api.getCategoryProducts(currentCategory.id)
                .then(products => renderCategoryProducts(products))
                .catch(error => {
                    console.error('Ошибка загрузки продуктов:', error);
                    showError('Не удалось загрузить продукты');
                });
        } else {
            // Загружаем все продукты
            api.getCategoryProducts(0)  // 0 = все категории
                .then(products => renderCategoryProducts(products))
                .catch(error => {
                    console.error('Ошибка загрузки продуктов:', error);
                    showError('Не удалось загрузить продукты');
                });
        }
    }
    
    // Настраиваем поиск
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                searchProducts(query);
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    searchProducts(query);
                }
            }
        });
    }
}

// Инициализация страницы профиля
function initProfilePage() {
    // Обновляем информацию о пользователе
    const profileName = document.getElementById('profile-name');
    const profileUsername = document.getElementById('profile-username');
    
    if (profileName) {
        profileName.textContent = `${currentUser.first_name} ${currentUser.last_name}`.trim();
    }
    
    if (profileUsername) {
        profileUsername.textContent = currentUser.username ? `@${currentUser.username}` : '';
    }
    
    // Загружаем статистику из текущих данных
    if (document.getElementById('profile-balance')) {
        updateStats({
            balance: document.getElementById('user-balance')?.textContent || '0₽',
            totalEarned: document.getElementById('user-earned')?.textContent || '0₽',
            refCount: document.getElementById('user-refs')?.textContent || '0'
        }, 'profile');
    }
    
    // Настраиваем реферальную ссылку
    const refLink = document.getElementById('profile-ref-link');
    const copyLinkBtn = document.getElementById('profile-copy-link');
    const shareLinkBtn = document.getElementById('profile-share-link');
    
    if (refLink) {
        refLink.textContent = `https://t.me/TutBabkiBot?start=${currentUser.id}`;
    }
    
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function() {
            copyToClipboard(refLink.textContent);
            tg.showPopup({
                title: 'Ссылка скопирована',
                message: 'Реферальная ссылка скопирована в буфер обмена',
                buttons: [{type: 'ok'}]
            });
        });
    }
    
    if (shareLinkBtn) {
        shareLinkBtn.addEventListener('click', function() {
            tg.sendData(`share_ref_link:${currentUser.id}`);
        });
    }
    
    // Загружаем историю транзакций
    loadTransactions();
    
    // Настраиваем обработчики для настроек
    const withdrawalSettings = document.getElementById('settings-withdrawals');
    const supportSettings = document.getElementById('settings-support');
    
    if (withdrawalSettings) {
        withdrawalSettings.addEventListener('click', function() {
            tg.showPopup({
                title: 'Вывод средств',
                message: 'Функция вывода средств будет доступна в ближайшее время',
                buttons: [{type: 'ok'}]
            });
        });
    }
    
    if (supportSettings) {
        supportSettings.addEventListener('click', function() {
            tg.openTelegramLink('https://t.me/help_tutbabki');
        });
    }
}

// Загрузка истории транзакций
async function loadTransactions() {
    try {
        const transactionsList = document.getElementById('transactions-list');
        if (!transactionsList) return;
        
        showLoader();
        
        // Загружаем транзакции
        const transactions = await api.getUserTransactions(currentUser.id);
        
        if (transactions.length === 0) {
            transactionsList.innerHTML = `
                <div class="empty-state">
                    <p>У вас пока нет истории транзакций</p>
                </div>
            `;
        } else {
            transactionsList.innerHTML = transactions.map(transaction => `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <div class="transaction-name">${transaction.product}</div>
                        <div class="transaction-date">${transaction.date}</div>
                    </div>
                    <div class="transaction-amount ${transaction.status === 'approved' ? 'positive' : 'pending'}">
                        ${transaction.status === 'approved' ? '+' : ''}${transaction.amount}₽
                    </div>
                </div>
            `).join('');
        }
        
        hideLoader();
    } catch (error) {
        console.error('Ошибка загрузки транзакций:', error);
        hideLoader();
    }
}

// Отрисовка вкладок категорий
function renderCategoryTabs() {
    const tabsContainer = document.getElementById('category-tabs');
    if (!tabsContainer) return;
    
    // Добавляем вкладку "Все категории"
    let tabsHTML = `
        <div class="filter-tab ${!currentCategory ? 'active' : ''}" 
             data-id="0" onclick="loadCategoryProducts(0)">
            🔍 Все
        </div>
    `;
    
    // Добавляем остальные категории
    tabsHTML += categories.map(category => `
        <div class="filter-tab ${currentCategory && category.id === currentCategory.id ? 'active' : ''}" 
             data-id="${category.id}" onclick="loadCategoryProducts(${category.id})">
            ${category.icon} ${category.name}
        </div>
    `).join('');
    
    tabsContainer.innerHTML = tabsHTML;
}

// Загрузка продуктов категории
async function loadCategoryProducts(categoryId) {
    try {
        showLoader();
        
        if (categoryId === 0) {
            // Все категории
            currentCategory = null;
        } else {
            // Конкретная категория
            const category = categories.find(cat => cat.id === categoryId);
            if (!category) throw new Error('Категория не найдена');
            currentCategory = category;
        }
        
        // Загружаем продукты категории
        const products = await api.getCategoryProducts(categoryId);
        
        // Если не на странице каталога, переходим на неё
        if (!document.querySelector('.catalog-page')) {
            loadPage('catalog');
        } else {
            // Обновляем вкладки категорий
            renderCategoryTabs();
            // Отображаем продукты
            renderCategoryProducts(products);
        }
        
        hideLoader();
    } catch (error) {
        console.error('Ошибка загрузки продуктов категории:', error);
        showError('Не удалось загрузить продукты');
        hideLoader();
    }
}

// Поиск продуктов
async function searchProducts(query) {
    try {
        showLoader();
        
        // Выполняем поиск продуктов
        const products = await api.searchProducts(query);
        
        // Обновляем UI
        renderCategoryProducts(products);
        
        hideLoader();
    } catch (error) {
        console.error('Ошибка поиска продуктов:', error);
        showError('Не удалось выполнить поиск');
        hideLoader();
    }
}

// Отрисовка продуктов категории
function renderCategoryProducts(products) {
    const productsContainer = document.getElementById('products-grid');
    if (!productsContainer) return;
    
    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="empty-state">
                <p>Продукты в данной категории не найдены</p>
            </div>
        `;
        return;
    }
    
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}" onclick="loadProductDetails(${product.id})">
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-reward">Награда: ${product.reward}₽</div>
            </div>
        </div>
    `).join('');
}

// Загрузка деталей продукта
async function loadProductDetails(productId) {
    try {
        showLoader();
        
        // Загружаем детали продукта
        const product = await api.getProductDetails(productId);
        currentProduct = product;
        
        // Загружаем страницу продукта
        loadPage('product');
        
        // Обновляем интерфейс
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-reward').textContent = `Награда: ${product.reward}₽`;
        document.getElementById('product-description').textContent = product.description;
        
        // Устанавливаем изображение
        const imageElement = document.getElementById('product-image');
        imageElement.style.backgroundImage = `url('${product.image}')`;
        
        // Устанавливаем требования
        const requirementsElement = document.getElementById('product-requirements');
        requirementsElement.innerHTML = product.requirements.map(req => `
            <li>${req}</li>
        `).join('');
        
        // Устанавливаем реферальную ссылку
        const refLinkElement = document.getElementById('referral-link-display');
        refLinkElement.textContent = product.refLink;
        
        // Настраиваем кнопки
        setupProductButtons(product);
        
        // Настраиваем кнопку "Назад"
        const backButton = document.getElementById('back-to-catalog');
        if (backButton) {
            backButton.addEventListener('click', function() {
                loadPage('catalog');
            });
        }
        
        hideLoader();
    } catch (error) {
        console.error('Ошибка загрузки деталей продукта:', error);
        showError('Не удалось загрузить информацию о продукте');
        hideLoader();
    }
}

// Настройка кнопок на странице продукта
function setupProductButtons(product) {
    const copyLinkButton = document.getElementById('copy-link-button');
    const shareLinkButton = document.getElementById('share-link-button');
    
    if (copyLinkButton) {
        copyLinkButton.addEventListener('click', function() {
            copyToClipboard(product.refLink);
            tg.showPopup({
                title: 'Ссылка скопирована',
                message: 'Реферальная ссылка скопирована в буфер обмена',
                buttons: [{type: 'ok'}]
            });
        });
    }
    
    if (shareLinkButton) {
        shareLinkButton.addEventListener('click', function() {
            tg.sendData(`share_product:${product.id}`);
        });
    }
}

// Функция для копирования текста в буфер обмена
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';  // Важно для iOS
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Не удалось скопировать текст: ', err);
    }
    
    document.body.removeChild(textarea);
}

// Настройка навигации
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.dataset.page;
            loadPage(page);
        });
    });
}

// Показать лоадер
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

// Скрыть лоадер
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Показать ошибку
function showError(message) {
    tg.showAlert(message);
} 