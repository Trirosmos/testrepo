var menu = {

create: function()
{
   game.sound.play("menu_music",1,true);
   game.add.text(10, 50, "Super Awesome Game!!!!!", {font: "30px Arial"});
   var button = game.add.button(130, 110, 'play_button', function(){

   var negritude = game.make.bitmapData(320,240);
   negritude.ctx.fillStyle = "black";
   negritude.ctx.fillRect(0,0,320,240);
   var escuro = game.add.sprite(0,0,negritude);
   escuro.alpha = 0;
   game.add.tween(escuro).to({alpha : 1},500,Phaser.Easing.Bounce.out,true).onComplete.add(function(){game.state.start("nivel1")},this);
   game.sound.stopAll();


   }, this, 2, 1, 0);
},
};
