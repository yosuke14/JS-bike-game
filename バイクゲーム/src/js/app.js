var c = document.createElement("canvas"); //グラフィックを描画する
var ctx = c.getContext("2d"); //getContext メソッドで描画機能を有効にする。　2d は2次元のこと
//canbus の大きさ
c.width = 1000;
c.height = 500;

document.body.appendChild(c); //bodyに子要素（appendChild）を追加する

var perm = [];

while (Perm.length < 255) {
    while (perm.includes(val = Math.floor(Math.random() * 255)));
    perm.push(val);
}

var lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2; //線形分離（ベクトルの話）自分の想像している山ができればそれでいい！

var noice = x => { //山道の斜面
    x = x * 0.01 % 255;
    return　lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

var player = new function() { //プレイヤーの設定
    this.x = c.width / 2; //画面の真ん中
    this.y = 0; //上下
    this.ySpeed = 0;
    this.rot = 0; //回転
    this.rSpeed =0; //回転のスピード

    this.img = new Image();
    this.img.src = "images/moto.png";

    this.draw = function() {
var p1 = c.height - noise(t + this.x) * 0.25;
var p2 = c.height - noise(t + 5 + this.x) * 0.25;

var grounded = 0;

if (p1 - size > this.y) {
    this.ySpeed += 0.1; //落下スピードがどんどん早くなる
} else {
    this.ySpeed -= this.y - (p1 - size);
    this.y = p1 - size;// 山の斜面に触れたらp1の固定する

    grounded = 1;
}

if(!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5) {
    playing = false;
    this.rSpeed = 5;
    k.ArrowUp = 1;
    this.x -= speed * 5;
}

var angle = Math.atan2((p2 - size) - this.y, (this.x + 5) - this.x);

// this.rot = angle; いらない

this.y += this.ySpeed;

if(grounded && playing) {
    this.rot -= (this.rot - angle) * 0.5;
    this.rSpeed = this.rSpeed - (angle - this.rot);
}

this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
this.rot -= this.rSpeed * 0.1;

if(this.rot > Math.PI) this.rot = -Math.PI;
if(this.rot < -Math.PI) this.rot = Math.PI;

        ctx.save(); //何度も動かすため保存する
        ctx.translate(this.x, this.y); //プレイヤーの移動
        ctx.rotate(this.rot);
        ctx.drawImage(this.img, -size, -size, 30, 30); //プレイヤーの大きさの変更可能

        ctx.restore(); //描画状態を保存した時点のものに戻す
    }
}

var t = 0;
var speed = 0;
var playing = true; //プレイができる状態かできない状態かを表す
var k = {ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0};

function loop () { //アニメーションを追加するためループ処理を追加する
    speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.1; //キーを押している時は早くなる、離すと遅くなる
    t += 10 * speed; //tを増加させる
    ctx.fillStyle = "#19f" //色の塗り潰し
    ctx.fillRect(0, 0, c.width, c.height) //長方形を描画する　(x, y, w, h)

    ctx.fillStyle = "black"; //凸凹の斜面を描画する

    ctx.beginPath(); //線を描画する時は最初に指定する
    ctx.moveTo(0, c.height);

    for (var i = 0; i < c.width; i++) {
        ctx.lineTo(i, c.height - noise(t + i) * 0.25); //ctx.lineTo（直前の座標と指定座標を結ぶ直線を引く）
    }

    ctx.lineTo(c.width, c.height);

    ctx.fill();

    player.draw();
    requestAnimationFrame(loop); //ブラウザにアニメーションを行いたい事を知らせ、指定した関数を呼び出して、次の描画の前にアニメーションを追加する事を要求する
}

onkeydown = d => k[d.key] = 1; //キーを押した時
onkeyup = d = k[d.key] = 0;

loop(); // 関数の実行