var nivel1 = {

create: function()
{
 fundo = game.add.image(0,0,"fundo");
 fundo.scale.setTo(5,5);
 game.sound.play("nivel1_music",1,true);
 game.physics.startSystem(Phaser.Physics.ARCADE);

 plataformas = game.add.tilemap("nivel1");
 plataformas.addTilesetImage("Tileset1","tileset");
 coisas = plataformas.createLayer("Camada de Tiles 1");
 coisas.resizeWorld();
 plataformas.setCollision(1);

 inimigos = game.add.group();
 inimigos.enableBody = true;
 plataformas.createFromTiles(4, null, "inimigos", coisas, inimigos);
 inimigos.setAllChildren("body.gravity.y",700);
 inimigos.setAllChildren("goingRight",true,false,false,0,true);
 inimigos.forEach(function(e){

  if(plataformas.getTileWorldXY(e.position.x,e.position.y,16,16,coisas).index === 4)
  {
   plataformas.removeTileWorldXY(e.position.x,e.position.y,16,16,coisas)
  }

  e.animations.add("walkingRight",[0,1],2,true);
  e.animations.add("walkingLeft",[2,3],2,true);
  e.animations.play("walkingRight");

},this);

 jogador = game.add.group();
 jogador.enableBody = true;
 plataformas.createFromTiles(5, null, "trevor_sprites", coisas, jogador);
 trevor = jogador.children[0];
 if(plataformas.getTileWorldXY(trevor.position.x,trevor.position.y,16,16,coisas).index === 5)
 {
  plataformas.removeTileWorldXY(trevor.position.x,trevor.position.y,16,16,coisas)
 }


 game.physics.arcade.enable(trevor);
 trevor.body.gravity.y = 700;
 trevor.body.drag.x = 700;
 trevor.body.drag.y = 10;
 trevor.animations.add("idle",[9],1,true);
 trevor.animations.play("idle");
 trevor.animations.add("walkingRight",[9,7,11,8,9],8,false);
 trevor.animations.add("walkingLeft",[2,0,4,1,2],8,false);
 trevor.animations.add("jumpingRight",[12,13],4,false);
 trevor.animations.add("jumpingLeft",[5,6],4,false);
 trevor.heading = "right";
 game.camera.follow(trevor);


 game.camera.deadzone = new Phaser.Rectangle(100,100,100,100);

},

update: function()
{

 if(trevor.position.y > 320 && trevor.alive)
 {
   game.camera.follow(null);
   trevor.alive = false;
   game.sound.play("hurt",1,false);
   var negritude = game.make.bitmapData(320,240);
   negritude.ctx.fillStyle = "black";
   negritude.ctx.fillRect(0,0,320,240);
   var escuro = game.add.sprite(game.camera.x,game.camera.y,negritude);
   escuro.alpha = 0;
   game.add.tween(escuro).to({alpha : 1},500,Phaser.Easing.Bounce.out,true).onComplete.add(function(){game.state.start("game_over")});
 }

 game.physics.arcade.collide(coisas,trevor);
 game.physics.arcade.collide(coisas,inimigos);
 game.physics.arcade.overlap(inimigos,coisas,function(e,f){

  if(f.index === 6) e.goingRight = !e.goingRight;
  if(e.goingRight) e.animations.play("walkingRight");
  else e.animations.play("walkingLeft");

 });

 game.physics.arcade.overlap(trevor,inimigos,function(e,f){
  if(!e.body.onFloor() && trevor.alive)
  {
   f.goingRight = undefined;
   f.body.destroy();
   game.add.tween(f.position).to({y : 500},1000,Phaser.Easing.Bounce.out,true).onComplete.add(f.destroy,f);
   game.sound.play("attack",1,false);
  }

  else if(trevor.alive)
  {
    game.camera.follow(null);
    trevor.alive = false;
    game.sound.play("hurt",1,false);
    trevor.body.velocity.x = 0;
    trevor.body.velocity.y = 0;
    game.add.tween(e.position).to({y : 500},1000,Phaser.Easing.Bounce.out,true).onComplete.add(e.destroy,e);
    var negritude = game.make.bitmapData(320,240);
    negritude.ctx.fillStyle = "black";
    negritude.ctx.fillRect(0,0,320,240);
    var escuro = game.add.sprite(game.camera.x,game.camera.y,negritude);
    escuro.alpha = 0;
    game.add.tween(escuro).to({alpha : 1},500,Phaser.Easing.Bounce.out,true).onComplete.add(function(){game.state.start("game_over")});
  }


});

 game.physics.arcade.overlap(trevor,coisas,function(e,f){

  if(f.index === 7)
  {
   game.sound.stopAll();
   game.state.start("win");
  }

 });

 inimigos.forEach(function(e){

  if(e.goingRight) e.position.x += 0.3;
  else e.position.x -= 0.3;

 });

 moveTrevor();


 game.scale.setUserScale(Math.round(window.innerWidth / 320) - 2,Math.round(window.innerWidth / 320) - 2);

}
};

function moveTrevor()
{
 if(trevor.alive)
 {
   var setas = game.input.keyboard.createCursorKeys();

   if(setas.right.isDown)
   {
    trevor.body.velocity.x = 200;
    if(trevor.body.onFloor()) trevor.animations.play("walkingRight");
    trevor.heading = "right";
   }

   else if(setas.left.isDown)
   {
    trevor.body.velocity.x = -200;
    if(trevor.body.onFloor()) trevor.animations.play("walkingLeft");
    trevor.heading = "left";
   }

   if(setas.up.isDown && trevor.body.onFloor())
   {
    game.sound.play("jump",1,false);
    trevor.body.velocity.y = -350;
    if(trevor.heading === "right") trevor.animations.play("jumpingRight");
    else trevor.animations.play("jumpingLeft");
   }

   if(setas.up.justUp && !trevor.body.onFloor())
   {
    trevor.body.velocity.y *= 0.6;
   }
 }
}
