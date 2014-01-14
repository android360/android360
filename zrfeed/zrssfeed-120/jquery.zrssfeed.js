/**
 * Plugin: jquery.zRSSFeed
 * 
 * Version: 1.2.0
 * (c) Copyright 2010-2013, Zazar Ltd
 * 
 * Description: jQuery插件RSS显示通过谷歌饲料API供稿
 *              (基于原始插件的jQuery方法文档jGFeed. Filesize function by Cary Dunn.)
 * 
 * History:
 * 1.2.0 - 添加的月份名称为日期格式
 * 1.1.9 - 新dateformat选项允许进料日期格式
 * 1.1.8 - 加入历史选项以启用得分王进谷歌API中
 * 1.1.7 - 添加饲料偏移，链接重定向和链接内容选项
 * 1.1.6 - 添加排序选项
 * 1.1.5 - 目标选项现在适用于所有饲料环节
 * 1.1.4 - 添加选项，隐藏的媒体，现在压缩与谷歌关闭
 * 1.1.3 - 检查有效的发布日期
 * 1.1.2 - 由于jQuery的1.4.2后发出带有ajaxStop这样添加的用户的回调函数
 * 1.1.1 - 更正为null的xml条目和媒体的支持与jQuery < 1.5
 * 1.1.0 - 增加了对媒体的支持，机箱标签
 * 1.0.3 - 饲料添加链接目标
 * 1.0.2 - 修正了GET参数（SEB菲尔德）和SSL选项
 * 1.0.1 - 纠正问题的多个实例
 *
 **/

(function($){

	$.fn.rssfeed = function(url, options, fn) {	
	
		// 设置默认的插件
		var defaults = {
			limit: 10,
			offset: 1,
			header: true,
			titletag: 'h4',
			date: true,
			dateformat: 'datetime',
			content: true,
			snippet: true,
			media: true,
			showerror: true,
			errormsg: '',
			key: null,
			ssl: false,
			linktarget: '_self',
			linkredirect: '',
			linkcontent: false,
			sort: '',
			sortasc: true,
			historical: false
		};  
		var options = $.extend(defaults, options); 
		
		// Functions
		return this.each(function(i, e) {
			var $e = $(e);
			var s = '';

			// 检查SSL协议
			if (options.ssl) s = 's';
			
			// 添加饲料级用户的div
			if (!$e.hasClass('rssFeed')) $e.addClass('rssFeed');
			
			// 检查有效的URL
			if(url == null) return false;

			// 添加起始偏移量养活长度
			if (options.offset > 0) options.offset -= 1;
			options.limit += options.offset;
			
			// 创建谷歌API的饲料地址
			var api = "http"+ s +"://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" + encodeURIComponent(url);
			api += "&num=" + options.limit;
			if (options.historical) api += "&scoring=h";
			if (options.key != null) api += "&key=" + options.key;
			api += "&output=json_xml"

			// 发送请求
			$.getJSON(api, function(data){
				
				// 检查错误
				if (data.responseStatus == 200) {
	
					// 加工饲料
					_process(e, data.responseData, options);

					// 用户可选的回调函数
					if ($.isFunction(fn)) fn.call(this,$e);
					
				} else {

					// 如果需要处理错误
					if (options.showerror)
						if (options.errormsg != '') {
							var msg = options.errormsg;
						} else {
							var msg = data.responseDetails;
						};
						$(e).html('<div class="rssError"><p>'+ msg +'</p></div>');
				};
			});				
		});
	};
	
	// 函数来创建HTML结果
	var _process = function(e, data, options) {

		// 获取JSON提要数据
		var feeds = data.feed;
		if (!feeds) {
			return false;
		}
		var rowArray = [];
		var rowIndex = 0;
		var html = '';	
		var row = 'odd';
		
		// 获取XML数据的介质（ ParseXML中不作为需要1.5 + ）
		if (options.media) {
			var xml = _getXMLDocument(data.xmlString);
			var xmlEntries = xml.getElementsByTagName('item');
		}
		
		// 添加标题如果需要的话
		if (options.header)
			html +=	'<div class="rssHeader">' +
				'<a href="'+feeds.link+'" title="'+ feeds.description +'">'+ feeds.title +'</a>' +
				'</div>';
			
		// Add body
		html += '<div class="rssBody">' +
			'<ul>';


		// Add feeds
		for (var i=options.offset; i<feeds.entries.length; i++) {
			
			rowIndex = i - options.offset;
			rowArray[rowIndex] = [];

			// Get individual feed
			var entry = feeds.entries[i];
			var pubDate;
			var sort = '';
			var feedLink = entry.link;

			// 申请排序列
			switch (options.sort) {
				case 'title':
					sort = entry.title;
					break;
				case 'date':
					sort = entry.publishedDate;
					break;
			}
			rowArray[rowIndex]['sort'] = sort;

			// 格式出版日期
			if (entry.publishedDate) {

				var entryDate = new Date(entry.publishedDate);
				var pubDate = entryDate.toLocaleDateString() + ' ' + entryDate.toLocaleTimeString();

				switch (options.dateformat) {
					case 'datetime':
						break;
					case 'date':
						pubDate = entryDate.toLocaleDateString();
						break;
					case 'time':
						pubDate = entryDate.toLocaleTimeString();
						break;
					case 'timeline':
						pubDate = _getLapsedTime(entryDate);
						break;
					default:
						pubDate = _formatDate(entryDate,options.dateformat);
						break;
				}
			}
			
			// Add feed row/列
			if (options.linkredirect) feedLink = encodeURIComponent(feedLink);
			rowArray[rowIndex]['html'] = '<'+ options.titletag +'><a href="'+ options.linkredirect + feedLink +'" title="View this feed at '+ feeds.title +'">'+ entry.title +'</a></'+ options.titletag +'>'

			if (options.date && pubDate) rowArray[rowIndex]['html'] += '<div>'+ pubDate +'</div>'
			if (options.content) {
			
				// 使用饲料片段（如果可用）和选配
				if (options.snippet && entry.contentSnippet != '') {
					var content = entry.contentSnippet;
				} else {
					var content = entry.content;
				}

				if (options.linkcontent) {
					content = '<a href="'+ options.linkredirect + feedLink +'" title="View this feed at '+ feeds.title +'">'+ content +'</a>'
				}
				
				rowArray[rowIndex]['html'] += '<p>'+ content +'</p>'
			}
			
			// Add any media
			if (options.media && xmlEntries.length > 0) {
				var xmlMedia = xmlEntries[i].getElementsByTagName('enclosure');
				if (xmlMedia.length > 0) {
					
					rowArray[rowIndex]['html'] += '<div class="rssMedia"><div>Media files</div><ul>'
					
					for (var m=0; m<xmlMedia.length; m++) {
						var xmlUrl = xmlMedia[m].getAttribute("url");
						var xmlType = xmlMedia[m].getAttribute("type");
						var xmlSize = xmlMedia[m].getAttribute("length");
						rowArray[rowIndex]['html'] += '<li><a href="'+ xmlUrl +'" title="Download this media">'+ xmlUrl.split('/').pop() +'</a> ('+ xmlType +', '+ _formatFilesize(xmlSize) +')</li>';
					}
					rowArray[rowIndex]['html'] += '</ul></div>'
				}
			}
					
		}
		
		// 排序如果需要的话
		if (options.sort) {
			rowArray.sort(function(a,b) {

				// 申请排序方向
				if (options.sortasc) {
					var c = a['sort'];
					var d = b['sort'];
				} else {
					var c = b['sort'];
					var d = a['sort'];
				}

				if (options.sort == 'date') {
					return new Date(c) - new Date(d);
				} else {
					c = c.toLowerCase();
					d = d.toLowerCase();
					return (c < d) ? -1 : (c > d) ? 1 : 0;
				}
			});
		}

		//将行添加到输出
		$.each(rowArray, function(e) {

			html += '<li class="rssRow '+row+'">' + rowArray[e]['html'] + '</li>';

			// Alternate row classes
			if (row == 'odd') {
				row = 'even';
			} else {
				row = 'odd';
			}			
		});

		html += '</ul>' +
			'</div>'
		
		$(e).html(html);

		// 应用目标链接
		$('a',e).attr('target',options.linktarget);
	};
	
	var _formatFilesize = function(bytes) {
		var s = ['bytes', 'kb', 'MB', 'GB', 'TB', 'PB'];
		var e = Math.floor(Math.log(bytes)/Math.log(1024));
		return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
	}

	var _formatDate = function(date,mask) {

		// 转换成日期和设置返回到掩模
		var fmtDate = new Date(date);
		date = mask;

		// 更换面具令牌
		date = date.replace('dd', _formatDigit(fmtDate.getDate()));
		date = date.replace('MMMM', _getMonthName(fmtDate.getMonth()));
		date = date.replace('MM', _formatDigit(fmtDate.getMonth()+1));
		date = date.replace('yyyy',fmtDate.getFullYear());
		date = date.replace('hh', _formatDigit(fmtDate.getHours()));
		date = date.replace('mm', _formatDigit(fmtDate.getMinutes()));
		date = date.replace('ss', _formatDigit(fmtDate.getSeconds()));

		return date;
	}

	var _formatDigit = function(digit) {
		digit += '';
		if (digit.length < 2) digit = '0' + digit;
		return digit;
	}

	var _getMonthName = function(month) {
		var name = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		return name[month];
	}

	var _getXMLDocument = function(string) {
		var browser = navigator.appName;
		var xml;
		if (browser == 'Microsoft Internet Explorer') {
			xml = new ActiveXObject('Microsoft.XMLDOM');
			xml.async = 'false';
			xml.loadXML(string);
		} else {
			xml = (new DOMParser()).parseFromString(string, 'text/xml');
		}
		return xml;
	}

	var _getLapsedTime = function(date) {
		
		// 获取当前日期和日期格式参数
		var todayDate = new Date();	
		var pastDate = new Date(date);

		// Get lasped time in seconds/获取lasped时间（秒
		var lapsedTime = Math.round((todayDate.getTime() - pastDate.getTime())/1000)

		// 返回lasped时间，以秒，分钟，小时，天，周
		if (lapsedTime < 60) {
			return '< 1 min';
		} else if (lapsedTime < (60*60)) {
			var t = Math.round(lapsedTime / 60) - 1;
			var u = 'min';
		} else if (lapsedTime < (24*60*60)) {
			var t = Math.round(lapsedTime / 3600) - 1;
			var u = 'hour';
		} else if (lapsedTime < (7*24*60*60)) {
			var t = Math.round(lapsedTime / 86400) - 1;
			var u = 'day';
		} else {
			var t = Math.round(lapsedTime / 604800) - 1;
			var u = 'week';
		}
		
		// 检查复数单位
		if (t > 1) u += 's';
		return t + ' ' + u;
	}

})(jQuery);
