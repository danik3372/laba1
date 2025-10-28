const app = {
  // Данные меню
  menuData: [
    [1, 0, "Каталог товаров", "catalog.html"],
    [2, 0, "Бренды", "brands.html"],
    [3, 0, "Акции", "sales.html"],
    [4, 0, "Помощь", "help.html"],
    [5, 1, "Электроника", "electronics.html"],
    [6, 5, "Смартфоны", "smartphones.html"],
    [7, 5, "Ноутбуки", "laptops.html"],
    [8, 5, "Телевизоры", "tv.html"],
    [9, 1, "Бытовая техника", "appliances.html"],
    [10, 9, "Холодильники", "refrigerators.html"],
    [26, 10, "Однокамерные", "single-door-fridges.html"],
    [27, 10, "Двухкамерные", "double-door-fridges.html"],
    [11, 9, "Стиральные машины", "washing-machines.html"],
    [28, 11, "С фронтальной загрузкой", "front-load-washers.html"],
    [29, 11, "С вертикальной загрузкой", "top-load-washers.html"],
    [12, 1, "Одежда", "clothing.html"],
    [13, 12, "Мужская", "mens-clothing.html"],
    [14, 12, "Женская", "womens-clothing.html"],
    [15, 2, "Apple", "brand-apple.html"],
    [16, 2, "Samsung", "brand-samsung.html"],
    [17, 2, "Xiaomi", "brand-xiaomi.html"],
    [18, 3, "Скидки", "discounts.html"],
    [19, 3, "Распродажи", "clearance.html"],
    [20, 3, "Новинки", "new-arrivals.html"],
    [21, 4, "Доставка", "delivery.html"],
    [22, 4, "Оплата", "payment.html"],
    [23, 4, "Контакты", "contacts.html"],
    [24, 23, "Магазины", "stores.html"],
    [25, 23, "Обратная связь", "feedback.html"],
    [30, 1, "Мебель", "furniture.html"],
    [31, 30, "Гостиная", "living-room.html"],
    [32, 30, "Спальня", "bedroom.html"],
    [33, 1, "Спорт", "sports.html"],
    [34, 33, "Фитнес", "fitness.html"],
    [35, 33, "Велоспорт", "cycling.html"],
    [36, 5, "Наушники", "headphones.html"],
    [37, 36, "Беспроводные", "wireless-headphones.html"],
    [38, 36, "Накладные", "over-ear-headphones.html"]
  ].map(([id, parent, name, link]) => ({ id, parent, name, link: link || "#" })),

  // Корзина
  cart: {
    items: [],

    // Добавить товар в корзину
    addItem: function(product) {
      const existingItem = this.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({
          ...product,
          quantity: 1
        });
      }
      this.saveToLocalStorage();
      this.updateCartCount();
    },
    
    // Удалить товар из корзины
    removeItem: function(id) {
      this.items = this.items.filter(item => item.id !== id);
      this.saveToLocalStorage();
      this.updateCartCount();
    },
    
    // Изменить количество товара
    updateQuantity: function(id, quantity) {
      const item = this.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        this.saveToLocalStorage();
      }
      this.updateCartCount();
    },
    
    // Очистить корзину
    clearCart: function() {
      this.items = [];
      this.saveToLocalStorage();
      this.updateCartCount();
    },
    
    // Получить общую сумму
    getTotal: function() {
      return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    // Сохранить в localStorage
    saveToLocalStorage: function() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    // Загрузить из localStorage
    loadFromLocalStorage: function() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.items = JSON.parse(savedCart);
      }
      this.updateCartCount();
    },
    
    // Обновить счетчик в шапке
    updateCartCount: function() {
      const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
      document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
      });
    }
  },
 // Обработчик для кнопок "В корзину"

  // Построение дерева меню
  buildMenuTree: function(items, parentId = 0) {
    return items
      .filter((item) => item.parent === parentId)
      .map((item) => ({
        ...item,
        children: this.buildMenuTree(items, item.id),
      }));
  },

  // Генерация основного меню
  generateMenu: function() {
    const menuTree = this.buildMenuTree(this.menuData);
    const mainNav = document.getElementById("mainNav");
    
    if (mainNav) {
      mainNav.innerHTML = `
        <div class="menu-grid">
          ${menuTree.map(column => `
            <div class="menu-column">
              <h3 class="menu-category">
                <a href="${column.link}">${column.name}</a>
              </h3>
              ${column.children.map(item => `
                <div class="menu-group">
                  ${item.children.length ? `
                    <div class="menu-item-with-submenu">
                      <button class="menu-item-btn" type="button">
                        ${item.name} <i class="fas fa-chevron-down"></i>
                      </button>
                      <div class="submenu-dropdown">
                        ${item.children.map(subitem => `
                          ${subitem.children.length ? `
                            <div class="submenu-subitem-with-submenu">
                              <button class="submenu-item-btn" type="button">
                                ${subitem.name} <i class="fas fa-chevron-down"></i>
                              </button>
                              <div class="submenu-subdropdown">
                                ${subitem.children.map(subsubitem => `
                                  <a href="${subsubitem.link}" class="submenu-item">
                                    ${subsubitem.name}
                                  </a>
                                `).join("")}
                              </div>
                            </div>
                          ` : `
                            <a href="${subitem.link}" class="submenu-item">
                              ${subitem.name}
                            </a>
                          `}
                        `).join("")}
                      </div>
                    </div>
                  ` : `
                    <a href="${item.link}" class="menu-item">
                      ${item.name}
                    </a>
                  `}
                </div>
              `).join("")}
            </div>
          `).join("")}
        </div>
      `;
    }

    // Генерация мобильного меню
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu) {
      mobileMenu.innerHTML = `
        <div class="mobile-menu-inner">
          <div class="mobile-menu-content">
            ${menuTree.map(column => `
              <div class="mobile-menu-section">
                <a href="${column.link}" class="mobile-menu-btn">
                  ${column.name} <i class="fas fa-chevron-down"></i>
                </a>
                <div class="mobile-submenu">
                  ${column.children.map(item => `
                    ${item.children.length ? `
                      <button class="mobile-submenu-btn" type="button">
                        ${item.name} <i class="fas fa-chevron-down"></i>
                      </button>
                      <div class="mobile-subsubmenu">
                        ${item.children.map(subitem => `
                          <a href="${subitem.link}" class="mobile-menu-link">
                            ${subitem.name}
                          </a>
                        `).join("")}
                      </div>
                    ` : `
                      <a href="${item.link}" class="mobile-menu-link">
                        ${item.name}
                      </a>
                    `}
                  `).join("")}
                </div>
              </div>
            `).join("")}
          </div>
          <div class="mobile-menu-footer">
            <div class="mobile-contacts">
              <a href="tel:+375447119852"><i class="fas fa-phone"></i> +375 (44) 711-98-52</a>
              <a href="mailto:info@marketplace.by"><i class="fas fa-envelope"></i> info@marketplace.by</a>
              <a href="/contacts"><i class="fas fa-map-marker-alt"></i> Минск</a>
            </div>
            <div class="mobile-social">
              <a href="https://vk.com"><i class="fab fa-vk"></i></a>
              <a href="https://telegram.org"><i class="fab fa-telegram"></i></a>
              <a href="https://instagram.com"><i class="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      `;
    }
  },

  // Генерация верхней панели
  generateTopBar: function() {
    const topBar = document.getElementById('topBar');
    if (topBar) {
      topBar.innerHTML = `
        <div class="container">
          <div class="top-bar-content">
            <div class="contact-info">
              <span><i class="fas fa-phone"></i> +375 (44) 711-98-52</span>
              <span><i class="fas fa-envelope"></i> info@marketplace.by</span>
              <span><i class="fas fa-map-marker-alt"></i> Минск</span>
            </div>
            <div class="top-bar-right">
              <div class="social-links">
                <a href="#"><i class="fab fa-vk"></i></a>
                <a href="https://web.telegram.org/k/#@hatsad"><i class="fab fa-telegram"></i></a>
                <a href="https://www.instagram.com/eflxzieie1/"><i class="fab fa-instagram"></i></a>
              </div>
              <div class="user-actions">
                <a href="auth.html" class="login-btn" id="loginBtn">
                  <i class="fas fa-user"></i><span>Войти</span>
                </a>
                <a href="cart.html" class="cart-btn">
                  <i class="fas fa-shopping-cart"></i><span class="cart-count">0</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },

  // Генерация поисковой строки
  generateSearchBox: function() {
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
      searchBox.innerHTML = `
        <form id="searchForm" class="search-form">
          <input type="text" placeholder="Поиск товаров..." id="searchInput" />
          <button type="submit"><i class="fas fa-search"></i></button>
        </form>
        <div class="search-suggestions" id="searchSuggestions"></div>
      `;
    }
  },

  // Индекс для поиска товаров
  searchIndex: {
    // Наушники
    'xiaomi buds 5 m2341e1': { url: 'headphones.html#xiaomi-buds-5', title: 'Xiaomi Buds 5 M2341E1' },
    'jbl live flex': { url: 'headphones.html#jbl-live-flex', title: 'JBL Live Flex' },
    'samsung galaxy buds 3 pro': { url: 'headphones.html#samsung-buds-3-pro', title: 'Samsung Galaxy Buds 3 Pro' },
    'apple airpods pro 2': { url: 'headphones.html#apple-airpods-pro-2', title: 'Apple AirPods Pro 2' },
    'huawei freebuds 5': { url: 'headphones.html#huawei-freebuds-5', title: 'Huawei FreeBuds 5' },
    'realme buds air 7': { url: 'headphones.html#realme-buds-air-7', title: 'Realme Buds Air 7' },
    'qcy melobuds neo': { url: 'headphones.html#qcy-melobuds-neo', title: 'QCY MeloBuds Neo' },
    'cmf buds pro 2': { url: 'headphones.html#cmf-buds-pro-2', title: 'CMF Buds Pro 2' },
    
    // Накладные наушники
    'marshall major v': { url: 'over-ear-headphones.html#marshall-major-v', title: 'MARSHALL MAJOR V' },
    'sony wh-ch520b': { url: 'over-ear-headphones.html#sony-wh-ch520b', title: 'SONY WH-CH520B' },
    'soundcore life q35': { url: 'over-ear-headphones.html#soundcore-life-q35', title: 'SoundCore Life Q35' },
    'miru cat ep-w10': { url: 'over-ear-headphones.html#miru-cat-ep-w10', title: 'MIRU Cat EP-W10' },
    'logitech g435': { url: 'over-ear-headphones.html#logitech-g435', title: 'Logitech G435' },
    'jbl tune 670nc': { url: 'over-ear-headphones.html#jbl-tune-670nc', title: 'JBL Tune 670NC' },
    'defender freemotion b645': { url: 'over-ear-headphones.html#defender-freemotion-b645', title: 'Defender FreeMotion B645' },
    'apple airpods max': { url: 'over-ear-headphones.html#apple-airpods-max', title: 'Apple Airpods Max' },
    
    // Ноутбуки
    'thunderobot 911 plus se': { url: 'laptops.html#thunderobot-911', title: 'THUNDEROBOT 911 Plus SE' },
    'asus tuf gaming f15': { url: 'laptops.html#asus-tuf-gaming-f15', title: 'ASUS TUF Gaming F15' },
    'machcreator one i3': { url: 'laptops.html#machcreator-one-i3', title: 'Machcreator One i3' },
    'msi stealth a16': { url: 'laptops.html#msi-stealth-a16', title: 'MSI Stealth A16' },
    'msi titan dragon edition 18': { url: 'laptops.html#msi-titan-dragon', title: 'MSI Titan Dragon Edition 18' },
    'apple macbook pro 14': { url: 'laptops.html#apple-macbook-pro-14', title: 'Apple Macbook Pro 14' },
    'apple macbook air 13': { url: 'laptops.html#apple-macbook-air-13', title: 'Apple Macbook Air 13' },
    'lenovo ideapad gaming 3': { url: 'laptops.html#lenovo-ideapad-gaming-3', title: 'Lenovo IdeaPad Gaming 3' },
    
    // Смартфоны
    'apple iphone 13': { url: 'smartphones.html#apple-iphone-13', title: 'Apple iPhone 13' },
    'samsung galaxy s21 fe': { url: 'smartphones.html#samsung-galaxy-s21-fe', title: 'Samsung Galaxy S21 FE' },
    'xiaomi 12 lite': { url: 'smartphones.html#xiaomi-12-lite', title: 'Xiaomi 12 Lite' },
    'realme 9 pro+': { url: 'smartphones.html#realme-9-pro-plus', title: 'Realme 9 Pro+' },
    'oneplus 10 pro': { url: 'smartphones.html#oneplus-10-pro', title: 'OnePlus 10 Pro' },
    'google pixel 6': { url: 'smartphones.html#google-pixel-6', title: 'Google Pixel 6' },
    'huawei p50 pro': { url: 'smartphones.html#huawei-p50-pro', title: 'Huawei P50 Pro' },
    'oppo find x5 pro': { url: 'smartphones.html#oppo-find-x5-pro', title: 'Oppo Find X5 Pro' }
  },

  // Поиск товаров
  searchProducts: function(query) {
    const normalizedQuery = query.toLowerCase().trim();
    const results = [];
    
    // Поиск точных совпадений
    for (const [key, value] of Object.entries(this.searchIndex)) {
      if (key.includes(normalizedQuery) || value.title.toLowerCase().includes(normalizedQuery)) {
        results.push(value);
      }
    }
    
    return results;
  },

  // Обработчик поиска
  handleSearch: function(e) {
    e.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value;
    
    if (query.trim() === '') {
      this.hideSuggestions();
      alert('Пожалуйста, введите поисковый запрос');
      return;
    }
    
    const results = this.searchProducts(query);
    
    if (results.length > 0) {
      // Если найдено точное совпадение - перенаправляем
      if (results.length === 1) {
        window.location.href = results[0].url;
      } else {
        // Показываем подсказки
        this.showSuggestions(results);
      }
    } else {
      // Если ничего не найдено, ищем по категориям
      this.searchByCategory(query);
    }
  },

  // Поиск по категориям
  searchByCategory: function(query) {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (normalizedQuery.includes('наушники') || normalizedQuery.includes('headphones')) {
      if (normalizedQuery.includes('беспроводные') || normalizedQuery.includes('wireless')) {
        window.location.href = 'wireless-headphones.html';
      } else if (normalizedQuery.includes('накладные') || normalizedQuery.includes('over ear')) {
        window.location.href = 'over-ear-headphones.html';
      } else {
        window.location.href = 'headphones.html';
      }
    } else if (normalizedQuery.includes('ноутбук') || normalizedQuery.includes('laptop')) {
      window.location.href = 'laptops.html';
    } else if (normalizedQuery.includes('смартфон') || normalizedQuery.includes('smartphone')) {
      window.location.href = 'smartphones.html';
    } else {
      alert('Товар не найден. Попробуйте изменить запрос.');
    }
  },

  // Показать подсказки
  showSuggestions: function(results) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;
    
    suggestionsContainer.innerHTML = results.map(result => `
      <div class="suggestion-item" data-url="${result.url}">
        ${result.title}
      </div>
    `).join('');
    
    suggestionsContainer.style.display = 'block';
    
    // Добавляем обработчики клика на подсказки
    document.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        window.location.href = item.getAttribute('data-url');
      });
    });
  },

  // Скрыть подсказки
  hideSuggestions: function() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
      suggestionsContainer.style.display = 'none';
    }
  },

  // Генерация основного контента
  generateMainContent: function() {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
      mainContent.innerHTML = `
        <section class="hero-section">
          <div class="container"><div class="hero-content"></div></div>
        </section>
        <section class="promo-section">
          <div class="container">
            <h2 class="section-title">Акции и специальные предложения</h2>
            <div class="promo-cards">
              <div class="promo-card">
                <div class="promo-image" style="background-image: url('https://via.placeholder.com/400x200?text=iPhone+14')"></div>
                <div class="promo-content">
                  <span class="promo-badge">-20%</span>
                  <h3 class="promo-title">Скидка на iPhone 14</h3>
                  <p class="promo-text">Только этой неделю специальное предложение на новейшие смартфоны Apple</p>
                  <a href="#" class="btn btn-primary">Подробнее</a>
                </div>
              </div>
              <div class="promo-card">
                <div class="promo-image" style="background-image: url('https://via.placeholder.com/400x200?text=Ноутбуки')"></div>
                <div class="promo-content">
                  <span class="promo-badge">Рассрочка 0%</span>
                  <h3 class="promo-title">Ноутбуки в рассрочку</h3>
                  <p class="promo-text">Покупайте топовые ноутбуки с рассрочкой платежа на 12 месяцев</p>
                  <a href="#" class="btn btn-primary">Подробнее</a>
                </div>
              </div>
              <div class="promo-card">
                <div class="promo-image" style="background-image: url('https://via.placeholder.com/400x200?text=Бытовая+техника')"></div>
                <div class="promo-content">
                  <span class="promo-badge">Бесплатная доставка</span>
                  <h3 class="promo-title">Техника для дома</h3>
                  <p class="promo-text">Бесплатная доставка по Минску при заказе от 500 руб.</p>
                  <a href="#" class="btn btn-primary">Подробнее</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    }
  },

  // Генерация футера
  generateFooter: function() {
    const footer = document.getElementById('mainFooter');
    if (footer) {
      footer.innerHTML = `
        <div class="container">
          <div class="footer-content">
            <div class="footer-column">
              <h3>О компании</h3>
              <p>MarketPlace - это современный интернет-магазин с широким ассортиментом товаров по доступным ценам.</p>
              <div class="footer-social">
                <a href="#"><i class="fab fa-vk"></i></a>
                <a href="https://web.telegram.org/k/#@hatsad"><i class="fab fa-telegram"></i></a>
                <a href="https://www.instagram.com/eflxzieie1/"><i class="fab fa-instagram"></i></a>
              </div>
            </div>
            <div class="footer-column">
              <h3>Контакты</h3>
              <p><i class="fas fa-map-marker-alt"></i> г. Минск, пр. Независимости, 58</p>
              <p><i class="fas fa-phone"></i> +375 (44) 711-98-52</p>
              <p><i class="fas fa-envelope"></i> info@marketplace.by</p>
              <p><i class="fas fa-clock"></i> Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00</p>
            </div>
            <div class="footer-column">
              <h3>Полезные ссылки</h3>
              <a href="about.html">О нас</a>
              <a href="delivery.html">Доставка и оплата</a>
              <a href="warranty.html">Гарантия</a>
              <a href="blog.html">Блог</a>
              <a href="contacts.html">Контакты</a>
            </div>
            <div class="footer-column">
              <h3>Подписка</h3>
              <p>Подпишитесь на наши новости и акции:</p>
              <form class="subscribe-form">
                <input type="email" placeholder="Ваш email" required>
                <button type="submit" class="btn btn-primary">Подписаться</button>
              </form>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2025 MarketPlace. Все права защищены.</p>
          </div>
        </div>
      `;
    }
  },

  // Генерация страницы корзины
  generateCartPage: function() {
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;
    
    this.cart.loadFromLocalStorage();
    
    if (this.cart.items.length === 0) {
      cartContent.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <h3>Ваша корзина пуста</h3>
          <p>Перейдите в каталог, чтобы добавить товары</p>
          <a href="index.html" class="btn btn-primary">В каталог</a>
        </div>
      `;
      return;
    }
    
    cartContent.innerHTML = `
      <div class="cart-container">
        <div class="cart-items">
          <h2>Ваша корзина</h2>
          ${this.cart.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
              <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
              </div>
              <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <div class="cart-item-price">${item.price.toFixed(2)} руб.</div>
                <div class="cart-item-actions">
                  <div class="quantity-selector">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                    <button class="quantity-btn plus">+</button>
                  </div>
                  <button class="btn btn-danger remove-btn">Удалить</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="cart-summary">
          <div class="summary-card">
            <h3>Итого</h3>
            <div class="summary-row">
              <span>Товары (${this.cart.items.reduce((sum, item) => sum + item.quantity, 0)})</span>
              <span>${this.cart.getTotal().toFixed(2)} руб.</span>
            </div>
            <div class="summary-row total">
              <span>Общая сумма</span>
              <span>${this.cart.getTotal().toFixed(2)} руб.</span>
            </div>
            <button class="btn btn-primary checkout-btn">Оформить заказ</button>
          </div>
        </div>
      </div>
    `;
    
    // Обработчики для корзины
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.target.closest('.cart-item').getAttribute('data-id');
        this.cart.removeItem(itemId);
        this.generateCartPage();
      });
    });
    
    document.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const input = e.target.closest('.quantity-selector').querySelector('.quantity-input');
        let value = parseInt(input.value);
        
        if (e.target.classList.contains('plus')) {
          value += 1;
        } else if (e.target.classList.contains('minus') && value > 1) {
          value -= 1;
        }
        
        input.value = value;
        const itemId = e.target.closest('.cart-item').getAttribute('data-id');
        this.cart.updateQuantity(itemId, value);
        this.generateCartPage();
      });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const value = parseInt(e.target.value);
        if (value < 1) {
          e.target.value = 1;
          return;
        }
        const itemId = e.target.closest('.cart-item').getAttribute('data-id');
        this.cart.updateQuantity(itemId, value);
        this.generateCartPage();
      });
    });
    
    document.querySelector('.checkout-btn')?.addEventListener('click', () => {
      alert('Заказ оформлен! Спасибо за покупку!');
      this.cart.clearCart();
      this.generateCartPage();
    });
  },

  // Обработчики событий
  setupEventHandlers: function() {
    // Обработчик формы поиска
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => this.handleSearch(e));
    }
    
    // Обработчик ввода в поле поиска
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
          const results = this.searchProducts(query);
          this.showSuggestions(results);
        } else {
          this.hideSuggestions();
        }
      });
      
      // Скрывать подсказки при клике вне поля поиска
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-form') && !e.target.closest('.search-suggestions')) {
          this.hideSuggestions();
        }
      });
    }
    
    // Обработчик для кнопок "В корзину"
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-primary') && e.target.textContent.includes('В корзину')) {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
          const product = {
            id: productCard.id,
            title: productCard.querySelector('.product-title').textContent,
            price: parseFloat(productCard.querySelector('.product-price').textContent.replace(' руб.', '').replace(',', '.')),
            image: productCard.querySelector('.product-image img').src
          };
          this.cart.addItem(product);
          alert('Товар добавлен в корзину!');
        }
      }
    });
    
    // Десктопное меню
    document.querySelectorAll('.menu-item-btn, .submenu-item-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.toggle('active');
        const dropdown = this.nextElementSibling;
        if (dropdown) {
          dropdown.style.display = this.classList.contains('active') ? 'block' : 'none';
        }
      });
    });
    
    // Мобильное меню
    document.querySelectorAll('.mobile-submenu-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.toggle('active');
        const icon = this.querySelector('i');
        if (icon) {
          icon.style.transform = this.classList.contains('active') ? 'rotate(180deg)' : '';
        }
        const next = this.nextElementSibling;
        if (next) next.classList.toggle('active');
      });
    });
    
    // Бургер меню
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (burgerBtn && mobileMenu) {
      burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      });
    }
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#mainNav') && !e.target.closest('#burgerBtn')) {
        document.querySelectorAll('.menu-item-btn.active, .submenu-item-btn.active').forEach(btn => {
          btn.classList.remove('active');
          const dropdown = btn.nextElementSibling;
          if (dropdown) dropdown.style.display = 'none';
        });
      }
    });
    
    // Обработчик для заглушек ссылок
    document.addEventListener('click', (e) => {
      if (e.target.closest('a[href="#"]')) {
        e.preventDefault();
        alert('Ссылка работает! В реальном проекте здесь будет переход на страницу.');
      }
    });
  },

  // Инициализация приложения
  init: function() {
    document.addEventListener("DOMContentLoaded", () => {
      this.generateMenu();
      this.generateTopBar();
      this.generateSearchBox();
      this.generateMainContent();
      this.generateFooter();
      this.setupEventHandlers();
      
      // Загружаем корзину при инициализации
      this.cart.loadFromLocalStorage();
      
      // Генерируем страницу корзины, если мы на ней
      if (window.location.pathname.includes('cart.html')) {
        this.generateCartPage();
      }
    });
  }
};

// Запуск приложения
app.init();