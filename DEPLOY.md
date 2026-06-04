# 🚀 Инструкция по деплою изменений Фазы 1

## Быстрый старт

### 1. Проверка перед деплоем
```bash
# Убедитесь, что TypeScript компилируется
npx tsc --noEmit

# Проверьте, что все зависимости установлены
npm install
```

### 2. Подготовка переменных окружения

**На Vercel** (или другом хостинге):
1. Перейдите в настройки проекта → Environment Variables
2. Добавьте все переменные из `.env.example`
3. Для `NEXTAUTH_SECRET` используйте:
   ```bash
   openssl rand -base64 32
   ```

### 3. Деплой на Vercel

```bash
# Коммит изменений
git add .
git commit -m "feat: Phase 1 - Security, SEO, and Performance improvements

- Add rate limiting (3 req/hr contact, 5 req/hr login)
- Add sitemap.xml and robots.txt for SEO
- Enable ISR with 1-hour revalidation
- Optimize images (AVIF/WebP) and packages
- Add .env.example for developers"

# Пуш в репозиторий
git push origin main

# Vercel автоматически задеплоит изменения
```

### 4. Проверка после деплоя

```bash
# Замените YOUR-DOMAIN на ваш домен

# 1. Sitemap работает?
curl https://YOUR-DOMAIN/sitemap.xml

# 2. Robots.txt работает?
curl https://YOUR-DOMAIN/robots.txt

# 3. Rate limiting работает? (должен вернуть 429 на 4-м запросе)
for i in {1..4}; do
  echo "Request #$i"
  curl -X POST https://YOUR-DOMAIN/api/contact \
    -H "Content-Type: application/json" \
    -d '{"telegram":"@test","email":"test@test.com"}' \
    -w "\nStatus: %{http_code}\n\n"
done
```

### 5. Google Search Console

После деплоя добавьте sitemap:
1. Откройте [Google Search Console](https://search.google.com/search-console)
2. Выберите ваш сайт
3. Sitemaps → Add a new sitemap
4. Введите: `https://YOUR-DOMAIN/sitemap.xml`
5. Submit

---

## Ручной деплой (без Git)

```bash
# Установите Vercel CLI (если еще нет)
npm i -g vercel

# Логин в Vercel
vercel login

# Деплой
vercel --prod
```

---

## Rollback (если что-то пошло не так)

На Vercel:
1. Перейдите в Deployments
2. Найдите предыдущий рабочий деплой
3. Нажмите "..." → Promote to Production

Или через CLI:
```bash
vercel rollback
```

---

## Что проверить в production:

- ✅ Главная страница загружается быстро (~50-150ms TTFB)
- ✅ Sitemap доступен по `/sitemap.xml`
- ✅ Robots.txt доступен по `/robots.txt`
- ✅ Rate limiting работает (4-й запрос возвращает 429)
- ✅ Изображения проектов в формате AVIF/WebP (DevTools → Network)
- ✅ Админка работает без ошибок
- ✅ Форма контактов отправляется корректно

---

## Troubleshooting

### "DATABASE_URL is not set"
**Решение**: Добавьте `DATABASE_URL` в Environment Variables на Vercel

### Rate limiting не работает в local dev
**Решение**: Это нормально для hot-reload. Перезапустите сервер.

### Sitemap пустой
**Решение**: Проверьте, что проекты с `visible: true` есть в БД

### 500 ошибка после деплоя
**Решение**:
1. Проверьте Vercel Logs
2. Убедитесь, что все env variables установлены
3. Проверьте, что БД доступна

---

## Поддержка

Если возникли проблемы, проверьте:
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)

Или откройте Issue в репозитории.
