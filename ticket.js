(function () {
  "use strict";

  var P = { purple: "#801C73", purpleDark: "#5F1555", orange: "#F07134" };
  var white = "#ffffff";
  var muted = "#c9bcc6";

  var MODULES = ["CLAUDE CODE", "SPEC DRIVEN DEV", "COPILOT STUDIO", "POWER BI"];

  var CAPTION =
    "🥋 Ticket carimbado: participei do dojô da IA!\n\n" +
    "Participei da Primeira Masterclass de Inteligência Artificial da Ímpar, em 21 de outubro. Foi uma baita oportunidade pra aprender, experimentar e descobrir novas formas de aplicar IA no dia a dia.\n\n" +
    "Treinamos Claude Code, Spec Driven Development, agentes no Copilot Studio e um case de dashboard no Power BI. 🚀\n\n" +
    "A jornada até a faixa-preta começa com prática, curiosidade e troca de conhecimento. Bora treinar juntos?\n\n" +
    "#Ímpar #InteligênciaArtificial #MasterclassIA #AprendizadoContínuo";

  // ---------- templates ----------

  var TEMPLATES = [
    {
      id: "rockwell-badge",
      label: "Crachá roxo · Rockwell",
      cfg: {
        bg: { mode: "gradient", c1: P.purple, c2: P.purpleDark },
        shape: "badge", scale: 1.05, tilt: 4,
        accent: P.orange, cardFill: white, ink: P.purpleDark, muted: muted,
        photoShape: "circle", stripeHeader: false, lanyard: true, deco: "barcode",
        headline: { type: "none" },
        footer: { type: "pills", color: "#fff", pill: "rgba(255,255,255,0.18)" },
        fonts: { display: '"Rockwell", Georgia, serif', body: '"Segoe UI", sans-serif' },
      },
    },
    {
      id: "franklin-horizontal",
      label: "Cartão roxo · Franklin Gothic",
      cfg: {
        bg: { mode: "solid", c1: P.purpleDark },
        shape: "horizontal", scale: 1, tilt: -3,
        accent: P.orange, cardFill: white, ink: P.purpleDark, muted: muted,
        photoShape: "rounded", stripeHeader: true, lanyard: false, deco: "barcode",
        headline: { type: "bold", c1: "#fff", c2: P.orange, weight: "800" },
        footer: { type: "inline", color: "#fff" },
        fonts: { display: '"Franklin Gothic Medium", Arial, sans-serif', body: "Georgia, serif" },
      },
    },
    {
      id: "verdana-horizontal",
      label: "Cartão laranja · Verdana",
      cfg: {
        bg: { mode: "solid", c1: P.orange },
        shape: "horizontal", scale: 1, tilt: 3,
        accent: P.purpleDark, cardFill: white, ink: P.purpleDark, muted: muted,
        photoShape: "circle", stripeHeader: false, lanyard: false, deco: "barcode",
        headline: { type: "label", c1: "#fff" },
        footer: { type: "inline", color: "#fff" },
        fonts: { display: "Verdana, sans-serif", body: "Georgia, serif" },
      },
    },
    {
      id: "georgia-gradient-horizontal",
      label: "Cartão gradiente · Georgia",
      cfg: {
        bg: { mode: "gradient", c1: P.orange, c2: P.purpleDark },
        shape: "horizontal", scale: 1, tilt: 0,
        accent: P.purpleDark, cardFill: white, ink: P.purpleDark, muted: muted,
        photoShape: "circle", stripeHeader: true, lanyard: false, deco: "barcode",
        headline: { type: "bold", c1: "#fff", c2: "#fff", weight: "800" },
        footer: { type: "inline", color: "#fff" },
        fonts: { display: 'Georgia, "Times New Roman", serif', body: '"Segoe UI", Arial, sans-serif' },
      },
    },
    {
      id: "bahnschrift-badge",
      label: "Crachá duplo acento · Bahnschrift",
      cfg: {
        bg: { mode: "gradient", c1: P.purpleDark, c2: P.orange },
        shape: "badge", scale: 0.95, tilt: -6,
        accent: P.orange, cardFill: white, ink: P.purpleDark, muted: muted,
        photoShape: "circle", stripeHeader: true, lanyard: true, deco: "barcode",
        headline: { type: "none" },
        footer: { type: "pills", color: "#fff", pill: "rgba(255,255,255,0.18)" },
        fonts: { display: '"Bahnschrift", "Segoe UI", sans-serif', body: '"Segoe UI", sans-serif' },
      },
    },
  ];

  // ---------- drawing helpers ----------

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function roundRectTop(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
  }
  function trackedWidth(ctx, text, sp) {
    var w = 0;
    for (var i = 0; i < text.length; i++) { w += ctx.measureText(text[i]).width; if (i < text.length - 1) w += sp; }
    return w;
  }
  function trackedText(ctx, text, cx, y, sp) {
    var total = trackedWidth(ctx, text, sp);
    var x = cx - total / 2;
    var prev = ctx.textAlign;
    ctx.textAlign = "left";
    for (var i = 0; i < text.length; i++) { ctx.fillText(text[i], x, y); x += ctx.measureText(text[i]).width + sp; }
    ctx.textAlign = prev;
  }
  function trackedTextLeft(ctx, text, x, y, sp) {
    var cur = x;
    for (var i = 0; i < text.length; i++) { ctx.fillText(text[i], cur, y); cur += ctx.measureText(text[i]).width + sp; }
  }
  function wrapLines(ctx, text, maxWidth) {
    var words = text.split(" "), lines = [], cur = "";
    for (var i = 0; i < words.length; i++) {
      var t = cur ? cur + " " + words[i] : words[i];
      if (ctx.measureText(t).width > maxWidth && cur) { lines.push(cur); cur = words[i]; } else cur = t;
    }
    if (cur) lines.push(cur);
    return lines;
  }
  function barcode(ctx, x, y, w, h, color) {
    ctx.save(); ctx.fillStyle = color;
    var cx = x, seed = 7;
    while (cx < x + w) {
      seed = (seed * 13 + 5) % 11;
      var bw = 2 + (seed % 4);
      if (seed % 3 !== 0) ctx.fillRect(cx, y, bw, h);
      cx += bw + 3;
    }
    ctx.restore();
  }
  function qrPattern(ctx, x, y, size, color) {
    ctx.save(); ctx.fillStyle = color;
    var cells = 7, cell = size / cells, seed = 3;
    for (var r = 0; r < cells; r++) {
      for (var c = 0; c < cells; c++) {
        seed = (seed * 17 + 11) % 13;
        var corner = (r < 2 && c < 2) || (r < 2 && c > cells - 3) || (r > cells - 3 && c < 2);
        if (corner || seed % 2 === 0) ctx.fillRect(x + c * cell, y + r * cell, cell - 1.5, cell - 1.5);
      }
    }
    ctx.restore();
  }

  function drawPhoto(ctx, shape, cx, cy, size, photoImg, initial, displayFont) {
    ctx.save();
    if (shape === "circle") { ctx.beginPath(); ctx.arc(cx, cy, size / 2, 0, Math.PI * 2); ctx.clip(); }
    else { var rr = shape === "square" ? 6 : size * 0.16; roundRect(ctx, cx - size / 2, cy - size / 2, size, size, rr); ctx.clip(); }

    if (photoImg) {
      var scale = Math.max(size / photoImg.width, size / photoImg.height);
      var w = photoImg.width * scale, h = photoImg.height * scale;
      ctx.drawImage(photoImg, cx - w / 2, cy - h / 2, w, h);
    } else {
      var g = ctx.createLinearGradient(cx - size / 2, cy - size / 2, cx + size / 2, cy + size / 2);
      g.addColorStop(0, P.purpleDark); g.addColorStop(1, P.purple);
      ctx.fillStyle = g; ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.font = "700 " + Math.round(size * 0.44) + "px " + displayFont;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(initial, cx, cy + size * 0.03);
    }
    ctx.restore();
  }

  function drawBG(ctx, bg) {
    var W = 1080, H = 1080;
    if (bg.mode === "solid") { ctx.fillStyle = bg.c1; ctx.fillRect(0, 0, W, H); }
    else if (bg.mode === "gradient") {
      var g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, bg.c1); g.addColorStop(1, bg.c2);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    } else { ctx.fillStyle = bg.c1; ctx.fillRect(0, 0, W, H); }
  }

  var DARK_CHIP = "rgba(37, 10, 33, 0.85)";

  function drawScrim(ctx, cx, cy, w, h, r) {
    ctx.save();
    roundRect(ctx, cx - w / 2, cy - h / 2, w, h, r);
    ctx.fillStyle = DARK_CHIP;
    ctx.fill();
    ctx.restore();
  }

  function drawHeadline(ctx, cfg) {
    var CX = 540;
    if (cfg.headline.type === "none") return;
    var BODY = cfg.fonts.body, DISPLAY = cfg.fonts.display;
    ctx.save();
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    if (cfg.headline.type === "bold") {
      ctx.font = "700 14px " + BODY;
      var w1 = trackedWidth(ctx, "EU PARTICIPEI DA", 3);
      ctx.font = (cfg.headline.weight || "800") + " 42px " + DISPLAY;
      var w2 = ctx.measureText("MASTERCLASS DE IA").width;
      ctx.font = "600 15px " + BODY;
      var w3 = trackedWidth(ctx, "21 · 10 · 2026", 2);
      drawScrim(ctx, CX, 102, Math.max(w1, w2, w3) + 56, 120, 24);

      ctx.font = "700 14px " + BODY; ctx.fillStyle = cfg.headline.c2;
      trackedText(ctx, "EU PARTICIPEI DA", CX, 60, 3);
      ctx.font = (cfg.headline.weight || "800") + " 42px " + DISPLAY; ctx.fillStyle = cfg.headline.c1;
      ctx.fillText("MASTERCLASS DE IA", CX, 104);
      ctx.font = "600 15px " + BODY; ctx.fillStyle = cfg.headline.c2;
      trackedText(ctx, "21 · 10 · 2026", CX, 138, 2);
    } else if (cfg.headline.type === "serif") {
      ctx.font = "700 14px " + BODY;
      var sw1 = trackedWidth(ctx, "CARTÃO DE PARTICIPAÇÃO", 3);
      ctx.font = (cfg.headline.style || "italic 400") + " 42px " + DISPLAY;
      var sw2 = ctx.measureText("Primeira Masterclass de IA").width;
      drawScrim(ctx, CX, 102, Math.max(sw1, sw2) + 64, 92, 24);

      ctx.font = "700 14px " + BODY; ctx.fillStyle = cfg.headline.c2;
      trackedText(ctx, "CARTÃO DE PARTICIPAÇÃO", CX, 76, 3);
      ctx.font = (cfg.headline.style || "italic 400") + " 42px " + DISPLAY; ctx.fillStyle = cfg.headline.c1;
      ctx.fillText("Primeira Masterclass de IA", CX, 128);
    } else if (cfg.headline.type === "label") {
      ctx.font = "800 26px " + BODY;
      var lw1 = trackedWidth(ctx, "ÍMPAR", 3);
      ctx.font = "700 38px " + BODY;
      var lw2 = ctx.measureText("MASTERCLASS DE IA").width;
      ctx.font = "600 22px " + BODY;
      var lw3 = trackedWidth(ctx, "21 · 10 · 2026", 2);
      drawScrim(ctx, CX, 116, Math.max(lw1, lw2, lw3) + 70, 164, 28);

      ctx.font = "800 26px " + BODY; ctx.fillStyle = cfg.headline.c1;
      trackedText(ctx, "ÍMPAR", CX, 66, 3);
      ctx.font = "700 38px " + BODY;
      ctx.fillText("MASTERCLASS DE IA", CX, 114);
      ctx.font = "600 22px " + BODY;
      trackedText(ctx, "21 · 10 · 2026", CX, 162, 2);
    }
    ctx.restore();
  }

  function drawFooter(ctx, cfg, cardBottomAbs) {
    if (cfg.footer.type === "none") return;
    var CX = 540, y = Math.min(cardBottomAbs + 46, 1024);
    ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle";
    if (cfg.footer.type === "inline") {
      ctx.font = "700 24px " + cfg.fonts.body;
      var tw = trackedWidth(ctx, MODULES.join("   ·   "), 1);
      drawScrim(ctx, CX, y, tw + 64, 58, 29);

      ctx.fillStyle = cfg.footer.color;
      trackedText(ctx, MODULES.join("   ·   "), CX, y, 1);
    } else if (cfg.footer.type === "pills") {
      var pillFont = 22, pad = 34, gap = 10, h = 48;
      var maxRowW = 900;
      ctx.font = "700 " + pillFont + "px " + cfg.fonts.body;
      var totalW = 0, widths = [];
      MODULES.forEach(function (m) {
        var w = ctx.measureText(m).width + pad;
        widths.push(w); totalW += w + gap;
      });
      totalW -= gap;

      if (totalW > maxRowW) {
        var scale = maxRowW / totalW;
        pillFont = Math.round(pillFont * scale);
        pad *= scale; gap *= scale; h *= scale;
        ctx.font = "700 " + pillFont + "px " + cfg.fonts.body;
        totalW = 0; widths = [];
        MODULES.forEach(function (m) {
          var w = ctx.measureText(m).width + pad;
          widths.push(w); totalW += w + gap;
        });
        totalW -= gap;
      }

      var x = CX - totalW / 2;
      MODULES.forEach(function (m, i) {
        var w = widths[i];
        roundRect(ctx, x, y - h / 2, w, h, h / 2);
        ctx.fillStyle = DARK_CHIP; ctx.fill();
        ctx.font = "700 " + pillFont + "px " + cfg.fonts.body;
        ctx.fillStyle = cfg.footer.color;
        ctx.fillText(m, x + w / 2, y + 1);
        x += w + gap;
      });
    }
    ctx.restore();
  }

  function shapeDims(shape, scale) {
    if (shape === "horizontal") return { w: 800 * scale, h: 500 * scale, kind: shape };
    if (shape === "square") return { w: 700 * scale, h: 700 * scale, kind: shape };
    return { w: 450 * scale, h: 580 * scale, kind: "badge" };
  }

  function drawLanyardLocal(ctx, dims, color) {
    var topEdge = -dims.h / 2;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-42, topEdge - 80);
    ctx.lineTo(42, topEdge - 80);
    ctx.lineTo(28, topEdge - 14);
    ctx.lineTo(-28, topEdge - 14);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, topEdge - 10, 11, 0, Math.PI * 2);
    ctx.lineWidth = 5; ctx.strokeStyle = "rgba(255,255,255,0.92)"; ctx.stroke();
    ctx.restore();
  }

  function drawCardLocal(ctx, dims, cfg, name, photoImg) {
    var w = dims.w, h = dims.h, x0 = -w / 2, y0 = -h / 2;
    var initial = name && name.trim() ? name.trim()[0].toUpperCase() : "S";

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.28)"; ctx.shadowBlur = 42; ctx.shadowOffsetY = 20;
    roundRect(ctx, x0, y0, w, h, 30);
    ctx.fillStyle = cfg.cardFill; ctx.fill();
    ctx.restore();

    var stripeH = 0;
    if (cfg.stripeHeader) {
      stripeH = h * 0.14;
      ctx.save();
      roundRectTop(ctx, x0, y0, w, stripeH, 30);
      ctx.fillStyle = cfg.accent; ctx.fill();
      ctx.font = "800 " + Math.round(w * 0.065) + "px " + cfg.fonts.body;
      ctx.fillStyle = "#ffffff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      trackedText(ctx, "ÍMPAR", 0, y0 + stripeH * 0.62, 2);
      ctx.restore();
    } else {
      ctx.save();
      ctx.font = "800 " + Math.round(w * 0.045) + "px " + cfg.fonts.body;
      ctx.fillStyle = cfg.accent; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      trackedText(ctx, "ÍMPAR", 0, y0 + h * 0.09, 2);
      ctx.restore();
    }

    if (cfg.lanyard) {
      ctx.save();
      ctx.beginPath(); ctx.arc(0, y0 + 15, 10, 0, Math.PI * 2);
      ctx.fillStyle = cfg.cardFill;
      ctx.globalCompositeOperation = "destination-out"; ctx.fill();
      ctx.restore();
    }

    ctx.save();
    roundRect(ctx, x0, y0, w, h, 30);
    ctx.lineWidth = 1.5; ctx.strokeStyle = "rgba(95,21,85,0.14)"; ctx.stroke();
    ctx.restore();

    if (dims.kind === "horizontal") {
      var photoSize = h * 0.56;
      var photoCx = x0 + w * 0.26, photoCy = 0;
      drawPhoto(ctx, cfg.photoShape, photoCx, photoCy, photoSize, photoImg, initial, cfg.fonts.display);
      var textX = x0 + w * 0.48;
      var hNameY = photoCy - h * 0.18;
      var hRoleY = hNameY + h * 0.095;
      var hEventY = hRoleY + h * 0.095;
      var hDateY = hEventY + h * 0.09;

      ctx.save();
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.font = "700 " + Math.round(h * 0.08) + "px " + cfg.fonts.display; ctx.fillStyle = cfg.ink;
      ctx.fillText(name || "Seu Nome", textX, hNameY);
      ctx.font = "700 " + Math.round(h * 0.038) + "px " + cfg.fonts.body; ctx.fillStyle = cfg.accent;
      trackedTextLeft(ctx, "PARTICIPEI", textX, hRoleY, 2);
      ctx.font = "600 " + Math.round(h * 0.044) + "px " + cfg.fonts.body; ctx.fillStyle = cfg.ink;
      ctx.fillText("Masterclass de IA", textX, hEventY);
      ctx.font = "700 " + Math.round(h * 0.042) + "px " + cfg.fonts.body; ctx.fillStyle = cfg.accent;
      ctx.fillText("21 · 10 · 2026", textX, hDateY);

      var modLabelY = hDateY + h * 0.11;
      ctx.font = "700 " + Math.round(h * 0.03) + "px " + cfg.fonts.body; ctx.fillStyle = cfg.accent;
      trackedTextLeft(ctx, "O QUE EU APRENDI", textX, modLabelY, 2);

      var modFont = Math.round(h * 0.034);
      ctx.font = "700 " + modFont + "px " + cfg.fonts.body;
      var maxModW = 0;
      MODULES.forEach(function (m) { maxModW = Math.max(maxModW, ctx.measureText(m).width); });
      var modColGap = maxModW + 44;
      MODULES.forEach(function (m, i) {
        var col = i % 2, row = Math.floor(i / 2);
        var mx = textX + col * modColGap;
        var my = modLabelY + h * 0.09 + row * h * 0.1;
        ctx.beginPath(); ctx.arc(mx + 6, my, 5, 0, Math.PI * 2); ctx.fillStyle = cfg.accent; ctx.fill();
        ctx.font = "700 " + modFont + "px " + cfg.fonts.body; ctx.fillStyle = cfg.ink;
        ctx.fillText(m, mx + 20, my);
      });
      ctx.restore();
    } else {
      var topPad = stripeH + h * (cfg.stripeHeader ? 0.08 : 0.135);
      var pR = w * 0.23;
      var pCy = y0 + topPad + pR;
      drawPhoto(ctx, cfg.photoShape, 0, pCy, pR * 2, photoImg, initial, cfg.fonts.display);

      var bNameY = pCy + pR + h * 0.085;
      var bRoleY = bNameY + h * 0.065;
      var bDividerY = bRoleY + h * 0.055;
      var bEventY = bDividerY + h * 0.065;
      var bDateY = bEventY + h * 0.075;

      ctx.save();
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "700 " + Math.round(w * 0.075) + "px " + cfg.fonts.display; ctx.fillStyle = cfg.ink;
      ctx.fillText(name || "Seu Nome", 0, bNameY);
      ctx.font = "700 " + Math.round(w * 0.033) + "px " + cfg.fonts.body; ctx.fillStyle = cfg.accent;
      trackedText(ctx, "PARTICIPEI", 0, bRoleY, 3);

      ctx.strokeStyle = "rgba(95,21,85,0.14)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0 + w * 0.12, bDividerY); ctx.lineTo(x0 + w - w * 0.12, bDividerY); ctx.stroke();

      ctx.font = "600 " + Math.round(w * 0.037) + "px " + cfg.fonts.body; ctx.fillStyle = cfg.ink;
      ctx.fillText("MASTERCLASS DE IA", 0, bEventY);
      ctx.font = "700 " + Math.round(w * 0.034) + "px " + cfg.fonts.body; ctx.fillStyle = cfg.accent;
      trackedText(ctx, "21 · 10 · 2026", 0, bDateY, 2);
      ctx.restore();
    }
  }

  function renderTemplate(ctx, cfg, name, photoImg) {
    ctx.clearRect(0, 0, 1080, 1080);
    drawBG(ctx, cfg.bg);
    var dims = shapeDims(cfg.shape, cfg.scale);
    var centerY = 560;
    var shiftY = 0;

    if (dims.kind === "horizontal") {
      var tiltRad0 = ((cfg.tilt || 0) * Math.PI) / 180;
      var extent0 = (dims.w / 2) * Math.abs(Math.sin(tiltRad0)) + (dims.h / 2) * Math.abs(Math.cos(tiltRad0));
      var headlineBottom =
        cfg.headline.type === "label" ? 198 :
        cfg.headline.type === "serif" ? 148 :
        cfg.headline.type === "none" ? 40 : 162;
      var rawCenterY = headlineBottom + 45 + extent0;
      var contentTop = 40;
      var contentBottom = rawCenterY + extent0;
      shiftY = 540 - (contentTop + contentBottom) / 2;
      centerY = rawCenterY + shiftY;
    }

    ctx.save();
    if (shiftY) ctx.translate(0, shiftY);
    drawHeadline(ctx, cfg);
    ctx.restore();

    ctx.save();
    ctx.translate(540, centerY);
    if (cfg.tilt) ctx.rotate((cfg.tilt * Math.PI) / 180);
    if (cfg.lanyard) drawLanyardLocal(ctx, dims, cfg.accent);
    drawCardLocal(ctx, dims, cfg, name, photoImg);
    ctx.restore();
    if (dims.kind !== "horizontal") {
      var tiltRad = ((cfg.tilt || 0) * Math.PI) / 180;
      var bottomExtent = (dims.w / 2) * Math.abs(Math.sin(tiltRad)) + (dims.h / 2) * Math.abs(Math.cos(tiltRad));
      drawFooter(ctx, cfg, centerY + bottomExtent);
    }
  }

  // ---------- wiring ----------

  var canvas = document.getElementById("ticket");
  var ctx = canvas.getContext("2d");
  var nameInput = document.getElementById("nameInput");
  var photoInput = document.getElementById("photoInput");
  var downloadBtn = document.getElementById("downloadBtn");
  var captionText = document.getElementById("captionText");
  var copyBtn = document.getElementById("copyBtn");
  var templatePicker = document.getElementById("templatePicker");

  var state = { photoImg: null, templateIndex: 0 };

  function render() {
    var tpl = TEMPLATES[state.templateIndex];
    renderTemplate(ctx, tpl.cfg, nameInput.value, state.photoImg);
  }

  function buildPicker() {
    var current = TEMPLATES[state.templateIndex];

    var wrapper = document.createElement("div");
    wrapper.className = "tpl-dropdown";

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "tpl-toggle";
    toggle.setAttribute("aria-haspopup", "listbox");
    toggle.setAttribute("aria-expanded", "false");

    var toggleThumb = document.createElement("canvas");
    toggleThumb.width = 1080;
    toggleThumb.height = 1080;
    toggleThumb.className = "tpl-thumb";

    var toggleLabel = document.createElement("span");
    toggleLabel.className = "tpl-label";
    toggleLabel.textContent = current.label;

    var arrow = document.createElement("span");
    arrow.className = "tpl-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "▾";

    toggle.appendChild(toggleThumb);
    toggle.appendChild(toggleLabel);
    toggle.appendChild(arrow);

    var list = document.createElement("ul");
    list.className = "tpl-list";
    list.setAttribute("role", "listbox");
    list.hidden = true;

    function closeList() {
      list.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }
    function openList() {
      list.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (list.hidden) openList(); else closeList();
    });
    document.addEventListener("click", function (e) {
      if (!wrapper.contains(e.target)) closeList();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeList();
    });

    TEMPLATES.forEach(function (tpl, i) {
      var item = document.createElement("li");
      item.className = "tpl-option" + (i === state.templateIndex ? " selected" : "");
      item.setAttribute("role", "option");
      item.setAttribute("tabindex", "0");

      var thumb = document.createElement("canvas");
      thumb.width = 1080;
      thumb.height = 1080;
      item.appendChild(thumb);

      var label = document.createElement("span");
      label.textContent = tpl.label;
      item.appendChild(label);

      function select() {
        state.templateIndex = i;
        Array.prototype.forEach.call(list.children, function (el) { el.classList.remove("selected"); });
        item.classList.add("selected");
        toggleLabel.textContent = tpl.label;
        renderTemplate(toggleThumb.getContext("2d"), tpl.cfg, "", null);
        closeList();
        render();
      }

      item.addEventListener("click", select);
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(); }
      });

      list.appendChild(item);
      renderTemplate(thumb.getContext("2d"), tpl.cfg, "", null);
    });

    wrapper.appendChild(toggle);
    wrapper.appendChild(list);
    templatePicker.appendChild(wrapper);

    renderTemplate(toggleThumb.getContext("2d"), current.cfg, "", null);
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
        setTimeout(function () { copyBtn.textContent = original; }, 2000);
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
  buildPicker();
  render();
})();
