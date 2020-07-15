self.addEventListener('install', async (event) => {
	const cache = await caches.open('dice');
	const cached = cache.addAll([
		'/',
		'/dice-180w.png',
		'/dice-192w.png',
		'/dice.css',
		'/dice.js',
		'/dice.svg',
		'/index.html',
		'/manifest.webmanifest',
		// Don't cache the audio, because they return 206 responses
		// which can't be cached
		// '/roll.mp3',
		// '/roll.ogg',
		// '/roll.wav',
	]);
	event.waitUntil(cached);
});

self.addEventListener('fetch', async (event) => {
	console.log("request for", event.request.url);
	const response = await caches.match(event.request);
	event.respondWith(response || fetch(event.request));
});
