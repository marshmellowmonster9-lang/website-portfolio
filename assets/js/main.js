/*
	Helios by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

try {
(function($) {

	var	$window = $(window),
		$body = $('body'),
		settings = {

			// Carousels
				carousels: {
					speed: 1.2,
					fadeIn: true,
					fadeDelay: 250
				},

				// Hero background video behaviour: after the intro animations finish, crossfade the looping video in.
				heroVideoDelay: 1600,

		};

	// Breakpoints.
		breakpoints({
			wide:      [ '1281px',  '1680px' ],
			normal:    [ '961px',   '1280px' ],
			narrow:    [ '841px',   '960px'  ],
			narrower:  [ '737px',   '840px'  ],
			mobile:    [ null,      '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');

				// After the hero intro animations are complete, fade the background video in.
				window.setTimeout(function() {
					var v = document.getElementById('hero-bg-video');
					if (v) {
						// Ensure muted/autoplay inline behaviour, try to play and then crossfade.
						v.muted = true;
						v.playsInline = true;
						var p = v.play();
						if (p !== undefined) {
							p.then(function() { $(v).addClass('visible'); }).catch(function() { /* Autoplay blocked, user interaction required */ });
						} else {
							$(v).addClass('visible');
						}
					}
				}, settings.heroVideoDelay);

			}, 100);
		});

	// Dropdowns.
		$('#nav > ul').dropotron({
			mode: 'fade',
			speed: 350,
			noOpenerFade: true,
			alignment: 'center'
		});

	// Scrolly.
		$('.scrolly').scrolly();

	// Nav.

		// Button.
			$(
				'<div id="navButton">' +
					'<a href="#navPanel" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					target: $body,
					visibleClass: 'navPanel-visible'
				});

	// Carousels.
		$('.carousel').each(function() {

			var	$t = $(this),
				$forward = $('<span class="forward"></span>'),
				$backward = $('<span class="backward"></span>'),
				$reel = $t.children('.reel'),
				$items = $reel.children('article');

			var	pos = 0,
				leftLimit,
				rightLimit,
				itemWidth,
				reelWidth,
				timerId;

			// Items.
				if (settings.carousels.fadeIn) {

					$items.addClass('loading');

					$t.scrollex({
						mode: 'middle',
						top: '-20vh',
						bottom: '-20vh',
						enter: function() {

							var	timerId,
								limit = $items.length - Math.ceil($window.width() / itemWidth);

							timerId = window.setInterval(function() {
								var x = $items.filter('.loading'), xf = x.first();

								if (x.length <= limit) {

									window.clearInterval(timerId);
									$items.removeClass('loading');
									return;

								}

								xf.removeClass('loading');

							}, settings.carousels.fadeDelay);

						}
					});

				}

			// Main.
				$t._update = function() {
					pos = 0;
					rightLimit = (-1 * reelWidth) + $window.width();
					leftLimit = 0;
					$t._updatePos();
				};

				$t._updatePos = function() { $reel.css('transform', 'translate(' + pos + 'px, 0)'); };

			// Forward.
				$forward
					.appendTo($t)
					.hide()
					.mouseenter(function(e) {
						timerId = window.setInterval(function() {
							pos -= settings.carousels.speed;

							if (pos <= rightLimit)
							{
								window.clearInterval(timerId);
								pos = rightLimit;
							}

							$t._updatePos();
						}, 10);
					})
					.mouseleave(function(e) {
						window.clearInterval(timerId);
					});

			// Backward.
				$backward
					.appendTo($t)
					.hide()
					.mouseenter(function(e) {
						timerId = window.setInterval(function() {
							pos += settings.carousels.speed;

							if (pos >= leftLimit) {

								window.clearInterval(timerId);
								pos = leftLimit;

							}

							$t._updatePos();
						}, 10);
					})
					.mouseleave(function(e) {
						window.clearInterval(timerId);
					});

			// Init.
				$window.on('load', function() {

					reelWidth = $reel[0].scrollWidth;

					if (browser.mobile) {

						$reel
							.css('overflow-y', 'hidden')
							.css('overflow-x', 'scroll')
							.scrollLeft(0);
						$forward.hide();
						$backward.hide();

					}
					else {

						$reel
							.css('overflow', 'visible')
							.scrollLeft(0);
						$forward.show();
						$backward.show();

					}

					$t._update();

					$window.on('resize', function() {
						reelWidth = $reel[0].scrollWidth;
						$t._update();
					}).trigger('resize');

				});

		});

		// Map featured showcase slides to project pages so clicks navigate directly.
		$(function() {
			var map = {
				'The City & The City': 'project-city.html',
				'Rogue Directive: Genesis': 'rogue-directive.html',
				'Post-Apocalyptic Rome': 'post-apocalyptic-rome.html',
				'Philippines Lyra Map': 'philippines-lyra.html',
				'Phantom Paws': 'phantom-paws.html',
				'Studio Prototype': 'project-city.html',
				'Between Two Crowns': 'between-two-crowns.html'
			};

			$('.portfolio-showcase__slide').each(function() {
				var $slide = $(this);
				var title = $slide.find('.portfolio-showcase__overlay h3').text().trim();
				var href = map[title] || '#projects';
				$slide.find('a.portfolio-showcase__link').attr('href', href);
			});

			// Lightbox for galleries and level flows.
			$('body').append('<div id="lightbox-overlay" role="dialog" aria-hidden="true"><div id="lightbox-content"></div><button id="lightbox-close" aria-label="Close">✕</button></div>');

			function openLightbox(element) {
				var $overlay = $('#lightbox-overlay');
				var $content = $('#lightbox-content');
				$content.empty();
				var tag = element.prop('tagName').toLowerCase();
				if (tag === 'img') {
					var src = element.attr('src');
					$('<img>').attr('src', src).appendTo($content);
				} else if (tag === 'video') {
					var clone = element.clone();
					clone.attr('controls', true).css({width:'100%', height:'auto'}).appendTo($content);
				} else if (element.data('lightbox-src')) {
					var src = element.data('lightbox-src');
					if (src.match(/\.mp4$/)) {
						$('<video controls playsinline>').attr('src', src).appendTo($content);
					} else {
						$('<img>').attr('src', src).appendTo($content);
					}
				}
				$overlay.addClass('visible').attr('aria-hidden','false');
			}

			function closeLightbox() {
				$('#lightbox-overlay').removeClass('visible').attr('aria-hidden','true');
				$('#lightbox-content').empty();
			}

			// Attach gallery click handlers
			$(document).on('click', '.project-gallery img, .project-gallery video, .project-gallery [data-lightbox-src]', function(e){
				e.preventDefault();
				openLightbox($(this));
			});

			// Close handlers
			$(document).on('click', '#lightbox-close, #lightbox-overlay', function(e){
				if (e.target.id === 'lightbox-overlay' || e.target.id === 'lightbox-close') closeLightbox();
			});
			$(document).on('keyup', function(e){ if (e.key === 'Escape') closeLightbox(); });

			

			// Featured showcase — keep CSS-driven animation looping. Dragging and pointer handlers disabled to simplify behaviour.
			(function() {
				// No JS dragging: CSS animation 'portfolio-scroll' handles continuous loop.
				// This is intentionally left empty to avoid pointer event conflicts.
			})();
			});
		})(jQuery);
} catch (e) { console.error('main.js error', e); }