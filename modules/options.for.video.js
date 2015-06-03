// Добавляет видео плеер по клику на ссылках и на картинках
d3.addModule(
{
	type: "Содержание",
	name: 'Дополнительные опции для видеоплеера',
	author: 'crea7or',
	config: {active:{type:'checkbox',value:true,caption:'Добавить спец.опции к видеоплееру',description:'Добавляет кнопки размера и закрытия для видеоплеера'}
			,bigwindow:{type:'checkbox',value:false,caption:'открывать сразу в большом размере',description:'видео будет открываться в большом окне 1024px'}
			},

	run: function()
	{
		var me = this;

		$j(document).on('DOMNodeInserted', function (e) 
		{	
		    if ( e.target.nodeName == "DIV" && e.target.className == "js-media_player" )
	    	{
		   		//console.log( "video " + e.target.innerHTML );
		   		if ( !e.target.querySelector("div.spVideoOptoons"))
		   		{
					me.addOptions( e.target );
		   		}
		   		else
		   		{
					var spanImg = e.target.parentNode.querySelector("span.b-media_player_preview_pic_holder");
					if ( spanImg )
					{
						//console.log('fnd span');
						spanImg.setAttribute("class", "b-media_player_preview_pic_holder hidden");
					}
					else
					{
						//console.log('not fnd span');
					}
				}
			}
		});
	},

	addOptions: function( container )
	{
		var cont = container;
		var iframeObj = container.querySelector("iframe.b-video_player");

		var playerWidth = '480px';
		if ( this.config.bigwindow.value == 1 )
		{
			playerWidth = '960px';
			iframeObj.setAttribute('width', 960 );
			iframeObj.setAttribute('height', 720 );
		}

		var topToolbar = document.createElement('div');
		topToolbar.setAttribute( "class", "spVideoOptoons");
		$j(topToolbar).css('width', playerWidth );		
		$j(topToolbar).css('font-size','13px');
		$j(topToolbar).css('font-face','verdana,tahoma');
		$j(topToolbar).css('margin','7px');

		// top toolbar
		topToolbar.appendChild( document.createTextNode(' размер видео: '));
		var newA = document.createElement('a');
		newA.href = '#';
		newA.appendChild( document.createTextNode('нормальный'));
		$j(newA).bind('click', function (e) {
			$j(topToolbar).css('width','480px');
			$j(iframeObj).css('width','480px');
			$j(iframeObj).css('height','360px');				
		 	e.preventDefault(); return false; 
		});
		topToolbar.appendChild( newA );
		topToolbar.appendChild( document.createTextNode(' | ') );

		newA = document.createElement('a');
		newA.href = '#';			
		newA.appendChild( document.createTextNode('большой'));
		$j(newA).bind('click', function (e) {
			$j(topToolbar).css('width','960px');
			$j(iframeObj).css('width','960px');
			$j(iframeObj).css('height','720px');				
		 	e.preventDefault(); return false; 
		});
		topToolbar.appendChild( newA );
		topToolbar.appendChild( document.createTextNode(' | ') );

		var newA = document.createElement('a');
		newA.href = '#';
		newA.appendChild( document.createTextNode('закрыть плеер'));

		topToolbar.appendChild( newA );
		cont.appendChild( topToolbar );

		$j(newA).bind('click', function (e) { 

			var commentHolder = cont.parentNode

			commentHolder.removeChild( cont );

			var spanImg = commentHolder.querySelector("span.b-media_player_preview_pic_holder");
			if ( spanImg )
			{
				spanImg.setAttribute("class", "b-media_player_preview_pic_holder");
			}

			e.preventDefault();
			return false;
		});
	}
});
