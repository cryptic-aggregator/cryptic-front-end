export const profile = {
  title: "Профіль користувача",
  info: "Інформація",
  update: "Оновити профіль",
  login: "Логін",
  placeholderLogin: "Введіть ваш логін",
  email: "Електронна пошта",
  placeholderEmail: "Введіть вашу електронну пошту",
  patternEmail: "Неправильна електронна адреса",

  twoFA: {
    topic: "Двофакторна автентифікація",
    first: "1. Для завершення цього процесу потрібен додаток автентифікатора, наприклад Google Authenticator",
    second: "2. Скануйте QR-код за допомогою вашого автентифікатора",
    secondText: "Якщо ви не можете сканувати код, ви можете вручну ввести цей секретний ключ у ваш автентифікатор.",
    third: "3. Після сканування QR-коду введіть шестизначний код, згенерований автентифікатором.",
    verify: "Підтвердити",
    loading: "Завантаження QR...",
    toast: {
      successConnection: "Двофакторну автентифікацію успішно підключено",
      successCopy: "Скопійовано в буфер обміну",
      errorConnection: "Не вдалося підключити двофакторну автентифікацію",
    }
  },

  twoFADisable: {
    topic: "Двофакторна автентифікація",
    passwordTopic: "Пароль",
    first: "1. Щоб вимкнути 2FA, введіть свій пароль і шестизначний код з додатку Google Authenticator нижче, а потім натисніть «Вимкнути».",
    placeholderPassword: "Введіть ваш пароль",
    FATopic: "Код 2FA",
    placeholderFA: "Введіть код 2FA",
    required: "Це обов'язкове поле.",
    disable: "Вимкнути",
    toast: {
      successDisabling: "Двофакторну автентифікацію успішно вимкнено",
    }
  },

  changePassword: {
    topic: "Зміна пароля",
    oldPasswordTopic: "Старий пароль",
    placeholderOldPassword: "Введіть ваш старий пароль",
    FATopic: "Код 2FA",
    placeholderFA: "Введіть код 2FA",
    newPasswordTopic: "Новий пароль",
    placeholderNewPassword: "Введіть новий пароль",
    patternNewPassword: "Мінімальна довжина — 6 символів.",
    confirmNewPassword: "Підтвердження нового пароля",
    patternConfirmPassword: "Паролі не співпадають.",
    placeholderConfirmPassword: "Повторіть новий пароль",
    required: "Це обов'язкове поле.",
    save: "Зберегти",
  },
  premium: {
    title: "Оновіть до Преміум",
    subtitle: "Відкрийте розширені функції та підніміть свій крипто-досвід на новий рівень",
    features: {
      analyticsTitle: "Розширена аналітика",
      analyticsDescription: "Отримуйте детальні звіти та метрики продуктивності",
      notificationsTitle: "Push-повідомлення",
      notificationsDescription: "Сповіщення в реальному часі про зміни цін та оновлення",
      walletsTitle: "Необмежена кількість гаманців",
      walletsDescription: "Підключайте необмежену кількість гаманців та портфелів"
    },
    guarantee: "Скасування в будь-який момент • Гарантія повернення грошей протягом 30 днів",
    activateButton: "Активувати Преміум",
    activating: "Активується Преміум..."
  }
};
