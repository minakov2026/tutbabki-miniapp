// Объект для работы с API
const api = {
    baseUrl: 'http://localhost/api',
    
    // Получение данных пользователя
    async getUserData(userId) {
        try {
            console.log('Запрашиваем данные для пользователя с ID:', userId);
            
            // Делаем запрос к нашему локальному API
            const response = await fetch(`${this.baseUrl}?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Ошибка загрузки данных пользователя');
            }
            
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            
            return data;
        } catch (error) {
            console.error('Ошибка API при получении данных пользователя:', error);
            
            // В случае ошибки возвращаем тестовые данные
            return {
                _userId: userId, // Подчеркивание означает что это внутреннее поле для отладки
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
            // В реальном проекте здесь будет настоящий запрос к API
            
            // Для демонстрации возвращаем тестовые данные
            return await new Promise(resolve => {
                setTimeout(() => {
                    resolve([
                        {id: 1, name: 'Альфа-Банк 100 дней', reward: 3000, image: 'https://alphabank.ru/f/media/logo.png'},
                        {id: 2, name: 'Тинькофф Black', reward: 2500, image: 'https://acdn.tinkoff.ru/static/pages/files/8b969c4e-3.jpg'},
                        {id: 3, name: 'Сбер СберПрайм', reward: 1800, image: 'https://sber.ru/logo.png'},
                        {id: 4, name: 'ВТБ Мультикарта', reward: 1500, image: 'https://vtb.ru/logo.png'}
                    ]);
                }, 500);
            });
        } catch (error) {
            console.error('Ошибка API при получении продуктов категории:', error);
            throw error;
        }
    },
    
    // Получение деталей продукта
    async getProductDetails(productId) {
        try {
            // В реальном проекте здесь будет настоящий запрос к API
            
            // Для демонстрации возвращаем тестовые данные
            return await new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        id: productId,
                        name: 'Альфа-Банк 100 дней',
                        description: 'Кредитная карта с беспроцентным периодом до 100 дней',
                        reward: 3000,
                        image: 'https://alphabank.ru/f/media/logo.png',
                        requirements: [
                            'Гражданство РФ',
                            'Возраст от 18 лет',
                            'Постоянный доход'
                        ],
                        refLink: 'https://alfabank.ru/credit-cards/100-days/?ref=12345'
                    });
                }, 500);
            });
        } catch (error) {
            console.error('Ошибка API при получении деталей продукта:', error);
            throw error;
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
    
    // Получение трансакций пользователя
    async getUserTransactions(userId) {
        try {
            // В реальном проекте здесь будет настоящий запрос к API
            
            // Для демонстрации возвращаем тестовые данные
            return await new Promise(resolve => {
                setTimeout(() => {
                    resolve([
                        {id: 1, product: 'Альфа-Банк 100 дней', amount: 3000, status: 'approved', date: '2023-10-15'},
                        {id: 2, product: 'Тинькофф Black', amount: 2500, status: 'pending', date: '2023-10-20'}
                    ]);
                }, 500);
            });
        } catch (error) {
            console.error('Ошибка API при получении трансакций:', error);
            throw error;
        }
    },
    
    // Поиск продуктов
    async searchProducts(query) {
        try {
            // Для тестирования возвращаем тестовые данные
            return await new Promise(resolve => {
                setTimeout(() => {
                    resolve([
                        {id: 1, name: 'Альфа-Банк 100 дней', reward: 3000, image: 'https://alfabank.ru/f/media/logo.png'},
                        {id: 2, name: 'Тинькофф Black', reward: 2500, image: 'https://acdn.tinkoff.ru/static/pages/files/8b969c4e-3.jpg'}
                    ]);
                }, 500);
            });
        } catch (error) {
            console.error('Ошибка API при поиске продуктов:', error);
            throw error;
        }
    }
}; 