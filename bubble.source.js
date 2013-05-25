// Generated by CoffeeScript 1.6.2
/*
 @name wg-bubble
 @url https://github.com/wange1228/wg-bubble
 @author WanGe
 @blog http://wange.im
 @version 2.3
*/

var Bubble;

Bubble = (function() {
  var doc, win;

  win = window;

  doc = document;

  function Bubble() {
    this.config = {
      wait: 60000,
      radius: 90,
      avatar: [],
      speed: 6,
      callback: function() {
        win.console && console.log('@name wg-bubble' + '\n' + '@url https://github.com/wange1228/wg-bubble' + '\n' + '@author WanGe' + '\n' + '@blog http://wange.im' + '\n' + '@version 2.3');
      }
    };
    this.cache = {};
  }

  Bubble.initialized = false;

  Bubble.prototype.init = function(params) {
    var config, cvs, cvsEl, i, styleEl, styles, _this;
    if (params == null) {
      params = this.config;
    }
    if (Bubble.initialized) {
      return null;
    }
    Bubble.initialized = true;
    _this = this;
    config = _this.config;
    for (i in params) {
      config[i] = params[i] || config[i];
    }
    cvsEl = doc.createElement('canvas');
    styleEl = doc.createElement('style');
    styles = 'html,body{width:100%;height:100%;margin:0;padding:0;}' + '#bubble_canvas{display:none;margin:0;padding:0;position:absolute;top:0;left:0;z-index:9999;}';
    cvsEl.id = 'bubble_canvas';
    styleEl.type = 'text/css';
    if (styleEl.styleSheet) {
      styleEl.styleSheet.cssText = styles;
    } else {
      styleEl.appendChild(doc.createTextNode(styles));
    }
    doc.body.appendChild(cvsEl);
    doc.body.appendChild(styleEl);
    cvs = doc.getElementById(cvsEl.id);
    if (cvs && cvs.getContext) {
      _this.ctx = cvs.getContext('2d');
      _this.fullCvs(cvs);
      _this.start(cvs);
      _this.bind(cvs);
    }
  };

  Bubble.prototype.start = function(cvs) {
    var _this;
    _this = this;
    _this.cache.bubbles = [];
    _this.cache.imgs = [];
    _this.cache.bubblesNum = 0;
    _this.cache.toWait = _this.config.wait;
    _this.cache.avatar = _this.config.avatar.concat();
    clearTimeout(_this.cache.startSTO);
    clearTimeout(_this.cache.createSTO);
    clearTimeout(_this.cache.animateSTO);
    _this.cache.startSTO = setTimeout(function() {
      var scrollTop;
      scrollTop = doc.body.scrollTop || doc.documentElement.scrollTop;
      cvs.style.display = 'block';
      cvs.style.top = scrollTop + 'px';
      _this.createBubble();
      _this.animateBubble(cvs);
      _this.config.callback.apply(_this);
    }, _this.cache.toWait);
  };

  Bubble.prototype.restart = function(cvs) {
    var _this;
    _this = this;
    cvs.style.display = 'none';
    _this.ctx.clearRect(0, 0, _this.cvsWidth, _this.cvsHeight);
    _this.start(cvs);
  };

  Bubble.prototype.fullCvs = function(cvs) {
    var _this;
    _this = this;
    _this.cvsWidth = doc.body.offsetWidth;
    _this.cvsHeight = doc.body.offsetHeight;
    cvs.setAttribute('width', _this.cvsWidth);
    cvs.setAttribute('height', _this.cvsHeight);
  };

  Bubble.prototype.createBubble = function() {
    var avatar, avatarArr, avatarNum, radius, speed, _this;
    _this = this;
    radius = _this.config.radius;
    speed = _this.config.speed;
    avatar = _this.cache.avatar;
    avatarArr = avatar.shift();
    avatarNum = avatar.length;
    _this.cache.bubblesNum++;
    _this.cache.bubbles.push({
      x: radius,
      y: _this.cvsHeight - radius,
      zIndex: avatarNum,
      vX: Math.random() * speed,
      vY: Math.random() * speed - speed / 2,
      src: avatarArr.src,
      url: avatarArr.url,
      name: avatarArr.name
    });
    _this.cache.reverseBubbles = _this.cache.bubbles.concat().reverse();
    if (avatarNum !== 0) {
      _this.cache.createSTO = setTimeout(function() {
        _this.createBubble();
      }, 600);
    }
  };

  Bubble.prototype.animateBubble = function(cvs) {
    var angle, bubbles, cosine, ctx, dX, dY, distance, i, img, j, num, radius, randomZ, sine, tmpBubble, tmpBubbleB, vX, vXb, vY, vYb, x, xB, y, yB, _i, _j, _ref, _this;
    _this = this;
    ctx = _this.ctx;
    radius = _this.config.radius;
    num = _this.cache.bubblesNum;
    bubbles = _this.cache.bubbles;
    ctx.clearRect(0, 0, _this.cvsWidth, _this.cvsHeight);
    _this.setCursor(_this.cache.clientX, _this.cache.clientY, cvs);
    for (i = _i = 0; 0 <= num ? _i < num : _i > num; i = 0 <= num ? ++_i : --_i) {
      tmpBubble = bubbles[i];
      for (j = _j = _ref = i + 1; _ref <= num ? _j < num : _j > num; j = _ref <= num ? ++_j : --_j) {
        tmpBubbleB = bubbles[j];
        randomZ = Math.round(Math.random());
        if (tmpBubble.zIndex === tmpBubbleB.zIndex) {
          dX = tmpBubbleB.x - tmpBubble.x;
          dY = tmpBubbleB.y - tmpBubble.y;
          distance = Math.sqrt(dX * dX + dY * dY);
          if (distance < 2 * radius) {
            angle = Math.atan2(dY, dX);
            sine = Math.sin(angle);
            cosine = Math.cos(angle);
            x = 0;
            y = 0;
            xB = dX * cosine + dY * sine;
            yB = dY * cosine - dX * sine;
            vX = tmpBubble.vX * cosine + tmpBubble.vY * sine;
            vY = tmpBubble.vY * cosine - tmpBubble.vX * sine;
            vXb = tmpBubbleB.vX * cosine + tmpBubbleB.vY * sine;
            vYb = tmpBubbleB.vY * cosine - tmpBubbleB.vX * sine;
            vX *= -1;
            vXb *= -1;
            xB = x + 2 * radius;
            tmpBubble.x = tmpBubble.x + (x * cosine - y * sine);
            tmpBubble.y = tmpBubble.y + (y * cosine + x * sine);
            tmpBubbleB.x = tmpBubble.x + (xB * cosine - yB * sine);
            tmpBubbleB.y = tmpBubble.y + (yB * cosine + xB * sine);
            tmpBubble.vX = vX * cosine - vY * sine;
            tmpBubble.vY = vY * cosine + vX * sine;
            tmpBubbleB.vX = vXb * cosine - vYb * sine;
            tmpBubbleB.vY = vYb * cosine + vXb * sine;
          }
        }
      }
      tmpBubble.x += tmpBubble.vX;
      tmpBubble.y += tmpBubble.vY;
      if (tmpBubble.x - radius < 0) {
        tmpBubble.x = radius;
        tmpBubble.vX *= -1;
      } else if (tmpBubble.x + radius > _this.cvsWidth) {
        tmpBubble.x = _this.cvsWidth - radius;
        tmpBubble.vX *= -1;
        tmpBubble.zIndex = randomZ;
      }
      if (tmpBubble.y - radius < 0) {
        tmpBubble.y = radius;
        tmpBubble.vY *= -1;
        tmpBubble.zIndex = randomZ;
      } else if (tmpBubble.y + radius > _this.cvsHeight) {
        tmpBubble.y = _this.cvsHeight - radius;
        tmpBubble.vY *= -1;
      }
      if (_this.cache.imgs[i]) {
        img = _this.cache.imgs[i];
      } else {
        img = new Image();
        img.src = tmpBubble.src;
        _this.cache.imgs.push(img);
      }
      ctx.fillStyle = '#000';
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = '#fff';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.font = '700 ' + radius * 0.3 + 'px "Microsoft YaHei",SimSun';
      ctx.save();
      ctx.beginPath();
      ctx.arc(tmpBubble.x, tmpBubble.y, radius, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.clip();
      ctx.globalCompositeOperation = 'source-atop';
      ctx.save();
      ctx.scale(radius * 2 / img.width, radius * 2 / img.height);
      ctx.drawImage(img, (tmpBubble.x - radius) / (radius * 2 / img.width), (tmpBubble.y - radius) / (radius * 2 / img.height));
      ctx.restore();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillText(tmpBubble.name, tmpBubble.x, tmpBubble.y);
      ctx.strokeText(tmpBubble.name, tmpBubble.x, tmpBubble.y);
      ctx.restore();
      ctx.closePath();
    }
    _this.cache.animateSTO = setTimeout(function() {
      _this.animateBubble(cvs);
    }, 20);
  };

  Bubble.prototype.inBubble = function(x, y) {
    var bubbles, distance, dx, dy, i, _i, _ref, _this;
    _this = this;
    bubbles = _this.cache.reverseBubbles || [];
    for (i = _i = 0, _ref = bubbles.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      dx = bubbles[i].x - x;
      dy = bubbles[i].y - y;
      distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= _this.config.radius) {
        _this.cache.curBubble = bubbles[i];
        return true;
      }
    }
    return false;
  };

  Bubble.prototype.setCursor = function(x, y, cvs) {
    var cursor;
    if (this.inBubble(x, y)) {
      cursor = 'pointer';
    } else {
      cursor = 'default';
    }
    cvs.style.cursor = cursor;
  };

  Bubble.prototype.bind = function(cvs) {
    var body, _this;
    _this = this;
    body = doc.body;
    body.addEventListener('mousemove', function(ev) {
      var x, y;
      x = _this.cache.clientX = ev.clientX;
      y = _this.cache.clientY = ev.clientY;
      _this.setCursor(x, y, cvs);
    });
    body.addEventListener('mousedown', function(ev) {
      var x, y;
      x = ev.clientX;
      y = ev.clientY;
      if (_this.inBubble(x, y) && _this.cache.bubbles.length !== 0) {
        win.location.href = _this.cache.curBubble.url;
      } else {
        _this.restart(cvs);
      }
    });
    body.addEventListener('keydown', function() {
      _this.restart(cvs);
    });
    win.addEventListener('scroll', function() {
      _this.restart(cvs);
    });
    win.addEventListener('resize', function() {
      _this.fullCvs(cvs);
      _this.restart(cvs);
    });
  };

  return Bubble;

})();
