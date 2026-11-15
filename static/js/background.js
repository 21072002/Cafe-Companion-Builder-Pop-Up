/**
 * Interactive Liquid Glass Ambient Canvas Background
 * Renders glowing molten amber, deep espresso, and golden honey liquid orbs
 * that organically deform, flow, and react to cursor/touch gestures,
 * creating an ultra-premium refractive liquid glass atmosphere.
 */

(function initLiquidGlassBackground() {
  const canvas = document.createElement('canvas');
  canvas.id = 'ambientCanvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;
  let orbs = [];
  const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, radius: 180, isMoving: false };
  let lastMoveTime = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initOrbs();
  }

  class LiquidOrb {
    constructor(i) {
      this.index = i;
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * width : (Math.random() > 0.5 ? -100 : width + 100);
      this.y = initial ? Math.random() * height : Math.random() * height;
      this.radius = Math.random() * 160 + 100; // Large soft fluid orbs
      this.baseRadius = this.radius;
      
      // Floating velocity
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      
      // Color variations: Warm amber (32), molten caramel (24), deep roast (16), matcha shimmer (140)
      const colorRoll = Math.random();
      if (colorRoll > 0.7) {
        this.hue = 32; // Bright molten amber
        this.sat = 90;
        this.light = 48;
        this.opacity = 0.22;
      } else if (colorRoll > 0.4) {
        this.hue = 22; // Deep caramel roast
        this.sat = 85;
        this.light = 38;
        this.opacity = 0.28;
      } else if (colorRoll > 0.15) {
        this.hue = 15; // Dark espresso bronze
        this.sat = 80;
        this.light = 26;
        this.opacity = 0.35;
      } else {
        this.hue = 150; // Subtle emerald matcha aura accent
        this.sat = 75;
        this.light = 36;
        this.opacity = 0.12;
      }
      this.baseOpacity = this.opacity;
      
      // Fluid deformation oscillation
      this.wobbleSpeed = Math.random() * 0.015 + 0.008;
      this.wobbleAngle = Math.random() * Math.PI * 2;
    }

    update(time) {
      this.x += this.vx;
      this.y += this.vy;
      this.wobbleAngle += this.wobbleSpeed;

      // Mouse interactive fluid attraction & deflection
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius && mouse.x > 0) {
        const force = (1 - dist / mouse.radius);
        // Swirl around mouse like viscous liquid
        this.x -= (dx / dist) * force * 2.2;
        this.y -= (dy / dist) * force * 2.2;
        this.radius = this.baseRadius * (1 + force * 0.25);
        this.opacity = Math.min(0.55, this.baseOpacity + force * 0.25);
      } else {
        this.radius += (this.baseRadius - this.radius) * 0.03;
        this.opacity += (this.baseOpacity - this.opacity) * 0.03;
      }

      // Bounce/wrap around edges smoothly
      const pad = this.radius * 1.2;
      if (this.x < -pad) this.x = width + pad;
      if (this.x > width + pad) this.x = -pad;
      if (this.y < -pad) this.y = height + pad;
      if (this.y > height + pad) this.y = -pad;
    }

    draw() {
      ctx.save();
      const currentRadius = this.radius * (1 + Math.sin(this.wobbleAngle) * 0.12);
      
      const grad = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, currentRadius
      );
      grad.addColorStop(0, `hsla(${this.hue}, ${this.sat}%, ${this.light}%, ${this.opacity})`);
      grad.addColorStop(0.5, `hsla(${this.hue}, ${this.sat}%, ${this.light * 0.8}%, ${this.opacity * 0.45})`);
      grad.addColorStop(1, `hsla(${this.hue}, ${this.sat}%, ${this.light * 0.5}%, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initOrbs() {
    const count = Math.min(18, Math.max(9, Math.floor((width * height) / 60000)));
    orbs = [];
    for (let i = 0; i < count; i++) {
      orbs.push(new LiquidOrb(i));
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    lastMoveTime = performance.now();
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
      lastMoveTime = performance.now();
    }
  }, { passive: true });

  window.addEventListener('resize', resize);

  function animate(time) {
    mouse.x += (mouse.targetX - mouse.x) * 0.06;
    mouse.y += (mouse.targetY - mouse.y) * 0.06;

    // Pitch black OLED base clear
    ctx.fillStyle = '#060504';
    ctx.fillRect(0, 0, width, height);

    // Dynamic liquid interactive spotlight under cursor
    if (mouse.x > 0 && mouse.y > 0) {
      const cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 280);
      cursorGlow.addColorStop(0, 'rgba(229, 140, 54, 0.16)');
      cursorGlow.addColorStop(0.5, 'rgba(180, 83, 9, 0.06)');
      cursorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = cursorGlow;
      ctx.fillRect(0, 0, width, height);
    }

    // Render liquid orbs with 'screen' blend mode for luminous refraction
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < orbs.length; i++) {
      orbs[i].update(time);
      orbs[i].draw();
    }
    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(animate);
  }

  resize();
  requestAnimationFrame(animate);
})();
