//  粒子背景 · 升级版
// ════════════════════════════════════════════════
(function(){
  const c=document.getElementById('bgCanvas');
  if(!c) return;  // 无 bgCanvas 时跳过（town.html 等页面不需要背景粒子）
  const ctx=c.getContext('2d');
  let W,H,pts=[],meteors=[];
  const COLORS=[
    [240,192,96],   // 金
    [200,160,60],   // 暗金
    [180,120,40],   // 铜
    [255,230,150],  // 亮金
    [100,80,180],   // 紫（点缀）
    [40,120,200],   // 蓝（点缀）
  ];
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
  resize(); window.addEventListener('resize',resize);
  function mkPt(){
    const col=COLORS[Math.floor(Math.random()*COLORS.length)];
    return{
      x:Math.random()*W,y:Math.random()*H,
      vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,
      r:Math.random()*1.5+.3,
      a:Math.random()*.7+.1,
      col,
      pulse:Math.random()*Math.PI*2,
      pulseSpeed:Math.random()*.02+.005
    };
  }
  function mkMeteor(){
    return{
      x:Math.random()*W*1.5-W*.25,y:-20,
      vx:Math.random()*2+1,vy:Math.random()*3+2,
      len:Math.random()*80+40,
      a:1,life:1
    };
  }
  for(let i=0;i<100;i++) pts.push(mkPt());
  function draw(){
    ctx.clearRect(0,0,W,H);
    // 背景深度雾气
    const grad=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*.8);
    grad.addColorStop(0,'rgba(15,8,40,.06)');
    grad.addColorStop(.5,'rgba(5,3,18,.04)');
    grad.addColorStop(1,'rgba(0,0,0,.0)');
    ctx.fillStyle=grad;
    ctx.fillRect(0,0,W,H);
    // 粒子
    pts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      p.pulse+=p.pulseSpeed;
      if(p.x<-5||p.x>W+5) p.vx*=-1;
      if(p.y<-5||p.y>H+5) p.vy*=-1;
      const pulsedA=p.a*(0.5+0.5*Math.sin(p.pulse));
      const r=p.col[0],g=p.col[1],b=p.col[2];
      // 光晕
      const grd=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);
      grd.addColorStop(0,`rgba(${r},${g},${b},${pulsedA*.4})`);
      grd.addColorStop(1,`rgba(${r},${g},${b},0)`);
      ctx.beginPath();ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2);
      ctx.fillStyle=grd;ctx.fill();
      // 粒子核心
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${r},${g},${b},${pulsedA})`;ctx.fill();
    });
    // 连线
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){
          const t=1-d/110;
          ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle=`rgba(240,192,96,${.06*t*t})`;ctx.lineWidth=.6*t;ctx.stroke();
        }
      }
    }
    // 流星
    if(Math.random()<.003) meteors.push(mkMeteor());
    meteors=meteors.filter(m=>{
      m.x+=m.vx;m.y+=m.vy;m.life-=.012;m.a=m.life;
      if(m.life<=0) return false;
      ctx.save();
      const gm=ctx.createLinearGradient(m.x,m.y,m.x-m.vx/Math.sqrt(m.vx*m.vx+m.vy*m.vy)*m.len,m.y-m.vy/Math.sqrt(m.vx*m.vx+m.vy*m.vy)*m.len);
      gm.addColorStop(0,`rgba(255,240,180,${m.a*.9})`);
      gm.addColorStop(.3,`rgba(240,192,96,${m.a*.5})`);
      gm.addColorStop(1,'rgba(240,192,96,0)');
      ctx.strokeStyle=gm;ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(m.x,m.y);
      const len=Math.sqrt(m.vx*m.vx+m.vy*m.vy);
      ctx.lineTo(m.x-m.vx/len*m.len,m.y-m.vy/len*m.len);
      ctx.stroke();
      ctx.restore();
      return true;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ════════════════════════════════════════════════
//  江湖舆图 专属粒子背景（绿色江湖气息）
// ════════════════════════════════════════════════
(function(){
  const mc = document.getElementById('mapBgCanvas');
  if(!mc) return;
  const mctx = mc.getContext('2d');
  let MW=0,MH=0,mPts=[],mMeteors=[];
  const MAP_COLORS=[
    [60,200,120],  // 翠绿
    [40,160,90],   // 深绿
    [100,240,160], // 亮绿
    [80,180,100],  // 草绿
    [120,220,180], // 青绿
    [40,200,140],  // 碧绿（点缀）
  ];
  function mResize(){
    MW=mc.width=window.innerWidth;
    MH=mc.height=window.innerHeight;
  }
  function mkMPt(){
    const col=MAP_COLORS[Math.floor(Math.random()*MAP_COLORS.length)];
    return{
      x:Math.random()*MW, y:Math.random()*MH,
      vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
      r:Math.random()*1.8+.4,
      a:Math.random()*.6+.15,
      col,
      pulse:Math.random()*Math.PI*2,
      pulseSpeed:Math.random()*.018+.004
    };
  }
  function mkMMeteor(){
    return{
      x:Math.random()*MW, y:-20,
      vx:(Math.random()-.5)*1.5, vy:Math.random()*2.5+1.5,
      len:Math.random()*60+30, a:1, life:1
    };
  }
  function mDraw(){
    if(mc.style.display==='none'||!mc.style.display){
      requestAnimationFrame(mDraw); return;
    }
    mctx.clearRect(0,0,MW,MH);
    // 深绿背景雾气
    const grad=mctx.createRadialGradient(MW*.3,MH*.3,0,MW*.7,MH*.7,Math.max(MW,MH)*.9);
    grad.addColorStop(0,'rgba(0,30,15,.18)');
    grad.addColorStop(.5,'rgba(0,15,8,.10)');
    grad.addColorStop(1,'rgba(0,0,0,.0)');
    mctx.fillStyle=grad;
    mctx.fillRect(0,0,MW,MH);
    // 粒子
    mPts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      p.pulse+=p.pulseSpeed;
      if(p.x<-5||p.x>MW+5) p.vx*=-1;
      if(p.y<-5||p.y>MH+5) p.vy*=-1;
      const pulsedA=p.a*(0.4+0.6*Math.sin(p.pulse));
      const r=p.col[0],g=p.col[1],b=p.col[2];
      const grd=mctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);
      grd.addColorStop(0,`rgba(${r},${g},${b},${pulsedA*.5})`);
      grd.addColorStop(1,`rgba(${r},${g},${b},0)`);
      mctx.beginPath();mctx.arc(p.x,p.y,p.r*5,0,Math.PI*2);
      mctx.fillStyle=grd;mctx.fill();
      mctx.beginPath();mctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      mctx.fillStyle=`rgba(${r},${g},${b},${pulsedA})`;mctx.fill();
    });
    // 粒子连线（青绿色）
    for(let i=0;i<mPts.length;i++){
      for(let j=i+1;j<mPts.length;j++){
        const dx=mPts[i].x-mPts[j].x, dy=mPts[i].y-mPts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){
          const t=1-d/120;
          mctx.beginPath();mctx.moveTo(mPts[i].x,mPts[i].y);mctx.lineTo(mPts[j].x,mPts[j].y);
          mctx.strokeStyle=`rgba(60,200,120,${.07*t*t})`;mctx.lineWidth=.7*t;mctx.stroke();
        }
      }
    }
    // 流星（绿色）
    if(Math.random()<.002) mMeteors.push(mkMMeteor());
    mMeteors=mMeteors.filter(m=>{
      m.x+=m.vx;m.y+=m.vy;m.life-=.014;m.a=m.life;
      if(m.life<=0) return false;
      mctx.save();
      const len=Math.sqrt(m.vx*m.vx+m.vy*m.vy);
      const gm=mctx.createLinearGradient(m.x,m.y,m.x-m.vx/len*m.len,m.y-m.vy/len*m.len);
      gm.addColorStop(0,`rgba(160,255,200,${m.a*.85})`);
      gm.addColorStop(.3,`rgba(60,200,120,${m.a*.4})`);
      gm.addColorStop(1,'rgba(60,200,120,0)');
      mctx.strokeStyle=gm;mctx.lineWidth=1.5;
      mctx.beginPath();mctx.moveTo(m.x,m.y);mctx.lineTo(m.x-m.vx/len*m.len,m.y-m.vy/len*m.len);
      mctx.stroke();mctx.restore();
      return true;
    });
    requestAnimationFrame(mDraw);
  }
  // 初始化
  function mInit(){
    mResize();
    mPts=[];
    for(let i=0;i<80;i++) mPts.push(mkMPt());
    mMeteors=[];
    mDraw();
  }
  window.addEventListener('resize',()=>{
    MW=mc.width=mc.offsetWidth||window.innerWidth;
    MH=mc.height=mc.offsetHeight||window.innerHeight;
  });
  // 等DOM加载完再init
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',mInit);
  } else {
    mInit();
  }
})();

// ════════════════════════════════════════════════
//  行路场景专属粒子背景 startJnyParticles / stopJnyParticles
// ════════════════════════════════════════════════
(function(){
  let jpc = null;   // canvas element
  let jpctx = null; // 2d context
  let JW = 0, JH = 0;
  let jPts = [], jMeteors = [];
  let jRaf = null;
  let jRunning = false;

  // 根据当前天气/地形决定粒子色系
  const JNY_COLOR_SETS = {
    green:  [[60,200,120],[100,240,160],[40,160,90],[120,220,180]],   // 平原/森林
    gold:   [[240,180,80],[255,220,120],[200,150,60],[255,200,100]],  // 沙漠/黄昏
    blue:   [[80,160,240],[120,200,255],[60,120,200],[180,220,255]],  // 雨天/水域
    white:  [[220,240,255],[200,220,240],[180,200,220],[255,255,255]],// 雪地/冰原
    purple: [[180,80,240],[220,120,255],[140,60,200],[200,160,255]],  // 神秘/夜晚
    fire:   [[240,100,60],[255,160,80],[200,80,40],[255,200,100]],    // 红/火焰
  };

  function getColorSet(){
    const el = document.getElementById('jnySky');
    const skyColor = el ? el.style.color || '#88cc88' : '#88cc88';
    const terrain = (window._jnyActiveTerrain || '').toLowerCase();
    if(terrain.includes('desert')||terrain.includes('sand')) return JNY_COLOR_SETS.gold;
    if(terrain.includes('snow')||terrain.includes('ice'))    return JNY_COLOR_SETS.white;
    if(terrain.includes('sea')||terrain.includes('river'))   return JNY_COLOR_SETS.blue;
    // 按天空色调判断
    if(skyColor.includes('ff8')||skyColor.includes('fa8')) return JNY_COLOR_SETS.gold;  // 黄昏
    return JNY_COLOR_SETS.green;  // 默认绿色
  }

  function mkJPt(colors){
    const col = colors[Math.floor(Math.random()*colors.length)];
    return{
      x:Math.random()*JW, y:Math.random()*JH,
      vx:(Math.random()-.5)*.4+(Math.random()*.3), // 向右漂，模拟前进感
      vy:(Math.random()-.5)*.3,
      r:Math.random()*1.6+.3,
      a:Math.random()*.5+.1,
      col,
      pulse:Math.random()*Math.PI*2,
      pulseSpeed:Math.random()*.025+.006
    };
  }

  function mkJMeteor(){
    return{
      x:-20, y:Math.random()*JH*.6,
      vx:Math.random()*4+3, vy:(Math.random()-.3)*.8,
      len:Math.random()*50+25, a:1, life:1
    };
  }

  function jDraw(){
    if(!jRunning){ jRaf = null; return; }
    jRaf = requestAnimationFrame(jDraw);

    // 动态取canvas大小（scene大小可能变化）
    const pw = jpc.parentElement ? jpc.parentElement.offsetWidth  : JW;
    const ph = jpc.parentElement ? jpc.parentElement.offsetHeight : JH;
    if(pw&&ph&&(JW!==pw||JH!==ph)){JW=jpc.width=pw;JH=jpc.height=ph;}

    jpctx.clearRect(0,0,JW,JH);

    const colors = getColorSet();
    // 补充粒子
    while(jPts.length < 50) jPts.push(mkJPt(colors));

    // 绘制粒子
    jPts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      p.pulse+=p.pulseSpeed;
      // 边界循环（从右边消失后从左边出现，模拟前进）
      if(p.x>JW+5) p.x=-5;
      if(p.x<-5) p.x=JW+5;
      if(p.y<-5||p.y>JH+5) p.vy*=-1;
      const pulsedA = p.a*(0.3+0.7*Math.sin(p.pulse));
      const [r,g,b] = p.col;
      // 光晕
      const grd = jpctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);
      grd.addColorStop(0,`rgba(${r},${g},${b},${pulsedA*.45})`);
      grd.addColorStop(1,`rgba(${r},${g},${b},0)`);
      jpctx.beginPath();jpctx.arc(p.x,p.y,p.r*5,0,Math.PI*2);
      jpctx.fillStyle=grd;jpctx.fill();
      // 粒子核心
      jpctx.beginPath();jpctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      jpctx.fillStyle=`rgba(${r},${g},${b},${pulsedA})`;jpctx.fill();
    });

    // 流星（向右飞，符合行进方向）
    if(Math.random()<.004) jMeteors.push(mkJMeteor());
    jMeteors = jMeteors.filter(m=>{
      m.x+=m.vx; m.y+=m.vy; m.life-=.018; m.a=m.life;
      if(m.life<=0||m.x>JW+50) return false;
      const colors2 = getColorSet();
      const [r,g,b] = colors2[0];
      jpctx.save();
      const len=Math.sqrt(m.vx*m.vx+m.vy*m.vy);
      const gm=jpctx.createLinearGradient(m.x,m.y,m.x-m.vx/len*m.len,m.y-m.vy/len*m.len);
      gm.addColorStop(0,`rgba(${r+30>255?255:r+30},${g+30>255?255:g+30},${b+30>255?255:b+30},${m.a*.8})`);
      gm.addColorStop(1,`rgba(${r},${g},${b},0)`);
      jpctx.strokeStyle=gm; jpctx.lineWidth=1.5;
      jpctx.beginPath();jpctx.moveTo(m.x,m.y);
      jpctx.lineTo(m.x-m.vx/len*m.len, m.y-m.vy/len*m.len);
      jpctx.stroke(); jpctx.restore();
      return true;
    });
  }

  window.startJnyParticles = function(){
    jpc = document.getElementById('jnyParticleCanvas');
    if(!jpc) return;
    jpctx = jpc.getContext('2d');
    // 延迟一帧确保 overlay/scene 已展开，尺寸正确
    requestAnimationFrame(()=>{
      JW = jpc.width  = jpc.parentElement ? jpc.parentElement.offsetWidth  : window.innerWidth;
      JH = jpc.height = jpc.parentElement ? jpc.parentElement.offsetHeight : window.innerHeight;
      jPts = [];
      jMeteors = [];
      for(let i=0;i<50;i++) jPts.push(mkJPt(JNY_COLOR_SETS.green));
      jRunning = true;
      if(jRaf) cancelAnimationFrame(jRaf);
      jRaf = requestAnimationFrame(jDraw);
    });
  };

  window.stopJnyParticles = function(){
    jRunning = false;
    if(jRaf){ cancelAnimationFrame(jRaf); jRaf = null; }
    if(jpctx && JW && JH) jpctx.clearRect(0,0,JW,JH);
  };
})();


