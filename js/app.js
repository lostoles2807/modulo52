$("document").ready(function(){
	var move = 0;
	var score = 0;
	var d1;
	imagenes();
	color();
	color1();
	//drag_drop();
	function color(){
			$("h1").animate({
			color: '#4B0082'
		}, 3000, function(){
			$(this).animate({
			color: '#DCFF0E'
			}, 3000)
		}); 
	}
	
	 function color1(){
		$("h1").animate({
			color: '#2E8B57'
		}, 1000, function(){
			$(this).animate({
				color: '#FF4500'
			}, 1000, function(){
				color1();
			});
		});
	}
	
	function imagenes(){
		for(i=1; i<=7; i++){
			for(j=1; j<=7; j++){
				$('.col-'+i).slideDown('slow', function(){
					$(this).append('<img src="image/'+Math.floor(Math.random()*4+1)+'.png" class="im'+j+'">');
				});
			}
		}
		$('img').css('height','100px')
	}
	
	function tiempo(){
		$('#timer').timer({
			countdown:true, //activa conteo regresivo
			duration:'30s',
			callback: function(){
				$("#timer").timer("remove");
				$('.panel-tablero').fadeOut("fast");
				$('.panel-score').animate({
					width: '+=800px'
				},4000);
				$('.moves').animate({
					width: '+=800px'
				},4000)
			}
		});
	}
	
	function tiempo2(){
				$('.panel-score').animate({
					width: '-=800px'
				},1000);
				$('.moves').animate({
					width: '-=800px'
				},1000);
				$(".panel-tablero").delay(2000);
				$('.panel-tablero').fadeIn(3000);
	}
	
	function drag_drop(){
		$('img').draggable({
			helper:"clone"
		});
		$('img').droppable({
			drop : function(event ,ui){
				d1 = ui.draggable;
				$(this).replaceWith(d1)
				move = move +1;
				$("#movimientos-text").html(move);
				iniciar_juego();
				//carga();
			}
			
		});
		 
	}
	
	function iniciar_juego() {
		for(m=1; m<=7; m++){
			if(($(".col-"+m+"  img")[0].src == $(".col-"+m+" img")[1].src) && ($(".col-"+m+" img")[1].src == $(".col-"+m+" img")[2].src)){
					$(".col-"+m+"  img")[0].remove();
					$(".col-"+m+"  img")[1].remove();
					$(".col-"+m+"  img")[2].remove();
					score = score + 300;
					$('#score-text').html(score);
	
			}
			else if(($(".col-"+m+" img")[1].src == $(".col-"+m+" img")[2].src) && ($(".col-"+m+" img")[2].src == $(".col-"+m+" img")[3].src)){
					$(".col-"+m+"  img")[1].remove();
					$(".col-"+m+"  img")[2].remove();
					$(".col-"+m+"  img")[3].remove();
					score = score + 300;
					$('#score-text').html(score);
	
			}
			else if(($(".col-"+m+" img")[2].src == $(".col-"+m+" img")[3].src) && ($(".col-"+m+" img")[3].src == $(".col-"+m+" img")[4].src)){
					$(".col-"+m+" img")[2].remove();
					$(".col-"+m+" img")[3].remove();
					$(".col-"+m+" img")[4].remove();
					score = score + 300;
					$('#score-text').html(score);
			}
			else if(($(".col-"+m+" img")[3].src == $(".col-"+m+" img")[4].src) && ($(".col-"+m+" img")[3].src == $(".col-"+m+" img")[5].src)){
					$(".col-"+m+" img")[3].remove();
					$(".col-"+m+" img")[4].remove();
					score = score + 300;
					$('#score-text').html(score);
			}
			
		}	
		carga();
	}
	
	$(".btn-reinicio").click(function(){
		if($(this).html()=="Iniciar"){
			drag_drop();
			iniciar_juego();
			tiempo();
			$(this).html("Reiniciar")
		   }else{
		   	$(this).html("Iniciar");
			tiempo2();
			move = 0;
			$("#movimientos-text").html(move);
			score = 0;
			$('#score-text').html(score);
		   }
	});
	
	function carga(){
			for(k=1; k<=7; k++){
				while($('.col-'+k+' img').length<7){
					$('.col-'+k+'').prepend('<img src="image/'+Math.floor(Math.random()*4+1)+'.png">');
					$('img').css('height','100px');
					drag_drop();
				}	
			}
	}
	
	
});


