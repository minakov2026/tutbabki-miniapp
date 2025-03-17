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
            const response = await fetch(this.baseUrl);
            if (!response.ok) {
                throw new Error(`Ошибка загрузки API: ${response.status}`);
            }
            
            this._cache = await response.json();
            return this._cache;
        } catch (error) {
            console.error('Ошибка загрузки API данных:', error);
            throw error;
        }
    },
    
    // Получение данных пользователя
    async getUserData(userId) {
        try {
            console.log('Запрашиваем данные для пользователя с ID:', userId);
            
            // Загружаем данные API
            const apiData = await this._loadApiData();
            
            // Получаем данные пользователя
            const userData = apiData.users[userId];
            
            if (!userData) {
                console.warn(`Пользователь с ID ${userId} не найден в API`);
                // Возвращаем тестовые данные для тестирования
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
                        {id: 1, name: 'Альфа-Банк 100 дней', reward: 3000, image: 'https://alphabank.ru/f/media/logo.png'},
                        {id: 2, name: 'Тинькофф Black', reward: 2500, image: 'https://acdn.tinkoff.ru/static/pages/files/8b969c4e-3.jpg'},
                        {id: 3, name: 'Сбер СберПрайм', reward: 1800, image: 'https://sber.ru/logo.png'},
                        {id: 4, name: 'ВТБ Мультикарта', reward: 1500, image: 'https://vtb.ru/logo.png'}
                    ]
                };
            }
            
            console.log('Получены данные пользователя:', userData);
            return userData;
        } catch (error) {
            console.error('Ошибка API при получении данных пользователя:', error);
            
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
                    {id: 1, name: 'Альфа-Банк 100 дней', reward: 3000, image: 'https://alphabank.ru/f/media/logo.png'},
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
            // Загружаем данные API
            const apiData = await this._loadApiData();
            
            // Если categoryId = 0, возвращаем все продукты
            if (categoryId === 0) {
                return Object.values(apiData.products);
            }
            
            // Получаем данные категории
            const category = apiData.categories[categoryId];
            if (!category) {
                throw new Error(`Категория с ID ${categoryId} не найдена`);
            }
            
            // Возвращаем продукты категории
            return category.products.map(productId => apiData.products[productId]);
        } catch (error) {
            console.error('Ошибка API при получении продуктов категории:', error);
            
            // В случае ошибки возвращаем тестовые продукты
            return [
                {id: 1, name: 'Альфа-Банк 100 дней', reward: 3000, image: 'https://alphabank.ru/f/media/logo.png'},
                {id: 2, name: 'Тинькофф Black', reward: 2500, image: 'https://acdn.tinkoff.ru/static/pages/files/8b969c4e-3.jpg'}
            ];
        }
    },
    
    // Получение деталей продукта
    async getProductDetails(productId) {
        try {
            // Загружаем данные API
            const apiData = await this._loadApiData();
            
            // Получаем данные продукта
            const product = apiData.products[productId];
            if (!product) {
                throw new Error(`Продукт с ID ${productId} не найден`);
            }
            
            // Добавляем refLink с ID пользователя если есть currentUser
            if (window.currentUser && window.currentUser.id) {
                product.refLink = `${product.refLink}?ref=${window.currentUser.id}`;
            }
            
            return product;
        } catch (error) {
            console.error('Ошибка API при получении деталей продукта:', error);
            
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
            // В реальном проекте здесь будет настоящий запрос к API
            
            // Для демонстрации имитируем успешную регистрацию клика
            return await new Promise(resolve => {
                setTimeout(() => {
                    resolve({success: true});
                }, 300);
            });
        } catch (error) {
            console.error('Ошибка API при регистрации клика:', error);
            throw error;
        }
    },
    
    // Получение транзакций пользователя
    async getUserTransactions(userId) {
        try {
            // Загружаем данные API
            const apiData = await this._loadApiData();
            
            // Получаем данные пользователя
            const userData = apiData.users[userId];
            if (!userData || !userData.transactions) {
                return [];
            }
            
            return userData.transactions;
        } catch (error) {
            console.error('Ошибка API при получении транзакций:', error);
            
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
            // Загружаем данные API
            const apiData = await this._loadApiData();
            
            // Получаем все продукты
            const allProducts = Object.values(apiData.products);
            
            // Если нет запроса, возвращаем все продукты
            if (!query) {
                return allProducts;
            }
            
            // Фильтруем продукты по запросу
            query = query.toLowerCase();
            return allProducts.filter(product => 
                product.name.toLowerCase().includes(query) || 
                product.description.toLowerCase().includes(query)
            );
        } catch (error) {
            console.error('Ошибка API при поиске продуктов:', error);
            
            // В случае ошибки возвращаем тестовые продукты
            return [
                {id: 1, name: 'Альфа-Банк 100 дней', reward: 3000, image: 'https://alphabank.ru/f/media/logo.png'},
                {id: 2, name: 'Тинькофф Black', reward: 2500, image: 'https://acdn.tinkoff.ru/static/pages/files/8b969c4e-3.jpg'}
            ];
        }
    }
}; 