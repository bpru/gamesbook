$(document).ready(function() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    // var ship_info = new ImageInfo([45, 45], [90, 90], 35);
    var img = new Image();
    img.src = "/assets/double_ship.png";
    ctx.drawImage(img, 50, 50);
    
    draw_image(img,[45,45], [90 ,90], [150, 200], [45,45], 0);
    draw_image(img,[45,45], [90, 90], [200, 200], [45,45], 1);
    
    draw_image(img,[45,45], [90, 90], [50, 200], [45,45], -1);
    
    function draw_image(img, src_center, src_size, dest_center, dest_size, angle) {
        ctx.save();
        ctx.translate(dest_center[0], dest_center[1]);
        ctx.rotate(angle);
        ctx.drawImage(img, src_center[0] - (src_size[0]/2), src_center[1] - (src_size[1]/2),
            src_size[0], src_size[1], -(dest_size[0]/2), -(dest_size[1]/2), dest_size[0], dest_size[1]);
        ctx.restore();
    }
});