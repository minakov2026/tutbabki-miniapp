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
        // Показываем прелоадер
        showLoader();
        
        // Получаем данные пользователя из Telegram
        initTelegramUser();
        
        // Загружаем главную страницу
        loadPage('home');
        
        // Настраиваем навигацию
        setupNavigation();
        
        // Скрываем прелоадер после загрузки
        hideLoader();
        
        // Показываем приветственное сообщение
        setTimeout(() => {
            telegram.showNotification(`Привет, ${currentUser.first_name}! Добро пожаловать в приложение TutBabki.`);
        }, 1000);
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        showError('Не удалось загрузить приложение. Пожалуйста, попробуйте позже.');
    }
}

// Инициализация пользователя из Telegram
function initTelegramUser() {
    // Получаем пользователя из Telegram
    const user = telegram.getUser();
    
    if (user) {
        // Успешно получаем данные из Telegram WebApp
        currentUser = user;
        console.log('✅ Получены данные пользователя из Telegram WebApp:', currentUser);
    } else {
        // Режим тестирования или открытие вне Telegram
        console.warn('⚠️ WebApp не в Telegram или initData недоступен');
        console.warn('⚠️ Используем тестовые данные для ID: 7934395190');
        
        currentUser = {
            id: 7934395190, // ID для тестирования
            first_name: 'Тестовый',
            last_name: 'Пользователь',
            username: 'test_user',
            language_code: 'ru'
        };
    }
    
    // Логируем текущего пользователя для отладки
    console.log('Текущий пользователь:', currentUser);
    
    // Загружаем данные пользователя из API
    loadUserData(currentUser.id);
}

// Загрузка реальных данных пользователя
async function loadUserData(userId) {
    try {
        showLoader();
        
        // Запрос к API
        const userData = await api.getUserData(userId);
        
        // Обновляем интерфейс
        updateUserInterface(userData);
        
        hideLoader();
    } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
        hideLoader();
        
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
    
    // Настраиваем реферальную ссылку
    setupReferralLink();
}

// Настройка реферальной ссылки
function setupReferralLink() {
    const refLink = document.getElementById('referral-link');
    const copyRefButton = document.getElementById('copy-referral-button');
    const shareRefButton = document.getElementById('share-referral-button');
    
    if (refLink) {
        const link = `https://t.me/TutBabkiBot?start=${currentUser.id}`;
        refLink.value = link;
    }
    
    if (copyRefButton) {
        copyRefButton.addEventListener('click', function() {
            copyToClipboard(refLink.value);
            telegram.showNotification('Реферальная ссылка скопирована в буфер обмена');
        });
    }
    
    if (shareRefButton) {
        shareRefButton.addEventListener('click', function() {
            const link = refLink.value;
            const text = `Присоединяйтесь к TutBabki и начните зарабатывать на рекомендациях банковских продуктов! ${link}`;
            
            telegram.sendData(`share_ref_link:${currentUser.id}`);
            
            // В режиме тестирования используем обычный шаринг
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                if (navigator.share) {
                    navigator.share({
                        title: 'TutBabki - Заработок на рекомендациях',
                        text: text,
                        url: link
                    });
                } else {
                    telegram.shareLink(link);
                }
            }
        });
    }
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
    
    // Настраиваем кнопку "Назад" Telegram
    if (pageName === 'home') {
        telegram.hideBackButton();
    } else {
        telegram.showBackButton(() => {
            loadPage('home');
        });
    }
    
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
    
    // Анимация перехода
    contentContainer.classList.add('fade-in');
    setTimeout(() => {
        contentContainer.classList.remove('fade-in');
    }, 300);
    
    // Прокручиваем страницу вверх
    window.scrollTo(0, 0);
}

// Инициализация домашней страницы
function initHomePage() {
    // Если данные уже загружены, обновляем UI
    if (categories.length > 0) {
        renderCategories(categories);
        renderPopularProducts(popularProducts);
    }
    
    // Настраиваем реферальную ссылку
    setupReferralLink();
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
    
    if (profileName) {
        profileName.textContent = `${currentUser.first_name} ${currentUser.last_name || ''}`.trim();
    }
    
    // Загружаем статистику из текущих данных
    if (document.getElementById('profile-balance')) {
        updateStats({
            balance: document.getElementById('user-balance')?.textContent.replace('₽', '') || '0',
            totalEarned: document.getElementById('user-earned')?.textContent.replace('₽', '') || '0',
            refCount: document.getElementById('user-refs')?.textContent || '0'
        }, 'profile');
    }
    
    // Загружаем историю транзакций
    loadTransactions();
    
    // Настраиваем кнопку вывода средств
    const withdrawalButton = document.getElementById('withdrawal-button');
    if (withdrawalButton) {
        withdrawalButton.addEventListener('click', function() {
            const balance = parseInt(document.getElementById('profile-balance').textContent) || 0;
            
            if (balance < 1000) {
                telegram.showNotification('Минимальная сумма для вывода составляет 1000₽. Заработайте больше, чтобы вывести средства.');
                return;
            }
            
            telegram.showConfirm(`Вы хотите вывести ${balance}₽ на ваш счет?`, (confirmed) => {
                if (confirmed) {
                    telegram.sendData(`withdraw:${balance}`);
                    telegram.showNotification('Заявка на вывод средств успешно создана. Ожидайте подтверждения от администратора.');
                }
            });
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
                    <div class="transaction-header">
                        <div class="transaction-name">${transaction.product}</div>
                        <div class="transaction-amount ${transaction.status === 'approved' ? 'positive' : ''}">
                            ${transaction.status === 'approved' ? '+' : ''}${transaction.amount}₽
                        </div>
                    </div>
                    <div class="transaction-footer">
                        <div class="transaction-date">${transaction.date}</div>
                        <div class="transaction-status status-${transaction.status}">
                            ${getStatusText(transaction.status)}
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        hideLoader();
    } catch (error) {
        console.error('Ошибка загрузки транзакций:', error);
        hideLoader();
        
        // Показываем тестовые данные
        const transactionsList = document.getElementById('transactions-list');
        if (transactionsList) {
            transactionsList.innerHTML = `
                <div class="transaction-item">
                    <div class="transaction-header">
                        <div class="transaction-name">Альфа-Банк 100 дней</div>
                        <div class="transaction-amount positive">+3000₽</div>
                    </div>
                    <div class="transaction-footer">
                        <div class="transaction-date">15.10.2023</div>
                        <div class="transaction-status status-approved">Одобрено</div>
                    </div>
                </div>
                <div class="transaction-item">
                    <div class="transaction-header">
                        <div class="transaction-name">Тинькофф Black</div>
                        <div class="transaction-amount">2500₽</div>
                    </div>
                    <div class="transaction-footer">
                        <div class="transaction-date">20.10.2023</div>
                        <div class="transaction-status status-pending">Ожидание</div>
                    </div>
                </div>
            `;
        }
    }
}

// Получение текста статуса транзакции
function getStatusText(status) {
    switch (status) {
        case 'approved':
            return 'Одобрено';
        case 'pending':
            return 'Ожидание';
        case 'rejected':
            return 'Отклонено';
        default:
            return 'Неизвестно';
    }
}

// Отрисовка вкладок категорий
function renderCategoryTabs() {
    const tabsContainer = document.getElementById('categories-tabs');
    if (!tabsContainer) return;
    
    // Добавляем вкладку "Все категории"
    let tabsHTML = `
        <div class="category-tab ${!currentCategory ? 'active' : ''}" 
             data-id="0" onclick="loadCategoryProducts(0)">
            🔍 Все
        </div>
    `;
    
    // Добавляем остальные категории
    tabsHTML += categories.map(category => `
        <div class="category-tab ${currentCategory && category.id === currentCategory.id ? 'active' : ''}" 
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
        
        // Логируем клик
        await api.logProductClick(productId, currentUser.id);
        
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
        refLinkElement.value = product.refLink;
        
        // Настраиваем кнопки
        setupProductButtons(product);
        
        // Настраиваем кнопку "Назад"
        const backButton = document.getElementById('back-to-catalog');
        if (backButton) {
            backButton.addEventListener('click', function() {
                loadPage('catalog');
            });
        }
        
        // Настраиваем основную кнопку Telegram
        telegram.setMainButton('Получить ссылку', () => {
            telegram.sendData(`get_ref_link:${productId}`);
            
            // Дублируем функциональность для тестирования
            copyToClipboard(product.refLink);
            telegram.showNotification('Реферальная ссылка скопирована в буфер обмена и отправлена в ваш чат');
        });
        
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
            telegram.showNotification('Реферальная ссылка скопирована в буфер обмена');
        });
    }
    
    if (shareLinkButton) {
        shareLinkButton.addEventListener('click', function() {
            const text = `Рекомендую ${product.name}! Оформи прямо сейчас: ${product.refLink}`;
            
            telegram.sendData(`share_product:${product.id}`);
            
            // В режиме тестирования используем обычный шаринг
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                if (navigator.share) {
                    navigator.share({
                        title: product.name,
                        text: text,
                        url: product.refLink
                    });
                } else {
                    telegram.shareLink(product.refLink);
                }
            }
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
    telegram.showAlert(message);
} 