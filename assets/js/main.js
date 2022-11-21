let firstImpt = document.querySelector('#first_impt');
let secondimpt = document.querySelector('#second_impt');
let first_side_btns = document.querySelectorAll('.first_side_btns')
let second_side_btns = document.querySelectorAll('.second_side_btns')
let bottom_side_of_currency_first = document.querySelector('.first_bottom')
let bottom_side_of_currency_second = document.querySelector('.second_bottom')

async function apiFunc() {
    const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols');
    const rates = await response.json();
    return rates;
}

first_side_btns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let btn_checked_btn_for_value_change = e.target.innerText
        let second_side_checked_btn = document.querySelector('.checked_btn2').innerText
        document.querySelector('.checked_btn1').classList.remove('checked_btn1')
        e.target.classList.add('checked_btn1')
        if (firstImpt.value) {
            apiFunc().then(res => {
                secondimpt.value = res.rates[`${second_side_checked_btn}`] /
                    res.rates[`${btn_checked_btn_for_value_change}`] * firstImpt.value
            })
        }
        apiFunc().then(res => {
            bottom_side_of_currency_first.innerText = `1 ${e.target.innerText}` +
                " = " + `${(res.rates[second_side_checked_btn]/res.rates[e.target.innerText]).toFixed(4)}` +
                `${second_side_checked_btn}`
            bottom_side_of_currency_second.innerText = `1 ${second_side_checked_btn}` +
                ` = ` +
                `${(res.rates[e.target.innerText]/res.rates[second_side_checked_btn]).toFixed(4)}` +
                ` ${e.target.innerText}`
        })

    })
})
second_side_btns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let btn_checked_btn_for_value_change = e.target.innerText
        let first_side_checked_btn = document.querySelector('.checked_btn1').innerText
        document.querySelector('.checked_btn2').classList.remove('checked_btn2')
        e.target.classList.add('checked_btn2')
        if (secondimpt.value) {
            apiFunc().then(res => {
                firstImpt.value = res.rates[`${first_side_checked_btn}`] /
                    res.rates[`${btn_checked_btn_for_value_change}`] * secondimpt.value
            })
        }
        apiFunc().then(res => {
            bottom_side_of_currency_second.innerText = `1 ${e.target.innerText}` + " = " +
                `${(res.rates[first_side_checked_btn]/res.rates[e.target.innerText]).toFixed(4)} ` +
                `${first_side_checked_btn}`
            bottom_side_of_currency_first.innerText = `1 ${first_side_checked_btn} ` +
                `= ` + `${(res.rates[e.target.innerText]/res.rates[first_side_checked_btn]).toFixed(4)}` +
                `${e.target.innerText}`
        })
    })
})


firstImpt.addEventListener('input', (e) => {
    let first_side_checked_btn = document.querySelector('.checked_btn1').innerText
    let second_side_checked_btn = document.querySelector('.checked_btn2').innerText

    apiFunc().then((res) => {
        secondimpt.value = res.rates[`${second_side_checked_btn}`] / res.rates[`${first_side_checked_btn}`] * e.target.value;

    })
})

secondimpt.addEventListener('input', (e) => {
    let first_side_checked_btn = document.querySelector('.checked_btn1').innerText
    let second_side_checked_btn = document.querySelector('.checked_btn2').innerText

    apiFunc().then((res) => {
        firstImpt.value = res.rates[`${first_side_checked_btn}`] / res.rates[`${second_side_checked_btn}`] * e.target.value;
    })
})

var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

$(window).on('resize', function() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

colors = ['#61E89E', '#FF8A80', '#F9ED86', '#FFB28E', '#95FFEF', '#D75A6C', '#79C4FC', '#DBDAD9', '#FF405F' ];
symbols = [
  '$', '¢', '¥', '€', '￡'
  //, '~', '=', '*', '#', '{', '}', '[', ']', '!', '?', '>'
]

objPack = [];
gravity = 0.05;

function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function objects(x, y) {
  this.x = x = randomInt(0, width);
  this.y = y = -50//randomInt(0, width);
  
  this.w = 50;
  this.h = 50;
  
  this.a = 1;

  this.fontSize = 42;
  this.fontWeight = '100'
  this.size = 20

  this.vx = randomInt(-1, 1);
  this.vy = randomInt(-1, 1);
  this.color = colors[Math.floor(Math.random() * colors.length)];
  this.symbols = symbols[Math.floor(Math.random() * symbols.length)];
}

objects.prototype.draw = function() {  
  context.globalAlpha = this.a
  context.save()
  context.font = '100 ' + this.fontSize + 'px bt_mono'
  context.fillText(this.symbols, this.x, this.y)
  context.restore()
  context.fillStyle = this.color
  this.x += this.vx;
  this.y += this.vy;
  this.vy += gravity;
  this.vx *= 0.99;
  this.vy *= 0.99;
  this.size -= 0.05;
  
  this.a > 0 ? this.a -= 0.003 : this.a = 0
}

function update() {
  context.clearRect(0, 0, width, height);
  context.globalCompositeOperation = "destination-over";

  if (objPack.length < 250) objPack.push(new objects(width / 2, height / 2));

  for (var i = 0; i < objPack.length; i++) {

    objPack[i].draw();

    if (objPack[i].size < 0.1) {
      objPack.splice(0, 1);
    }
  }

  requestAnimationFrame(update);
}

update();