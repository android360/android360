	$( document ).one( "pagecreate",function() {
		$("#nav").navbar();
		$("#head, #foot").attr({"data-position":"fixed"}).toolbar();
	});
	$( document ).on( "pageinit", "[data-role='page']", function() {
		$("#head a,#ilist a").attr("data-prefetch","true");//预读页面
		//全局缓存－若影响手机性能则不用
		$.mobile.page.prototype.options.domCache = true;
	//	pageContainerElement.page({ domCache: true });//缓存访问过的页面
		//index列表项名称/title
		var pati= new Array("共荣桂平","今日特价","今周特价","限时优惠","节日预告","店长推荐");
		//声明名称和价格/数量＝冒泡＝列表长度
		var daya= ["红牛","加多宝","可口可乐","旺旺大礼包"];
		var dayb= ["￥6","￥5","￥2","￥18"];
		//添加计数冒泡类
		$("#ilist span").addClass("ui-li-count");
		$('#ilist').each(function(){
			$("#ilist h2:eq(0)").text(pati[1]);
			$("#ilist h2:eq(1)").text(pati[2]);
			$("#ilist h2:eq(2)").text(pati[3]);
			$("#ilist h2:eq(3)").text(pati[4]);
			$("#ilist h2:eq(4)").text(pati[5]);
			$("#ilist span:eq(0)").text(daya.length);/*
			$("#ilist span:eq(1)").text(weeka.length);
			$("#ilist span:eq(2)").text(timea.length);
			$("#ilist span:eq(3)").text(holia.length);
			$("#ilist span:eq(4)").text(manaa.length);*/
			$(this).listview("refresh");
		});
		//添加名称和价格到列表
		$("#imgu").each(function(){
			$("#imgla h2:eq(0)").text(daya[1]);
			$("#imgla h2:eq(1)").text(dayb[1]);
			$(this).listview("refresh");
		});
		//给"page"添加"data-title"属性
		$("#index").attr({"data-title" : pati[0]})
		$("#apage").attr({"data-title" : pati[1]})
		$("#bpage").attr({"data-title" : pati[2]})
		$("#cpage").attr({"data-title" : pati[3]})
		$("#dpage").attr({"data-title" : pati[4]})
		$("#epage").attr({"data-title" : pati[5]})
		//修改header-title文本，文本值current
		var current = $( this ).jqmData( "title" );
		$( "#head h1" ).text( current );
		//给header<a>赋值
		$( "#head a:eq(0)").addClass("ui-btn-left ui-icon-home ui-btn-icon-notext");
		$( "#head a:eq(1)").each(function() {
		  if ( current == pati[0] ) {
			$("#head a:eq(0)").removeClass("ui-icon-home").addClass("ui-icon-grid");
			$(this).text(pati[5]);
			$("#head a:eq(2)").text(pati[1]);
		  }else if ( current == pati[1] ) {
			$(this).text(pati[0]);
			$("#head a:eq(2)").text(pati[2]);
		  }else if ( current == pati[2] ) {
			$(this).text(pati[1]);
			$("#head a:eq(2)").text(pati[3]);
		  }else if ( current == pati[3] ) {
			$(this).text(pati[2]);
			$("#head a:eq(2)").text(pati[4]);
		  }else if ( current == pati[4] ) {
			$(this).text(pati[3]);
			$("#head a:eq(2)").text(pati[5]);
		  }else if ( current == pati[5] ) {
			$(this).text(pati[4]);
			$("#head a:eq(2)").text(pati[0]);
		  }
		});
		//图片弹出DIV绑定到"back"/图片绑定到imgl
		$("#imglb img").clone().appendTo("#imgvb");
		$("#imgu li:eq(0) a:eq(0)").addClass("popphoto").attr({ "data-rel":"popup","data-position-to":"window","data-transition":"pop" })
		$("[data-role='popup'] img").addClass("popphoto").css("max-height","512px");
		$("[data-role='popup'] a").addClass("ui-icon-check ui-btn-icon-notext ui-btn-right");
		$("[data-role='popup']").css("margin","15px").click(function(){ $("[data-role='popup'] a").click(); });
	});
	$( document ).on("mobileinit",function(){
		//定义滑动事件
		$(".ui-content").on({
			swipeleft: function(){$("#head a:eq(1)").click()},
			swiperight: function(){$("#head a:eq(2)").click()}
		});
	});