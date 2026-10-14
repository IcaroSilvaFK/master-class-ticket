(function () {
  "use strict";

  var W = 1080;
  var H = 1080;
  var CX = W / 2;

  var COLORS = {
    purple: "#801C73",
    purpleDark: "#5F1555",
    orange: "#F07134",
    cream: "#f3e9f0",
  };

  var SERIF = 'Georgia, "Times New Roman", serif';
  var KANJI_FONT = '"Yu Mincho", "MS Mincho", "Hiragino Mincho ProN", serif';

  var MODULES = [
    { num: "一", text: "Claude Code + extensão no navegador" },
    { num: "二", text: "Spec Driven Development" },
    { num: "三", text: "Agentes no Copilot Studio" },
    { num: "四", text: "Case: dashboard no Power BI" },
  ];

  var CAPTION =
    "🥋 Acabei de garantir meu lugar na Primeira Masterclass de Inteligência Artificial da Ímpar!\n\n" +
    "21/10/2026 — um dojô de conhecimento com Claude Code, Spec Driven Development, Agentes no Copilot Studio e um case real de dashboard no Power BI.\n\n" +
    "Bora evoluir juntos nessa jornada de IA! 🖤\n\n" +
    "#Ímpar #MasterclassIA #InteligênciaArtificial #IA #Inovação";

  // ---------- helpers ----------

  function drawRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function trackedWidth(ctx, text, spacing) {
    var w = 0;
    for (var i = 0; i < text.length; i++) {
      w += ctx.measureText(text[i]).width;
      if (i < text.length - 1) w += spacing;
    }
    return w;
  }

  function drawTrackedText(ctx, text, cx, y, spacing) {
    var total = trackedWidth(ctx, text, spacing);
    var x = cx - total / 2;
    ctx.textAlign = "left";
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      ctx.fillText(ch, x, y);
      x += ctx.measureText(ch).width + spacing;
    }
  }

  function drawVerticalKanji(ctx, chars, x, cy, color, size, alpha) {
    ctx.save();
    ctx.font = size + "px " + KANJI_FONT;
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var step = size * 1.25;
    var totalH = step * (chars.length - 1);
    var startY = cy - totalH / 2;
    for (var i = 0; i < chars.length; i++) {
      ctx.fillText(chars[i], x, startY + i * step);
    }
    ctx.restore();
  }

  // ---------- drawing sections ----------

  function drawBackground(ctx) {
    var cx = CX;
    var cy = H * 0.42;

    ctx.fillStyle = "#fffaf8";
    ctx.fillRect(0, 0, W, H);

    var glowPurple = ctx.createRadialGradient(170, 170, 0, 170, 170, 560);
    glowPurple.addColorStop(0, "rgba(128, 28, 115, 0.20)");
    glowPurple.addColorStop(1, "rgba(128, 28, 115, 0)");
    ctx.fillStyle = glowPurple;
    ctx.fillRect(0, 0, W, H);

    var glowOrange = ctx.createRadialGradient(cx, 500, 0, cx, 500, 440);
    glowOrange.addColorStop(0, "rgba(240, 113, 52, 0.18)");
    glowOrange.addColorStop(1, "rgba(240, 113, 52, 0)");
    ctx.fillStyle = glowOrange;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, H * 0.8);
    ctx.bezierCurveTo(W * 0.3, H * 0.72, W * 0.7, H * 0.97, W, H * 0.82);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    var wave = ctx.createLinearGradient(0, H * 0.75, W, H);
    wave.addColorStop(0, COLORS.purple);
    wave.addColorStop(1, COLORS.orange);
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = wave;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(128, 28, 115, 0.5)";
    ctx.lineWidth = 3;
    ctx.strokeRect(22, 22, W - 44, H - 44);
    ctx.strokeStyle = "rgba(240, 113, 52, 0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(32, 32, W - 64, H - 64);
    ctx.restore();
  }

  function drawHeader(ctx) {
    var y = 96;
    var text = "ÍMPAR · 21 · 10 · 2026";
    ctx.save();
    ctx.font = "600 26px " + SERIF;
    ctx.fillStyle = COLORS.orange;
    ctx.textBaseline = "middle";
    var spacing = 6;
    drawTrackedText(ctx, text, CX, y, spacing);

    var halfW = trackedWidth(ctx, text, spacing) / 2;
    var lineY = y;
    var margin = 70;
    var gap = 24;

    var gradL = ctx.createLinearGradient(margin, 0, CX - halfW - gap, 0);
    gradL.addColorStop(0, "rgba(240,113,52,0)");
    gradL.addColorStop(1, "rgba(240,113,52,0.8)");
    ctx.strokeStyle = gradL;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, lineY);
    ctx.lineTo(CX - halfW - gap, lineY);
    ctx.stroke();

    var gradR = ctx.createLinearGradient(CX + halfW + gap, 0, W - margin, 0);
    gradR.addColorStop(0, "rgba(240,113,52,0.8)");
    gradR.addColorStop(1, "rgba(240,113,52,0)");
    ctx.strokeStyle = gradR;
    ctx.beginPath();
    ctx.moveTo(CX + halfW + gap, lineY);
    ctx.lineTo(W - margin, lineY);
    ctx.stroke();
    ctx.restore();
  }

  function drawTitle(ctx) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = COLORS.purpleDark;
    ctx.font = "italic 400 60px " + SERIF;
    ctx.fillText("Primeira Masterclass", CX, 190);

    ctx.font = "600 30px " + SERIF;
    ctx.fillStyle = COLORS.orange;
    drawTrackedText(ctx, "DE INTELIGÊNCIA ARTIFICIAL", CX, 242, 3);
    ctx.restore();
  }

  function drawEnso(ctx, cx, cy, r) {
    ctx.save();
    var passes = 5;
    for (var i = 0; i < passes; i++) {
      var wobble = (Math.random() - 0.5) * 6;
      var rr = r + wobble;
      var startAngle = (-0.65 + (Math.random() - 0.5) * 0.12) * Math.PI;
      var endAngle = (1.55 + (Math.random() - 0.5) * 0.12) * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, startAngle, endAngle);
      ctx.lineWidth = 15 - i * 1.6;
      ctx.lineCap = "round";
      ctx.strokeStyle = i % 2 === 0 ? "rgba(240,113,52,0.55)" : "rgba(128,28,115,0.55)";
      ctx.globalAlpha = 0.45 + Math.random() * 0.3;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawAvatar(ctx, cx, cy, r, photoImg, name) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    if (photoImg) {
      var scale = Math.max((r * 2) / photoImg.width, (r * 2) / photoImg.height);
      var w = photoImg.width * scale;
      var h = photoImg.height * scale;
      ctx.drawImage(photoImg, cx - w / 2, cy - h / 2, w, h);
    } else {
      var grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
      grad.addColorStop(0, COLORS.purpleDark);
      grad.addColorStop(1, COLORS.purple);
      ctx.fillStyle = grad;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      var initial = name && name.trim() ? name.trim()[0].toUpperCase() : "侍";
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "700 " + Math.round(r * 0.85) + "px " + SERIF;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(initial, cx, cy + 8);
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = COLORS.orange;
    ctx.stroke();
    ctx.restore();
  }

  function drawName(ctx, name, cx, y) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = COLORS.purpleDark;
    ctx.font = "700 42px " + SERIF;
    ctx.fillText(name || "Seu Nome", cx, y);

    ctx.strokeStyle = COLORS.orange;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 60, y + 34);
    ctx.lineTo(cx + 60, y + 34);
    ctx.stroke();
    ctx.restore();
  }

  function drawSideKanji(ctx) {
    drawVerticalKanji(ctx, "人工知能".split(""), 66, 560, COLORS.purple, 34, 0.18);
    drawVerticalKanji(ctx, "道場".split(""), 1014, 560, COLORS.purple, 34, 0.18);
  }

  function drawBeltSeal(ctx) {
    var cx = W - 150;
    var cy = 150;
    var r = 72;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((-8 * Math.PI) / 180);

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.purpleDark;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = COLORS.orange;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, r - 10, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 " + Math.round(r * 0.55) + "px " + KANJI_FONT;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("黒帯", 0, 2);
    ctx.restore();
  }

  function drawModuleChips(ctx) {
    var pad = 70;
    var rowH = 46;
    var gap = 12;
    var startY = 828;
    var w = W - pad * 2;

    MODULES.forEach(function (mod, i) {
      var y = startY + i * (rowH + gap);

      ctx.save();
      drawRoundRect(ctx, pad, y, w, rowH, rowH / 2);
      ctx.fillStyle = "rgba(128, 28, 115, 0.35)";
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(240, 113, 52, 0.6)";
      ctx.stroke();

      var circleR = rowH / 2 - 4;
      var circleCx = pad + rowH / 2;
      var circleCy = y + rowH / 2;
      ctx.beginPath();
      ctx.arc(circleCx, circleCy, circleR, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.orange;
      ctx.fill();

      ctx.fillStyle = "#1a0617";
      ctx.font = "700 20px " + KANJI_FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(mod.num, circleCx, circleCy + 1);

      ctx.fillStyle = COLORS.purpleDark;
      ctx.font = "600 23px " + SERIF;
      ctx.textAlign = "left";
      ctx.fillText(mod.text, pad + rowH + 18, circleCy + 1);
      ctx.restore();
    });
  }

  // ---------- orchestrator ----------

  function drawTicket(ctx, opts) {
    var name = (opts && opts.name) || "";
    var photoImg = opts && opts.photoImg;

    ctx.clearRect(0, 0, W, H);
    drawBackground(ctx);
    drawHeader(ctx);
    drawTitle(ctx);
    drawSideKanji(ctx);
    drawBeltSeal(ctx);

    var ensoCx = CX;
    var ensoCy = 500;
    var ensoR = 215;
    drawEnso(ctx, ensoCx, ensoCy, ensoR);
    drawAvatar(ctx, ensoCx, ensoCy, 182, photoImg, name);
    drawName(ctx, name, CX, 745);

    drawModuleChips(ctx);
  }

  // ---------- wiring ----------

  var canvas = document.getElementById("ticket");
  var ctx = canvas.getContext("2d");
  var nameInput = document.getElementById("nameInput");
  var photoInput = document.getElementById("photoInput");
  var downloadBtn = document.getElementById("downloadBtn");
  var captionText = document.getElementById("captionText");
  var copyBtn = document.getElementById("copyBtn");

  var state = { photoImg: null };

  function render() {
    drawTicket(ctx, { name: nameInput.value, photoImg: state.photoImg });
  }

  function downloadPNG() {
    var link = document.createElement("a");
    var safeName = (nameInput.value || "ticket").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    link.download = "masterclass-ia-ticket-" + (safeName || "impar") + ".png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function copyCaption() {
    navigator.clipboard.writeText(captionText.value).then(
      function () {
        var original = copyBtn.textContent;
        copyBtn.textContent = "Copiado!";
        setTimeout(function () {
          copyBtn.textContent = original;
        }, 2000);
      },
      function () {
        captionText.select();
        document.execCommand("copy");
      }
    );
  }

  nameInput.addEventListener("input", render);

  photoInput.addEventListener("change", function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        state.photoImg = img;
        render();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  downloadBtn.addEventListener("click", downloadPNG);
  copyBtn.addEventListener("click", copyCaption);

  captionText.value = CAPTION;
  render();
})();
