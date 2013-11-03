$(function()  {	

	//  Manage default text in form fields
	var txtFields = 'input:text, input:password, textarea, select';
	$('form').on('focus', txtFields, function()  {
		$(this).addClass('has-focus');
	}).on('keypress', txtFields, function()  {
		if ($.trim(this.value) == '')  {
			$(this).removeClass('has-focus').addClass('has-input');
		}
	}).on('keyup', txtFields, function(event)  {
		if (event.keyCode == 8 && $.trim(this.value) === '')  {
			// alert($.trim(this.value));
			$(this).removeClass('has-input').addClass('has-focus');
		}
	}).on('blur', txtFields, function()  {
		$(this).removeClass('has-focus');
		if ($.trim(this.value) === '')  {
			$(this).removeClass('has-input');
		}
	}).on('change', 'select', function()  {
		if ($.trim(this.value) !== '')  {
			$(this).addClass('has-input');
		}  else  {
			$(this).removeClass('has-input').addClass('has-focus');
		}
	});
	
	if ($('.tabs').length)  {
		var tabs = $('.tabs li'),
			panels = $('.panels li');
			
		tabs.on('click', 'a', function()  {
			event.preventDefault();
			$(this).closest('li').addClass('showing').siblings().removeClass('showing');
			$(this.hash).siblings().hide().end().show();
		})
	}

});
