const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
window.onload = loadFishes;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
(canvas.width < 500 ? maxFish = 10 : maxFish = 30)

let clicks = 0;
let bonusClick = 1;
let lockedFish = 0;
let num = 0;
let cleanTop = false;
let cleanBottom = false;
let cleanRight = false;
let cleanLeft = false;
const fishesArray = [];
const entities = [];

async function loadFishes() {
    const resp = await fetch("fishes.json");
    const fishes = await resp.json();
    fishesArray.push(fishes);
    showShop(fishes);
}

function showShop(fishes) {
    const shopHTML = document.getElementById("shop");
    let html = "";
    for (let i = 0; i < fishes.length; i++) {
        html += `<button id="${fishes[i].name}">`;
        html += `<img class="fishImg locked" src="${fishes[i].img}" alt="">`;
        html += `<h1 class="price">${fishes[i].price}</h1>`;
        html += `</button>`;
    }
    shopHTML.innerHTML = html;
    loadShop(fishes)
}

function loadShop(fishes){
    if (lockedFish == 0) {
        document.getElementsByClassName("fishImg")[0].classList.remove("locked");
        const priceHTML = document.getElementsByClassName("price")[0];
        priceHTML.innerHTML = lockedFish;
        priceHTML.parentNode.removeChild(priceHTML);
        lockedFish++;
        loadShop(fishes)
    }
    loadUpgrades(fishes);
}

function loadUpgrades(fishes){
    const upgrade = document.getElementById(`${fishes[lockedFish].name}`);
    upgrade.onclick = (() => {
        if (lockedFish < fishes.length && clicks >= fishes[lockedFish].price && fishes[lockedFish].name == upgrade.id) {
            console.log("nome peixe: ", fishes[lockedFish].name, "  id: ", upgrade.id)
            clicks -= fishes[lockedFish].price;
            document.getElementById("clicks").innerHTML = clicks;
            document.getElementsByClassName("fishImg")[lockedFish].classList.remove("locked");
            const priceHTML = document.getElementsByClassName("price")[0];
            priceHTML.parentNode.removeChild(priceHTML);
            (lockedFish <= fishes.length -1 ? lockedFish++ : lockedFish = fishes.length -1);
            //console.log("Maximum number of upgrades reached");
            loadShop(fishes);
        }
        console.log("lockedFish: ", lockedFish, "   length: ", fishes.length)
    });
}

canvas.addEventListener('click', function (e) {
    const fishes = fishesArray[0]
    num = Math.floor(Math.random() * lockedFish);
    this.x = e.pageX;
    this.y = e.pageY;
    this.dWidth = fishes[num].width;
    this.dHeight = fishes[num].height;
    this.img = fishes[num];

    entities.push(new Fish(this.img, this.x, this.y, this.dWidth, this.dHeight));
    clicks += fishes[num].bonusClick;

    document.getElementById("clicks").innerHTML = clicks;
    
    if (entities.length >= maxFish) {
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
            entities.splice(i, 1);
        }
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
        menu.parentElement.href="#shop"; 
        console.log(fishesArray);
    } 
    else {
        menu.classList.remove('open');
        menuOpen = false;
        menu.parentElement.href="#"; 
    }
});

const menuItems = document.querySelectorAll('#shop');