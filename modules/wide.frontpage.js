// Широкая главная
d3.addModule(
{
	type: "Навигация",
	name: 'Широкая главная',
	author: 'crea7or',
	config: {active:{type:'checkbox',value:true}},

	run: function () {
		$j("#js-posts_holder").attr("style", "padding-right: 30px;").attr("class", "");
		$j("#js-random_interests").remove();
	}
});