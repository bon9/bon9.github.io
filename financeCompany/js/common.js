$(document).ready(function() {

	$(".toggle_mnu").click(function() {
		$(this).toggleClass("on");
		$(".main_mnu").slideToggle();
		return false;
	});

	//скрол для нижнего выпадающего меню
	$(".main_footer .toggle_mnu").click(function() {
		$("html, body").animate({ scrollTop: $(document).height() }, "slow");
		return false;
	});
	//скрол кнопки хедера
	$(".arrow_bottom").click(function() {
		$("html, body").animate({ scrollTop: $(".main_head").height()+125 }, "slow");
		return false;
	});
	//скролл футера
		$(".top").click(function() {
		$("html, body").animate({ scrollTop: 0 }, "slow");
		return false;
	});

	//регулировка высоты при изменении объема контента
	$(".section_1 .info_item").equalHeights();
	$(".section_3 .section_content .info_item").equalHeights();
	$(".s2_item").equalHeights();
	$(".s2_item .img_wrap").equalHeights();
	// $(".section_4 .card").equalHeights();

//секция 4, 6 появление карт с анимацией
$(".section_4").waypoint(function() {
	$(".section_4 .card").each(function(index) {
		var ths = $(this);
		setInterval(function() {
			ths.removeClass("card_off").addClass("card_on");
		}, 200*index);
		
	});
}, {
	offset : "35%"
});


	$(".section_6").waypoint(function() {

		$(".section_6 .team").each(function(index) {
			var ths = $(this);
			setInterval(function() {
				ths.removeClass("team_off").addClass("team_on");
			}, 200*index);
		});

	}, {
		offset : "35%"
	});

//секция 5 прорисовка (в индексе в <svg> необоходимо указать stroke и stroke-width)

$(".section_5").waypoint(function(dir) {

	if (dir === "down") {

		$(".section_5 .tc_item").each(function(index) {
			var ths = $(this);
			setTimeout(function() {
				var myAnimation = new DrawFillSVG ({
					elementId: "tc-svg-" + index
				});
				ths.removeClass(".tc_content").addClass(".tc_content_on");
			}, 700*index);
		});
	};
	this.destroy();
}, {
	offset : "80%"
});

// Секция 7 Слайдер
	$(".slider").owlCarousel({
		items : 1,
		nav : true,
		navText : "",
		loop : true,
		navSpeed : 600
	});

	$(".section_head h2, .section_head p").animated("fadeIn");
	$(".info_item_wrap").animated("zoomIn");
	$(".slider .slide").animated("rollIn");
	$(".section_8 .forms").animated("fadeInRight");


	$(".section_2").waypoint(function() {
		$(".s2_item_wrap").each(function(index) {
			var ths = $(this);
			setInterval(function() {
				ths.addClass("on");
			}, 200*index);
		});
	}, {
		offset : "30%"
	});

	$(".section_8").waypoint(function() {
		$(".s8_item").each(function(index) {
			var ths = $(this);
			setInterval(function() {
				ths.addClass("on");
			}, 200*index);
		});
	}, {
		offset : "30%"
	});

	//SVG Fallback если не поддерживается svg то заменяет расширение на png
	if(!Modernizr.svg) {
		$("img[src*='svg']").attr("src", function() {
			return $(this).attr("src").replace(".svg", ".png");
		});
	};

	$('.homesect .section_button .buttons').click(function() {
		$("#callback h4").html($(this).text()); //меняем заголовк в каждоый всплывашке
		$("#callback input[name=formname]").val($(this).text());
	}).magnificPopup({
		type:'inline',
		mainClass: "mfp-forms"
});
	//E-mail Ajax Send
	//Documentation & Example: https://github.com/agragregra/uniMail
	$(".forms").submit(function() { //Change
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "/mail.php", //Change
			data: th.serialize()
		}).done(function() {
			alert("Thank you!");
			setTimeout(function() {
				// Done Functions
				$(".forms").trigger("reset");
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

});
