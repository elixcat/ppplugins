(function() {
  'use strict';

  Lampa.Platform.tv();
  (function() {

    'use strict';

    function init() {
      var EpisodeCard = function(data3) {
          var
            card = data3.card || data3,
            episode = data3.next_episode_to_air || data3.episode || {};
          if (card.source == undefined) card.source = "tmdb";
          Lampa.Arrays.extend(card, {
            title: card.name,
            original_title: card.original_name,
            release_date: card.first_air_date
          }), card.release_year = ((card.release_date || '0000') + '').slice(0, 4);

          function removeElement(element) {
            if (element) element.remove();
          }
          this.build = function() {
            this.card = Lampa.Template.js("card_episode"), this.img_poster = this.card.querySelector('.card__img') || {}, this.img_episode = this.card.querySelector(".full-episode__img img") || {}, this.card.querySelector('.card__title').innerText = card.title, this.card.querySelector(".full-episode__num").innerText = card.unwatched || '', episode && episode.air_date && (this.card.querySelector(".full-episode__name").innerText = episode.name || Lang.translate("noname"), this.card.querySelector(".full-episode__num").innerText = episode.episode_number || '', this.card.querySelector(".full-episode__date").innerText = episode.air_date ? Lampa.Utils.parseTime(episode.air_date).full : "----"), card.release_year == "0000" ? removeElement(this.card.querySelector('.card__age')) : this.card.querySelector(".card__age").innerText = card.release_year, this.card.addEventListener("visible", this.visible.bind(this));
          }, this.image = function() {
            var
              self = this;
            this.img_poster.onload = function() {}, this.img_poster.onerror = function() {
              self.img_poster.src = './img/img_broken.svg';
            }, this.img_episode.onload = function() {
              self.card.querySelector(".full-episode__img").classList.add('full-episode__img--loaded');
            }, this.img_episode.onerror = function() {
              self.img_episode.src = "./img/img_broken.svg";
            };
          }, this.create = function() {
            var
              self5 = this;
            this.build(), this.card.addEventListener("hover:focus", function() {
              if (self5.onFocus) self5.onFocus(self5.card, card);
            }), this.card.addEventListener("hover:hover", function() {
              if (self5.onHover) self5.onHover(self5.card, card);
            }), this.card.addEventListener("hover:enter", function() {
              if (self5.onEnter) self5.onEnter(self5.card, card);
            }), this.image();
          }, this.visible = function() {
            if (card.poster_path) this.img_poster.src = Lampa.Api.img(card.poster_path);
            else {
              if (card.profile_path) this.img_poster.src = Lampa.Api.img(card.profile_path);
              else {
                if (card.poster) this.img_poster.src = card.poster;
                else {
                  if (card.img) this.img_poster.src = card.img;
                  else this.img_poster.src = './img/img_broken.svg';
                }
              }
            }
            if (card.still_path) this.img_episode.src = Lampa.Api.img(episode.still_path, 'w300');
            else {
              if (card.backdrop_path) this.img_episode.src = Lampa.Api.img(card.backdrop_path, "w300");
              else {
                if (episode.img) this.img_episode.src = episode.img;
                else {
                  if (card.img) this.img_episode.src = card.img;
                  else this.img_episode.src = "./img/img_broken.svg";
                }
              }
            }
            if (this.onVisible) this.onVisible(this.card, card);
          }, this.destroy = function() {
            this.img_poster.onerror = function() {}, this.img_poster.onload = function() {}, this.img_episode.onerror = function() {}, this.img_episode.onload = function() {}, this.img_poster.src = '', this.img_episode.src = '', removeElement(this.card), this.card = null, this.img_poster = null, this.img_episode = null;
          }, this.render = function(raw) {
            return raw ? this.card : $(this.card);
          };
        },
        PersonalSource = function(baseSource) {
          this.network = new Lampa[("Reguest")](), this.discovery = false, this.main = function() {
            var
              self3 = this,
              params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              onComplete = arguments.length > 1 ? arguments[1] : undefined,
              onError5 = arguments.length > 2 ? arguments[2] : undefined,
              partSize = 56,
              categoryList = [{
                id: "now_watch",
                order: parseInt(Lampa.Storage.get('number_now_watch'), 10) || 1,
                active: !Lampa.Storage.get("now_watch_remove")
              }, {
                id: 'upcoming_episodes',
                order: 2,
                active: !Lampa.Storage.get("upcoming_episodes_remove")
              }, {
                id: "trend_day",
                order: parseInt(Lampa.Storage.get('number_trend_day'), 10) || 3,
                active: !Lampa.Storage.get("trend_day_remove")
              }, {
                id: "trend_day_tv",
                order: parseInt(Lampa.Storage.get("number_trend_day_tv"), 10) || 4,
                active: !Lampa.Storage.get("trend_day_tv_remove")
              }, {
                id: "trend_day_film",
                order: parseInt(Lampa.Storage.get("number_trend_day_film"), 10) || 5,
                active: !Lampa.Storage.get("trend_day_film_remove")
              }, {
                id: 'trend_week',
                order: parseInt(Lampa.Storage.get("number_trend_week"), 10) || 6,
                active: !Lampa.Storage.get('trend_week_remove')
              }, {
                id: "trend_week_tv",
                order: parseInt(Lampa.Storage.get('number_trend_week_tv'), 10) || 7,
                active: !Lampa.Storage.get("trend_week_tv_remove")
              }, {
                id: "trend_week_film",
                order: parseInt(Lampa.Storage.get("number_trend_week_film"), 10) || 8,
                active: !Lampa.Storage.get("trend_week_film_remove")
              }, {
                id: 'upcoming',
                order: parseInt(Lampa.Storage.get("number_upcoming"), 10) || 9,
                active: !Lampa.Storage.get("upcoming_remove")
              }, {
                id: "popular_movie",
                order: parseInt(Lampa.Storage.get("number_popular_movie"), 10) || 10,
                active: !Lampa.Storage.get("popular_movie_remove")
              }, {
                id: 'popular_tv',
                order: parseInt(Lampa.Storage.get("number_popular_tv"), 10) || 11,
                active: !Lampa.Storage.get("popular_tv_remove")
              }, {
                id: "top_movie",
                order: parseInt(Lampa.Storage.get("number_top_movie"), 10) || 12,
                active: !Lampa.Storage.get("top_movie_remove")
              }, {
                id: "top_tv",
                order: parseInt(Lampa.Storage.get("number_top_tv"), 10) || 13,
                active: !Lampa.Storage.get("top_tv_remove")
              }, {
                id: "netflix",
                order: parseInt(Lampa.Storage.get('number_netflix'), 10) || 14,
                active: !Lampa.Storage.get("netflix_remove")
              }, {
                id: "apple_tv",
                order: parseInt(Lampa.Storage.get('number_apple_tv'), 10) || 15,
                active: !Lampa.Storage.get("apple_tv_remove")
              }, {
                id: "prime_video",
                order: parseInt(Lampa.Storage.get("number_prime_video"), 10) || 16,
                active: !Lampa.Storage.get('prime_video_remove')
              }, {
                id: "mgm",
                order: parseInt(Lampa.Storage.get("number_mgm"), 10) || 17,
                active: !Lampa.Storage.get("mgm_remove")
              }, {
                id: "hbo",
                order: parseInt(Lampa.Storage.get('number_hbo'), 10) || 18,
                active: !Lampa.Storage.get('hbo_remove')
              }, {
                id: "collections_inter_tv",
                order: parseInt(Lampa.Storage.get("number_collections_inter_tv"), 10) || 34,
                active: !Lampa.Storage.get('collections_inter_tv_remove')
              }, {
                id: "collections_inter_movie",
                order: parseInt(Lampa.Storage.get("number_collections_inter_movie"), 10) || 36,
                active: !Lampa.Storage.get("collections_inter_movie_remove")
              }],
              usedIds = [];

            function shuffle(array) {
              for (var i = array.length - 1; i > 0; i--) {
                var randomIndex = Math.floor(Math.random() * (i + 1)),
                  temp = array[i];
                array[i] = array[randomIndex], array[randomIndex] = temp;
              }
            }
            var yearRanges = [{
                start: 2023,
                end: 2025
              }, {
                start: 2020,
                end: 2022
              }, {
                start: 2017,
                end: 2019
              }, {
                start: 2014,
                end: 2016
              }, {
                start: 2011,
                end: 2013
              }],
              tvYearRange = yearRanges[Math.floor(Math.random() * yearRanges.length)],
              tvDateFrom = tvYearRange.start + "-01-01",
              tvDateTo = tvYearRange.end + "-12-31",
              movieYearRange = yearRanges[Math.floor(Math.random() * yearRanges.length)],
              movieDateFrom = movieYearRange.start + "-01-01",
              movieDateTo = movieYearRange.end + "-12-31",
              sortOptionsTv = ["vote_count.desc", 'popularity.desc', "revenue.desc"],
              sortIndexTv = Math.floor(Math.random() * sortOptionsTv.length),
              sortTv = sortOptionsTv[sortIndexTv],
              sortOptionsMovie = ["vote_count.desc", "popularity.desc", "revenue.desc"],
              sortIndexMovie = Math.floor(Math.random() * sortOptionsMovie.length),
              sortMovie = sortOptionsMovie[sortIndexMovie],
              today = new Date().toISOString().substr(0, 10),
              lastMonthDate = new Date(today);
            lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
            var lastMonth = lastMonthDate.toISOString().substr(0, 10);

            function personalApplyDisplay(line, key) {
              if (!line || !line.results) return line;
              var mode = Lampa.Storage.get(key + '_display') + '';
              line.params = line.params || {};
              if (mode == '2') {
                line.params.type = 'collection';
                line.results.forEach(function (item) {
                  item.params = item.params || {};
                  item.params.style = { name: 'collection' };
                });
              } else if (mode == '3') {
                line.results.forEach(function (item) {
                  item.params = item.params || {};
                  item.params.style = { name: 'wide' };
                });
                line.params.items = line.params.items || {};
                line.params.items.view = 3;
              } else if (mode == '4') {
                line.params.type = 'top';
              }
              return line;
            }

            function loadHome(onComplete5, onError) {
              var
                loaders = {
                  now_watch: function(onNowWatch) {
                    self3.get("movie/now_playing", params, function(nowWatchLine) {
                      nowWatchLine.title = Lampa.Lang.translate("title_now_watch"), personalApplyDisplay(nowWatchLine, "now_watch"), Lampa.Storage.get('now_watch_shuffle') == true && shuffle(nowWatchLine.results), onNowWatch(nowWatchLine);
                    }, onNowWatch);
                  },
                  upcoming_episodes: function(onUpcomingEpisodes) {
                    onUpcomingEpisodes({
                      source: "tmdb",
                      results: Lampa.TimeTable.lately().slice(0, 20),
                      title: Lampa.Lang.translate("title_upcoming_episodes"),
                      nomore: true,
                      cardClass: function createCard(data, options) {
                        return new EpisodeCard(data, options);
                      }
                    });
                  },
                  trend_day: function(onTrendDay) {
                    self3.get("trending/all/day", params, function(trendDayLine) {
                      trendDayLine.title = Lampa.Lang.translate('title_trend_day'), personalApplyDisplay(trendDayLine, "trend_day"), Lampa.Storage.get("trend_day_shuffle") == true && shuffle(trendDayLine.results), onTrendDay(trendDayLine);
                    }, onTrendDay);
                  },
                  trend_day_tv: function(onTrendDayTv) {
                    self3.get("trending/tv/day", params, function(trendDayTvLine) {
                      trendDayTvLine.title = Lampa.Lang.translate("Сьогодні в тренді (серіали)"), personalApplyDisplay(trendDayTvLine, "trend_day_tv"), Lampa.Storage.get('trend_day_tv_shuffle') == true && shuffle(trendDayTvLine.results), onTrendDayTv(trendDayTvLine);
                    }, onTrendDayTv);
                  },
                  trend_day_film: function(onTrendDayFilm) {
                    self3.get("trending/movie/day", params, function(trendDayFilmLine) {
                      trendDayFilmLine.title = Lampa.Lang.translate("Сьогодні в тренді (фільми)"), personalApplyDisplay(trendDayFilmLine, "trend_day_film"), Lampa.Storage.get("trend_day_film_shuffle") == true && shuffle(trendDayFilmLine.results), onTrendDayFilm(trendDayFilmLine);
                    }, onTrendDayFilm);
                  },
                  trend_week: function(onTrendWeek) {
                    self3.get("trending/all/week", params, function(trendWeekLine) {
                      trendWeekLine.title = Lampa.Lang.translate("title_trend_week"), personalApplyDisplay(trendWeekLine, "trend_week"), Lampa.Storage.get("trend_week_shuffle") == true && shuffle(trendWeekLine.results), onTrendWeek(trendWeekLine);
                    }, onTrendWeek);
                  },
                  trend_week_tv: function(onTrendWeekTv) {
                    self3.get("trending/tv/week", params, function(trendWeekTvLine) {
                      trendWeekTvLine.title = Lampa.Lang.translate("У тренді за тиждень (серіали)"), personalApplyDisplay(trendWeekTvLine, "trend_week_tv"), Lampa.Storage.get("trend_week_tv_shuffle") == true && shuffle(trendWeekTvLine.results), onTrendWeekTv(trendWeekTvLine);
                    }, onTrendWeekTv);
                  },
                  trend_week_film: function(onTrendWeekFilm) {
                    self3.get("trending/movie/week", params, function(trendWeekFilmLine) {
                      trendWeekFilmLine.title = Lampa.Lang.translate('У тренді за тиждень (фільми)'), personalApplyDisplay(trendWeekFilmLine, "trend_week_film"), Lampa.Storage.get("trend_week_film_shuffle") == true && shuffle(trendWeekFilmLine.results), onTrendWeekFilm(trendWeekFilmLine);
                    }, onTrendWeekFilm);
                  },
                  upcoming: function(onUpcoming) {
                    self3.get("movie/upcoming", params, function(upcomingLine) {
                      upcomingLine.title = Lampa.Lang.translate("title_upcoming"), personalApplyDisplay(upcomingLine, "upcoming"), Lampa.Storage.get("upcoming_shuffle") == true && shuffle(upcomingLine.results), onUpcoming(upcomingLine);
                    }, onUpcoming);
                  },
                  popular_movie: function(onPopularMovie) {
                    self3.get("movie/popular", params, function(popularMovieLine) {
                      popularMovieLine.title = Lampa.Lang.translate("title_popular_movie"), personalApplyDisplay(popularMovieLine, "popular_movie"), Lampa.Storage.get("popular_movie_shuffle") == true && shuffle(popularMovieLine.results), onPopularMovie(popularMovieLine);
                    }, onPopularMovie);
                  },
                  popular_tv: function(onPopularTv) {
                    self3.get('trending/tv/week', params, function(popularTvLine) {
                      popularTvLine.title = Lampa.Lang.translate('title_popular_tv'), personalApplyDisplay(popularTvLine, "popular_tv"), Lampa.Storage.get("popular_tv_shuffle") == true && shuffle(popularTvLine.results), onPopularTv(popularTvLine);
                    }, onPopularTv);
                  },
                  top_movie: function(onTopMovie) {
                    self3.get('movie/top_rated', params, function(topMovieLine) {
                      topMovieLine.title = Lampa.Lang.translate("title_top_movie"), personalApplyDisplay(topMovieLine, "top_movie"), Lampa.Storage.get("top_movie_shuffle") == true && shuffle(topMovieLine.results), onTopMovie(topMovieLine);
                    }, onTopMovie);
                  },
                  top_tv: function(onTopTv) {
                    self3.get("tv/top_rated", params, function(topTvLine) {
                      topTvLine.title = Lampa.Lang.translate("title_top_tv"), personalApplyDisplay(topTvLine, "top_tv"), Lampa.Storage.get("top_tv_shuffle") == true && shuffle(topTvLine.results), onTopTv(topTvLine);
                    }, onTopTv);
                  },
                  netflix: function(onNetflix) {
                    self3.get("discover/tv?with_networks=213&first_air_date.gte=2020-01-01&vote_average.gte=6&vote_average.lte=10&first_air_date.lte=" + today, params, function(netflixLine) {
                      netflixLine.title = Lampa.Lang.translate("Netflix"), personalApplyDisplay(netflixLine, "netflix"), Lampa.Storage.get("netflix_shuffle") == true && shuffle(netflixLine.results), onNetflix(netflixLine);
                    }, onNetflix);
                  },
                  apple_tv: function(onAppleTv) {
                    self3.get("discover/tv?with_networks=2552&first_air_date.gte=2020-01-01&vote_average.gte=6&vote_average.lte=10&first_air_date.lte=" + today, params, function(appleTvLine) {
                      appleTvLine.title = Lampa.Lang.translate("Apple TV+"), personalApplyDisplay(appleTvLine, "apple_tv"), Lampa.Storage.get("apple_tv_shuffle") == true && shuffle(appleTvLine.results), onAppleTv(appleTvLine);
                    }, onAppleTv);
                  },
                  prime_video: function(onPrimeVideo) {
                    self3.get("discover/tv?with_networks=1024&first_air_date.gte=2020-01-01&vote_average.gte=6&vote_average.lte=10&first_air_date.lte=" + today, params, function(primeVideoLine) {
                      primeVideoLine.title = Lampa.Lang.translate("Prime Video"), personalApplyDisplay(primeVideoLine, "prime_video"), Lampa.Storage.get("prime_video_shuffle") == true && shuffle(primeVideoLine.results), onPrimeVideo(primeVideoLine);
                    }, onPrimeVideo);
                  },
                  mgm: function(onMgm) {
                    self3.get("discover/tv?with_networks=6219&first_air_date.gte=2020-01-01&vote_average.gte=6&vote_average.lte=10&first_air_date.lte=" + today, params, function(mgmLine) {
                      mgmLine.title = Lampa.Lang.translate("MGM+"), personalApplyDisplay(mgmLine, "mgm"), Lampa.Storage.get("mgm_shuffle") == true && shuffle(mgmLine.results), onMgm(mgmLine);
                    }, onMgm);
                  },
                  hbo: function(onHbo) {
                    self3.get('discover/tv?with_networks=49&first_air_date.gte=2020-01-01&vote_average.gte=6&vote_average.lte=10&first_air_date.lte=' + today, params, function(hboLine) {
                      hboLine.title = Lampa.Lang.translate('HBO'), personalApplyDisplay(hboLine, "hbo"), Lampa.Storage.get("hbo_shuffle") == true && shuffle(hboLine.results), onHbo(hboLine);
                    }, onHbo);
                  },
                  collections_inter_tv: function(onCollectionsInterTv) {
                    self3.get('discover/tv?with_networks=213|2552|1024|6219|49&sort_by=' + sortTv + "&first_air_date.gte=" + tvDateFrom + "&first_air_date.lte=" + tvDateTo, params, function(collectionsInterTvLine) {
                      collectionsInterTvLine.title = Lampa.Lang.translate('Добірки зарубіжних серіалів'), personalApplyDisplay(collectionsInterTvLine, "collections_inter_tv"), Lampa.Storage.get('collections_inter_tv_shuffle') == true && shuffle(collectionsInterTvLine.results), onCollectionsInterTv(collectionsInterTvLine);
                    }, onCollectionsInterTv);
                  },
                  collections_inter_movie: function(onCollectionsInterMovie) {
                    self3.get("discover/movie?vote_average.gte=5&vote_average.lte=9.5&sort_by=" + sortMovie + "&primary_release_date.gte=" + movieDateFrom + "&primary_release_date.lte=" + movieDateTo, params, function(collectionsInterMovieLine) {
                      collectionsInterMovieLine.title = Lampa.Lang.translate("Добірки зарубіжних фільмів"), personalApplyDisplay(collectionsInterMovieLine, "collections_inter_movie"), Lampa.Storage.get('collections_inter_movie_shuffle') == true && shuffle(collectionsInterMovieLine.results), onCollectionsInterMovie(collectionsInterMovieLine);
                    }, onCollectionsInterMovie);
                  }
                },
                activeCategories = categoryList.filter(function(category) {
                  return category.active;
                }).sort(function(a2, b) {
                  return a2.order - b.order;
                });
              if (activeCategories.length === 0) return onComplete5();
              var tasks = [];
              activeCategories.forEach(function(category3) {
                !usedIds.includes(category3.id) && loaders[category3.id] && (tasks.push(loaders[category3.id]), usedIds.push(category3.id));
              }), Lampa.Storage.get("genres_cat") == false && baseSource.genres.movie.forEach(function(genre) {
                if (!usedIds.includes(genre.id)) {
                  var loadGenre = function(onGenre) {
                    self3.get("discover/movie?with_genres=" + genre.id, params, function(genreLine) {
                      genreLine.title = Lampa.Lang.translate(genre.title.replace(/[^a-z_]/g, '')), shuffle(genreLine.results), onGenre(genreLine);
                    }, onGenre);
                  };
                  tasks.push(loadGenre), usedIds.push(genre.id);
                }
              }), tasks.length > 0 ? Lampa.Api.partNext(tasks, partSize, onComplete5, onError) : console.log("Немає доступних категорій для завантаження.");
            }

            function load(onComplete3, onError3) {
              loadHome(onComplete3, onError3);
            }
            return load(onComplete, onError5), load;
          };
        },
        personalSource = Object.assign({}, Lampa.Api.sources.tmdb, new PersonalSource(Lampa.Api.sources.tmdb));
      Lampa.Api.sources.personal = personalSource, Object.defineProperty(Lampa.Api.sources, "personal", {
        get: function getSource() {
          return personalSource;
        }
      }), Lampa.Params.select("source", Object.assign({}, Lampa.Params.values.source, {
        personal: 'Personal'
      }), "tmdb");
      if (Lampa.Storage.get("source") == "personal") var sourceValue = Lampa.Storage.get("source"),
        interval = setInterval(function() {
          var
            activity = Lampa.Activity.active();
          activity && (clearInterval(interval), Lampa.Activity.replace({
            source: sourceValue,
            title: Lampa.Lang.translate("title_main") + ' - ' + Lampa.Storage.field("source").toUpperCase()
          }));
        }, 300);
      Lampa.Settings.listener.follow('open', function(event3) {
        event3.name == "main" && (Lampa.Settings.main().render().find('[data-component="personal_source"]').length == 0 && Lampa.SettingsApi.addComponent({
          component: "personal_source",
          name: "Джерело Personal"
        }), Lampa.Settings.main().update(), Lampa.Settings.main().render().find("[data-component=\"personal_source\"]").addClass('hide'));
      }), Lampa.SettingsApi.addParam({
        component: "more",
        param: {
          name: 'personal_source',
          type: "static",
          default: true
        },
        field: {
          name: 'Джерело Personal',
          description: 'Налаштування головного екрану'
        },
        onRender: function(element5) {
          setTimeout(function() {
            $(".settings-param > div:contains(\"Джерело Personal\")").parent().insertAfter($("div[data-name=\"source\"]")), Lampa.Storage.field('source') !== 'personal' ? element5.hide() : element5.show();
          }, 20), element5.on('hover:enter', function() {
            Lampa.Settings.create("personal_source"), Lampa.Controller.enabled().controller.back = function() {
              Lampa.Settings.create('more');
            };
          });
        }
      }), Lampa.Storage.listener.follow('change', function(event) {
        event.name == "source" && setTimeout(function() {
          Lampa.Storage.get("source") !== "personal" ? $('.settings-param > div:contains("Джерело Personal")').parent().hide() : $(".settings-param > div:contains(\"Джерело Personal\")").parent().show();
        }, 50);
      });

      var personalRefreshTimer = 0,
        personalRefreshWatch = 0;

      function personalReplaceMain() {
        if (Lampa.Storage.get('source') != 'personal') return;
        var activity = Lampa.Activity.active();
        if (activity && activity.component == 'main') Lampa.Activity.replace({
          source: 'personal',
          title: Lampa.Lang.translate('title_main') + ' - ' + Lampa.Storage.field('source').toUpperCase()
        });
      }

      function personalStartRefresh() {
        clearInterval(personalRefreshWatch);
        var tries = 0;
        personalRefreshWatch = setInterval(function() {
          tries++;
          if (Lampa.Storage.get('source') != 'personal' || tries > 1200) {
            clearInterval(personalRefreshWatch);
            personalRefreshWatch = 0;
            return;
          }
          var busy = $('body').hasClass('settings--open') || $('body').hasClass('selectbox--open');
          var activity = Lampa.Activity.active();
          if (!busy && activity && activity.component == 'main') {
            clearInterval(personalRefreshWatch);
            personalRefreshWatch = 0;
            personalReplaceMain();
          }
        }, 250);
      }

      function personalScheduleRefresh() {
        clearTimeout(personalRefreshTimer);
        personalRefreshTimer = setTimeout(personalStartRefresh, 300);
      }

      Lampa.Storage.listener.follow('change', function(event) {
        var name = event && event.name ? event.name : '';
        if (name == "source" || name == "genres_cat" || name.indexOf("number_") == 0 || /_(remove|display|shuffle)$/.test(name)) personalScheduleRefresh();
      });

      function addSetting(component2, title2, description2, removeDefault, displayDefault, orderDefault, shuffleDefault) {

        Lampa.Settings.listener.follow('open', function(event7) {
          event7.name === "main" && (Lampa.Settings.main().render().find('[data-component="' + component2 + '"]').length === 0 && Lampa.SettingsApi.addComponent({
            component: component2,
            name: title2
          }), Lampa.Settings.main().update(), Lampa.Settings.main().render().find("[data-component=\"" + component2 + '"]').addClass("hide"));
        }), Lampa.SettingsApi.addParam({
          component: "personal_source",
          param: {
            name: component2,
            type: "static",
            default: true
          },
          field: {
            name: title2,
            description: description2
          },
          onRender: function(element7) {
            element7.on("hover:enter", function(line) {
              var target = line.target,
                parent = target.parentElement,
                children = Array.from(parent.children),
                index = children.indexOf(target),
                nextIndex = index + 1;
              Lampa.Settings.create(component2), Lampa.Controller.enabled().controller.back = function() {
                Lampa.Settings.create("personal_source"), setTimeout(function() {
                  var element3 = document.querySelector("#app > div.settings.animate > div.settings__content.layer--height > div.settings__body > div > div > div > div > div:nth-child(" + nextIndex + ')');
                  if (element3) {
                    Lampa.Controller.focus(element3);
                    Lampa.Controller.toggle('settings_component');
                  }
                }, 5);
              };
            });
          }
        }), Lampa.SettingsApi.addParam({
          component: component2,
          param: {
            name: component2 + "_remove",
            type: "trigger",
            default: removeDefault
          },
          field: {
            name: "Прибрати з головної сторінки"
          },
          onChange: personalScheduleRefresh
        }), Lampa.SettingsApi.addParam({
          component: component2,
          param: {
            name: component2 + '_display',
            type: "select",
            values: {
              1: "Стандарт",
              2: "Широкі маленькі",
              3: "Широкі великі",
              4: "Top Line"
            },
            default: displayDefault
          },
          field: {
            name: "Вигляд відображення"
          },
          onChange: personalScheduleRefresh
        }), Lampa.SettingsApi.addParam({
          component: component2,
          param: {
            name: "number_" + component2,
            type: "select",
            values: {
              1: '1',
              2: '2',
              3: '3',
              4: '4',
              5: '5',
              6: '6',
              7: '7',
              8: '8',
              9: '9',
              10: '10',
              11: '11',
              12: '12',
              13: '13',
              14: '14',
              15: '15',
              16: '16',
              17: '17',
              18: '18',
              19: '19',
              20: '20',
              21: '21',
              22: '22',
              23: '23',
              24: '24',
              25: '25',
              26: '26',
              27: '27',
              28: '28',
              29: '29',
              30: '30',
              31: '31',
              32: '32',
              33: '33',
              34: '34',
              35: '35',
              36: '36',
              37: '37'
            },
            default: orderDefault
          },
          field: {
            name: "Порядок відображення"
          },
          onChange: personalScheduleRefresh
        }), Lampa.SettingsApi.addParam({
          component: component2,
          param: {
            name: component2 + "_shuffle",
            type: "trigger",
            default: shuffleDefault
          },
          field: {
            name: "Змінювати порядок карток на головній"
          },
          onChange: personalScheduleRefresh
        });
      }
      addSetting('now_watch', "Зараз дивляться", "Натисни для налаштування", false, '1', '1', false), addSetting("trend_day", 'Сьогодні в тренді', 'Натисни для налаштування', false, '1', '3', false), addSetting("trend_day_tv", "Сьогодні в тренді (серіали)", "Натисни для налаштування", false, '1', '4', false), addSetting('trend_day_film', 'Сьогодні в тренді (фільми)', "Натисни для налаштування", false, '1', '5', false), addSetting('trend_week', "У тренді за тиждень", "Натисни для налаштування", false, '1', '6', false), addSetting("trend_week_tv", "У тренді за тиждень (серіали)", "Натисни для налаштування", false, '1', '7', false), addSetting("trend_week_film", "У тренді за тиждень (фільми)", "Натисни для налаштування", false, '1', '8', false), addSetting('upcoming', 'Скоро в кінотеатрах', "Натисни для налаштування", false, '1', '9', false), addSetting("popular_movie", "Популярні фільми", "Натисни для налаштування", false, '1', '10', false), addSetting("popular_tv", "Популярні серіали", 'Натисни для налаштування', false, '1', '11', false), addSetting("top_movie", "Топ фільми", "Натисни для налаштування", false, '4', '12', false), addSetting("top_tv", "Топ серіали", "Натисни для налаштування", false, '4', '13', false), addSetting("netflix", "Netflix", 'Натисни для налаштування', false, '1', '14', false), addSetting("apple_tv", "Apple TV+", "Натисни для налаштування", false, '1', '15', false), addSetting("prime_video", "Prime Video", "Натисни для налаштування", false, '1', '16', false), addSetting("mgm", "MGM+", "Натисни для налаштування", false, '1', '17', false), addSetting("hbo", "HBO", "Натисни для налаштування", false, '1', '18', false), addSetting('collections_inter_tv', 'Добірки зарубіжних серіалів', "Натисни для налаштування", false, '1', '34', false), addSetting("collections_inter_movie", 'Добірки зарубіжних фільмів', "Натисни для налаштування", false, '1', '36', false), Lampa.SettingsApi.addParam({
        component: "personal_source",
        param: {
          name: "upcoming_episodes_remove",
          type: "trigger",
          default: false
        },
        field: {
          name: "Вихід найближчих епізодів",
          description: "Прибрати з головної сторінки"
        }
      }), Lampa.SettingsApi.addParam({
        component: 'personal_source',
        param: {
          name: "genres_cat",
          type: "trigger",
          default: false
        },
        field: {
          name: "Добірки за жанрами",
          description: "Прибрати з головної сторінки"
        }
      });
      var bootInterval = setInterval(function() {
        if (typeof Lampa !== "undefined") {
          clearInterval(bootInterval);
          if (Lampa.Storage.get('personal_source_params') != "v2") initDefaults();
        }
      }, 200);

      function initDefaults() {
        Lampa.Storage.set("personal_source_params", "v2");
        ['trend_day_tv', 'trend_day_film', 'trend_week_tv', 'trend_week_film', 'netflix', 'apple_tv', 'prime_video', 'mgm', 'hbo', 'collections_inter_tv', 'collections_inter_movie'].forEach(function(id) {
          Lampa.Storage.set(id + "_remove", false);
        });
        Lampa.Storage.set("genres_cat", false);
      }
    }
    if (window.appready) init();
    else Lampa.Listener.follow("app", function(event5) {
      event5.type == "ready" && init();
    });
  }());
})();
