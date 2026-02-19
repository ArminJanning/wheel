const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin");
const result = document.getElementById("result");

canvas.width = 480;
canvas.height = 480;

function getNamesFromURL() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("names");

  if (!raw) return ["Default A","Default B"];

  return raw
    .split("|")                       // 👈 new separator
    .map(n => decodeURIComponent(n.trim()))
    .filter(n => n.length > 0);
}


const entries = getNamesFromURL();
const sliceAngle = (Math.PI * 2) / entries.length;

let angle = 0;
let velocity = 0;
let spinning = false;

const friction = 0.985;
const minVelocity = 0.002;

const colors = ["#e74c3c","#2ecc71","#f1c40f","#3498db"];

function drawWheel(){
  ctx.clearRect(0,0,480,480);

  entries.forEach((name,i)=>{

    const start = i * sliceAngle + angle;
    const end = start + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(240,240);
    ctx.arc(240,240,230,start,end);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();

    ctx.save();
    ctx.translate(240,240);
    ctx.rotate(start + sliceAngle/2);

    ctx.fillStyle="#111";
    ctx.font="bold 20px sans-serif";
    ctx.textAlign="right";
    ctx.fillText(name,210,5);

    ctx.restore();
  });
}

function animate(){

  if(!spinning) return;

  angle += velocity;
  velocity *= friction;

  drawWheel();

  if(velocity < minVelocity){

    spinning = false;
    spinBtn.disabled = false;

    const normalized = (Math.PI*2 - (angle % (Math.PI*2))) % (Math.PI*2);
    const index = Math.floor(normalized / sliceAngle);

    result.textContent = entries[index];
    return;
  }

  requestAnimationFrame(animate);
}

function spin(){

  if(spinning) return;

  result.textContent = "";
  spinBtn.disabled = true;
  spinning = true;

  velocity = 0.35 + Math.random()*0.25;

  animate();
}

spinBtn.onclick = spin;

/* 🎯 AUTO SPIN AL LOAD */

window.addEventListener("load", () => {

  drawWheel();     // prima disegna
  setTimeout(() => {
    spin();        // poi gira automaticamente
  }, 400);         // piccolo delay = effetto più naturale
});
