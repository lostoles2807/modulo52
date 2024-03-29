// JavaScript Document
$(document).ready(function(){
	var gemSize = 64;
    var gemClass = "gem"
    var gemIdPrefix = "gem";
    var numRows = 6;
    var numCols = 7;
	var selectedRow = -1;
  	var selectedCol = -1;
  	var posX;
  	var posY;
  	var jewels = new Array();
  	var movingItems = 0;
  	var gameState = "pick";
  	var swiped = false;
    var swipeStart = null;
  	var bgColors = new Array("magenta", "mediumblue", "yellow", "lime", "cyan", "orange", "crimson", "gray");
  	$("body").append('<div id = "marker"></div><div id = "gamefield"></div>').css({
        "background-color": "black",
        "margin": "0"
    });
  	$("#gamefield").css({
        "background-color": "#000000",
        "width": (numCols * gemSize) + "px",
        "height": (numRows * gemSize) + "px"
    });
	$("#marker").css({
        "width": (gemSize - 10) +"px",
        "height": (gemSize - 10) +"px",
        "border": "5px solid white",
        "position": "absolute"
    }).hide();
  	for(i = 0; i < numRows; i++){
     	jewels[i] = new Array();
     	for(j = 0; j < numCols; j++){
          	jewels[i][j] = -1;
     	}
  	}
	for(i = 0; i < numRows; i++){
		for(j = 0; j < numCols; j++){
			do{
				jewels[i][j] = Math.floor(Math.random() * 8);
			} while(isStreak(i, j));
			$("#gamefield").append('<div class = "' + gemClass + '" id = "' + gemIdPrefix + '_' + i + '_' + j + '"></div>');
            $("#" + gemIdPrefix + "_" + i + "_" + j).css({
                "top": (i * gemSize) + 4 + "px",
                "left": (j * gemSize) + 4 + "px",
                "width": "54px",
                "height":"54px",
                "position": "absolute",
                "border": "1px solid white",
                "cursor": "pointer",
                "background-color": bgColors[jewels[i][j]]
            });
		}
	}
 
	
	function checkMoving(){
		movingItems--;
    		if(movingItems == 0){
    			switch(gameState){
    				case "revert":
    				case "switch":
                  		if(!isStreak(selectedRow, selectedCol) && !isStreak(posY, posX)){
                   			if(gameState != "revert"){
    							gameState = "revert";
                   				gemSwitch();
                   			}
                   			else{
    							gameState = "pick";
    							selectedRow = -1;
    						}
                    	}
					else{
						gameState = "remove";
                    		if(isStreak(selectedRow, selectedCol)){
                    			removeGems(selectedRow, selectedCol);
						}
                    		if(isStreak(posY, posX)){
                    			removeGems(posY, posX);
						}
						gemFade();
					}
					break;
				case "remove":
					checkFalling();
					break;
				case "refill":
					placeNewGems();
					break;
			}
		}
	}
 
	function placeNewGems(){
		var gemsPlaced = 0;
		for(i = 0; i < numCols; i++){
			if(jewels[0][i] == -1){
				jewels[0][i] = Math.floor(Math.random() * 8);
          		$("#gamefield").append('<div class = "' + gemClass + '" id = "' + gemIdPrefix + '_0_' + i + '"></div>');
          		$("#" + gemIdPrefix + "_0_" + i).css({
                    "top": "4px",
                    "left": (i * gemSize) + 4 + "px",
                    "width": "54px",
                    "height": "54px",
                    "position": "absolute",
                    "border": "1px solid white",
                    "cursor": "pointer",
                    "background-color": bgColors[jewels[0][i]]
                });
          		gemsPlaced++;
			}
		}
		if(gemsPlaced){
			gameState = "remove";
			checkFalling();
		}
		else{
			var combo = 0
			for(i = 0; i < numRows; i++){
      			for(j = 0; j < numCols; j++){
      				if(j <= numCols - 3 && jewels[i][j] == jewels[i][j + 1] && jewels[i][j] == jewels[i][j + 2]){
						combo++;
						removeGems(i, j);
					}
					if(i <= numRows - 3 && jewels[i][j] == jewels[i + 1][j] && jewels[i][j] == jewels[i + 2][j]){
						combo++;
						removeGems(i, j);
					}
				}
			}
			if(combo > 0){
				gameState = "remove";
				gemFade();
			}
			else{
				gameState = "pick";
				selectedRow= -1;
			}
		}
	}
 
	function checkFalling(){
		var fellDown = 0;
		for(j = 0; j < numCols; j++){
			for(i = numRows - 1; i > 0; i--){
				if(jewels[i][j] == -1 && jewels[i - 1][j] >= 0){
					$("#" + gemIdPrefix + "_" + (i - 1) + "_" + j).addClass("fall").attr("id", gemIdPrefix + "_" + i + "_" + j);
					jewels[i][j] = jewels[i - 1][j];
					jewels[i - 1][j] = -1;
					fellDown++;
				}
			}
		}
		$.each($(".fall"), function(){
			movingItems++;
			$(this).animate({
				top: "+=" + gemSize
			},
            {
			    duration: 100,
				complete: function(){
					$(this).removeClass("fall");
					checkMoving();
				}
			});
		});
		if(fellDown == 0){
			gameState = "refill";
			movingItems = 1;
			checkMoving();
		}
	}
 
	function gemFade(){
		$.each($(".remove"), function(){
			movingItems++;
			$(this).animate({
				opacity:0
			},
            {
				duration: 200,
				complete: function(){
					$(this).remove();
					checkMoving();
				}
			});
		});
	}
 
	function gemSwitch(){
		var yOffset = selectedRow - posY;
		var xOffset = selectedCol - posX;
		$("#" + gemIdPrefix + "_" + selectedRow + "_" + selectedCol).addClass("switch").attr("dir", "-1");
		$("#" + gemIdPrefix + "_" + posY + "_" + posX).addClass("switch").attr("dir", "1");
		$.each($(".switch"),function(){
			movingItems++;
			$(this).animate({
				left: "+=" + xOffset * gemSize * $(this).attr("dir"),
				top: "+=" + yOffset * gemSize * $(this).attr("dir")
				},{
				duration: 250,
				complete: function(){
					checkMoving();
				}
			}).removeClass("switch")
		});
		$("#" + gemIdPrefix + "_" + selectedRow + "_" + selectedCol).attr("id", "temp");
		$("#" + gemIdPrefix + "_" + posY + "_" + posX).attr("id", gemIdPrefix + "_" + selectedRow + "_" + selectedCol);
		$("#temp").attr("id", gemIdPrefix + "_" + posY + "_" + posX);
		var temp = jewels[selectedRow][selectedCol];
		jewels[selectedRow][selectedCol] = jewels[posY][posX];
		jewels[posY][posX] = temp;
	}
 
	function removeGems(row, col){
		var gemValue = jewels[row][col];
		var tmp = row;
		$("#" + gemIdPrefix + "_" + row + "_" + col).addClass("remove");
		if(isVerticalStreak(row, col)){
			while(tmp > 0 && jewels[tmp - 1][col] == gemValue){
				$("#" + gemIdPrefix + "_" + (tmp - 1) + "_" + col).addClass("remove");
				jewels[tmp - 1][col] = -1;
				tmp--;
			}
			tmp = row;
			while(tmp < numRows - 1 && jewels[tmp + 1][col] == gemValue){
				$("#" + gemIdPrefix + "_" + (tmp + 1) + "_" + col).addClass("remove");
				jewels[tmp + 1][col] = -1;
				tmp++;
			}
		}
		if(isHorizontalStreak(row, col)){
			tmp = col;
			while(tmp > 0 && jewels[row][tmp - 1]==gemValue){
				$("#" + gemIdPrefix + "_" + row + "_" + (tmp - 1)).addClass("remove");
				jewels[row][tmp - 1] = -1;
				tmp--;
			}
			tmp = col;
			while(tmp < numCols - 1 && jewels[row][tmp + 1]==gemValue){
				$("#" + gemIdPrefix + "_" + row + "_" + (tmp + 1)).addClass("remove");
				jewels[row][tmp + 1] = -1;
				tmp++;
			}
		}
		jewels[row][col] = -1;
	}
 
	function isVerticalStreak(row, col){
		var gemValue = jewels[row][col];
		var streak = 0;
		var tmp = row;
		while(tmp > 0 && jewels[tmp - 1][col] == gemValue){
			streak++;
			tmp--;
		}
		tmp = row;
		while(tmp < numRows - 1 && jewels[tmp + 1][col] == gemValue){
			streak++;
			tmp++;
		}
		return streak > 1
	}
 
	function isHorizontalStreak(row, col){
		var gemValue = jewels[row][col];
		var streak = 0;
		var tmp = col
		while(tmp > 0 && jewels[row][tmp - 1] == gemValue){
			streak++;
			tmp--;
		}
		tmp = col;
		while(tmp < numCols - 1 && jewels[row][tmp + 1] == gemValue){
			streak++;
			tmp++;
		}
		return streak > 1
	}
 
	function isStreak(row, col){
		return isVerticalStreak(row, col) || isHorizontalStreak(row, col);
	}
});