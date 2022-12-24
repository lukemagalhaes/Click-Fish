const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
(canvas.width < 500 ? maxFish = 10 : maxFish = 30)

let clicks = 0;
let bonusClick = 1;
let fishUpgrade = 0;
let num = 0;
let cleanTop = false;
let cleanBottom = false;
let cleanRight = false;
let cleanLeft = false;

const entities = [];
const imgFish = [
    {   
        name: "goldenfish",
        img: "img/fish/goldenfish/goldenfish.png",
        fishLeft: "img/fish/goldenfish/goldenfishL.png",
        fishRight: "img/fish/goldenfish/goldenfishR.png",
        width: 50,
        height: 31,
        bonusClick: 1,
        price: 0
    },
    {
        name: "clownfish",
        img: "img/fish/clownfish/clownfish.png",
        fishLeft: "img/fish/clownfish/clownfishL.png",
        fishRight: "img/fish/clownfish/clownfishR.png",
        width: 45,
        height: 26,
        bonusClick: 2,
        price: 10
    },
    {
        name: "pixel clownfish",
        img: "img/fish/orangefish/orangefish.png",
        fishLeft: "img/fish/orangefish/orangefishL.png",
        fishRight: "img/fish/orangefish/orangefishR.png",
        width: 80,
        height: 40,
        bonusClick: 5,
        price: 100
    },
    {
        name: "pixel clownfish 2",
        img: "img/fish/exoticfish/exoticfish.png",
        fishLeft: "img/fish/exoticfish/exoticfishL.png",
        fishRight: "img/fish/exoticfish/exoticfishR.png",
        width: 100,
        height: 48,
        bonusClick: 10,
        price: 1000 
    }
];
let price = imgFish[fishUpgrade].price;

function showShop(imgFish) {
    const shopHTML = document.getElementById("shop");
    let html = "";
    for (let i = 0; i < imgFish.length; i++) {
        html += `<button id="${imgFish[i].name}">`;
        html += `<img class="fishImg locked" src="${imgFish[i].img}" alt="">`;
        html += `<h1 class="price">${imgFish[i].price}</h1>`;
        html += `</button>`;
    }
    shopHTML.innerHTML = html;
    loadShop(imgFish)
}

function loadShop(imgFish){
    const upgrade = document.getElementById(`${imgFish[fishUpgrade].name}`);
    if (fishUpgrade == 0) {
        document.getElementsByClassName("fishImg")[0].classList.remove("locked");
        const priceHTML = document.getElementsByClassName("price")[0];
        priceHTML.innerHTML = fishUpgrade;
        priceHTML.parentNode.removeChild(priceHTML);
        fishUpgrade++;
        loadShop(imgFish)
    }

    upgrade.onclick = (() => {
        if (clicks >= imgFish[fishUpgrade].price && imgFish[fishUpgrade].name == upgrade.id) {
            clicks -= imgFish[fishUpgrade].price;
            document.getElementById("clicks").innerHTML = clicks;
            document.getElementsByClassName("fishImg")[fishUpgrade].classList.remove("locked");
            const priceHTML = document.getElementsByClassName("price")[0];
            priceHTML.parentNode.removeChild(priceHTML);
            fishUpgrade++;
            loadShop(imgFish);
        }
    });
}

canvas.addEventListener('click', function (e) {
    num = Math.floor(Math.random() * fishUpgrade);
    this.x = e.pageX;
    this.y = e.pageY;
    this.dWidth = imgFish[num].width;
    this.dHeight = imgFish[num].height;
    this.img = imgFish[num];

    entities.push(new Fish(this.img, this.x, this.y, this.dWidth, this.dHeight));
    clicks += imgFish[num].bonusClick;

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
    } 
    else {
        menu.classList.remove('open');
        menuOpen = false;
        menu.parentElement.href="#"; 
    }
});

const menuItems = document.querySelectorAll('#shop');
showShop(imgFish);