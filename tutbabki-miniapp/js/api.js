// Объект для работы с API
const api = {
    // Базовый URL для статического JSON API
    baseUrl: 'data/api.json',
    
    // Кэш данных API
    _cache: null,
    
    // Загрузка всех данных API
    async _loadApiData() {
        if (this._cache) {
            return this._cache;
        }
        
        try {
            console.log('🔄 Загрузка данных API из:', this.baseUrl);
            
            // Проверяем существование файла data/api.json
            const checkResponse = await fetch(this.baseUrl, { method: 'HEAD' });
            if (!checkResponse.ok) {
                console.warn('⚠️ Файл API не найден, создаем тестовые данные');
                // Если файл не найден, возвращаем тестовые данные
                this._cache = this._createMockApiData();
                return this._cache;
            }
            
            const response = await fetch(this.baseUrl);
            if (!response.ok) {
                throw new Error(`Ошибка загрузки API: ${response.status}`);
            }
            
            this._cache = await response.json();
            console.log('✅ Данные API успешно загружены');
            return this._cache;
        } catch (error) {
            console.error('❌ Ошибка загрузки API данных:', error);
            
            // В случае ошибки, создаем тестовые данные
            console.warn('⚠️ Используем тестовые данные вместо API');
            this._cache = this._createMockApiData();
            return this._cache;
        }
    },
    
    // Создание тестовых данных API
    _createMockApiData() {
        console.log('🔄 Создание тестовых данных API');
        
        return {
            users: {
                "7934395190": {
                    userId: 7934395190,
                    username: "@test_user",
                    first_name: "Тестовый",
                    last_name: "Пользователь",
                    balance: 2500,
                    totalEarned: 5800,
                    refCount: 3,
                    refLink: "https://t.me/TutBabkiBot?start=7934395190",
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
                    ],
                    transactions: [
                        {id: 1, product: 'Альфа-Банк 100 дней', amount: 3000, status: 'approved', date: '2023-06-15'},
                        {id: 2, product: 'Тинькофф Black', amount: 2500, status: 'pending', date: '2023-06-20'}
                    ]
                }
            },
            products: {
                "1": {
                    id: 1,
                    name: "Альфа-Банк 100 дней",
                    description: "Кредитная карта с беспроцентным периодом до 100 дней",
                    reward: 3000,
                    image: "https://alfabank.ru/f/media/logo.png",
                    requirements: ["Гражданство РФ", "Возраст от 18 лет", "Постоянный доход"],
                    refLink: "https://alfabank.ru/credit-cards/100-days/"
                },
                "2": {
                    id: 2,
                    name: "Тинькофф Black",
                    description: "Дебетовая карта с кэшбэком до 30%",
                    reward: 2500,
                    image: "https://acdn.tinkoff.ru/static/pages/files/8b969c4e-3.jpg",
                    requirements: ["Гражданство РФ", "Возраст от 18 лет"],
                    refLink: "https://www.tinkoff.ru/cards/debit-cards/tinkoff-black/"
                },
                "3": {
                    id: 3,
                    name: "Сбер СберПрайм",
                    description: "Дебетовая карта с годовой подпиской на все сервисы Сбера",
                    reward: 1800,
                    image: "https://sber.ru/logo.png",
                    requirements: ["Гражданство РФ", "Возраст от 18 лет"],
                    refLink: "https://sberbank.ru/cards/sber-prime/"
                },
                "4": {
                    id: 4,
                    name: "ВТБ Мультикарта",
                    description: "Дебетовая карта с выбором категории кэшбэка",
                    reward: 1500,
                    image: "https://vtb.ru/logo.png",
                    requirements: ["Гражданство РФ", "Возраст от 18 лет"],
                    refLink: "https://www.vtb.ru/personal/karty/multicard/"
                }
            },
            categories: {
                "1": {
                    id: 1,
                    name: "Кредитные карты",
                    icon: "💳",
                    products: [1]
                },
                "2": {
                    id: 2,
                    name: "Дебетовые карты",
                    icon: "💰",
                    products: [2, 3, 4]
                },
                "3": {
                    id: 3,
                    name: "Ипотека",
                    icon: "🏠",
                    products: []
                },
                "4": {
                    id: 4,
                    name: "Инвестиции",
                    icon: "📈",
                    products: []
                }
            }
        };
    },
    
    // Получение данных пользователя
    async getUserData(userId) {
        try {
            console.log('🔄 Запрос данных пользователя с ID:', userId);
            
            if (!userId) {
                console.error('❌ ID пользователя не указан');
                throw new Error('ID пользователя не указан');
            }
            
            // Загружаем данные API
            const apiData = await this._loadApiData();
            
            // Получаем данные пользователя
            const userData = apiData.users[userId];
            
            if (!userData) {
                console.warn(`⚠️ Пользователь с ID ${userId} не найден в API`);
                
                // Возвращаем тестовые данные
                return {
                    userId: userId,
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
            }
            
            console.log('✅ Получены данные пользователя:', userData);
            return userData;
        } catch (error) {
            console.error('❌ Ошибка API при получении данных пользователя:', error);
            
            // В случае ошибки возвращаем тестовые данные
            return {
                userId: userId,
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
        }
    },
    
    // Получение продуктов категории
    async getCategoryProducts(categoryId) {
        try {
            console.log(`🔄 Запрос продуктов категории с ID: ${categoryId}`);
            
            // Загружаем данные API
            const apiData = await this._loadApiData();
            
            // Если categoryId = 0, возвращаем все продукты
            if (categoryId === 0) {
                console.log('✅ Возвращаем все продукты');
                return Object.values(apiData.products);
            }
            
            // Получаем данные категории
            const category = apiData.categories[categoryId];
            if (!category) {
                console.warn(`⚠️ Категория с ID ${categoryId} не найдена`);
                return [];
            }
            
            // Возвращаем продукты категории
            const products = category.products.map(productId => apiData.products[productId]).filter(Boolean);
            console.log(`✅ Найдено ${products.length} продуктов в категории ${category.name}`);
            return products;
        } catch (error) {
            console.error('❌ Ошибка API при получении продуктов категории:', error);
            
            // В случае ошибки возвращаем тестовые продукты
            return [
                {id: 1, name: 'Альфа-Банк 100 дней', reward: 3000, image: 'https://alfabank.ru/f/media/logo.png'},
                {id: 2, name: 'Тинькофф Black', reward: 2500, image: 'https://acdn.tinkoff.ru/static/pages/files/8b969c4e-3.jpg'}
            ];
        }
    },
    
    // Получение деталей продукта
    async getProductDetails(productId) {
        try {
            console.log(`🔄 Запрос деталей продукта с ID: ${productId}`);
            
            if (!productId) {
                console.error('❌ ID продукта не указан');
                throw new Error('ID продукта не указан');
            }
            
            // Загружаем данные API
            const apiData = await this._loadApiData();
            
            // Получаем данные продукта
            const product = apiData.products[productId];
            if (!product) {
                console.warn(`⚠️ Продукт с ID ${productId} не найден`);
                
                // Возвращаем тестовый продукт
                return {
                    id: productId,
                    name: 'Тестовый продукт',
                    description: 'Описание тестового продукта',
                    reward: 1000,
                    image: 'https://via.placeholder.com/150',
                    requirements: ['Требование 1', 'Требование 2', 'Требование 3'],
                    refLink: 'https://example.com/?ref=' + (window.currentUser?.id || '')
                };
            }
            
            // Добавляем refLink с ID пользователя если есть currentUser
            if (window.currentUser && window.currentUser.id) {
                product.refLink = `${product.refLink}?ref=${window.currentUser.id}`;
            }
            
            console.log('✅ Получены детали продукта:', product);
            return product;
        } catch (error) {
            console.error('❌ Ошибка API при получении деталей продукта:', error);
            
            // В случае ошибки возвращаем тестовый продукт
            return {
                id: productId,
                name: 'Тестовый продукт',
                description: 'Описание тестового продукта',
                reward: 1000,
                image: 'https://via.placeholder.com/150',
                requirements: ['Требование 1', 'Требование 2', 'Требование 3'],
                refLink: 'https://example.com/?ref=' + (window.currentUser?.id || '')
            };
        }
    },
    
    // Регистрация клика по продукту
    async logProductClick(productId, userId) {
        try {
            console.log(`🔄 Регистрация клика по продукту с ID: ${productId} от пользователя с ID: ${userId}`);
            
            // В реальном проекте здесь будет настоящий запрос к API
            
            // Для демонстрации имитируем успешную регистрацию клика
            return await new Promise(resolve => {
                setTimeout(() => {
                    console.log('✅ Клик по продукту успешно зарегистрирован');
                    resolve({success: true});
                }, 300);
            });
        } catch (error) {
            console.error('❌ Ошибка API при регистрации клика:', error);
            return {success: false, error: error.message};
        }
    },
    
    // Получение транзакций пользователя
    async getUserTransactions(userId) {
        try {
            console.log(`🔄 Запрос транзакций пользователя с ID: ${userId}`);
            
            if (!userId) {
                console.error('❌ ID пользователя не указан');
                throw new Error('ID пользователя не указан');
            }
            
            // Загружаем данные API
            const apiData = await this._loadApiData();
            
            // Получаем данные пользователя
            const userData = apiData.users[userId];
            if (!userData || !userData.transactions) {
                console.warn(`⚠️ Транзакции пользователя с ID ${userId} не найдены`);
                return [];
            }
            
            console.log(`✅ Найдено ${userData.transactions.length} транзакций`);
            return userData.transactions;
        } catch (error) {
            console.error('❌ Ошибка API при получении транзакций:', error);
            
            // В случае ошибки возвращаем тестовые транзакции
            return [
                {id: 1, product: 'Альфа-Банк 100 дней', amount: 3000, status: 'approved', date: '2023-10-15'},
                {id: 2, product: 'Тинькофф Black', amount: 2500, status: 'pending', date: '2023-10-20'}
            ];
        }
    },
    
    // Поиск продуктов
    async searchProducts(query) {
        try {
            console.log(`🔄 Поиск продуктов по запросу: ${query}`);
            
            // Загружаем данные API
            const apiData = await this._loadApiData();
            
            // Получаем все продукты
            const allProducts = Object.values(apiData.products);
            
            // Если нет запроса, возвращаем все продукты
            if (!query) {
                console.log('✅ Возвращаем все продукты (пустой запрос)');
                return allProducts;
            }
            
            // Фильтруем продукты по запросу
            query = query.toLowerCase();
            const filteredProducts = allProducts.filter(product => 
                product.name.toLowerCase().includes(query) || 
                product.description.toLowerCase().includes(query)
            );
            
            console.log(`✅ Найдено ${filteredProducts.length} продуктов по запросу "${query}"`);
            return filteredProducts;
        } catch (error) {
            console.error('❌ Ошибка API при поиске продуктов:', error);
            
            // В случае ошибки возвращаем тестовые продукты
            return [
                {id: 1, name: 'Альфа-Банк 100 дней', reward: 3000, image: 'https://alfabank.ru/f/media/logo.png'},
                {id: 2, name: 'Тинькофф Black', reward: 2500, image: 'https://acdn.tinkoff.ru/static/pages/files/8b969c4e-3.jpg'}
            ];
        }
    }
}; 