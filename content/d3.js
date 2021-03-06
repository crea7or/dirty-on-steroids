// content interface module for *.d3.ru

d3.addContentModule(/(.*\.)?d3.ru/i,
{
	type: "Ядро",
	author: 'crimaniak',
	name: 'Интерфейс к содержимому d3.ru',
	variant: 'd3.ru',
	posts: [],
	comments: [],
	commentListeners: [],
	postListeners: [],
	postsUpdatedHandler: new DelayedEventHandler(),
	commentsUpdatedHandler: new DelayedEventHandler(),
	itemsUpdatedHandler: new DelayedEventHandler(),

	run: function()
	{

		var isInbox = document.location.pathname.substr(0,10)=="/my/inbox/";
		d3.page=
		{
			inbox: isInbox,
			my: document.location.pathname.substr(0, 4) == "/my/" && !isInbox,
			postComments: (window.location.pathname.indexOf("/comments/") >= 0),
			inboxComments: (( document.location.pathname.indexOf("/inbox/") > 0 ) && ( window.location.pathname.length > 15 )),
			onlyNew: (document.location.href.indexOf('#new') > -1),
			user: (window.location.pathname.indexOf("/user/")>=0) || (window.location.pathname.indexOf("/users/")>=0)
		};
		/// Get element(s) of page
		d3.get =
		{
			logoutLink: function(){return $j('#js-header_logout_link');},
			leftNavigation: function(){return $j('#leftNavigator');},
			items: function(){return d3.content.items();}
		};

		var me=this;

		this.createLeftNavigator();
		this.countItems();

		//d3.window.d3=d3;
		d3.content=this;
		this.onCommentsUpdated(function () {
			me.itemsUpdatedHandler.trigger();
		});
		this.onPostsUpdated(function () {
			me.itemsUpdatedHandler.trigger();
		});

		function processPost($post) {
			var post = new Post($post);
			me.countPost(post);
			me.postListeners.forEach(function (listener) {
				try {
					listener(post);
				} catch (e) {
					if(console) console.log(e);
				}
			});
			me.postsUpdatedHandler.trigger();
		}

		function processComment($comment) {
			var comment = new Comment($comment);
			me.countComment(comment);
			me.commentListeners.forEach(function (listener) {
				try {
					listener(comment);
				} catch (e) {
					if(console) console.log(e);
				}
			});
		}

		$j(document).on('DOMNodeInserted', function (event) {
			var $current = $j(event.target);
			if ($current.is(".comment")) processComment($current);
			if ($current.is(".post")) processPost($current);

			$j("div.post", event.target).each(
				function () {
					processPost($j(this));
				}
			);
			$j("div.comment", event.target).each(
				function () {
					processComment($j(this));
				}
			);
		});

	},

	countItems: function()
	{
		this.posts=[];
		this.comments=[];
		var me=this;
		$j('.post:not(.b-related-posts_item)').each(function () {
			me.countPost(new Post($j(this)));
		});
		$j('.comment').each(function () {
			me.countComment(new Comment($j(this)));
		});
	},

	countPost: function(post) {
		this.posts.push(post);
	},

	countComment: function(comment) {
		this.comments.push(comment);
	},
	
	items: function(){return this.comments.length ? this.comments : this.posts.length ? this.posts : [];},
	
	onNewComment: function(fn){this.commentListeners.push(fn);},
	onNewPost: function(fn){this.postListeners.push(fn);},
	onPostsUpdated: function(fn){this.postsUpdatedHandler.addListener(fn);},
	onCommentsUpdated: function(fn){this.commentsUpdatedHandler.addListener(fn);},
	onItemsUpdated: function(fn){this.itemsUpdatedHandler.addListener(fn);},

	addItemsProcessor: function(processor)
	{
		var items = this.items();

		for(var i=0;i<items.length;++i)
			processor(items[i]);
		
		this.onNewComment(processor);
	},
	
	addToHeaderDrop: function(item, after)
	{
		var nav = $j('#js-header_nav_user_menu');
		var list = $j('ul', nav);
		if(after !== undefined)
		{
			after = $j('li:contains("'+after+'")',list);
			item.insertAfter(after);
		} else
			list.append(item);
		nav.height(nav.height()+item.height());
	},
	
	addToHeaderNav: function(item)
	{
		console.log("Append to header");
		if(	document.getElementsByClassName('b-header_nav').length)
			//$j(item).insertBefore('.b-header_nav');
			$j('.b-header_nav').append(item);
		else
			$j(item).insertBefore('.l-header_big_login_controls');
		//$j('.b-header_nav').append(item);
	},
	
	addToLeftNav: function(item, after)
	{
		console.log("Append to left");

		var nav = $j('#leftNavigator');
		if (nav.length) 
		{
			var list = $j('ul', nav);
			if (after !== undefined) 
			{
				after = $j('li:contains("' + after + '")', list);
				item.insertAfter(after);
			} else
				list.append(item);
		}else
		{
			$j(".l-content_aside").append(item);
			$j(document).bind("DOMNodeInserted", function(event){
				
				var node = $j(event.target);
				if(node.hasClass('l-content_aside'))
				{
					console.log(event);
					node.append(item);
				}
			});
			console.log($j(".l-content_aside"), item, document.getElementsByClassName('l-content_aside'));
		}
	},

	addConfigLink: function(id, top)
	{	
		if(top)
			this.addToHeaderNav($j('<li class="b-header_nav_button"><a id="'+id+'" href="#" class="b-button" title="Настройки сервис-пака"><span class="b-button_icon"><i class="b-svg-icon b-svg-icon__settings b-svg-icon__loaded" data-name="settings"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve"><g id="settings" opacity="0.75"><path d="M3,4 L6,4 L6,6 L3,6 z"/><path d="M12,4 L21,4 L21,6 L12,6 z"/><path d="M8,3 L10,3 C10.552,3 11,3.448 11,4 L11,6 C11,6.552 10.552,7 10,7 L8,7 C7.448,7 7,6.552 7,6 L7,4 C7,3.448 7.448,3 8,3 z"/><path d="M3,11 L12,11 L12,13 L3,13 z"/><path d="M18,11 L21,11 L21,13 L18,13 z"/><path d="M14,10 L16,10 C16.552,10 17,10.448 17,11 L17,13 C17,13.552 16.552,14 16,14 L14,14 C13.448,14 13,13.552 13,13 L13,11 C13,10.448 13.448,10 14,10 z"/><path d="M3,18 L9,18 L9,20 L3,20 z"/><path d="M15,18 L21,18 L21,20 L15,20 z"/><path d="M11,17 L13,17 C13.552,17 14,17.448 14,18 L14,20 C14,20.552 13.552,21 13,21 L11,21 C10.448,21 10,20.552 10,20 L10,18 C10,17.448 10.448,17 11,17 z"/></g></svg><em></em></i></span><span class="b-button_caption">сервиспак</span></a></li>'));
			else
			this.addToLeftNav($j('<li><a href="#" id="'+id+'"><div style="background: url(data:image/png;base64,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) 4px 1px no-repeat; height:50px;border-top:1px solid #e9e9e9;border-bottom:1px solid #e9e9e9"><span style="cursor:pointer;text-decoration:underline;line-height:50px;margin-left:62px">Настройки</span></div></a></li>'));
	},
	
	// collect user info
	findUser: function()
	{
		var user = { name: "", id: 0};
		if ( d3.globals && d3.globals.user )
		{
			user = d3.globals.user;
			user.name = user.login;
		}
		return user;
	},
	
	createLeftNavigator: function()
	{
		var aside = $j('div.l-content_aside');
		if(aside.length)
			aside.append('<div id="leftNavigator"><ul style="list-style-type: none; padding: 0px 0px 0px 5px; font-size: 0.85em;"></ul></div>');
		else
		{
			/*
			console.log("Error creating left navigator");
			$j('body').append('<div id="leftNavigator" style="position:absolute;top:100px;left:20px;border: 2px red solid;z-index:5000"><ul style="list-style-type: none; padding: 0px 0px 0px 5px; font-size: 0.85em;"><li>NAVIGATOR</li></ul></div>');
			console.log($j("body"));
			*/
		}
	}
	
});
