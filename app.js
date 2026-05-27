const workspace = document.getElementById("workspace");
const viewport = document.getElementById("viewport");
const output = document.getElementById("output");

// =====================
// 拖積木
// =====================
document.querySelectorAll(".block").forEach(b => {
  b.addEventListener("click", () => {
    const el = document.createElement("div");
    el.className = "workspace-block";
    el.dataset.type = b.dataset.type;

    if (b.dataset.type === "print") {
      el.textContent = "輸出 Hello";
    }

    if (b.dataset.type === "repeat") {
      el.textContent = "重複 3 次";
    }

    workspace.appendChild(el);
  });
});

// =====================
// 編譯
// =====================
function compile() {
  let code = "";

  for (let b of workspace.children) {
    if (b.dataset.type === "print") {
      code += 'console.log("Hello");\n';
    }

    if (b.dataset.type === "repeat") {
      code += 'for(let i=0;i<3;i++){console.log("loop");}\n';
    }
  }

  output.textContent = code;
}

// =====================
// 執行
// =====================
function run() {
  eval(output.textContent);
}

// =====================
// Blockly風畫布（拖動+縮放）
// =====================
let scale = 1;
let x = 0;
let y = 0;

let dragging = false;
let startX, startY;

function update() {
  workspace.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
}

// 拖動畫布（單指）
viewport.addEventListener("touchstart", e => {
  if (e.touches.length === 1) {
    dragging = true;
    startX = e.touches[0].clientX - x;
    startY = e.touches[0].clientY - y;
  }
});

viewport.addEventListener("touchmove", e => {
  e.preventDefault();

  if (e.touches.length === 1 && dragging) {
    x = e.touches[0].clientX - startX;
    y = e.touches[0].clientY - startY;
    update();
  }

  // 雙指縮放
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (window.lastDist) {
      let diff = dist - window.lastDist;
      scale += diff * 0.005;

      scale = Math.max(0.5, Math.min(3, scale));
      update();
    }

    window.lastDist = dist;
  }
});

viewport.addEventListener("touchend", () => {
  dragging = false;
  window.lastDist = null;
});
