var START = 0
var PLAY = 1;
var END = 2;
var gameState = START;

var jerry, jerryImg, jerry_running, Jerry_collided;
var tom, tomImg, tom_running, tom_collided;

var ground, invisibleGround, groundImage;
var background, bgImage, mainImg, startButton, button;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver,gameOverImg, restart, resetImg;

function preload(){
  jerryImg = loadAnimation("../images/jerryStanding.png","../images/jerry0.png","../images/jerry.png");
  jerryJump = loadAnimation("../images/jerry.png");
  jerrytom = loadAnimation("../images/tomJerry.png");

  tomImg = loadImage("../images/tomStanding.png");
  tomRun = loadImage("../images/tomRunning.png");

  groundImage = loadImage("../images/ground.png");

  obstacle1 = loadImage("../images/obstacle1.png");
  obstacle2 = loadImage("../images/obstacle2.png");
  obstacle3 = loadImage("../images/obstacle3.png");
  obstacle4 = loadImage("../images/obstacle4.png");
  obstacle5 = loadImage("../images/obstacle5.png");
  obstacle6 = loadImage("../images/obstacle6.png"); 

  resetImg = loadImage("../images/reset.png");
  gameOverImg = loadImage("../images/gameOver.png");
  bgImage = loadImage("../images/bg.avif");
  mainImg = loadImage("../images/start.png");
  button = loadImage("../images/play.png");
}

function setup(){
    createCanvas(windowWidth,windowHeight);

    startButton = createSprite(2405,height-210,130,130);
    startButton.addImage("button",button);
    startButton.scale = 0.3;
    startButton.visible = true;

    ground = createSprite(width/2,height-130,width,100);
    ground.addImage("ground",groundImage);
    ground.scale = 2;
    ground.x = width/2;          
    ground.velocityX = -(14 + 3*score/100);
    
    jerry = createSprite(width/2.8,height-120,20,30);
    jerry.addAnimation("jerry",jerryImg);
    jerry.addAnimation("jump",jerryJump);
    jerry.addAnimation("catched",jerrytom);
    jerry.scale = 0.4;

    tom = createSprite(width/8.5,height-200,40,70);
    tom.addImage("tom",tomRun);
    tom.scale = 1.4;
    
    gameOver = createSprite(width/2+150,height/2);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 1;
    gameOver.visible = false;

    restart = createSprite(300,140);
    restart.addImage("restart",resetImg);
    restart.scale = 0.5;
    restart.visible = false;
    
    invisibleGround = createSprite(width/2,height-60,3000,10);
    invisibleGround.visible = false;

    obstaclesGroup = new Group();
  
}

function draw(){
    //background(0);
    //jerry.debug=true;
    //jerry.setCollider("circle",30,30);
    //tom.debug=true;
    tom.setCollider("rectangle", 0, 0, 50, 400, 0);
    if(gameState === START){
      background(mainImg)
      ground.visible=false;
      tom.visible=false;
      jerry.visible=false;
     
      if(mousePressedOver(startButton)){
        gameState = PLAY;
       // startButton.visible= false;
      }
    }
      
    if (gameState===PLAY){

      background(bgImage);
      fill("red");
      textSize(55);
      text("Score: "+ score, 2200,200);

      startButton.visible=false;
      ground.visible=true;
      tom.visible=true;
      jerry.visible=true;
      
      //to increase the score
      score = score + Math.round(getFrameRate()/60);
      
      //to make the jerry jump and change animation
      if(keyDown("space") && jerry.y >= height-180) {
        jerry.velocityY = -64;
        jerry.changeAnimation("jump",jerryJump);
      }
      else{ 
        jerry.changeAnimation("jerry",jerryImg);
      }
      jerry.velocityY = jerry.velocityY + 4;
       
      //to repeat the ground
      if (ground.x < 0){
        ground.x = width/2; 
      }
    
      //to make the jerry stand on the table
      jerry.collide(invisibleGround);

      //to create obstacles
      spawnObstacles();

      //to check whether the obstacle is touching tom and make him jump
      if(obstaclesGroup.isTouching(tom)){
        tom.velocityY = -30;
      }
      tom.velocityY += 2;
      
      //to check the the obstacles are touching jerry
      if(obstaclesGroup.isTouching(jerry)){
        
        jerry.changeAnimation("catched",jerrytom);
        jerry.scale = 1;
        tom.visible = false;
        gameState = END;
        
      }
       
      //to make tom stand on the table
      tom.collide(invisibleGround);
      
    }

    else if(gameState === END){
      gameOver.visible = true;
      restart.visible = true;
      ground.velocityX = 0;
      jerry.velocityY = 0;
      obstaclesGroup.setVelocityXEach(0);
      obstaclesGroup.setLifetimeEach(-1);
      if(mousePressedOver(restart)) {
        reset();
      }
    }

    drawSprites();
}

function spawnObstacles() {

  if(frameCount % 125 === 0) {
    var obstacle = createSprite(2800,height-140,10,40);
    obstacle.velocityX = -(20 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage("obs",obstacle1);
              break;
      case 2: obstacle.addImage("obs",obstacle2);
              break;
      case 3: obstacle.addImage("obs",obstacle3);
              break;
      case 4: obstacle.addImage("obs",obstacle4);
              break;
      case 5: obstacle.addImage("obs",obstacle5);
              break;
      case 6: obstacle.addImage("obs",obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.4;
    obstacle.lifetime = 200;
    
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

//to reset the game
function reset(){

  gameState = PLAY;
  ground.velocityX = -(14 + 3*score/100);
  gameOver.visible = false;
  restart.visible = false;
  jerry.scale = 0.4;
  tom.visible = true;
  jerry.changeAnimation("running",jerryImg);
  obstaclesGroup.destroyEach();
  score = 0;
  
}