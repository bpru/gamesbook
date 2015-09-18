//=require_tree ./game_helpers
$(document).ready(function() {
    
    // art assets created by Kim Lathrop, may be freely re-used in non-commercial projects, please credit Kim
    
    // debris images - debris1_brown.png, debris2_brown.png, debris3_brown.png, debris4_brown.png
    //                  debris1_blue.png, debris2_blue.png, debris3_blue.png, debris4_blue.png, debris_blend.png
    var debris_info = new ImageInfo([320, 240], [640, 480]);
    var debris_image = new Image();
    debris_image.src = "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/debris2_blue.png"

    // nebula images - nebula_brown.png, nebula_blue.png
    var nebula_info = new ImageInfo([400, 300], [800, 600]);
    var nebula_image = new Image();
    nebula_image.src = "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/nebula_blue.f2014.png";

    // splash image
    var splash_info = new ImageInfo([200, 150], [400, 300]);
    // alert(splash_info.radius);
    var splash_image = new Image();
    splash_image.src = "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/splash.png";

    // ship image
    var ship_info = new ImageInfo([45, 45], [90, 90], 35);
    var ship_image = new Image();
    ship_image.src = "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/double_ship.png";

    // missile image - shot1.png, shot2.png, shot3.png
    var missile_info = new ImageInfo([5,5], [10, 10], 3, 50);
    var missile_image = new Image();
    missile_image.src = "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/shot2.png";

    // asteroid images - asteroid_blue.png, asteroid_brown.png, asteroid_blend.png
    var asteroid_info = new ImageInfo([45, 45], [90, 90], 40);
    var asteroid_image = new Image();
    asteroid_image.src = "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/asteroid_blue.png";

    // animated explosion - explosion_orange.png, explosion_blue.png, explosion_blue2.png, explosion_alpha.png
    var explosion_info = new ImageInfo([64, 64], [128, 128], 17, 24, true);
    var explosion_image = new Image();
    explosion_image.src = "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/explosion_alpha.png";

    // sound assets purchased from sounddogs.com, please do not redistribute
    // .ogg versions of sounds are also available, just replace .mp3 by .ogg
    var soundtrack = new Audio("http://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.mp3");
    var missile_sound = new Audio("http://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/missile.mp3");
    // var missile_sound.set_volume(.5)
    var ship_thrust_sound = new Audio("http://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/thrust.mp3");
    var explosion_sound = new Audio("http://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/explosion.mp3");
    
    
    // set canvas
    var canvas = $("#canvas");
	var ctx = canvas[0].getContext("2d");
// 	ctx.fillRect(100, 100, 50, 50);
	
    // set game status
    var WIDTH = canvas[0].width;
    var HEIGHT = canvas[0].height;
    // alert(WIDTH);
    // alert(HEIGHT);
    var score = 0;
    var lives = 3;
    var time = 0;
    var level_time = 0;
    var started = false;
    var msg = "Welcome";
    var alive = false;
    var ask_save = false;
    var saved = true;
    
    // initialize stuff
    var frame = create_frame();
    
    // initialize ship and two sprites
    var my_ship = new Ship([WIDTH / 2, HEIGHT / 2], [0, 0], 0, ship_image, ship_info);
    var rock_group = [];
    var missile_group = [];
    var explosion_group = [];
    
    // register handlers
    // document.getElementById("game").addEventListener('keyup', keyup, true);
    // document.getElementById("game").addEventListener('keydown', keydown, true);
    canvas.keyup(keyup);
    canvas.keydown(keydown);
    canvas.click(click);
    frame.set_draw_handler(draw);
    var timer = create_timer(rock_spawner, 1000);
    
    // get things rolling
    // timer.start();
    frame.start();
    
    function ImageInfo(center, size, radius, lifespan, animated) {
        this.center = center;
        this.size = size;
        this.radius = radius;
        if (radius === undefined) this.radius = 0;
        else this.radius = radius;
        if (animated === undefined) this.animated = false;
        else this.animated = animated;
        if (lifespan === undefined) this.lifespan = Infinity;
        else this.lifespan = lifespan;
        this.animated = animated;

        this.get_center = function() {return this.center;};
        this.get_size = function() {return this.size;};
        this.get_radius = function() {return this.radius;};
        this.get_lifespan = function() {return this.lifespan;};
        this.get_animated = function() {return this.animated;};
    }
    
    
    // helper functions to handle transformations
    function angle_to_vector(ang) {
        return [Math.cos(ang), Math.sin(ang)];
    }

    function dist(p, q) {
        return Math.sqrt(Math.pow((p[0] - q[0]), 2) + Math.pow((p[1] - q[1]), 2));
    }
    
    function draw_image(img, src_center, src_size, dest_center, dest_size, angle) {
        ctx.save();
        ctx.translate(dest_center[0], dest_center[1]);
        ctx.rotate(angle);
        ctx.drawImage(img, src_center[0] - (src_size[0]/2), src_center[1] - (src_size[1]/2),
            src_size[0], src_size[1], -(dest_size[0]/2), -(dest_size[1]/2), dest_size[0], dest_size[1]);
        ctx.restore();
    }
    // Ship class
    function Ship(pos, vel, angle, image, info) {
        this.pos = [pos[0], pos[1]];
        this.vel = [vel[0], vel[1]];
        this.thrust = false;
        this.angle = angle;
        this.angle_vel = 0;
        this.image = image;
        this.image_center = info.get_center();
        this.image_size = info.get_size();
        this.radius = info.get_radius();
        
        this.draw = function() {
            if (this.thrust) {
                var src = [this.image_center[0] + this.image_size[0], this.image_center[1]];
            } else {src = this.image_center;}
            draw_image(this.image, src, this.image_size, this.pos, this.image_size, this.angle);
        }

        this.update = function() {
            // update angle
            this.angle += this.angle_vel;
            // update position
            this.pos[0] = (this.pos[0] + this.vel[0]);
            if (this.pos[0] < 0) this.pos[0] = WIDTH - this.pos[0];
            else if (this.pos[0] > WIDTH) this.pos[0] -= WIDTH; 
            this.pos[1] = (this.pos[1] + this.vel[1]) % HEIGHT;
            if (this.pos[1] < 0) this.pos[1] = HEIGHT - this.pos[1];
            else if (this.pos[1] > HEIGHT) this.pos[1] -= HEIGHT;

            // update velocity
            if (this.thrust) {
                var acc = angle_to_vector(this.angle);
                this.vel[0] += acc[0] * 0.1;
                this.vel[1] += acc[1] * 0.1;
            }
            
            this.vel[0] *= 0.99;
            this.vel[1] *= 0.99;
        }

        this.set_thrust = function(on) {
            this.thrust = on;
            if (on) {
                ship_thrust_sound.load();
                ship_thrust_sound.play();
            } else { ship_thrust_sound.pause() }
        };
       
        this.increment_angle_vel = function() {this.angle_vel = 0.05;};
        this.decrement_angle_vel = function() {this.angle_vel = -0.05;};
        this.reset_angle_vel = function() {this.angle_vel = 0;};
        
        this.shoot = function() {
            // alert(missile_group.length);
            if (missile_group.length >= 5) return;
            var forward = angle_to_vector(this.angle);
            var missile_pos = [this.pos[0] + this.radius * forward[0], 
                                    this.pos[1] + this.radius * forward[1]];
            var missile_vel = [this.vel[0] + 6 * forward[0], this.vel[1] + 
                                    6 * forward[1]];
            
            missile_group.push(new Sprite(missile_pos, missile_vel, this.angle, 0, 
                                missile_image, missile_info, missile_sound));
        };
        this.get_position = function() {return this.pos;};
        this.get_radius = function() {return this.radius;};
    }
    
    // Sprite class
    function Sprite(pos, vel, ang, ang_vel, image, info, sound) {
        this.pos = [pos[0],pos[1]];
        this.vel = [vel[0],vel[1]];
        this.angle = ang;
        this.angle_vel = ang_vel;
        this.image = image;
        this.image_center = info.get_center();
        this.image_size = info.get_size();
        this.radius = info.get_radius();
        this.lifespan = info.get_lifespan();
        this.animated = info.get_animated();
        this.age = 0;
        if (sound) {
            sound.load();
            sound.play();
        }
   
        this.draw = function() {
            var src;
            if (this.animated) src= [this.image_center[0] + 
                        this.image_size[0] * this.age, this.image_center[1]];
            else src = this.image_center;
            draw_image(this.image, src, this.image_size, this.pos, this.image_size, this.angle);
        };
        
        this.update = function() {
            // update angle
            this.angle += this.angle_vel;
            // update position
            this.pos[0] = (this.pos[0] + this.vel[0]);
            if (this.pos[0] < 0) this.pos[0] = WIDTH - this.pos[0];
            else if (this.pos[0] > WIDTH) this.pos[0] -= WIDTH; 
            this.pos[1] = (this.pos[1] + this.vel[1]) % HEIGHT;
            if (this.pos[1] < 0) this.pos[1] = HEIGHT - this.pos[1];
            else if (this.pos[1] > HEIGHT) this.pos[1] -= HEIGHT;
            
            this.age += 1;
            return this.age >= this.lifespan;
        };
        this.get_position = function() {return this.pos;};
        this.get_radius = function() {return this.radius;};
        this.collide = function(other) {
            return dist(this.pos, other.get_position()) <= this.radius + 
                other.get_radius();
        };
    }
    
    // helper function to draw a group of sprites
    function process_sprite_group(sprites) {
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (sprite.update()) sprites.splice(i, 1);
            else sprite.draw();
        }
    }

    function group_collide(group, other_object) {
        var collide = false;
        for (var i = 0; i < group.length; i++) {
            if (group[i].collide(other_object)) {
                group.splice(i, 1);
               
                collide = true;
                explosion_group.push(new Sprite(other_object.pos,[0, 0], 0, 0, 
                    explosion_image, explosion_info, explosion_sound));
            }
        }
        return collide;
    }
            
    function group_group_collide(group1, group2) {
        var num = 0;
        for (var i = 0; i < group1.length; i++) {
            var item1 = group1[i];
            for (var j = 0; j < group2.length; j++) {
                var item2 = group2[j];
                if (item1.collide(item2)) {
                    num += 1;
                    group1.splice(i, 1);
                    group2.splice(j, 1);
                    explosion_group.push(new Sprite(item2.pos,[0, 0], 0, 0, 
                        explosion_image, explosion_info, explosion_sound));
                }
            }
        }
        return num;
    }


    // key handlers to control ship   
    function keydown(key) {
        // alert(key.keyCode);
        if (key.keyCode == 32 || key.keyCode == 37 || key.keyCode == 38 ||
                key.keyCode == 40 || key.keyCode == 39) {
            window.event.keyCode = 0;
            window.event.returnValue = false;
        }
        if (key.keyCode == 37) my_ship.decrement_angle_vel();
        else if (key.keyCode == 39) my_ship.increment_angle_vel();
        else if (key.keyCode == 38) my_ship.set_thrust(true);
        else if (key.keyCode == 32) my_ship.shoot();
    }
        
    function keyup(key) {
        if (key.keyCode == 37) my_ship.reset_angle_vel();
        else if (key.keyCode == 39) my_ship.reset_angle_vel();
        else if (key.keyCode == 38) my_ship.set_thrust(false);
        else if (key.keyCode == 13) {
            if (ask_save && !saved) {
                $.ajax({url: '/spaceships', type: 'POST', data: {spaceship: {score: score}}});
                saved = true;
				alert('saved');
            }
        }
    }
        
    // mouseclick handlers that reset UI and conditions whether splash image is drawn
    function click(pos) {
        var center = [WIDTH / 2, HEIGHT / 2];
        var size = splash_info.get_size();
        var inwidth = (center[0] - size[0] / 2) < pos[0] < (center[0] + size[0] / 2);
        var inheight = (center[1] - size[1] / 2) < pos[1] < (center[1] + size[1] / 2);  
        if ((!started) && inwidth && inheight) {
            started = true;
            time = 0;
            level_time = 0;
            timer.start();
            score = 0;
            lives = 3;
            soundtrack.play();
            alive = true;
            ask_save = false;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
        // animiate background
        time += 1;
        var wtime = (time / 4) % WIDTH;
        var center = debris_info.get_center();
        var size = debris_info.get_size();
        draw_image(nebula_image, nebula_info.get_center(), nebula_info.get_size(), 
                                    [WIDTH / 2, HEIGHT / 2], [WIDTH, HEIGHT]);
        draw_image(debris_image, center, size, (wtime - WIDTH / 2, HEIGHT / 2), 
                                                            (WIDTH, HEIGHT));
        draw_image(debris_image, center, size, (wtime + WIDTH / 2, HEIGHT / 2), 
                                                            (WIDTH, HEIGHT));
        // draw UI
        ctx.font = "22px Comic Sans MS";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";    
        if (group_collide(rock_group, my_ship)) {
            lives -= 1;
            alive = false;
            rock_group = [];
            setTimeout(function() {
                if (lives > 0) my_ship = new Ship([WIDTH / 2, HEIGHT / 2],
                                            [0, 0], 0, ship_image, ship_info);
                alive = true;
            }, 500);
        }
        score += group_group_collide(missile_group, rock_group);
        
        
         // draw splash screen if not started
        if (!started) {
            draw_image(splash_image, splash_info.get_center(), 
                    splash_info.get_size(), [WIDTH / 2, HEIGHT / 2], 
                                                splash_info.get_size());
            
            if (ask_save) {
                ctx.font = "18px Comic Sans MS";
                ctx.fillText("Press <Enter> to save your score", WIDTH/2, 170);
                ctx.font = "26px Comic Sans MS";
                ctx.fillText(msg, WIDTH/2, 140);
            } else ctx.fillText(msg, WIDTH/2, 160);
            ctx.font = "16px Comic Sans MS";
            ctx.fillText("Use <left> and <right> to control direction", WIDTH/2, 330);
            ctx.fillText("Use <up> to accelerate", WIDTH/2, 355);
            ctx.fillText("Press <space> to fire !!!", WIDTH/2, 380);
        } else {
    
            if (lives == 0) {
                setTimeout(function() {
                    msg = "Game Over";
                    started = false;
                    timer.stop();
                    rock_group = [];
                    soundtrack.pause();
                    soundtrack.load();
                    my_ship = new Ship([WIDTH / 2, HEIGHT / 2], [0, 0], 0, ship_image, ship_info);
                    if (logged_in) ask_save = true;
                    saved = false;
                }, 500);
                // alert("Your got " + score + " points!");
            }
            // draw ship and sprites
            if (alive) my_ship.draw();
            process_sprite_group(rock_group);
            process_sprite_group(missile_group);
            process_sprite_group(explosion_group);
            
            
            // update ship and sprites
            my_ship.update();
        }
        ctx.font = "22px Comic Sans MS";
        ctx.fillText("Lives", 50, 50);
        ctx.fillText("Score", WIDTH - 50, 50);
        ctx.fillText(lives, 50, 80);
        ctx.fillText(score, WIDTH - 50, 80);
       
    }

    // timer handler that spawns a rock    
    function rock_spawner() {
        if (rock_group.length >= 12) return;
        level_time += 1;
        var rock_pos = [Math.floor(Math.random() * WIDTH), 
                    Math.floor(Math.random() * HEIGHT)];
        while (dist(rock_pos, my_ship.get_position()) < 3 * my_ship.get_radius()) {
            rock_pos = [Math.floor(Math.random() * WIDTH), 
                    Math.floor(Math.random() * HEIGHT)];
        }
        var rock_vel = [(Math.random() * .6 - .3) * level_time/2, (Math.random() * .6 - .3) * level_time/2];
        // var rock_vel = [Math.random() * 8 - 4,  Math.random() * 8 - 4];
        var rock_avel = Math.random() * .2 - .1;
        rock_group.push(new Sprite(rock_pos, rock_vel, 0, rock_avel, asteroid_image, asteroid_info));
    }
    
});

