const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var clicks = 0
let bonusClick = 1
let cleanTop = false
let cleanBottom = false
let cleanRight = false
let cleanLeft = false


const entities = [];
//console.log(entities)


const fishLeft1 = new Image();
fishLeft1.src = "fishLeft1.png";
const fishRight1 = new Image();
fishRight1.src = "fishRight1.png";

    

canvas.addEventListener('click', function (e) {
    
    this.x = e.x
    this.y = e.y
    
    
    let dWidth = 73;
    let dHeight = 40;
    
    entities.push(new Fish(this.img, this.x, this.y, dWidth, dHeight));
    if (bonusClick > 1) {
        entities.push(new Fish(this.img, this.x, this.y, dWidth, dHeight));
        clicks = clicks += 1;
    }
    //console.log(this.x, this.y);

    clicks = clicks += 1;
    //console.log(clicks);
    document.getElementById("clicks").innerHTML = clicks;
    
    if (entities.length >= 30) {

        cleanBottom = true
        cleanTop = true
        cleanLeft = true
        cleanRight = true
        //setTimeout (function() { numberFish = 0}, 2000)
    }

    else {
        cleanTop = false
        cleanBottom = false
        cleanLeft = false
        cleanRight = false
        
    }

    for (let i = 0; i < entities.length; i++){
        //console.log(entities.length)
        if (entities[i].y - dHeight > canvas.height || entities[i].y < -dHeight || entities[i].x > canvas.width || entities[i].x < -dWidth){
                entities.splice(i, 1);
                //console.log(entities[i].x, entities[i].y)
        }
    }
    console.log(entities.length, entities)

});


class Fish {
    constructor(img, x, y, dWidth, dHeight){
        this.x = x;
        this.y = y;
        this.dWidth = dWidth;
        this.dHeight = dHeight;
        this.img = img;
        
        this.dx = Math.floor(Math.random() * 4) + 2;
        this.dx *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        this.dy = Math.floor(Math.random() * 4) + 2;
        this.dy *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    }
    
    draw(){
        if (this.dx < 0) {
            this.img = fishLeft1;
        }
        else {
            this.img = fishRight1;
        }
        ctx.drawImage(this.img, this.x, this.y, this.dWidth, this.dHeight);

        
    }

    animate(){

        this.x += this.dx;
        this.y += this.dy;
        console.log(this.dx, this.x)
        //console.log(this.dy, this.y)
        if (!cleanBottom) {
            if (this.y + this.dHeight >= canvas.height) {
                if (this.dy > 0) {
                    this.dy = -this.dy;
                }
            }
            if (this.dy > 0 && 1.5 * this.dHeight + this.y > canvas.height) {
                this.dy = this.dy
            }
        }
        else {
            cleanBottom = true;
        }

        if (!cleanTop) {
            if (this.y < 0 && this.dy < 0) {
                this.dy = -this.dy;
                if (this.dy > 0) {
                this.dy = this.dy;
                }
            }
        }
        else {
            cleanTop = true;
        }

        if (!cleanRight) {
            if (this.x + this.dWidth > canvas.width) {
                if (this.dx < 0 && this.x >= 0 ) {
                    this.dx = this.dx;
                    
                }
                else {
                    this.dx = -this.dx;
                }
            }
            if (this.dx > 0 && this.x + 1.5 * this.dWidth > canvas.width) {
                this.dx = this.dx;
            }
        }
        else {
            cleanRight = true;
        }

        if (!cleanLeft) {
            if (this.x < 0 && this.dx < 0) {
                this.dx = -this.dx;
            }
        }
        else {
            cleanLeft = true;
        }

        this.draw()
    }
}

function Update () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < entities.length; i++) {
     let entitie = entities[i];
     entitie.animate();
    }
    
    requestAnimationFrame(Update);
}
Update();





const menu = document.querySelector('.menu');
let menuOpen = false;

menu.addEventListener('click', () => {
    if(!menuOpen) {
        menu.classList.add('open');
        menuOpen = true;
    } 
    else {
        menu.classList.remove('open');
        menuOpen = false;
    }
});

