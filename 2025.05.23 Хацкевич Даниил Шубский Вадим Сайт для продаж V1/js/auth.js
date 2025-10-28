// Ожидаем полной загрузки DOM перед выполнением скриптов
document.addEventListener('DOMContentLoaded', function() {
    // ========== Переключение видимости пароля ==========
    const togglePassword = document.getElementById('togglePassword'); // Кнопка показа пароля для входа
    const passwordInput = document.getElementById('password'); // Поле ввода пароля для входа
    
    const toggleRegPassword = document.getElementById('toggleRegPassword'); // Кнопка показа пароля для регистрации
    const regPasswordInput = document.getElementById('regPassword'); // Поле ввода пароля для регистрации
    
    // Обработчик для кнопки показа пароля в форме входа
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            // Переключаем тип поля между password и text
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type); // Устанавливаем новый тип
            // Меняем иконку глаза в зависимости от состояния
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // Обработчик для кнопки показа пароля в форме регистрации
    if (toggleRegPassword && regPasswordInput) {
        toggleRegPassword.addEventListener('click', function() {
            // Аналогичная логика для формы регистрации
            const type = regPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            regPasswordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // ========== Переключение между формами входа и регистрации ==========
    const switchToRegister = document.getElementById('switchToRegister'); // Ссылка "Зарегистрироваться"
    const switchToLogin = document.getElementById('switchToLogin'); // Ссылка "Войти"
    const loginForm = document.getElementById('loginForm'); // Форма входа
    const registerForm = document.getElementById('registerForm'); // Форма регистрации
    
    if (switchToRegister && switchToLogin) {
        // Обработчик перехода к форме регистрации
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault(); // Отменяем стандартное поведение ссылки
            loginForm.style.display = 'none'; // Скрываем форму входа
            registerForm.style.display = 'block'; // Показываем форму регистрации
        });
        
        // Обработчик перехода к форме входа
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault(); // Отменяем стандартное поведение ссылки
            registerForm.style.display = 'none'; // Скрываем форму регистрации
            loginForm.style.display = 'block'; // Показываем форму входа
        });
    }
    
    // ========== Валидация формы входа ==========
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Отменяем стандартную отправку формы
            
            // Получаем значения полей
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Простая валидация - проверка на заполненность полей
            if (!email || !password) {
                alert('Пожалуйста, заполните все поля');
                return; // Прерываем выполнение если валидация не пройдена
            }
            
            // В реальном приложении здесь был бы запрос к серверу
            console.log('Попытка входа:', { email, password });
            
            // Имитация успешной авторизации с задержкой
            setTimeout(() => {
                alert('Вы успешно вошли в систему!');
                // Перенаправление на главную страницу
                window.location.href = "index.html";
            }, 1000);
        });
    }
    
    // ========== Валидация формы регистрации ==========
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Отменяем стандартную отправку формы
            
            // Получаем значения всех полей формы
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            const agreeTerms = document.querySelector('input[name="agree"]').checked; // Состояние чекбокса
            
            // Проверка заполненности всех полей
            if (!name || !email || !password || !confirmPassword) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            
            // Проверка минимальной длины пароля
            if (password.length < 8) {
                alert('Пароль должен содержать минимум 8 символов');
                return;
            }
            
            // Проверка совпадения паролей
            if (password !== confirmPassword) {
                alert('Пароли не совпадают');
                return;
            }
            
            // Проверка согласия с условиями
            if (!agreeTerms) {
                alert('Необходимо согласиться с условиями использования');
                return;
            }
            
            // В реальном приложении здесь был бы запрос к серверу
            console.log('Попытка регистрации:', { name, email, password });
            
            // Имитация успешной регистрации с задержкой
            setTimeout(() => {
                alert('Регистрация прошла успешно! Теперь вы можете войти.');
                // Переключаем на форму входа
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
                registerForm.reset(); // Сбрасываем значения формы
            }, 1000);
        });
    }
    
    // ========== Обработка социальных кнопок ==========
    const socialButtons = document.querySelectorAll('.btn-social'); // Все социальные кнопки
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Определяем социальную сеть по классу кнопки
            const socialNetwork = this.classList.contains('google') ? 'Google' : 'ВКонтакте';
            // В реальном приложении здесь была бы интеграция с OAuth API
            alert(`Вы выбрали вход через ${socialNetwork}. В реальном приложении здесь была бы интеграция с API.`);
        });
    });
});