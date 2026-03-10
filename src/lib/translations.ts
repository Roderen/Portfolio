export type Locale = "en" | "ru" | "uk" | "de";

export const translations = {
  en: {
    nav: {
      about: "About",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      greeting: "Hi, I'm",
      role: "Full-Stack Web Developer",
      subtitle: "I build modern, fast, and beautiful websites for businesses",
      cta_projects: "View Projects",
      cta_contact: "Get in Touch",
    },
    about: {
      title: "About Me",
      badge: "Developer",
    },
    projects: {
      title: "My Projects",
      subtitle: "A selection of my recent work",
      view: "View Project",
      no_projects: "Projects coming soon",
    },
    contact: {
      title: "Get in Touch",
      subtitle: "Have a project in mind? Let's talk.",
      name: "Your Name",
      email: "Your Email",
      message: "Your Message",
      send: "Send Message",
      sending: "Sending...",
      success: "Message sent! I'll get back to you soon.",
      error: "Something went wrong. Please try again.",
    },
    footer: {
      rights: "All rights reserved.",
    },
  },
  ru: {
    nav: {
      about: "Обо мне",
      projects: "Проекты",
      contact: "Контакт",
    },
    hero: {
      greeting: "Привет, я",
      role: "Full-Stack веб-разработчик",
      subtitle: "Создаю современные, быстрые и красивые сайты для бизнеса",
      cta_projects: "Смотреть проекты",
      cta_contact: "Связаться",
    },
    about: {
      title: "Обо мне",
      badge: "Разработчик",
    },
    projects: {
      title: "Мои проекты",
      subtitle: "Подборка моих последних работ",
      view: "Смотреть проект",
      no_projects: "Проекты скоро появятся",
    },
    contact: {
      title: "Связаться со мной",
      subtitle: "Есть проект? Давайте обсудим.",
      name: "Ваше имя",
      email: "Ваш email",
      message: "Ваше сообщение",
      send: "Отправить",
      sending: "Отправка...",
      success: "Сообщение отправлено! Я свяжусь с вами в ближайшее время.",
      error: "Что-то пошло не так. Попробуйте ещё раз.",
    },
    footer: {
      rights: "Все права защищены.",
    },
  },
  uk: {
    nav: {
      about: "Про мене",
      projects: "Проєкти",
      contact: "Контакт",
    },
    hero: {
      greeting: "Привіт, я",
      role: "Full-Stack веб-розробник",
      subtitle: "Створюю сучасні, швидкі та красиві сайти для бізнесу",
      cta_projects: "Дивитися проєкти",
      cta_contact: "Зв'язатися",
    },
    about: {
      title: "Про мене",
      badge: "Розробник",
    },
    projects: {
      title: "Мої проєкти",
      subtitle: "Вибірка моїх останніх робіт",
      view: "Переглянути проєкт",
      no_projects: "Проєкти з'являться незабаром",
    },
    contact: {
      title: "Зв'яжіться зі мною",
      subtitle: "Є проєкт? Давайте обговоримо.",
      name: "Ваше ім'я",
      email: "Ваш email",
      message: "Ваше повідомлення",
      send: "Надіслати",
      sending: "Надсилання...",
      success: "Повідомлення надіслано! Я зв'яжусь з вами найближчим часом.",
      error: "Щось пішло не так. Спробуйте ще раз.",
    },
    footer: {
      rights: "Всі права захищені.",
    },
  },
  de: {
    nav: {
      about: "Über mich",
      projects: "Projekte",
      contact: "Kontakt",
    },
    hero: {
      greeting: "Hallo, ich bin",
      role: "Full-Stack Webentwickler",
      subtitle: "Ich erstelle moderne, schnelle und ansprechende Websites für Unternehmen",
      cta_projects: "Projekte ansehen",
      cta_contact: "Kontakt aufnehmen",
    },
    about: {
      title: "Über mich",
      badge: "Entwickler",
    },
    projects: {
      title: "Meine Projekte",
      subtitle: "Eine Auswahl meiner aktuellen Arbeiten",
      view: "Projekt ansehen",
      no_projects: "Projekte folgen bald",
    },
    contact: {
      title: "Kontakt aufnehmen",
      subtitle: "Haben Sie ein Projekt? Lassen Sie uns sprechen.",
      name: "Ihr Name",
      email: "Ihre E-Mail",
      message: "Ihre Nachricht",
      send: "Nachricht senden",
      sending: "Wird gesendet...",
      success: "Nachricht gesendet! Ich melde mich bald bei Ihnen.",
      error: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    },
    footer: {
      rights: "Alle Rechte vorbehalten.",
    },
  },
};

export type TranslationKeys = (typeof translations)["en"];
