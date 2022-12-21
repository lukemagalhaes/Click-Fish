const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const upgrade = document.getElementById("upgrade");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let clicks = 0;
let bonusClick = 1;
let fishUpgrade = 1;
let num = 0;

let cleanTop = false;
let cleanBottom = false;
let cleanRight = false;
let cleanLeft = false;

const entities = [];
const imgFish = [
    {
        fishLeft: "img/fishLeft1.png",
        fishRight: "img/fishRight1.png",
        width: 73,
        height: 40,
        bonusClick: 1,
        price: 0
    },
    {
        fishLeft: "img/fish1l.png",
        fishRight: "img/fish1r.png",
        width: 88,
        height: 30,
        bonusClick: 2,
        price: 10
    },
    {
        fishLeft: "img/fish1l.png",
        fishRight: "img/fish1r.png",
        width: 88,
        height: 30,
        bonusClick: 3,
        price: 1000
    }
];
let price = imgFish[fishUpgrade].price;
document.getElementById("price").innerHTML = price;

canvas.addEventListener('click', function (e) {
    num = Math.floor(Math.random() * fishUpgrade);
    this.x = e.pageX;
    this.y = e.pageY;
    this.dWidth = imgFish[num].width;
    this.dHeight = imgFish[num].height;
    this.img = imgFish[num];


    
    document.getElementById("price").innerHTML = price;

    entities.push(new Fish(this.img, this.x, this.y, this.dWidth, this.dHeight));
    clicks = clicks + imgFish[num].bonusClick;

    document.getElementById("clicks").innerHTML = clicks;
    
    if (entities.length >= 30) {
        cleanBottom = true;
        cleanTop = true;
        cleanLeft = true;
        cleanRight = true;
    } 
    else {
        cleanTop = false;
        cleanBottom = false;
        cleanLeft = false;
        cleanRight = false;
    }

    for (let i = 0; i < entities.length; i++){
        if (entities[i].y - this.dHeight > canvas.height || entities[i].y < - this.dHeight || entities[i].x > canvas.width || entities[i].x < - this.dWidth){
            console.log(entities);
            entities.splice(i, 1);
        }
    }
});



upgrade.onclick = (() => {
    if (clicks >= price) {
        clicks -= price;
        fishUpgrade++;
        document.getElementById("clicks").innerHTML = clicks;
        price = imgFish[fishUpgrade].price;
        document.getElementById("fishImg").classList.remove("locked")
        document.getElementById("price").innerHTML = price;
    }
});

function clickX2(){
    bonusClick = bonusClick * 2;
}

class Fish {
    src = "";
    constructor(img, x, y, dWidth, dHeight){
        this.x = x;
        this.y = y;
        this.dWidth = dWidth;
        this.dHeight = dHeight;
        this.src = img;
        this.img = new Image(img.width, img.height);
        
        this.dx = Math.floor(Math.random() * 4) + 2;
        this.dy = Math.floor(Math.random() * 4) + 2;
        this.dx *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        this.dy *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

        (this.dx < 0 ? this.img.src = this.src.fishLeft : this.img.src = this.src.fishRight)
        

    }
    
    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.dWidth, this.dHeight);
    }

    animate(){
        this.x += this.dx;
        this.y += this.dy;

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
                    this.img.src = this.src.fishLeft;
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
                this.img.src = this.src.fishRight;
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

const menu = document.getElementById('menu');
let menuOpen = false;

menu.addEventListener('click', () => {
    if(!menuOpen) {
        menu.classList.add('open');
        menuOpen = true;
        console.log(entities);
    } 
    else {
        menu.classList.remove('open');
        menuOpen = false;
    }
});

const menuItems = document.querySelectorAll('#shop');