$(function() {

	$(".slider_wrap").slideDown();


//линия меню
	$(".top_line .sf-menu").superfish({
		cssArrows: false,
		delay: 100,
		hoverClass: 'no-class' //любой класс, не фигурирующий в проэкте
	});

//выпадающее меню
	$(".sf-menu").after("<div id='my-menu'>");
	$(".sf-menu").clone().appendTo("#my-menu");
	$("#my-menu").find("*").attr("style", ""); 
	$("#my-menu").find("ul").removeClass("sf-menu"); 
	$("#my-menu").mmenu({
		extensions : [ 'widescreen', 'theme-white', 'effect-menu-slide', 'pagedim-black'],
		navbar: {
			title: "Меню"
		}
	});

	var api = $("#my-menu").data("mmenu"); //для возвращения иконки в норм состояние после закрытия
	api.bind("closed", function() {
		$(".toggle-mnu").removeClass("on");
	});

	$(".mobile_mnu").click(function() { //перентом перешли к родительскому my-menu то есть к mobile-mnu и скопировали с него всё в my-menu
		var mmAPI = $("#my-menu").data("mmenu");
		mmAPI.open();
		var thiss = $(this).find(".toggle-mnu");
		thiss.toggleClass("on");
		$(".main-mnu").slideToggle();
		return false;
	});
//слайдер
	var owl = $(".slider");
	owl.owlCarousel({
		loop : true,
		items : 1,
		itemClass : "slide_wrap",
		nav : true,
		navText : ""
	});
	$(".next").click(function(){
		owl.trigger('next.owl.carousel');
	});
	$(".prev").click(function(){
		owl.trigger('prev.owl.carousel');
	});


	//регулировка высоты при изменении объема контента
	$(".service_item h4").equalHeights();
	$(".sect_news .new_item h4").equalHeights();
	$(".sect_news .new_item p").equalHeights();
	$(".link_item .h4").equalHeights();

	//SVG Fallback
	if(!Modernizr.svg) {
		$("img[src*='svg']").attr("src", function() {
			return $(this).attr("src").replace(".svg", ".png");
		});
	};


	$(".popup-with-move-anim").magnificPopup({
		type: 'inline',

		fixedContentPos: false,
		fixedBgPos: true,

		overflowY: 'auto',

		closeBtnInside: true,
		preloader: false,
		
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-slide-bottom'
	});


	//E-mail Ajax Send
	//Documentation & Example: https://github.com/agragregra/uniMail
	$(".callback").submit(function() { //Change
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "mail.php", //Change
			data: th.serialize()
		}).done(function() {
			$(".success").addClass("visible");
			setTimeout(function() {
				// Done Functions
				th.trigger("reset");
				$(".success").removeClass("visible");
				$.magnificPopup.close();
			}, 4000);
		});
		return false;
	});

//Помещаем информцию о форме в текущую форму
	$("a[href=#callback]").click(function () {
		$("#callback .formname").val($(this).data("form"));
	});


	//Chrome Smooth Scroll
	try {
		$.browserSelector();
		if($("html").hasClass("chrome")) {
			$.smoothScroll();
		}
	} catch(err) {
	};

	$("img, a").on("dragstart", function(even) { event.preventDefault(); });

});
