var gallery = function(spec)  {
	
	var self = {};
	var slides = $(spec.slides),
		numSlides = slides.length,
		current = 0,
		next = current + 1,
		loaded = [],
		captions = spec.captions || 'none',
		circular = spec.circular || false,
		autoplay = spec.autoplay || false,
		cycleSpeed = spec.cycleSpeed || 4000,
		transSpeed = spec.transSpeed || 800,
		jumpSpeed = spec.jumpSpeed || cycleSpeed,
		transFX = spec.transFX || 'fade';

	self.prepSlides = function(which)  {
		var which = which || current;
		slides.not(slides.eq(which)).css('opacity', 0)
			.end()
			.eq(which).children(captions).css({
				visibility: 'visible',
				opacity: 1
			});
	};

	self.startSlideshow = function(whichSlide, options)  {
		options = options || {};
		var reset = options.reset || false;
		
		if (whichSlide >= 0)  {
			if (current > 0 && reset === true)  {
				self.prepSlides(0);
			}
			self.advanceSlide(whichSlide);
		}
		autoplay = setInterval(function()  {
			self.advanceSlide();
		}, cycleSpeed);
	};
	
	self.stopSlideshow = function()  {
		clearInterval(autoplay);
	}

	self.loadSlide = function(whichSlide, surrounding)  {
		var lazySlide = slides.eq(whichSlide).find('img'),
			nextLazy = whichSlide + 1,
			prevLazy = whichSlide -1;
		
		// load image if not already loaded
		if (!loaded.contains(whichSlide))  {
			lazySlide.attr('src', lazySlide.attr('data-slidesrc'));
			loaded.push(whichSlide);
		}
		if (surrounding)  {
			if (nextLazy < numSlides && !loaded.contains(nextLazy))  {
				self.loadSlide(nextLazy);
			}
			if (prevLazy >= 0 && !loaded.contains(prevLazy))  {
				self.loadSlide(prevLazy);
			}
		}
		return lazySlide;
	};
	
	self.advanceSlide = function(jumpTo)  {
		var jumpTo = parseInt(jumpTo);
		var speed = transSpeed;
		var currentSlide, nextSlide;
		if (jumpTo >= 0)  {
			next = jumpTo;
			speed = jumpSpeed;
		}  else if (jumpTo < 0)  {
			next = current + jumpTo;
			if (next < 0 && circular)  {
				next += numSlides;
			}
		}  else  {
			next = current + 1;
			if (next === numSlides && circular)  {
				next = 0;
			}
		}
		self.loadSlide(next, true);
		if (next >= 0 && next < numSlides)  {
			if (transFX === 'fade')  {
				slides.eq(current).stop(true, true).animate({'opacity': 0}, speed)
					.children(captions).stop(true, true)
					.animate({'opacity': 0}, speed, function()  {
						$(this).css('visibility', 'hidden');
					});
				slides.eq(next).stop(true, true).animate({'opacity': 1}, speed)
						.children(captions).stop(true, true)
						.css('visibility', 'visible').animate({'opacity': 1}, 200);	
			}  else if (transFX === 'slide')  {
				if (jumpTo < 0)  {
					slides.eq(current).hide('slide', {direction: 'right'}, speed);
					slides.eq(next).show('slide', {direction: 'left'}, speed);
				}  else  {
					slides.eq(current).hide('slide', {direction: 'left'}, speed);
					slides.eq(next).show('slide', {direction: 'right'}, speed);
				}
			}
			current = next;
		}
	};
	
	self.getCurrentSlideNum = function()  {
		return current + 1;
	};
	self.getNumSlides = function()  {
		return numSlides;
	};

	self.prepSlides();
	self.loadSlide(next, true, function()  {
		if (autoplay)  {
			self.startSlideshow();
		}
	}());
	
	return self;
};

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
