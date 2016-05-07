
// Hide unwanted elements module
d3.addModule(
{
	type: "Стилизация",
	author: 'crimaniak',
	name: 'Спрятать лишнее',
	variant: ['dirty.ru'],
	config: 
		{active:{type:'checkbox', value:1}
		,hideSocialLinks:{type:'checkbox', caption:'Спрятать кнопки социальных сетей', value:0}
		,hideSideBarItems:{type:'checkbox', caption:'Спрятать комментарии дня и прочее справа', value:0}
		,hideUserAd:{type:'checkbox', caption:'Спрятать рекламу в посте', value:0}
		},
	run: function()
	{
		if(this.config.hideSocialLinks.value) $j('.b-post_social_link').hide();

		if(this.config.hideSideBarItems.value)
		{
			var sideItems = document.querySelectorAll('div.b-sidebar_item');
			if ( sideItems )
			{				
				for ( var i = 0; i < sideItems.length; i++)
				{
					sideItems[i].parentNode.removeChild( sideItems[i] );
				}
			}
		}
		if(this.config.hideUserAd.value)
		{
			var sideItems = document.querySelectorAll('div.b-user_ad_container');
			if ( sideItems )
			{				
				for ( var i = 0; i < sideItems.length; i++)
				{
					sideItems[i].parentNode.removeChild( sideItems[i] );
				}
			}
		}
	}
});