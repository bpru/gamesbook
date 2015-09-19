//=require_tree ./game_helpers
$(document).ready(function() {
	var canvas = $("#canvas")[0];
	var WIDTH = canvas.width;
	var HEIGHT = canvas.height;
	var ctx = canvas.getContext("2d");
	var output = 0;
	var total_try = 0;
	var success = 0;
	var score = 0;
	timer = create_timer(count, 100);
	

	frame = create_frame();
	frame.set_draw_handler(draw);
	frame.start();

	$("#btn_start").click(function() {
		if (!timer.is_running) { timer.start(); }
	});

	$("#btn_stop").click(function() {
		if (timer.is_running) { 
			timer.stop();
			if (output%10 == 0) {
				success++;
				score += 10;
			};
			total_try++; 
		}
	});

	$("#btn_reset").click(function() {
		timer.stop();
		output = 0;
		success = 0;
		total_try = 0;
		score = 0;
	});
	
	$("#btn_save").click(function save() {
		if(score + total_try == 0) {
			alert("You have nothing to save.\nPlease start the game");
			return;
		}
		if (!logged_in) {
			alert("You need to log in or sign up \nto have your score saved!");
			return;
		}
		$.ajax({url: '/stopwatches', type: 'POST', 
			data: {stopwatch: {score: score, total_try: total_try}}});
		alert("Your score has been saved.");
		$("#btn_reset").trigger("click");
	});
	
	function format_time(t) {
		var min = Math.floor(t/600);
		var second = Math.floor((t%600)/10);
		var tenth_sec = (t%600)%10;
		var tens_second = Math.floor(second/10);
    	var second = second%10
    	return min + ":" + tens_second + second + ":" + tenth_sec;
	}

	function format_try() {
		return success + " / " + total_try;
	}
	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "96px Comic Sans MS";
		// ctx.font = "96px serif";
		ctx.fillText(format_time(output), WIDTH/2, HEIGHT*2/3);
		ctx.font = "18px Comic Sans MS";
		// ctx.font = "48px serif";
		ctx.fillText("success rate:" ,65, 20);
		ctx.fillText(format_try(), 65, 50);
		
		ctx.fillText("total score:" ,WIDTH - 65, 20);
		ctx.fillText(score ,WIDTH - 65, 50);
	}


	function count() {
		output++;
	}
	
	
});









// $(document).ready(function () {
// 	var canvas = document.getElementById('canvas');
// 	var ctx = canvas.getContext('2d');

// 	var ball = {
// 	  x: 100,
// 	  y: 100,
// 	  vx: 5,
// 	  vy: 2,
// 	  radius: 25,
// 	  color: 'blue',
// 	  draw: function() {
// 	    ctx.beginPath();
// 	    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
// 	    ctx.closePath();
// 	    ctx.fillStyle = this.color;
// 	    ctx.fill();
// 	  }
// 	};

// 	function draw() {
// 	  ctx.clearRect(0,0, canvas.width, canvas.height);
// 	  ball.draw();
// 	  ball.x += ball.vx;
// 	  ball.y += ball.vy;
// 	  window.requestAnimationFrame(draw);
// 	}

// 	canvas.addEventListener('mouseover', function(e){
// 	  window.requestAnimationFrame(draw);
// 	});

// 	canvas.addEventListener("mouseout",function(e){
// 	  window.cancelAnimationFrame(raf);
// 	});

// 	ball.draw();
// 	});