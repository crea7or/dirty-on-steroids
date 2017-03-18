// Favicons
d3.addModule(
{
	type: "Прочее",
	name: 'Показывать favicons доменов',
	author: 'Stasik0, NickJr, crimaniak',
	postSelector: 'div.dt > h3 > a.b-post_snippet_icon, div.post_body a, div.dt div.post_video a',
	commentSelector: 'div.c_body a',
	config: {
		active:{type:'checkbox', value:1},
		mouseover:{type:'radio', caption:'Когда:', options:{"перманентно":0, "только при наведении":1}, value:0},
		position:{type:'radio', caption:'Где:', options:{"слева от ссылки":0, "справа от ссылки":1}, value:0},
		domainWhitelist:{type: 'text', caption:'Список доменов', value:'d3.ru,livejournal.com,lenta.ru,flickr.com,google.com,google.ru,yandex.ru,yandex.net,rian.ru,wikipedia.org,wikimedia.org,futurico.ru,leprosorium.ru,facebook.com,twitter.com,gazeta.ru,vedomosti.ru,1tv.ru,fontanka.ru,kommersant.ru,vesti.ru,kp.ru,blogspot.com,narod.ru,vimeo.com,rbc.ru,korrespondent.net,youtube.com'
		}
	},
	
	getDomainMasks: function()
	{
		return this.config.domainWhitelist.value
			.split(/[\s,]+/)
			.map(function(item){
				return new RegExp('^(.*\\.)?'+item.replace(/\./g,'\\.').replace(/\*/g,'.*')+'$','i');
			});
	},
	
	inWhiteList: function(domain){
		if(domain.length==0) return false;
		if(this.config.domainWhitelist.value === "*") return true;
		if(this.inWhiteList.masks == undefined) this.inWhiteList.masks = this.getDomainMasks();
		try
		{
			this.inWhiteList.masks.forEach(function(mask){
				if(mask.test(domain)) {	throw true;	}
			});
			return false;
		} catch(e)
		{
			return true;
		}
	},

	showFavicon: function (el, faviconUrl) {
		el.css('background-image','url('+faviconUrl+')').addClass("faviconized");
	},

	hideFavicon: function (el) {
		el.css('background-image','none').removeClass("faviconized");
	},

	run: function(){
		var side = this.config.position.value==1 ? 'right' : 'left';
		$j('head').append("<style type='text/css'> .faviconized { \
		 	padding-"+side+":19px; \
		    background-repeat:no-repeat; \
			background-position:"+side+" center; \
		} </style>");
	},

	onPost: function(post) {
		this.processItem(this.postSelector, post.container);
	},

	onComment: function(comment) {
		this.processItem(this.commentSelector, comment.container);
	},

	processLink: function(link)
	{
		if (this.inWhiteList(link.hostname)) {
			var faviconUrl;
			if (link.hostname.indexOf('d3.ru', link.hostname.length - 'd3.ru'.length) !== -1) {
				//yandex has no d3.ru icon yet
				faviconUrl = location.protocol + '//www.google.com/s2/favicons?domain=' + link.hostname;
			} else {
				faviconUrl = location.protocol + '//favicon.yandex.net/favicon/' + link.hostname;
			}
			if (this.config.mouseover.value==1) {
				var me=this;
				$j(link).mouseover(function () {
					me.showFavicon($j(this), faviconUrl);
				}).mouseout(function () {
					me.hideFavicon($j(this));
				});
			} else {
				this.showFavicon($j(link), faviconUrl);
			}
		}
	},
	
	processItem: function(selector, container) {
		var me=this;
		//iterate over links
		$j.each($j(selector, container)
			.not('a[class*="b-controls_button"]')
			.not(':has(img)')
			.not('a[href=#]')
			,
			function (index, link) {
				me.processLink(link);
			});
	}
});
