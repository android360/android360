	$( document ).one( "pagecreate",function() {
		$("#pane").panel();
		$("#nav").navbar();
		$("#head, #foot").attr({"data-position":"fixed"}).toolbar();
		$("#head>a,#foot>a").attr({"data-prefetch":true});//预读
	});
	$( document ).on( "pageinit", "[data-role='page']", function() {
		//全局缓存－若影响手机性能则不用
		$.mobile.page.prototype.options.domCache = true;
	//	pageContainerElement.page({ domCache: true });//缓存访问过的页面
		//图片弹出DIV绑定到"back"
		$("[data-role='popup'] a").addClass("ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-right");
		$(".popphoto").css("max-height","512px");
		$("#imgview").css("margin","15px").click(function(){$("#imgview a").click()});
		//定义滑动事件
		$(this).on({
			swipeleft: function(){$("#head a:eq(1)").click()},
			swiperight: function(){$("#head a:eq(2)").click()}
		});
	});
	