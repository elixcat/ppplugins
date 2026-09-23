(function () {
	'use strict';

	// ============================================================
	// КОНСТАНТИ
	// ============================================================

	const API_BASE = 'https://kinopoiskapiunofficial.tech/';
	const API_KEY = '7bac784b-ea8f-45b3-8e1f-b099ca4d7b6b';
	const RATING_BASE = 'https://rating.kinopoisk.ru/';
	const CACHE_KEY = 'kp_rating';
	const CACHE_TIME = 60 * 60 * 24 * 1000; // 24 години

	// ============================================================
	// ФЕЙКОВІ АНТИДЕБАГ-ФУНКЦІЇ
	// (в оригіналі вони є, але нічого корисного не роблять —
	// лише підмінюють console і самі себе перевіряють)
	// ============================================================

	const _0x56b872 = (function () {
		let first = true;
		return function (ctx, fn) {
			const wrapper = first
				? function () {
					if (fn) {
						const result = fn.apply(ctx, arguments);
						fn = null;
						return result;
					}
				}
				: function () {};
			first = false;
			return wrapper;
		};
	})();

	const _0x2d4be9 = (function () {
		let first = true;
		return function (ctx, fn) {
			const wrapper = first
				? function () {
					if (fn) {
						const result = fn.apply(ctx, arguments);
						fn = null;
						return result;
					}
				}
				: function () {};
			first = false;
			return wrapper;
		};
	})();

	// ============================================================
	// УТИЛІТИ ДЛЯ РОБОТИ З РЯДКАМИ
	// ============================================================

	function normalizeString(str) {
		return str
			.replace(/[\s.,:;’'`!?]+/g, ' ')
			.trim();
	}

	function cleanTitle(str) {
		return normalizeString(str)
			.replace(/^[ \/\\]+/, '')
			.replace(/[ \/\\]+$/, '')
			.replace(/\+( *[+\/\\])+/g, '+')
			.replace(/([+\/\\] *)+\+/g, '+')
			.replace(/( *[\/\\]+ *)+/g, '+');
	}

	function normalizeForCompare(str) {
		return normalizeString(
			str.toLowerCase()
				.replace(/[\-\u2010-\u2015\u2E3A\u2E3B\uFE58\uFE63\uFF0D]+/g, '-')
				.replace(/ё/g, 'е')
		);
	}

	function titleEquals(a, b) {
		return typeof a === 'string' &&
			typeof b === 'string' &&
			normalizeForCompare(a) === normalizeForCompare(b);
	}

	function titleIncludes(a, b) {
		return typeof a === 'string' &&
			typeof b === 'string' &&
			normalizeForCompare(a).indexOf(normalizeForCompare(b)) !== -1;
	}

	// ============================================================
	// КЕШ
	// ============================================================

	function getCachedRating(id) {
		const now = Date.now();
		const cache = Lampa.Storage.get(CACHE_KEY, 500, {});

		if (cache[id]) {
			if (now - cache[id].timestamp > CACHE_TIME) {
				delete cache[id];
				Lampa.Storage.set(CACHE_KEY, cache);
				return false;
			}
		} else {
			return false;
		}
		return cache;
	}

	function saveRatingToCache(id, data) {
		const now = Date.now();
		const cache = Lampa.Storage.get(CACHE_KEY, 500, {});

		if (!cache[id]) {
			cache[id] = data;
			Lampa.Storage.set(CACHE_KEY, cache);
		} else {
			if (now - cache[id].timestamp > CACHE_TIME) {
				data.timestamp = now;
				cache[id] = data;
				Lampa.Storage.set(CACHE_KEY, cache);
			} else {
				data = cache[id];
			}
		}
		return data;
	}

	// ============================================================
	// ПОВІДОМЛЕННЯ
	// ============================================================

	function notifyError(message) {
		Lampa.Noty.show('Рейтинг KP: ' + message);
	}

	// ============================================================
	// РЕНДЕР РЕЙТИНГІВ У КАРТЦІ
	// ============================================================

	function renderRating(data) {
		if (!data) return;

		const kp = (!isNaN(data.kp) && data.kp !== null)
			? parseFloat(data.kp).toFixed(1)
			: '0.0';

		const imdb = (!isNaN(data.imdb) && data.imdb !== null)
			? parseFloat(data.imdb).toFixed(1)
			: '0.0';

		const html = Lampa.Activity.active().activity.render();
		const $root = $(html);

		$root.find('.wait_rating').remove();

		$root.find('.rate--imdb')
			.removeClass('hide')
			.find('.rate__value')
			.eq(0)
			.text(imdb);

		$root.find('.rate--kp')
			.removeClass('hide')
			.find('.rate__value')
			.eq(0)
			.text(kp);
	}

	// ============================================================
	// ОСНОВНА ЛОГІКА ПОШУКУ ФІЛЬМУ ТА РЕЙТИНГУ
	// ============================================================

	function findFilmRating(movie) {
		const request = new Lampa.Reguest();

		const cleanName = cleanTitle(movie.title);

		const rawYear = movie.year ||
			movie.release_date ||
			movie.first_air_date ||
			'0000';

		const year = parseInt((rawYear + '').slice(0, 4));
		const originalName = movie.original_title || movie.original_name;

		const config = {
			id: movie.id,
			url: API_BASE + 'api/v2.2/films/',
			rating_url: RATING_BASE,
			headers: { 'X-API-KEY': API_KEY },
			cache_time: CACHE_TIME
		};

		// --- крок 1: перевірка кешу ---
		function checkCacheOrLoad() {
			const cached = getCachedRating(config.id);
			if (cached) {
				renderRating(cached[config.id]);
			} else {
				loadFromApi();
			}
		}

		// --- крок 2: запит до API ---
		function loadFromApi() {
			let url = config.url;

			const searchUrl = Lampa.Utils.addUrlComponent(
				url + 'api/v2.1/films/search-by-keyword',
				'keyword=' + encodeURIComponent(cleanName)
			);

			if (movie.imdb_id) {
				url = Lampa.Utils.addUrlComponent(
					url + 'api/v2.2/films',
					'imdbId=' + encodeURIComponent(movie.imdb_id)
				);
			} else {
				url = searchUrl;
			}

			request.clear();
			request.timeout(15000);

			request.silent(
				url,
				function (json) {
					if (json.items && json.items.length) {
						processItems(json.items);
					} else if (json.films && json.films.length) {
						processItems(json.films);
					} else {
						if (url !== searchUrl) {
							// повторний запит — вже по назві
							request.clear();
							request.timeout(15000);
							request.silent(
								searchUrl,
								function (retry) {
									if (retry.items && retry.items.length) {
										processItems(retry.items);
									} else if (retry.films && retry.films.length) {
										processItems(retry.films);
									} else {
										processItems([]);
									}
								},
								function (a, b) {
									notifyError(request.errorDecode(a, b));
								},
								false,
								{ headers: config.headers }
							);
						} else {
							processItems([]);
						}
					}
				},
				function (a, b) {
					notifyError(request.errorDecode(a, b));
				},
				false,
				{ headers: config.headers }
			);
		}

		// --- крок 3: фільтрація знайдених елементів ---
		function processItems(items) {
			if (!items || !items.length) {
				return renderRating(saveRatingToCache(config.id, {
					kp: 0,
					imdb: 0,
					timestamp: Date.now()
				}));
			}

			let matched = false;
			let byImdb = false;

			// додаємо tmp_year кожному елементу
			items.forEach(function (item) {
				const date = item.start_date ||
					item.release_date ||
					'0000';
				item.tmp_year = parseInt((date + '').slice(0, 4));
			});

			// спочатку шукаємо точний збіг по imdb_id
			if (movie.imdb_id) {
				const byImdbList = items.filter(function (item) {
					return (item.imdb_id || item.imdbId) === movie.imdb_id;
				});
				if (byImdbList.length) {
					items = byImdbList;
					matched = true;
					byImdb = true;
				}
			}

			let list = items;

			if (list.length) {
				// фільтр по оригінальній назві
				if (originalName) {
					const byOriginal = list.filter(function (item) {
						return titleIncludes(item.nameOriginal || item.orig_title, originalName) ||
							titleIncludes(item.nameEn || item.en_title, originalName) ||
							titleIncludes(item.title || item.ru_title || item.nameRu, originalName);
					});
					if (byOriginal.length) {
						list = byOriginal;
						matched = true;
					}
				}

				// фільтр по локалізованій назві
				if (movie.title) {
					const byTitle = list.filter(function (item) {
						return titleIncludes(item.title || item.ru_title || item.nameRu, movie.title) ||
							titleIncludes(item.en_title || item.nameEn, movie.title) ||
							titleIncludes(item.nameOriginal || item.orig_title, movie.title);
					});
					if (byTitle.length) {
						list = byTitle;
						matched = true;
					}
				}

				// фільтр по року
				if (list.length > 1 && year) {
					let byYear = list.filter(function (item) {
						return item.year === year;
					});
					if (!byYear.length) {
						byYear = list.filter(function (item) {
							return item.year &&
								item.tmp_year > year - 2 &&
								item.tmp_year < year + 2;
						});
					}
					if (byYear.length) list = byYear;
				}
			}

			// додаткова перевірка, якщо лишився 1 елемент
			if (list.length === 1 && matched && !byImdb) {
				if (year && list[0].tmp_year) {
					matched = list[0].tmp_year > year - 2 &&
						list[0].tmp_year < year + 2;
				}
				if (matched) {
					matched = false;
					if (originalName) {
						matched |= titleEquals(list[0].nameOriginal || list[0].orig_title, originalName) ||
							titleEquals(list[0].nameEn || list[0].en_title, originalName) ||
							titleEquals(list[0].title || list[0].ru_title || list[0].nameRu, originalName);
					}
					if (movie.title) {
						matched |= titleEquals(list[0].title || list[0].ru_title || list[0].nameRu, movie.title) ||
							titleEquals(list[0].en_title || list[0].nameEn, movie.title) ||
							titleEquals(list[0].nameOriginal || list[0].orig_title, movie.title);
					}
				}
			}

			// --- крок 4: отримання рейтингів ---
			if (list.length === 1 && matched) {
				const kpId = list[0].filmId ||
					list[0].kinopoiskId ||
					list[0].kinopoisk_id ||
					list[0].kp_id;

				// запасний варіант — через API v2.2
				const loadViaApi = function () {
					request.clear();
					request.timeout(15000);
					request.silent(
						config.rating_url.replace(RATING_BASE, API_BASE) +
							'api/v2.2/films/' + kpId,
						function (json) {
							const data = saveRatingToCache(config.id, {
								kp: json.ratingKinopoisk,
								imdb: json.ratingImdb,
								timestamp: Date.now()
							});
							renderRating(data);
						},
						function (a, b) {
							notifyError(request.errorDecode(a, b));
						},
						false,
						{ headers: config.headers }
					);
				};

				// спочатку пробуємо XML з rating.kinopoisk.ru
				request.clear();
				request.timeout(5000);
				request.silent(
					config.rating_url + kpId + '.xml',
					function (xml) {
						if (xml.indexOf('<rating>') >= 0) {
							try {
								let kp = 0;
								let imdb = 0;

								const $xml = $($.parseXML(xml));

								const $kp = $xml.find('kp_rating');
								if ($kp.length) kp = parseFloat($kp.text());

								const $imdb = $xml.find('imdb_rating');
								if ($imdb.length) imdb = parseFloat($imdb.text());

								const data = saveRatingToCache(config.id, {
									kp: kp,
									imdb: imdb,
									timestamp: Date.now()
								});
								return renderRating(data);
							} catch (e) {
								// ігноруємо помилку парсингу
							}
						}
						loadViaApi();
					},
					function () {
						loadViaApi();
					},
					false,
					{ dataType: 'text' }
				);
			} else {
				renderRating(saveRatingToCache(config.id, {
					kp: 0,
					imdb: 0,
					timestamp: Date.now()
				}));
			}
		}

		checkCacheOrLoad();
	}

	// ============================================================
	// ІНІЦІАЛІЗАЦІЯ ПЛАГІНА
	// ============================================================

	function initPlugin() {
		// антидебаг-заглушки (як в оригіналі)
		(function () {
			const check = _0x56b872(this, function () {
				return check.toString()
					.search('(((.+)+)+)+$')
					.toString()
					.constructor(check)
					.search('(((.+)+)+)+$');
			});
			check();
		})();

		(function () {
			const check = _0x2d4be9(this, function () {
				let global;
				try {
					const fn = Function('return (function() {}.constructor("return this")( );');
					global = fn();
				} catch (e) {
					global = window;
				}

				const consoleObj = global.console = global.console || {};
				const methods = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace'];

				for (let i = 0; i < methods.length; i++) {
					const wrapper = _0x2d4be9.constructor.prototype.bind(_0x2d4be9);
					const name = methods[i];
					const original = consoleObj[name] || wrapper;
					wrapper.__proto__ = _0x2d4be9.bind(_0x2d4be9);
					wrapper.toString = original.toString.bind(original);
					consoleObj[name] = wrapper;
				}
			});
			check();
		})();

		// перевірка на повторний запуск
		window.rating_plugin = true;

		// слухаємо відкриття картки
		Lampa.Listener.follow('activity', function (e) {
			if (e.type === 'movie') {
				const html = e.activity.render();
				const $root = $(html);

				const isHidden = $root.hasClass('hide');
				const hasWait = $root.find('.wait_rating').length;

				if (isHidden || hasWait) return;

				// вставляємо спінер
				$root.find('.info__rate').after(
					'<div style="width:2em;margin-top:1em;margin-right:1em" class="wait_rating">' +
					'<div class="broadcast__scan"><div></div></div>' +
					'<div>'
				);

				// запускаємо пошук рейтингу
				findFilmRating(e.data.movie);
			}
		});
	}

	if (!window.rating_plugin) initPlugin();
})();
