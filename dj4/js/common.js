$(function() {

function initSize() { //функция для перерасчета размеров окна 
		$(".box_mnu .panel-heading").each(function() { //левый бордер у стрелочки в гармошке
		var ph = $(this).height() + 8;
		var pdt = $(this).find(".dropdown-toggle");	
		pdt.height(ph);
	});

	$(".till_item .tc").each(function() { //текст по центру в плитках
		var parh = $(this).parent().height();
		$(this).height(parh);
	});
};

	initSize(); //определение размера первого открытия

	$(window).resize(function() { //применение ф-ции перерасчета при изменении окна
		initSize();
	});



	//SVG Fallback
	if(!Modernizr.svg) {
		$("img[src*='svg']").attr("src", function() {
			return $(this).attr("src").replace(".svg", ".png");
		});
	};

	//E-mail Ajax Send
	//Documentation & Example: https://github.com/agragregra/uniMail
	$("form").submit(function() { //Change
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "mail.php", //Change
			data: th.serialize()
		}).done(function() {
			alert("Thank you!");
			setTimeout(function() {
				// Done Functions
				th.trigger("reset");
			}, 1000);
		});
		return false;
	});

	//Chrome Smooth Scroll
	try {
		$.browserSelector();
		if($("html").hasClass("chrome")) {
			$.smoothScroll();
		}
	} catch(err) {

	};

	$("img, a").on("dragstart", function(event) { event.preventDefault(); });

});
