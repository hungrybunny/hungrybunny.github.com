var gallery = function(spec)  {
	
	var self = {};
	var slides = $(spec.slides),
		numSlides = slides.length,
		next, current = 0,
		loaded = [],
		captions = spec.captions || 'none',
		controls = $(spec.controls) || '',
		circular = spec.circular || false,
		autoplay = spec.autoplay || false,
		randomStart = spec.randomStart || false,
		cycleSpeed = spec.cycleSpeed || 4000,
		transSpeed = spec.transSpeed || 800,
		jumpSpeed = spec.jumpSpeed || cycleSpeed,
		transFX = spec.transFX || 'fade';

	if (randomStart)  {
		current = Math.floor(Math.random() * (numSlides));
	}
	
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
			if ((next === numSlides) && circular)  {
				next = 0;
			}
		}
		self.loadSlide(next, true);
		if (next >= 0 && next < numSlides)  {
			slides.removeClass('current').eq(next).addClass('current');
			current = next;
		}
	};
	
	self.getCurrentSlideNum = function()  {
		return current + 1;
	};
	self.getNumSlides = function()  {
		return numSlides;
	};

	self.loadSlide(current, true, function()  {
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

