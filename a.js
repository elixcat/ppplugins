(function() {
	'use strict';

	(function() {
		var _guard1 = (function() {
			var _initial = true;
			return function(_ctx, _fn) {
				var _wrapped = _initial ? function() {
					if (_fn) {
						var _result = _fn.apply(_ctx, arguments);
						return _fn = null, _result;
					}
				} : function() {};
				return _initial = false, _wrapped;
			};
		}());
		var _guard2 = (function() {
			var _initial = true;
			return function(_ctx, _fn) {
				var _wrapped = _initial ? function() {
					if (_fn) {
						var _result = _fn.apply(_ctx, arguments);
						return _fn = null, _result;
					}
				} : function() {};
				return _initial = false, _wrapped;
			};
		}());

		'use strict';

		function fetchRating(movie) {
			var request = new Lampa['Reguest'](),
				cleanTitle = normalizeTitle(movie['title']),
				yearRaw = movie['year'] || movie['release_date'] || movie['first_air_date'] || '0000',
				yearNum = parseInt((yearRaw + '').slice(0, 4)),
				originalTitle = movie['original_title'] || movie['original_name'],
				urlPrefix = '',
				config = {
					'id': movie['id'],
					'url': urlPrefix + 'https://kinopoiskapiunofficial.tech/',
					'rating_url': urlPrefix + 'https://rating.kinopoisk.ru/',
					'headers': {
						'X-API-KEY': '7bac784b-ea8f-45b3-8e1f-b099ca4d7b6b'
					},
					'cache_time': 0x3c * 0x3c * 0x18 * 0x3e8
				};

			startFlow();

			function startFlow() {
				var cached = readCache(config['id']);
				if (cached) return applyRating(cached[config['id']]);
				else searchFilms();
			}

			function searchFilms() {
				var searchUrl = config['url'],
					keywordUrl = Lampa['Utils']['addUrlComponent'](searchUrl + 'api/v2.1/films/search-by-keyword', 'keyword=' + encodeURIComponent(cleanTitle));

				if (movie['imdb_id'])
					searchUrl = Lampa['Utils']['addUrlComponent'](searchUrl + 'api/v2.2/films', 'imdbId=' + encodeURIComponent(movie['imdb_id']));
				else
					searchUrl = keywordUrl;

				request['clear'](),
				request['timeout'](0x3a98),
				request['silent'](searchUrl, function(response) {
					if (response['items'] && response['items']['length'])
						processFilms(response['items']);
					else {
						if (response['films'] && response['films']['length'])
							processFilms(response['films']);
						else {
							if (searchUrl !== keywordUrl)
								request['clear'](),
								request['timeout'](0x3a98),
								request['silent'](keywordUrl, function(fallbackResponse) {
									if (fallbackResponse['items'] && fallbackResponse['items']['length'])
										processFilms(fallbackResponse['items']);
									else {
										if (fallbackResponse['films'] && fallbackResponse['films']['length'])
											processFilms(fallbackResponse['films']);
										else
											processFilms([]);
									}
								}, function(err1, err2) {
									showError(request['errorDecode'](err1, err2));
								}, false, {
									'headers': config['headers']
								});
							else
								processFilms([]);
						}
					}
				}, function(err1, err2) {
					showError(request['errorDecode'](err1, err2));
				}, false, {
					'headers': config['headers']
				});
			}

			function processFilms(films) {
				if (films && films['length']) {
					var matched = false,
						matchedByImdb = false;

					films['forEach'](function(film) {
						var dateRaw = film['start_date'] || film['release_date'] || '0000';
						film['tmp_year'] = parseInt((dateRaw + '').slice(0, 4));
					});

					if (movie['imdb_id']) {
						var imdbMatches = films['filter'](function(film) {
							return (film['imdb_id'] || film['imdbId']) == movie['imdb_id'];
						});
						imdbMatches['length'] && (films = imdbMatches, matched = true, matchedByImdb = true);
					}

					var candidates = films;

					if (candidates['length']) {
						if (originalTitle) {
							var byOriginal = candidates['filter'](function(film) {
								return titleContains(film['title'] || film['ru_title'], originalTitle) ||
									titleContains(film['en_title'] || film['nameEn'], originalTitle) ||
									titleContains(film['orig_title'] || film['original_title'] || film['nameRu'], originalTitle);
							});
							byOriginal['length'] && (candidates = byOriginal, matched = true);
						}

						if (movie['title']) {
							var byTitle = candidates['filter'](function(film) {
								return titleContains(film['title'] || film['ru_title'] || film['nameRu'], movie['title']) ||
									titleContains(film['en_title'] || film['nameEn'], movie['title']) ||
									titleContains(film['orig_title'] || film['original_title'], movie['title']);
							});
							byTitle['length'] && (candidates = byTitle, matched = true);
						}

						if (candidates['length'] > 1 && yearNum) {
							var byYear = candidates['filter'](function(film) {
								return film['year'] == yearNum;
							});
							if (!byYear['length'])
								byYear = candidates['filter'](function(film) {
									return film['year'] && film['tmp_year'] > yearNum - 2 && film['year'] < yearNum + 2;
								});
							if (byYear['length'])
								candidates = byYear;
						}
					}

					candidates['length'] == 1 && matched && !matchedByImdb && (
						yearNum && candidates[0]['tmp_year'] && (
							matched = candidates[0]['tmp_year'] > yearNum - 2 && candidates[0]['year'] < yearNum + 2
						),
						matched && (
							matched = false,
							originalTitle && (matched |= titlesEqual(candidates[0]['title'] || candidates[0]['ru_title'], originalTitle) || titlesEqual(candidates[0]['en_title'] || candidates[0]['nameEn'], originalTitle) || titlesEqual(candidates[0]['title'] || candidates[0]['ru_title'] || candidates[0]['nameRu'], originalTitle)),
							movie['title'] && (matched |= titlesEqual(candidates[0]['title'] || candidates[0]['ru_title'] || candidates[0]['nameRu'], movie['title']) || titlesEqual(candidates[0]['en_title'] || candidates[0]['nameEn'], movie['title']) || titlesEqual(candidates[0]['orig_title'] || candidates[0]['nameOriginal'], movie['title']))
						)
					);

					if (candidates['length'] == 1 && matched) {
						var kpId = candidates[0]['kinopoiskId'] || candidates[0]['filmId'] || candidates[0]['kinopoisk_id'] || candidates[0]['kp_id'],
							fetchFromApi = function _fetchFromApi() {
								request['clear'](),
								request['timeout'](0x3a98),
								request['silent'](config['url'] + 'api/v2.2/films/' + kpId, function(apiResponse) {
									var saved = writeCache(config['id'], {
										'kp': apiResponse['ratingKinopoisk'],
										'imdb': apiResponse['ratingImdb'],
										'timestamp': new Date().getTime()
									});
									return applyRating(saved);
								}, function(err1, err2) {
									showError(request['errorDecode'](err1, err2));
								}, false, {
									'headers': config['headers']
								});
							};

						request['clear'](),
						request['timeout'](0x1388),
						request['follow'](config['rating_url'] + kpId + '.xml', function(xmlText) {
							if (xmlText['indexOf']('<rating>') >= 0)
								try {
									var kpRating = 0,
										imdbRating = 0,
										xmlDoc = $($['parseXML'](xmlText)),
										kpNode = xmlDoc['find']('kp_rating');
									kpNode['length'] && (kpRating = parseFloat(kpNode['text']()));
									var imdbNode = xmlDoc['find']('imdb_rating');
									imdbNode['length'] && (imdbRating = parseFloat(imdbNode['text']()));
									var saved = writeCache(config['id'], {
										'kp': kpRating,
										'imdb': imdbRating,
										'timestamp': new Date().getTime()
									});
									return applyRating(saved);
								} catch (_ignore) {}
							fetchFromApi();
						}, function(_err1, _err2) {
							fetchFromApi();
						}, false, {
							'dataType': 'text'
						});
					} else {
						var savedZero = writeCache(config['id'], {
							'kp': 0x0,
							'imdb': 0x0,
							'timestamp': new Date()['getTime']()
						});
						return applyRating(savedZero);
					}
				} else {
					var savedZero2 = writeCache(config['id'], {
						'kp': 0x0,
						'imdb': 0x0,
						'timestamp': new Date()['getTime']()
					});
					return applyRating(savedZero2);
				}
			}

			function sanitizeText(text) {
				return text['replace'](/[\s.,:;’'`!?]+/g, ' ')['trim']();
			}

			function normalizeTitle(title) {
				return sanitizeText(title)['replace'](/^[ \/\\]+/, '')['replace'](/[ \/\\]+$/, '')['replace'](/\+( *[+\/\\])+/g, '+')['replace'](/([+\/\\] *)+\+/g, '+')['replace'](/( *[\/\\]+ *)+/g, '+');
			}

			function normalizeForCompare(text) {
				return sanitizeText(text['toLowerCase']()['replace'](/[\-\u2010-\u2015\u2E3A\u2E3B\uFE58\uFE63\uFF0D]+/g, '-')['replace'](/ё/g, 'е'));
			}

			function titlesEqual(a, b) {
				return typeof a === 'string' && typeof b === 'string' && normalizeForCompare(a) === normalizeForCompare(b);
			}

			function titleContains(haystack, needle) {
				return typeof haystack === 'string' && typeof needle === 'string' && normalizeForCompare(haystack)['indexOf'](normalizeForCompare(needle)) !== -0x1;
			}

			function showError(message) {
				Lampa['Noty']['show']('Ошибка доступа' + message);
			}

			function readCache(id) {
				var now = new Date()['getTime'](),
					store = Lampa['Storage']['get']('kp_rating', 0x1f4, {});
				if (store[id]) {
					if (now - store[id]['timestamp'] > config['cache_time'])
						return delete store[id], Lampa['Storage']['set']('kp_rating', store), false;
				} else return false;
				return store;
			}

			function writeCache(id, value) {
				var now = new Date()['getTime'](),
					store = Lampa['Storage']['get']('kp_rating', 0x1f4, {});
				if (!store[id])
					store[id] = value, Lampa['Storage']['set']('kp_rating', store);
				else {
					if (now - store[id]['timestamp'] > config['cache_time'])
						value['timestamp'] = now, store[id] = value, Lampa['Storage']['set']('kp_rating', store);
					else
						value = store[id];
				}
				return value;
			}

			function applyRating(data) {
				if (data) {
					var kpText = !isNaN(data['kp']) && data['kp'] !== null ? parseFloat(data['kp'])['toFixed'](0x1) : '0.0',
						imdbText = !isNaN(data['imdb']) && data['imdb'] !== null ? parseFloat(data['imdb'])['toFixed'](0x1) : '0.0',
						root = Lampa['Activity']['render']()['html']['full']();
					$('.wait_rating', root)['remove'](),
					$('.rate--imdb', root)['removeClass']('hide')['find']('<rating>')['eq'](0x0)['text'](imdbText),
					$('.rate--kp', root)['removeClass']('hide')['find']('<rating>')['eq'](0x0)['text'](kpText);
				}
			}
		}

		function initPlugin() {
			var _selfCheck = _guard1(this, function() {
				return _selfCheck['toString']()['search']('(((.+)+)+)+$')['toString']()['constructor'](_selfCheck)['search']('(((.+)+)+)+$');
			});
			_selfCheck();

			var _consoleGuard = _guard2(this, function() {
				var globalObj;
				try {
					var factory = Function('return (function() {}.constructor("return this")( ));');
					globalObj = factory();
				} catch (_e) {
					globalObj = window;
				}
				var consoleObj = globalObj['console'] = globalObj['console'] || {},
					methods = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace'];
				for (var i = 0x0; i < methods['length']; i++) {
					var patched = _guard2['constructor']['prototype']['bind'](_guard2),
						name = methods[i],
						original = consoleObj[name] || patched;
					patched['__proto__'] = _guard2['bind'](_guard2),
					patched['toString'] = original['toString']['bind'](original),
					consoleObj[name] = patched;
				}
			});
			_consoleGuard();

			window['rating_plugin'] = true,

			Lampa['Listener']['follow']('activity', function(event) {
				if (event['type'] == 'movie') {
					var root = event['activity']['render']()['html']['full']();
					$('.wait_rating', root)['hasClass']('hide') && !$('.wait_rating', root)['length'] && (
						$('.info__rate', root)['after']('<div style="width:2em;margin-top:1em;margin-right:1em" class="wait_rating"><div class="broadcast__scan"><div></div></div><div>'),
						fetchRating(event['activity']['movie'])
					);
				}
			});
		}

		if (!window['rating_plugin']) initPlugin();
	}());
})();
