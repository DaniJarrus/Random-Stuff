import { createAnimations } from "./animations.js";
import { checkControls } from "./controls.js";
//Global Variable Phaser//
const config = {
    type: Phaser.AUTO,
    width: 256,
    height: 244,
    backgroundColor: '#049cd8',
    parent: 'game',
    physics:{
        default: 'arcade',
        arcade:{
            gravity:{y: 300},
            debug: false
        }
    },
    scene:{
        preload, // Precarga los recursos
        create, // Se ejecuta al comenzar el juego
        update // Se ejecuta en cada frame
    }
}

new Phaser.Game(config);
// This se refiere al game

// Se ejecuta el primero
function preload(){
    //PRECARGAMOS EL CLOUD1
    this.load.image(
        'cloud1',
        'assets/scenery/overworld/cloud1.png'
    )
    this.load.image(
        'floorbricks',
        'assets/scenery/overworld/floorbricks.png'
    )

    this.load.spritesheet(
        'mario',
        'assets/entities/mario.png',
        {frameWidth: 18, frameHeight: 16}
    )

    this.load.spritesheet(
        'goomba',
        'assets/entities/overworld/goomba.png',
        {frameWidth: 16, frameHeight: 16}
    )

    this.load.audio('gameover', 'assets/sound/music/gameover.mp3')
}

// Se ejecuta el segundo
function create(){
    //AÑADIMOS IMAGEN CLOUD1
    // image(eje x, eje y y el nombre de la imagen)
    this.add.image(100, 50, 'cloud1')
    // Cambiamos el origin de la imagen para que comience a pintarse desde parte superior izquierda
    .setOrigin(0, 0)
    // Escalamos la imagen con Scale
    .setScale(0.15)

    //Fisicas del suelo

    this.floor = this.physics.add.staticGroup()

    this.floor
        .create(0, config.height - 16, 'floorbricks')
        .setOrigin(0, 0.5)
        //https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Physics.Arcade.Image-refreshBody
        .refreshBody()

    this.floor
        .create(150, config.height - 16, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()

    this.add.tileSprite(0, config.height - 32, 64, 32,
    'floorbricks')
        .setOrigin(0, 0)
    
    // this.add.tileSprite(100, config.height - 32, config.width, 32,
    //     'floorbricks')
    //         .setOrigin(0, 0)

    //AÑADIMOS SPRITE MARIO
    //this.mario = this.add.sprite(50, 210, 'mario')
    //.setOrigin(0, 1)

    //AÑADIMOS SPRITE MARIO TENIENDO EN CUENTA LAS FISICAS
    this.mario = this.physics.add.sprite(50, 100, 'mario')
        .setOrigin(0, 1)
        .setCollideWorldBounds(true)
        //Se puede modificar la gravedad
        .setGravityY(300)
    
    this.enemy = this.physics.add.sprite(120, config.height - 30, 'goomba')
        .setOrigin(0, 1)
        .setGravityY(300)
        .setVelocityX(-50)    

    //Utilizamos setBounds para establecer el tamaño del mapa
    this.physics.world.setBounds(0, 0, 2000, config.height)

    //Creamos una colision entre Mario y el suelo
    this.physics.add.collider(this.mario, this.floor)

    //Creamos una colision entre el enemigo y el suelo
    this.physics.add.collider(this.enemy, this.floor)

    //Creamos una colision entre Mario y el enemigo
    this.physics.add.collider(this.mario, this.enemy, onHitEnemy)

    //Nos permite establecer el tamaño que tendrá la camara
    this.cameras.main.setBounds(0, 0, 2000, config.height)
    //Establecemos que la camara siga al propio Mario
    this.cameras.main.startFollow(this.mario)

    createAnimations(this)

    this.enemy.anims.play('goomba-walk', true)

    this.keys = this.input.keyboard.createCursorKeys()
}

function onHitEnemy (mario, enemy) {
    if (mario.body.touching.down && enemy.body.touching.up){
        enemy.destroy()
        mario.setVelocityY(-200)
    } else {
        //morir Mario
        
    }
}

// Se ejecuta el tercero y continuamente
function update(){

    checkControls(this)

    const {mario, sound, scene} = this

    //Check if Mario is dead
    if(mario.y >= config.height){
        mario.isDead = true
        mario.anims.play('mario-dead')
        mario.setCollideWorldBounds(false)
        sound.add('gameover', {volumen: 0.2}).play()

        //Configuramos el salto despues de la muerte
        setTimeout(() => {
            mario.setVelocityY(-350)
        }, 100)

        setTimeout(() => {
            scene.restart()
        }, 2000)
    }
}