var gallery = function(spec)  {
	
	var self = {};
	var slides = $(spec.slides),
		numSlides = slides.length,
		next, current = 0,
		controls = $(spec.controls),
		autoplay,
		cycleSpeed = spec.cycleSpeed || 4000,
		transSpeed = spec.transSpeed || 800,
		jumpSpeed = spec.jumpSpeed || cycleSpeed,
		transFX = spec.transFX || 'fade';

	// Set up sizes
	var initControls = function()  {
		// controls.on('click', 'a', function(event)  {
		// 	event.preventDefault();
		// 	var clicked = $(this).parent().index();
		// 	clearInterval(autoplay);
		// 	if (clicked != current)  {
		// 		controls.removeClass('selected');
		// 		$(this).parent().addClass('selected');
		// 		self.advanceSlide(clicked);
		// 		self.startSlideshow();
		// 	}
		// })
		// var dots = '';
		// for (var i=0; i < slides.length; i++)  {
		// 	var slideID = "#" + i + "";
		// 	dots += '<button id="'+i+'"></button>';
		// }
		// controls.html(dots);
		// container.append(controls);
		// $('#' + current).addClass('current');
		// 
		// // Functionality:  stops slideshow and jumps to corresponding slide
		// controls.on('click', 'button', function(event)  {
		// 	self.stopSlideshow();
		// 	self.advanceSlide($(this).attr('id'));
		// });
	};

	self.startSlideshow = function(whichSlide, options)  {
		options = options || {};
		var reset = false || options.reset;
		
		if (whichSlide >= 0)  {
			if (current > 0 && reset === true)  {
				slides.filter(':gt(0)').css('display', 'none');
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

	self.advanceSlide = function(jumpTo)  {
		var speed = transSpeed;
		if (jumpTo >= 0)  {
			next = jumpTo;
			speed = jumpSpeed;
		}  else if (jumpTo < 0)  {
			next = (current + jumpTo) < 0 ? numSlides - 1 : current + jumpTo;
		}  else  {
			next = (current + 1) == numSlides ? 0 : current + 1;
		}
		if (transFX === 'fade')  {
			$(slides[current]).fadeOut(speed);
			$(slides[next]).fadeIn(speed);
		}  else if (transFX === 'slide')  {
			if (jumpTo < 0)  {
				$(slides[current]).hide('slide', {direction: 'right'}, speed);
				$(slides[next]).show('slide', {direction: 'left'}, speed);
			}  else  {
				$(slides[current]).hide('slide', {direction: 'left'}, speed);
				$(slides[next]).show('slide', {direction: 'right'}, speed);
			}
		}
		setTimeout(function()  {
			controls.removeClass('selected');
			controls[next].className = 'selected';
			current = next;
		}, 100);
	};
	
	initControls();
	self.startSlideshow();
	return self;
	
};
