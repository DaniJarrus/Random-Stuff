let contexto = document.getElementById("lienzo")
let ctx = contexto.getContext("2d")
let WIDTH = 300;
let HEIGHT = 530;
let CANVAS_WIDTH = 300;
let CANVAS_HEIGHT = 530;
contexto.width = WIDTH;
contexto.height = HEIGHT;
//VARIABLES
let score = 0
let FPS =60
let gravedad = 1.5
let personaje = {
    x:50,
    y:150,
    w:50,
    h:50
}
let tuberias = new Array()
tuberias[0] = {
    x:contexto.width,
    y:0
}

//AUDIOS

let punto = new Audio()
punto.src = "Resources/audios/punto.mp3"

//IMAGENES
let bird = new Image()
bird.src = "Resources/imagenes/bird.png"

let background = new Image()
background.src = "Resources/imagenes/background.png"

let tuberiaNorte = new Image()
tuberiaNorte.src = "Resources/imagenes/tuberiaNorte.png"

let tuberiaSur = new Image()
tuberiaSur.src = "Resources/imagenes/tuberiaSur.png"

let suelo = new Image()
suelo.src = "Resources/imagenes/suelo.png"
//CONTROL
function presionar(){
    personaje.y -=35
}
resize()
function resize(){
    CANVAS_HEIGHT = window.innerHeight;
    CANVAS_WIDTH = window.innerWidth;
    
    contexto.width = WIDTH;
    contexto.height = HEIGHT;
    
    contexto.style.height = ""+CANVAS_HEIGHT+"px";

}
//BUCLE
setInterval(loop,1000/FPS)
function loop() {
    ctx.clearRect(0,0,300,530)
    //FONDO
    ctx.drawImage(background,0,0)
    ctx.drawImage(suelo,0,contexto.height - suelo.height)
    //PERSONAJE
    ctx.drawImage(bird,personaje.x,personaje.y)
    //TUBERIAS
    for(let i = 0; i < tuberias.length ; i++){
        let constante = tuberiaNorte.height + 80 
        ctx.drawImage(tuberiaNorte,tuberias[i].x,tuberias[i].y)
        ctx.drawImage(tuberiaSur,tuberias[i].x,tuberias[i].y + constante)
        tuberias[i].x--
        if(tuberias[i].y + tuberiaNorte.height < 80){
            tuberias[i].y = 0 
        }
        if(tuberias[i].x == 150){
            tuberias.push({
                x:contexto.width,
                y: Math.floor(Math.random()*tuberiaNorte.height) - tuberiaNorte.height
            })
        }
        //COLISIONES
        if(personaje.x + bird.width >= tuberias[i].x &&
            personaje.x <= tuberias[i].x + tuberiaNorte.width &&
            (personaje.y <= tuberias[i].y + tuberiaNorte.height || 
                personaje.y + bird.height >= tuberias[i].y + constante)
                || personaje.y + bird.height >= contexto.height - suelo.height){
            location.reload()
        }
        if(tuberias[i].x == personaje.x){
            score++
            punto.play()
        }
    }
    //CONDICIONES
    personaje.y += gravedad
    ctx.fillStyle = "rgba(0,0,0,1)"
    ctx.font = "25px Arial"
    ctx.fillText("Score: "+score,10,contexto.height-40)
}

//EVENTOS
window.addEventListener("resize",resize)
window.addEventListener("keydown",presionar)