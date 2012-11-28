// Активные ссылки для картинок
d3.addModule(
{
	type: "Содержание",
	name: 'Раскрытие картинок по клику на ссылке',
	author: 'crea7or',
	config: {active:{type:'checkbox',value:true}},

	run: function()
	{
		var head = (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]);
   		var script = document.createElement( 'script' );
   		script.type = 'text/javascript';
   		script.textContent ="function morphingSp3( imgObjectId, targetX, targetY, targetWidth, targetHeight  )"
			+ "{ var image_copy = document.id( imgObjectId ); image_copy.get('morph').removeEvents('complete');"
			+ "image_copy.set('morph', { duration : 333, link : 'cancel'});"
			+ "image_copy.morph({'height' : targetHeight,'width' : targetWidth,'top' : targetY,'left' : targetX}); }";
		head.appendChild( script );
	},

	onPost: function(post) {
		this.imagesPreview(post.container.get(0))
	},

	onComment: function(comment) {
		this.imagesPreview(comment.container.get(0))
	},

	clickOnImageLink: function(e)
	{
		document.body.style.cursor = 'wait';
		var newImageForPreview = new Image();
		newImageForPreview.src = e.target.href;
		var posx = 0;
		var posy = 0;
		if (!e) var e = window.event;
		if (e.pageX || e.pageY)
		{
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) 	
		{
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}		
		$j(newImageForPreview).bind('load', {x: posx, y: posy}, function(e)
		{
			document.body.style.cursor = 'auto';
			if ( e.target.complete )
			{
				var data = e.data;
				var imgPreview = document.createElement('img');
				imgPreview.setAttribute('src', e.target.src );
				var posy = data.y - (e.target.height / 2 );
				if (posy < d3.window.getScroll().y) 
				{
					posy = d3.window.getScroll().y;
				}
				var posx = data.x - (e.target.width /2 );
				if (posx < d3.window.getScroll().x) 
				{
					posx = d3.window.getScroll().x;
				}
				var imgId = 'imgsp3' + new Date().getTime();
				imgPreview.setAttribute('id', imgId );
				imgPreview.setAttribute('style', 'position: absolute; cursor: pointer; z-index: 2; zoom: 1; left:' + data.x + 'px ; top:' + data.y + 'px; width:' + 8 + 'px; height:' + 8 + 'px;');
				document.body.appendChild( imgPreview );

				$j(imgPreview).bind('click', function(e)
					{
						e.target.parentNode.removeChild( e.target );
					});

   				var script = document.createElement( 'script' );
   				script.type = 'text/javascript';
   				script.textContent ="morphingSp3( " + imgId + "," + posx  + "," + posy + "," + e.target.width + "," +  e.target.height + ");"
				document.body.appendChild( script )
			}
		});
		$j(newImageForPreview).bind('error', {href: e.target.href}, function(e)
		{
			document.body.style.cursor = 'auto';
			window.location.href = e.data.href;
		});
		e.preventDefault();
		return false;
	},

	imagesPreview: function( baseElement )
	{
		var me = this;
		$j("a", baseElement).each(function(){
			var a = this;
			if(a.href.match(/\.(gif|png|jpg|jpeg)$/i))
			{
				if (a.href.match(/(img\.youtube\.com|vimeocdn\.com)/i) == null )
				{
						$j(a).click(
							function(e){
								me.clickOnImageLink(e);
							});
				}
			}
		});
	}
});
	