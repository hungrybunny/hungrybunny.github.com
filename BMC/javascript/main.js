$(function()  {	

	var bmcSite = BMC.init();
	// bmcSite.header.toggleLangAlert(true);

});

//  Manage default text in form fields
$('form textarea, form input:text').focus(function()  {
	$(this).addClass('has-input');
	if (this.value == this.defaultValue)  {
		this.value = '';
	}
});
$('form textarea, form input:text').blur(function()  {
	if ($.trim(this.value) == '')  {
		this.value = (this.defaultValue ? this.defaultValue : '');
		$(this).removeClass('has-input');
	}
});

var BMC = function()  {
	var self = {};
	
	self.init = function()  {
		var win = $(window),
			doc = $(document),
			site = {};
			
		site.header = initHeader();
		site.menu = initMenu();
	
		if ($('#cover').length)  {
			(function()  {
				win.unbind('scroll', site.header.headerBar.offWeGo);
				win.unbind('scroll', site.menu.sideBtns.offWeGo);
				site.header.headerBar.offWeGo({mode: 'outset', position: 'absolute'});
				site.menu.sideBtns.offWeGo({mode: 'outset', position: 'absolute'});

				var cover = $('#cover'),
					brandBar = $('#branding'),
					utility = $('#utility'),
					masthead = $('#cover h1'),
					tagline = $('#cover h2'),
					mhBottom, bbTop;

				site.masthead = followScroll({
					elem: '#cover h1',
					cushionTop: masthead.css('top')
				});

				cover.find('img').imagesLoaded(function()  {
					win.scrollTop(0);
					mhBottom = masthead.offset().top + masthead.height();

					if (cover.height() > win.height() - 250)  {
						if (win.height() - 250 < mhBottom + 20)  {
							cover.height(mhBottom + 20);
						}  else  {
							cover.height(win.height() - 250);
						}
					}
					brandBar.css('top', cover.height()  + brandBar.height());
					utility.css('top', brandBar.offset().top  + brandBar.height());
					bbTop = brandBar.offset().top;

					win.scroll(anchorHeader);
				});

				// click masthead tagline to scroll to main content
				tagline.on('click', function(event)  {
					event.preventDefault();
					$('html, body').animate({scrollTop: $('#main').offset().top - brandBar.height()}, 500);
				});

				// monitor brand bar position to trigger lock					
				var anchorHeader = function() {

					// fade masthead according to brand bar position
					masthead.css('opacity', (bbTop - win.scrollTop()) / mhBottom - .3);

					// once brand bar reaches top of window
					if (win.scrollTop() >= brandBar.offset().top)  {
						win.unbind('scroll', site.masthead.offWeGo);

						brandBar.css({
							position: 'fixed',
							top: 60,
							left: 60 - $(window).scrollLeft()
						});
						utility.css({
							position: 'fixed',
							top: 60,
							left: 60 - $(window).scrollLeft()
						});
						masthead.css({
							position: 'absolute',
							left: site.masthead.outsetLeft,
							opacity: 1
						});
						cover.css({
							paddingBottom: 0,
							paddingTop: 60
						});
						win.scroll(site.header.headerBar.offWeGo);
						win.scroll(site.menu.sideBtns.offWeGo);
						win.unbind('scroll', anchorHeader);
					}
				};
			})();
		}
		
		if ($('#pg-standard').length)  {
			waitForWebfonts([
				{
					which: 'Utopia W01 SmBd It',
					where: '#article h1'
				}, {
					which: 'Utopia W01 It',
					where: '#article h2'
				}
			], function() {
				standardTitle(initSocial);
			});
		}

		if ($('#btn-gallery').length)  {
			initGallery();
		}

		if ($('form .filter').length)  {
			initFilters();
		}
		
		if ($('#article #social-actions').length && $('#pg-standard').length <= 0)  {
			initSocial();
		}

		// make entire article summary pods clickable wherever present
		if ($('.article-listing').length)  {
			$('.article-listing').on('click', 'li', function()  {
				window.location.href = $(this).find('a:last').attr('href');
			});
		}
		
		return site;
	}
	
	var initHeader = function()  {
		var self = {};
		self.headerBar = followScroll({
			elem: '#branding',
			landmark: '#footer',
			until: 'touching',
			cushionTop: 60
		});
		
		// set up language picker
		var languages = $('#branding .locale ul');
		var unavailable = $('#language-unavailable');
		$('#branding').on('click', '.locale > a, .locale .selected, .close-widget', function(event)  {
			event.preventDefault();
			languages.toggleClass('expanded');
		});
		
		
		self.toggleLangAlert = function(showAlert)  {
			var show = showAlert || false;
			if (show === true)  {
				unavailable.fadeIn(170);
			}  else  {
				unavailable.fadeOut(170);
			}
		};

		languages.on('click', 'li a:not(.close-widget)', function(event)  {
			event.preventDefault();
			languages.find('li').removeClass('selected');
			$(this).parent().addClass('selected');
			if (this.hash === '#french')  {
				unavailable.fadeIn(170);
			}
		});
		
		unavailable.on('click', 'a', function(event)  {
			event.preventDefault();
			unavailable.fadeOut(170);
		})
		
		return self;
	}
	
	var initMenu = function()  {
		var posFix;
		var utility = $('#utility');
		var menu = {};
		menu.sideBtns = followScroll({
			elem: '#utility',
			cushionTop: 60
		});

		utility.on('click', '.sections > a', function(event)  {
			event.preventDefault();
			clearTimeout(posFix);
			var self = $(this);
			if (menu.sideBtns.elem.css('position') === 'fixed')  {
				menu.sideBtns.offWeGo({mode: 'stay'}, function()  {
					self.parent().toggleClass('expanded');
				}());
			}  else  {
				self.parent().toggleClass('expanded');
			}
		}).mouseleave(function()  {
			utility.find('.expanded').removeClass('expanded');
			if (menu.sideBtns.elem.css('position') === 'fixed')  {
				menu.sideBtns.offWeGo({mode: 'stay'}, function()  {
					posFix = setTimeout(menu.sideBtns.offWeGo, 1000);
				});
			}
		}).find('.search > a').fancybox({
			margin: $('#branding').height(),
			padding: 0,
			autoScale: false,
			overlayColor: '#000000',
			showCloseButton: false,
			onComplete: function()  {
				$('#search-site').find('input[name=searchterm]').focus();
			}
		});
		
		$('#search-site').on('click', '.pop-close', function(event)  {
			event.preventDefault();
			$.fancybox.close();
		});

		// initialize slideout updates widget by cloning from footer
		var updatesBtn = utility.find('.updates');
		var updatesWidget = updatesBtn.append($('.get-updates').clone(true))
			.find('.get-updates')
			.prepend('<a href="#close" class="close-widget">Close</a>');
		
		updatesBtn.on('click', 'a', function(event)  {
			event.preventDefault();				
			clearTimeout(posFix);
			
			if (menu.sideBtns.elem.css('position') === 'fixed')  {
				if (updatesWidget.hasClass('expanded'))  {
					posFix = setTimeout(menu.sideBtns.offWeGo, 1000);
					updatesWidget.removeClass('expanded');
				}  else  {
					menu.sideBtns.offWeGo({mode: 'stay'}, function()  {
						updatesWidget.addClass('expanded');
					}());
				}
			}  else  {
				updatesWidget.toggleClass('expanded');
			}
		});	
		
		return menu;
	};

	var initSocial = function ()  {
		var self = {};
		var posFix, commentsWidget;
		var commentBtn = $('#social-actions .comment');
		
		if (commentBtn.find('.pipe-up').length)  {
			return false;			
		}
			
		// initialize slideout comments widget by cloning inline module
		commentsWidget = commentBtn.append($('.pipe-up').clone(true))
			.find('.pipe-up')
			.prepend('<a href="#close" class="close-widget">Close</a>');

		commentBtn.on('click', 'a', function(event)  {
			event.preventDefault();
			clearTimeout(posFix);

			if (commentsWidget.hasClass('expanded'))  {
				posFix = setTimeout(self.socialMenu.offWeGo, 1000);
				commentsWidget.removeClass('expanded');
			}  else  {
				self.socialMenu.offWeGo({mode: 'stay'}, function()  {
					commentsWidget.addClass('expanded');
				}());
			}
		});	
		
		// follow scroll until end of article is reached
		self.socialMenu = followScroll({
			elem: '#social-actions',
			landmark: '#social-badges',
			until: 'touching',
			cushionTop: 66
		});

		return self;
	};
	
	var initFilters = function()  {
		var filters = $('form .filter');
		filters.find('input:checked').addClass('checked');

		filters.on('click', 'label', function()  {
			var clicked = $('#' + $(this).attr('for')),
				filterName = clicked.attr('name'),
				radioBtns;
			if (filterName !== '')  {
				radioBtns = $('#filter-by input[name=' + filterName + ']');
			}
				
			if (clicked.hasClass('checked'))  {
				clicked.removeClass('checked');
			}  else  {
				if (filterName !== '')  {
					radioBtns.removeClass('checked');
				}
				clicked.addClass('checked');
			}		
		});
	};
	
	// lay out headline block for Standard Article (standard.html)
	var standardTitle = function(callback)  {
		var article = $('#pg-standard #article'),
			hero = $('#pg-standard .article-hero'),
			intro = $('#pg-standard .article-intro'),
			introH = intro.outerHeight(true),
			origPadding = parseInt(article.css('paddingTop'));
			
		article.css({paddingTop: '+=' + introH});
		hero.css({marginTop: 0 - origPadding - introH});
		intro.css({
			top: origPadding,
			left: 0 - hero.css('marginLeft')
		});
		
		if (callback)  {
			callback();
		}
	};
	
	var initGallery = function()  {
		var dashboard = $('#gallery-dashboard'),
			translation = dashboard.find('h4').html(),
			origW, origH;
		var slideshow = gallery({
			slides: '#slides li',
			captions: 'div',
			transSpeed: 400
		});
		
		var sizeToFit = function()  {
			var fittedWidth, fittedHeight, scaleAmt;
			if ($(window).height() < $('#gallery').height() + $('#branding').height())  {
				fittedHeight = $(window).height() - $('#branding').height();
				scaleAmt = fittedHeight / $('#slides img').height();
				fittedWidth = $('#slides img').width() * scaleAmt;
				$('#slideshow, #slides li').width(fittedWidth);
				$('#slides li > *').css('max-width', fittedWidth);
			}
		};
		
		var sizeCaption = function()  {
			var slideImg = $('#slides img').eq(slideshow.getCurrentSlideNum() - 1);
			
			slideImg.imagesLoaded(function()  {
				var imgW = slideImg.width();
				slideImg.siblings('.img-caption').css({
					width: imgW,
					marginLeft: ($('#slideshow').width() - imgW) / 2
				});
			});
		}
		
		$('#btn-gallery').fancybox({
			margin: $('#branding').height(),
			padding: 0,
			autoScale: false,
			freeFloating: false,
			scrolling: 'no',
			showCloseButton: false,
			overlayColor: '#000000',
			overlayOpacity: 1,
			onStart: function()  {
				$('#branding').css('box-shadow', 'none');
				$('#gallery').css('visibility', 'hidden');
			},
			onComplete: function()  {
				$('#fancybox-wrap').css('left', 60);
				$('#slides li:first-child img:first-child').imagesLoaded(function()  {
					sizeToFit(function()  {
						followScroll({
							elem: '#gallery',
							cushionTop: $('#branding').height()
						});
						$('#gallery').css({
							visibility: 'visible'
						});
					}());
					sizeCaption();
				});
			},
			onClosed: function()  {
				$('#branding').css('box-shadow', '1px 0 15px 0 #525252');
			}
		}).css('z-index', 10);

		dashboard.find('h4').html(
			'<strong>' + slideshow.getCurrentSlideNum() + '</strong> ' + translation + ' ' + slideshow.getNumSlides()
		);
		
		dashboard.parent().on('click', 'a', function(event)  {
			event.preventDefault();
			var clicked = event.target.hash.replace('#', '');
			switch (clicked)  {
				case 'previous':
					slideshow.advanceSlide(-1);
					break;
				case 'next':
					slideshow.advanceSlide();
					break;
				case 'close':
					$.fancybox.close();
			}
			sizeCaption();
			dashboard.find('h4 strong').html(slideshow.getCurrentSlideNum());
		});
		
		$(window).resize(function()  {
			sizeToFit();
		});
	};
	
	return self;
}();


var followScroll = function(spec)  {
	var win = $(window),
		doc = $(document);
	var self = {};
	
	self.elem = $(spec.elem);
	self.landmark = spec.landmark ? $(spec.landmark) : 'none';
	self.until = spec.until || 'in view';
	self.cushionTop = spec.cushionTop || 0;
	self.cushionLeft = spec.cushionLeft || 0;
	self.outsetTop = self.elem.css('top') === 'auto' ? 0 : self.elem.css('top');
	self.outsetLeft = self.elem.css('left') === 'auto' ? 0 : self.elem.css('left');
	self.startPos = self.elem.offset();
	self.startPos.top -= parseInt(self.elem.css('marginTop'));
	self.startPos.left -= parseInt(self.elem.css('marginLeft'));
	
	if (self.landmark === 'none')  {
		self.landmarkPos = doc.height();
		self.stopPos = doc.height();
	}  else  {
		self.landmarkPos = self.landmark.offset();
		self.stopPos = self.landmarkPos.top;
		self.whatmeep = self.stopPos - self.startPos.top - $(window).height();
		if (self.until === 'touching')  {
			self.tripwire1 = self.startPos.top - self.cushionTop;
			self.tripwire2 = self.landmarkPos.top - self.elem.outerHeight() - self.cushionTop;
			self.stopPos = self.landmarkPos.top - self.elem.outerHeight() - self.startPos.top;
			if (self.tripwire2 < self.stopPos)  {
				self.tripwire2 = self.stopPos;
			}
		}  else  {	// until landmark is in view (...not sure if fully done...)
			self.tripwire1 = self.startPos.top - self.cushionTop;
			self.tripwire2 = self.landmarkPos.top - win.height() - self.cushionTop;
			self.stopPos = (self.whatmeep < 0) ? 0 : self.stopPos - win.height() - self.startPos.top;
		}
	}
	
	self.offWeGo = function(options)  {
		var blah = {};
		blah.options = options || {};
		var	mode = blah.options.mode || '',
			position = blah.options.position || 'relative',
			whereStop = self.stopPos,
			currentPos = win.scrollTop();

		if (mode === 'outset' || currentPos < self.tripwire1)  {
			// before start
			self.elem.css({
				position: position,
				top: self.outsetTop,
				left: self.outsetLeft
			});
		}  else if (mode === 'stay' || currentPos > self.tripwire2)  {
			if (mode === 'stay')  {
				if (currentPos > self.tripwire2)  {
					whereStop = self.stopPos;
				}  else if (currentPos > self.tripwire1)  {
					whereStop = currentPos - self.tripwire1;
				}  else  {
					whereStop = currentPos;
				}
			}
			self.elem.css({
				position: 'relative',
				top: whereStop,
				left: 0
			});
		}  else if (mode === 'follow' || currentPos >= 0)  {
			self.elem.css({
				position: 'fixed', 
				top: self.cushionTop,
				left: self.startPos.left - win.scrollLeft()
			});
		}	
	};

	win.scroll(self.offWeGo);

	return self;
};

function waitForWebfonts(fonts, callback) {
	var loaded = [],
		checksum = fonts.length,
		i, l, muzak;
	
	var DEBUG = false;
	if (DEBUG)  {  // start
		var inspect = $('<div id="debug" />').prependTo('#main');
	}  // debug: end
		
	var testFont = function(font, specimen)  {		
		var self = {},
			specimen = specimen || 'giItT1WQy@!-/#',
			node, preWidth,
			muzak;
		
		if (typeof specimen === 'string')  {
			node = $('<span>', {text: specimen}).appendTo('body').css({
				left: 0,
				bottom: '100%',
				fontSize: '300px'
			});
		}  else  {
			specimen.wrapInner('<span />');
			node = specimen.find('span:first');
		}
		
		node.css({
			position: 'absolute',
			fontFamily: 'Times New Roman',
			fontVariant: 'normal',
			fontStyle: 'normal',
			fontWeight: 'normal',
			letterSpacing: 0,
			whiteSpace: 'nowrap',
			visibility: 'hidden'
		});
		
		preWidth = node[0].offsetWidth;
		node.css('fontFamily', font);
		
		if (DEBUG)  {  // start
			// node.css('visibility', 'visible');
			inspect.html(inspect.html() + node.text().split(' ', 1) + ' (w1) &ndash; <b>' + preWidth + '</b><br>');
		}  // debug: end
		
		self.fontLoaded = function()  {
			if (node[0] && node[0].offsetWidth !== preWidth)  {
				clearInterval(muzak);
				var parent = node.parent();

				if (DEBUG)  {  // start
					inspect.html(inspect.html() + node.text().split(' ', 1) + ' (w2) &ndash; <b>' + node[0].offsetWidth + '</b><br>');
					inspect.html(inspect.html() + parent[0].tagName + ' (h) &ndash; <b>' + parent[0].offsetHeight + '</b><br>');
				}  // debug: end
				
				if (typeof specimen === 'string')  {
					node[0].parentNode.removeChild(node[0]);
					node[0] = null;
				}  else  {
					var newH = node.css({
						width: parent.width(),
						whiteSpace: 'normal'
					}).height();

					if (DEBUG)  {  // start
						inspect.html(inspect.html() + node.text().split(' ', 1) + ' (h) &ndash; <b>' + newH + '</b><br>');
					}  // debug: end
					parent.height(newH);
					node.contents().unwrap();
				}
				
				if (DEBUG)  {  // start
					inspect.html(inspect.html() + parent[0].tagName + ' (h) &ndash; <b>' + parent[0].offsetHeight + '</b><br>&nbsp;<br>');
				}  // debug: end
				
				loaded++;
				return true;
			}
		}
		
		if (!self.fontLoaded())  {
			muzak = setInterval(self.fontLoaded, 50); 
		}
		
		return node;
	}
	
	for (i = 0, l = fonts.length; i < l; i++) {
        (function(font) {
			var i, l, width;
			var elements = font.where.split(',') || [];
            
			testFont(font.which);

			for (i = 0, l = elements.length; i < l; i += 1)  {
				(function(el)  {
					testFont(font.which, $(el));
				})(elements[i]);
				checksum++;
			}			
        })(fonts[i]);
    }
	
	var fontsComplete = function()  {
		if (loaded === checksum)  {
			clearInterval(muzak);
			callback();
			return true;
		}
	};
	if (!fontsComplete())  {
		muzak = setInterval(fontsComplete, 50);
	}
};
