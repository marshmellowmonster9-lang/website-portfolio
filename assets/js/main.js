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

		$(function() {
			// Keep the URLs authored in the HTML; deriving them from display titles made
			// links silently fall back to the projects anchor when a title changed.
			var $showcase = $('.portfolio-showcase');
			var $viewport = $showcase.find('.portfolio-showcase__viewport');
			var $track = $showcase.find('.portfolio-showcase__track');
			var $slides = $track.find('.portfolio-showcase__slide');
			if ($slides.length) {
				var $dots = $('<div class="portfolio-showcase__dots" role="tablist" aria-label="Featured project groups"></div>');
				var groupCount = Math.min(3, Math.ceil($slides.length / 3));
				var activeGroup = 0;
				for (var i = 0; i < groupCount; i++) {
					$('<button type="button" role="tab" class="portfolio-showcase__dot" aria-label="Show featured projects ' + (i + 1) + '">')
						.attr('aria-selected', i === 0 ? 'true' : 'false')
						.appendTo($dots);
				}
				$showcase.append($dots);
				function showGroup(group) {
					activeGroup = (group + groupCount) % groupCount;
					var target = $slides.eq(activeGroup * 3)[0];
					if (target) {
						$viewport.stop().animate({ scrollLeft: target.offsetLeft }, 650);
					}
					$dots.children().each(function(index) {
						$(this).attr('aria-selected', index === activeGroup ? 'true' : 'false');
					});
				}
				$dots.on('click', 'button', function() {
					showGroup($(this).index());
				});
				var carouselTimer = window.setInterval(function() { showGroup(activeGroup + 1); }, 9000);
				$viewport.on('mouseenter focusin touchstart', function() { window.clearInterval(carouselTimer); });
				$viewport.on('mouseleave focusout touchend', function() {
					carouselTimer = window.setInterval(function() { showGroup(activeGroup + 1); }, 9000);
				});
			}

			// Lightbox for galleries and level flows.
			$('body').append('<div id="lightbox-overlay" role="dialog" aria-hidden="true"><button id="lightbox-prev" class="lightbox-control" aria-label="Previous image">‹</button><div id="lightbox-content"></div><button id="lightbox-next" class="lightbox-control" aria-label="Next image">›</button><button id="lightbox-close" aria-label="Close">✕</button></div>');

			var lightboxItems = [];
			var lightboxIndex = 0;
			var lightboxZoom = 1;
			var lightboxPanX = 0;
			var lightboxPanY = 0;
			var touchZoomDistance = null;
			var dragState = { active: false, startX: 0, startY: 0, panX: 0, panY: 0, moved: false };

			function getLightboxSource(element) {
				if (!element || !element.length) return '';
				return (element.attr('data-lightbox-src') || element.attr('data-full-src') || element.attr('data-hires-src') || element.attr('src') || '').trim();
			}

			function resetLightboxZoom() {
				lightboxZoom = 1;
				lightboxPanX = 0;
				lightboxPanY = 0;
				dragState = { active: false, startX: 0, startY: 0, panX: 0, panY: 0, moved: false };
				var $media = $('#lightbox-content .lightbox-media');
				if ($media.length) {
					$media.removeClass('is-zoomed is-dragging').css('transform', 'translate(0px, 0px) scale(1)').css('cursor', 'zoom-in');
				}
			}

			function applyLightboxZoom() {
				var $media = $('#lightbox-content .lightbox-media');
				if (!$media.length) return;
				var zoom = Math.max(1, Math.min(lightboxZoom, 5));
				$media.css('transform', 'translate(' + lightboxPanX + 'px, ' + lightboxPanY + 'px) scale(' + zoom + ')')
					.toggleClass('is-zoomed', zoom > 1)
					.css('cursor', zoom > 1 ? 'grab' : 'zoom-in');
			}

			function renderLightbox() {
				var $overlay = $('#lightbox-overlay');
				var $content = $('#lightbox-content');
				$content.empty();
				var element = lightboxItems[lightboxIndex];
				if (!element) return;
				var $element = $(element);
				var tag = $element.prop('tagName').toLowerCase();
				var lightboxCaption = $element.attr('data-lightbox-caption');
				var source = getLightboxSource($element);
				if (tag === 'img' || source.match(/\.(png|jpe?g|webp|avif|gif|bmp|svg)$/i)) {
					var $img = $('<img class="lightbox-media" alt="">').attr('src', source).attr('alt', $element.attr('alt') || 'Project image');
					$img.on('click', function(e) {
						e.preventDefault();
						e.stopPropagation();
						if (dragState.moved) {
							dragState.moved = false;
							return;
						}
						if (lightboxZoom > 1) {
							lightboxZoom = 1;
							lightboxPanX = 0;
							lightboxPanY = 0;
						} else {
							lightboxZoom = 2;
						}
						applyLightboxZoom();
					});
					$img.on('pointerdown', function(e) {
						e.preventDefault();
						e.stopPropagation();
						if (lightboxZoom <= 1) return;
						dragState.active = true;
						dragState.startX = e.clientX;
						dragState.startY = e.clientY;
						dragState.panX = lightboxPanX;
						dragState.panY = lightboxPanY;
						dragState.moved = false;
						$img.addClass('is-dragging');
					});
					$img.on('pointermove', function(e) {
						if (!dragState.active) return;
						var dx = e.clientX - dragState.startX;
						var dy = e.clientY - dragState.startY;
						if (Math.abs(dx) > 1 || Math.abs(dy) > 1) dragState.moved = true;
						lightboxPanX = dragState.panX + dx;
						lightboxPanY = dragState.panY + dy;
						applyLightboxZoom();
					});
					$img.on('pointerup pointerleave pointercancel', function() {
						if (dragState.active) {
							dragState.active = false;
							$img.removeClass('is-dragging');
						}
					});
					$img.on('wheel', function(e) {
						e.preventDefault();
						e.stopPropagation();
						var delta = e.originalEvent.deltaY < 0 ? 0.18 : -0.18;
						lightboxZoom = Math.max(1, Math.min(5, lightboxZoom + delta));
						if (lightboxZoom === 1) { lightboxPanX = 0; lightboxPanY = 0; }
						applyLightboxZoom();
					});
					$img.on('touchstart', function(e) {
						if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length === 2) {
							var t1 = e.originalEvent.touches[0];
							var t2 = e.originalEvent.touches[1];
							touchZoomDistance = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY) || null;
						}
					});
					$img.on('touchmove', function(e) {
						if (!e.originalEvent || !e.originalEvent.touches || e.originalEvent.touches.length !== 2 || !touchZoomDistance) return;
						e.preventDefault();
						var t1 = e.originalEvent.touches[0];
						var t2 = e.originalEvent.touches[1];
						var distance = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY) || touchZoomDistance;
						if (distance > 0 && touchZoomDistance > 0) {
							lightboxZoom = Math.max(1, Math.min(5, lightboxZoom * (distance / touchZoomDistance)));
							touchZoomDistance = distance;
							if (lightboxZoom === 1) { lightboxPanX = 0; lightboxPanY = 0; }
							applyLightboxZoom();
						}
					});
					$img.on('touchend touchcancel', function() { touchZoomDistance = null; });
					$img.appendTo($content);
				} else if (tag === 'video') {
					var clone = element.clone();
					clone.attr('controls', true).css({width:'100%', height:'auto'}).appendTo($content);
				} else if (source.match(/\.mp4$/i)) {
					$('<video class="lightbox-media" controls playsinline>').attr('src', source).appendTo($content);
				} else {
					$('<img class="lightbox-media" alt="">').attr('src', source).appendTo($content);
				}
				if (lightboxCaption) $('<p class="lightbox-caption"></p>').text(lightboxCaption).appendTo($content);
				$('#lightbox-prev, #lightbox-next').toggle(lightboxItems.length > 1);
				resetLightboxZoom();
				$overlay.addClass('visible').attr('aria-hidden','false');
			}

			function openLightbox(element) {
				var $element = $(element);
				var $gallery = $element.closest('.project-gallery');
				var collection = $gallery.length
					? $gallery.find('img, video, [data-lightbox-src], [data-full-src], [data-hires-src]').toArray()
					: [$element[0]];
				lightboxItems = collection;
				lightboxIndex = Math.max(0, collection.indexOf($element[0]));
				renderLightbox();
			}

			function moveLightbox(step) {
				if (lightboxItems.length < 2) return;
				lightboxIndex = (lightboxIndex + step + lightboxItems.length) % lightboxItems.length;
				renderLightbox();
			}

			$('.project-gallery img[data-gallery-caption]').each(function() {
				var $image = $(this);
				if ($image.parent().is('figure')) return;
				$image.wrap('<figure class="gallery-figure"></figure>');
				$('<figcaption></figcaption>').text($image.attr('data-gallery-caption')).appendTo($image.parent());
			});

			function closeLightbox() {
				$('#lightbox-overlay').removeClass('visible').attr('aria-hidden','true');
				$('#lightbox-content').empty();
				lightboxZoom = 1;
				lightboxIndex = 0;
			}

			// Attach gallery click handlers
			$(document).on('click', '.project-gallery:not(.project-gallery--links) img, .project-gallery:not(.project-gallery--links) video, .project-gallery:not(.project-gallery--links) [data-lightbox-src], .project-gallery:not(.project-gallery--links) [data-full-src], .project-gallery:not(.project-gallery--links) [data-hires-src], .breakdown-item img, .breakdown-item video', function(e){
				e.preventDefault();
				openLightbox($(this));
			});

			// Close handlers
			$(document).on('click', '#lightbox-close, #lightbox-overlay', function(e){
				if (e.target.id === 'lightbox-overlay' || e.target.id === 'lightbox-close') closeLightbox();
			});
			$(document).on('click', '#lightbox-prev', function() { moveLightbox(-1); });
			$(document).on('click', '#lightbox-next', function() { moveLightbox(1); });
			$(document).on('keyup', function(e){
				if (e.key === 'Escape') closeLightbox();
				if ($('#lightbox-overlay').hasClass('visible') && e.key === 'ArrowLeft') moveLightbox(-1);
				if ($('#lightbox-overlay').hasClass('visible') && e.key === 'ArrowRight') moveLightbox(1);
			});

			function setupCinematicVideo() {
				$('.project-page .project-shell').each(function() {
					var $shell = $(this);
					var $existing = $shell.find('.cinematic-video').first();
					var pageVideo = $shell.attr('data-cinematic-video') || $('body').attr('data-cinematic-video');
					if ($existing.length) {
						var src = $existing.attr('data-cinematic-video') || $existing.find('video').attr('src');
						if (src && !$existing.find('video').length) {
							$('<video class="project-video" controls autoplay muted loop playsinline></video>').attr('src', src).appendTo($existing);
						}
						return;
					}
					if (!pageVideo) return;
					var $section = $('<section class="project-section cinematic-video" data-cinematic-video="' + pageVideo + '"><div class="project-section__header"><h2>Cinematic Video</h2><p>Project cinematic presentation.</p></div><video class="project-video" controls autoplay muted loop playsinline></video></section>');
					$section.find('video').attr('src', pageVideo);
					$section.insertAfter($shell.find('#overview'));
				});
			}

			setupCinematicVideo();

			$('.project-page .project-shell').each(function() {
				if ($(this).find('.project-footer').length) return;
				$('<footer class="project-footer"><a class="button" href="index.html">Back to Portfolio</a></footer>').appendTo(this);
			});
		});
		})(jQuery);
} catch (e) { console.error('main.js error', e); }