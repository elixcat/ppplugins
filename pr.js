export default {
    async fetch(request) {
        // Отримуємо URL для запиту з параметра 'url'
        const url = new URL(request.url);
        const target = url.searchParams.get('url');
        if (!target) {
            return new Response('Missing url param', { status: 400 });
        }

        // Виконуємо запит до оригінального API
        const response = await fetch(target, {
            headers: {
                'Origin': 'https://elixcat.github.io' // Ваш домен
            }
        });

        // Копіюємо відповідь і додаємо CORS-заголовки
        const newHeaders = new Headers(response.headers);
        newHeaders.set('Access-Control-Allow-Origin', '*');

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
        });
    }
};
