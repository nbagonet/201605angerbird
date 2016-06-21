/**
 * 3D场景初始化
 * @return {[type]} [description]
 */
var camera, controls;

// 是否使用重力感应操作
if ($('.ios')[0]) {
  var DeviceOrientation = true;
  console.log('iOS系统，重力感应模式。');
} else {
  var DeviceOrientation = false;
  console.log('非iOS系统，拖拽模式');
}


function init3DSection() {
  // 定义相机
  camera = new THREE.PerspectiveCamera(
    // 相机视角的夹角
    90,
    // 相机画幅比
    $(window).width() / $(window).height(),
    // 最近焦距
    10,
    // 最远焦距
    150
  );
  camera.fov = 103;

  // 定义重力感应操作
  controls = new THREE.DeviceOrientationControls(camera);
  controls.connect();

  // 定义3D场景
  var scene = new THREE.Scene();

  // 初始化立方体
  // 180 degress
  var flipAngle = Math.PI;
  // 90 degress
  var rightAngle = flipAngle / 2;

  // 贴图
  var sides = [{
    url: '../img/scene_3d/posx-1024.png',
    position: [-512, 0, 0],
    rotation: [0, rightAngle, 0]
  }, {
    url: '../img/scene_3d/negx-1024.png',
    position: [512, 0, 0],
    rotation: [0, -rightAngle, 0]
  }, {
    url: '../img/scene_3d/posy-1024.png',
    position: [0, 512, 0],
    rotation: [rightAngle, 0, flipAngle]
  }, {
    url: '../img/scene_3d/negy-1024.png',
    position: [0, -512, 0],
    rotation: [-rightAngle, 0, flipAngle]
  }, {
    url: '../img/scene_3d/posz-1024.png',
    position: [0, 0, 512],
    rotation: [0, flipAngle, 0]
  }, {
    url: '../img/scene_3d/negz-1024.png',
    position: [0, 0, -512],
    rotation: [0, 0, 0]
  }];

  // 将贴图加入场景
  for (var i = 0; i < sides.length; i++) {
    var side = sides[i];

    // 场景贴图 begin
    var element = document.createElement('img');
    // element.width = 1030; // 2 pixels extra to close the gap.
    element.src = side.url;
    element.className = 'section3D';
    element.id = 'section3D-' + i;
    var object = new THREE.CSS3DObject(element);
    object.position.fromArray(side.position);
    object.rotation.fromArray(side.rotation);
    scene.add(object);
    // 场景贴图 end

    // 闹钟 begin
    var clock = document.createElement('img');
    clock.width = 136;
    clock.src = '../img/target/clock.png';
    clock.className = 'clock';
    clock.id = 'clock-' + i;

    if (i === 0 || i === 1 || i === 4 || i === 5) {
      var clockObj = new THREE.CSS3DObject(clock);
      clockObj.position.fromArray(side.position);
      clockObj.rotation.fromArray(side.rotation);
      // 闹钟位置
      switch (i) {
      case 0:
        clockObj.position.fromArray([-512, 0, -185]);
        break;
      case 1:
        clockObj.position.fromArray([512, -350, 300]);
        break;
      case 4:
        clockObj.position.fromArray([-135, -30, 512]);
        break;
      case 5:
        clockObj.position.fromArray([80, -70, -512]);
        break;
      }
      scene.add(clockObj);
    }
    // 闹钟 end

    // 奶 begin
    var milk = document.createElement('img');
    milk.width = 41;
    milk.src = '../img/target/milk-' + Math.floor(Math.random() * (2 - 1 + 1) + 1) + '.png';
    milk.className = 'milk';
    milk.id = 'milk-' + i;

    if (i === 0 || i === 1 || i === 4 || i === 5) {
      var milkObj = new THREE.CSS3DObject(milk);
      milkObj.position.fromArray(side.position);
      milkObj.rotation.fromArray(side.rotation);
      // 闹钟位置
      switch (i) {
      case 0:
        milkObj.position.fromArray([-512, -10, -80]);
        break;
      case 1:
        milkObj.position.fromArray([502, -60, -345]);
        break;
      case 4:
        milkObj.position.fromArray([-235, -45, 512]);
        break;
      case 5:
        milkObj.position.fromArray([190, -75, -512]);
        break;
      }
      scene.add(milkObj);
    }
    // 奶 end
  }

  // 定义渲染器
  var renderer = new THREE.CSS3DRenderer();
  // 设定尺寸
  renderer.setSize($(window).width(), $(window).height());
  // 将场景加入页面
  $('#quanjing').append(renderer.domElement);

  // 拖拽处理
  var touchX, touchY;
  var lon = 90,
    lat = 0;
  var phi = 0,
    theta = 0;

  function onDocumentTouchStart(event) {
    event.preventDefault();
    var touch = event.touches[0];
    touchX = touch.screenX;
    touchY = touch.screenY;
  }

  function onDocumentTouchMove(event) {
    event.preventDefault();
    var touch = event.touches[0];
    lon -= (touch.screenX - touchX) * 0.2;
    lat += (touch.screenY - touchY) * 0.2;
    touchX = touch.screenX;
    touchY = touch.screenY;
  }

  // resize处理
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // 事件触发
  var el_q = document.getElementById('quanjing');

  if (!DeviceOrientation) {
    el_q.addEventListener('touchstart', onDocumentTouchStart, false);
    el_q.addEventListener('touchmove', onDocumentTouchMove, false);
  }

  window.addEventListener('resize', onWindowResize, false);

  // 实时渲染
  var target = new THREE.Vector3();

  function animate() {

    // ios下初始化渲染bug，微移一下解决
    if (lon === 90) {
      lon += 1;
    } else {
      lon += 0;
    }

    renderer.render(scene, camera);

    if (!DeviceOrientation) {
      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.Math.degToRad(90 - lat);
      theta = THREE.Math.degToRad(lon);
      target.x = Math.sin(phi) * Math.cos(theta);
      target.y = Math.cos(phi);
      target.z = Math.sin(phi) * Math.sin(theta);

      // console.log('当前指向目标：' + target.x.toFixed(3) * 1000 + ',' + target.y.toFixed(3) * 1000 + ',' + target.z.toFixed(3) * 1000);
      // 更新准星坐标
      _shotTarget = [target.x.toFixed(3) * 1000, target.y.toFixed(3) * 1000, target.z.toFixed(3) * 1000];

      camera.lookAt(target);
    } else {
      controls.update();
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/**
 * 当前准星坐标
 * @type {Array}
 */
var _shotTarget = [0, 0, 0];
var _shotTarget4 = [0, 0, 0, 0];

/**
 * 猪表坐标库
 * @type {Object}
 */
var _clockPosition = {
  'clock-0': {
    hited: false,
    x: [-843 - 30, -689 + 30],
    y: [371 - 30, 574 + 30],
    z: [-522 - 30, -344 + 30]
  },
  'clock-1': {
    hited: false,
    x: [686 - 30, 792 + 30],
    y: [-125 - 30, 24 + 30],
    z: [600 - 30, 720 + 30]
  },
  'clock-4': {
    hited: false,
    x: [-474 - 30, -273 + 30],
    y: [312 - 30, 529 + 30],
    z: [739 - 30, 895 + 30]
  },
  'clock-5': {
    hited: false,
    x: [203 - 30, 415 + 30],
    y: [252 - 30, 460 + 30],
    z: [-942 - 30, -816 + 30]
  }
};
var _clockPosition4 = {
  'clock-0': {
    hited: false,
    // x: [16, 35],
    y: [40, 52],
    // z: [-17, 5],
    w: [80, 87]
  },
  'clock-1': {
    hited: false,
    // x: [-5, 5],
    y: [89, 92],
    // z: [-2, 10],
    w: [38, 45]
  },
  'clock-4': {
    hited: false,
    // x: [-1, 8],
    y: [90, 100],
    // z: [-30, -10],
    w: [15, 30]
  },
  'clock-5': {
    hited: false,
    // x: [11, 23],
    y: [14, 22],
    // z: [-5, 5],
    w: [95, 98]
  }
};

/**
 * 判断是否命中猪表
 * @return {[type]} [description]
 */
function checkShotTarget(pos) {
  // 标记本地判断中，是否有目标被命中
  var _flag = false;
  console.log('发射落点：' + pos[0] + ', ' + pos[1] + ', ' + pos[2]);
  // console.log('当前指向坐标：' + camera.matrixWorldInverse.elements.toString());

  for (pig in _clockPosition) {
    for (key in _clockPosition[pig]) {
      // 判断x
      var hitX = pos[0] >= _clockPosition[pig].x[0] && pos[0] <= _clockPosition[pig].x[1] ? true : false;
      // 判断y
      var hitY = pos[1] >= _clockPosition[pig].y[0] && pos[1] <= _clockPosition[pig].y[1] ? true : false;
      // 判断z
      var hitZ = pos[2] >= _clockPosition[pig].z[0] && pos[2] <= _clockPosition[pig].z[1] ? true : false;

      console.log('是否命中？ x:' + hitX + ', y: ' + hitY + ', z: ' + hitZ);

      if (hitX && hitY && hitZ && !_clockPosition[pig].hited) {
        // 命中计数
        _finished.hit += 1;

        // 删除命中的猪表
        $('#' + pig).addClass('none');

        // 命中提示
        // alert('命中了:' + pig);
        showFullTips('tips-hit-' + Math.floor(Math.random() * (2 - 0 + 1) + 0), function () {});

        // 标记
        _flag = true;

        // 停止轮询
        return false;
      }
    }
  }

  if (!_flag) {
    // 未命中提示
    // alert('未命中');
    showFullTips('tips-nohit-' + Math.floor(Math.random() * (1 - 0 + 1) + 0), function () {});
  }
}

function checkShotTarget4(pos) {
  // 标记本地判断中，是否有目标被命中
  var _flag = false;
  console.log('发射落点：' + pos[0] + ', ' + pos[1] + ', ' + pos[2], ', ' + pos[3]);

  for (pig in _clockPosition4) {
    for (key in _clockPosition4[pig]) {
      // 判断x
      // var hitX = pos[0] >= _clockPosition4[pig].x[0] && pos[0] <= _clockPosition4[pig].x[1] ? true : false;
      // 判断y
      var hitY = Math.abs(pos[1]) >= Math.abs(_clockPosition4[pig].y[0]) && Math.abs(pos[1]) <= Math.abs(_clockPosition4[pig].y[1]) ? true : false;
      // 判断z
      // var hitZ = pos[2] >= _clockPosition4[pig].z[0] && pos[2] <= _clockPosition4[pig].z[1] ? true : false;
      // 判断w
      var hitW = Math.abs(pos[3]) >= Math.abs(_clockPosition4[pig].w[0]) && Math.abs(pos[3]) <= Math.abs(_clockPosition4[pig].w[1]) ? true : false;

      console.log('是否命中？ x:' + /**hitX +*/ ', y: ' + hitY + ', z: ' + /*hitZ +*/ ', w: ' + hitW);

      if ( /**hitX && */ hitY && /**hitZ && */ hitW && !_clockPosition4[pig].hited) {
        // 命中计数
        _finished.hit += 1;

        // 删除命中的猪表
        $('#' + pig).addClass('none');

        // 命中提示
        // alert('命中了:' + pig);
        showFullTips('tips-hit-' + Math.floor(Math.random() * (2 - 0 + 1) + 0));

        // 标记
        _flag = true;

        // 停止轮询
        return false;
      }
    }
  }

  if (!_flag) {
    // 未命中提示
    // alert('未命中');
    showFullTips('tips-nohit-' + Math.floor(Math.random() * (1 - 0 + 1) + 0));
  }
}


/**
 * 睁眼动画
 * @return {[type]} [description]
 */
function openEyes(callback) {
  setTimeout(function () {
    $('#open-eyes').addClass('nobg');
    var _flag = -1;
    var _play = self.setInterval(function () {
      _flag += 1;
      $('#open-eyes img').addClass('none');
      $('#open-eyes img').eq(_flag).removeClass('none');
      if (_flag >= 36) {
        _play = window.clearInterval(_play);
        setTimeout(function () {
          $('#open-eyes').addClass('none');
          if (typeof (callback) === 'function') {
            callback.call(this);
          }
        }, 1000 / 16);
      }
    }, 1000 / 16);
  }, 500);
}


/**
 * 初始化弹弓
 * @return {[type]} [description]
 */
var audioPush, audioShot;

function initShot() {
  console.log('初始化弹弓');
  // 显示弹弓 begin
  $('#shot').addClass('show');
  // 显示弹弓 end

  // 上子弹 begin
  // 根据弹夹状态
  for (key in _clipStatus) {
    if (_clipStatus[key].current) {
      $('#shot-bird').attr('class', '').addClass(key);
    }
  }
  // 上子弹 end

  // 拖拽下拉射大屌 begin
  var _tigger = $('#shot')[0];
  var hammertime = new Hammer(_tigger);
  hammertime.get('pan').set({
    direction: Hammer.DIRECTION_ALL
  });
  hammertime.on('panmove', function (e) {
    // 弹弓紧绷 begin
    if (e.deltaY > 40 && $('#shot-bird').attr('class') != '') {
      $('#shot-trigger').removeClass('off').addClass('on');
    }
    // 弹弓紧绷 end
  });

  hammertime.on('panstart', function (e) {
    // 播放音效
    // if ($('#audio-shot').attr('src') == '') {
    // $('#audio-shot').attr('src', $('#audio-shot').attr('data-push'));
    // $('#audio-shot')[0].play();
    // }
    if (!audioPush) {
      audioPush = document.createElement('audio');
      audioPush.src = '../img/push.mp3';
      audioPush.loop = false;
    }
    audioPush.play();
  });

  hammertime.on('panend', function (e) {
    console.log('下拉触发：', e.deltaY);

    // 检查弹夹是否为空
    checkEmpty();

    // 人间大炮，发射 begin
    if (e.deltaY > 40 && $('#shot-bird').attr('class') != '') {
      // 播放音效
      audioPush.pause();
      audioPush.currentTime = 0.0;
      if (!audioShot) {
        audioShot = document.createElement('audio');
        audioShot.src = '../img/shot.mp3';
        audioShot.loop = false;
      }
      audioShot.play();
      // $('#audio-shot').attr('src', '');
      // $('#audio-shot').attr('src', $('#audio-shot').attr('data-shot'));
      // $('#audio-shot')[0].play();
      // 隐藏弹弓提示
      $('#shot-tips').hide();
      // 弹弓状态
      $('#shot-trigger').addClass('off').removeClass('on');
      // 鸟要飞得更高，飞~得~更~高~
      // $('#shot-bird').addClass('flying').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
      $('#shot-bird').addClass('flying');

      setTimeout(function () {
        // 更新弹夹状态 begin
        var _bird = $('#shot-bird').attr('class').split(' ')[0];
        _clipStatus[_bird].empty = true;
        _clipStatus[_bird].current = false;
        $('#clip > .clip-item').removeClass('current');
        for (key in _clipStatus) {
          if (_clipStatus[key].empty) {
            $('#clip > .' + key).addClass('empty');
          }
        }
        // 更新弹夹状态 end

        // 更新已用子弹数 begin
        _finished.used += 1;
        // 更新已用子弹数 end

        // 子弹消失 begin
        $('#shot-bird').attr('class', '');
        // 子弹消失 end

        // 给弹弓装弹 begin
        chargeBird();
        // 给弹弓装弹 end

        // 判断是否命中
        if (!DeviceOrientation) {
          checkShotTarget(_shotTarget);
        } else {
          checkShotTarget4(_shotTarget4);
        }

        // 判断是否完成游戏
        checkGame();
      }, 500);
      // });
    }
    // 人间大炮，发射 end
  });
  // 拖拽下拉射大屌 end
}


/**
 * 初始化弹夹
 * @return {[type]} [description]
 */
// 弹夹状态
var _clipStatus = {
  'shot-bird-red': {
    'current': true,
    'empty': false
  },
  'shot-bird-black': {
    'current': false,
    'empty': false
  },
  'shot-bird-yellow': {
    'current': false,
    'empty': false
  }
};

function initClip() {
  console.log('初始化弹夹');
  // 显示弹夹 begin
  $('#clip').addClass('show');
  // 显示弹夹 end

  // 初始化当前子弹 begin
  for (key in _clipStatus) {
    if (_clipStatus[key].current) {
      $('#clip > .' + key).addClass('current');
    }
  }
  // 初始化当前子弹 end
}

/**
 * 给弹弓装弹
 * @return {[type]} [description]
 */
function chargeBird() {
  console.log('给弹弓装弹');
  for (key in _clipStatus) {
    if (!_clipStatus[key].empty) {
      console.log('下个子弹：' + key);
      // 标记状态
      _clipStatus[key].current = true;
      // 装弹
      $('#shot-bird').attr('class', '')
      $('#shot-bird').addClass(key);
      // 停止轮询
      return false;
    }
  }
}


/**
 * 初始化奶资源
 * @return {[type]} [description]
 */
function initMilk() {
  console.log('初始化奶资源');

  // 随机一个空奶
  var _emptyIndex = Math.floor(Math.random() * (3 - 0 + 1) + 0);
  console.log('本次的空奶：' + _emptyIndex);

  // 标记空奶 & 添加点击事件
  $('.milk')
    .each(function (index, el) {
      if (index == _emptyIndex) {
        $(this).data('empty', 'true');
      } else {
        $(this).data('empty', 'false');
      }
    })
    .on('touchstart', function (e) {
      e.preventDefault();
      getMilk($(this));
    });
}


/**
 * 从奶里获取鸟弹
 * @param  {[type]} milkObj [description]
 * @return {[type]}         [description]
 */
function getMilk(milkObj) {
  // 是否为空奶
  var _isEmpty = milkObj.data('empty') == 'true' ? true : false;

  if (_isEmpty) {

    // 空罐提示
    // alert('这是一罐空奶');
    showFullTips('tips-empty-0');

    // 删掉奶盒
    console.log('这是一罐空奶，删除奶盒' + milkObj.attr('id'));
    milkObj.addClass('none');

  } else {

    // 弹夹状态
    var _clipFull = !_clipStatus['shot-bird-red'].empty && !_clipStatus['shot-bird-black'].empty && !_clipStatus['shot-bird-yellow'].empty ? true : false;
    if (_clipFull) {

      // 满弹提示
      // alert('你的小鸟活力满满，先消灭绿猪吧~');
      showFullTips('tips-full-0');

    } else {

      for (key in _clipStatus) {
        if (_clipStatus[key].empty) {
          console.log(key + '弹为空，装填');

          // 弹夹装弹
          _clipStatus[key].empty = false;
          $('#clip > .' + key).removeClass('empty');

          // 如果弹弓上无子弹，则自动装上
          if ($('#shot-bird').attr('class') == '') {
            $('#shot-bird').attr('class', key);
            $('#clip > .' + key).addClass('current');
          }

          // 删掉奶盒
          console.log('装弹完成，删除奶盒' + milkObj.attr('id'));
          milkObj.addClass('none');

          // 停止轮询
          return false;
        }
      }

    }

  }
}


/**
 * 判断游戏是否结束
 */
var _finished = {
  // 命中数
  hit: 0,
  // 子弹使用数
  used: 0
};

function checkGame() {
  console.log('命中数：' + _finished.hit + '；已用子弹数：' + _finished.used);

  // alert('命中数：' + _finished.hit + '；已用子弹数：' + _finished.used);
  if (_finished.hit >= 4 || _finished.used >= 6) {
    // 游戏结束
    // alert('游戏结束！');
    // 将命中数提交给接口，接口需返回跳转目标Url
    $('#tips-ajax-post').removeClass('none');
    $.ajax({
        url: siteUrl + '/m/game_over',
        type: 'POST',
        dataType: 'json',
        data: {
          'hit': _finished.hit
        }
      })
      .done(function (json) {
        if (json.info != 'ok') {
          alert(json.info);
          return false;
        }

        // 成功，跳转
        window.location.href = json.url;
      })
      .fail(function (data) {
        alert('Sorry, 网络不给力');
      });

  } else {
    console.log('游戏尚未结束，命中数：' + _finished.hit + '；已用子弹数：' + _finished.used);
  }
}


function checkEmpty() {
  var _empty = $('#clip > .empty').length;
  console.log('弹夹状态：' + _empty);
  if (_empty >= 3) {
    showFullTips('tips-empty-clip');
  }
}


/**
 * 显示一个大提示气泡
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function showFullTips(id, cb) {
  $('#full-tips').removeClass('none');
  $('#' + id).removeClass('none');
  setTimeout(function () {
    hideFullTips(function () {
      if (typeof (cb) == 'function') {
        cb.call(this);
      }
    });
  }, 2000);
}
/**
 * 隐藏大提示气泡
 * @return {[type]} [description]
 */
function hideFullTips(cb) {
  $('#full-tips').addClass('none');
  $('#full-tips > div').addClass('none');
  if (typeof (cb) == 'function') {
    cb.call(this);
  }
}
$('#full-tips').on('touchend touchmove', function (e) {
  e.preventDefault();
  hideFullTips();
});


/**
 * 初始化
 */
$(function () {

  // 表单页<input>focus处理
  // 傻逼安卓
  if ($('.form')[0]) {
    // console.log($(window).height())
    $('.form > form').css({
      height: $(window).height()
    });
    $('body').css({
      'overflow-y': 'auto'
    });
  }

  // 分享浮层
  if ($('#pop-share')[0]) {
    $('#btn-share').on('touchend', function (e) {
      e.preventDefault();
      $('#pop-share').removeClass('none');
    });
    $('#pop-share').on('touchend', function (e) {
      e.preventDefault();
      $('#pop-share').addClass('none');
    });
  }

  if ($('#quanjing')[0]) {
    // 禁止全局拖拽
    document.addEventListener('touchmove', function (e) {
      e.preventDefault();
    });
    // 执行3D场景初始化
    init3DSection();
    // 睁眼
    openEyes(function () {
      // 初始化弹弓
      initShot();
      // 初始化弹夹
      initClip();
      // 初始化奶资源
      initMilk();
    });
  }
});


// 微信内强制自动播放背景音乐
if ($('#music')[0]) {
  setTimeout(function () {
    $(window).scrollTop(1);
  }, 0);
  document.addEventListener("WeixinJSBridgeReady", function () {
    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
      document.getElementById('music').play();
    });
  }, false);
}

// 音乐播放控制
if ($('#bgmusic')[0]) {
  $('#bgmusic').on('click', function (e) {
    e.preventDefault();
    var _m = $('#music')[0],
      _this = $(this);
    if (_this.hasClass('on')) {
      _this.removeClass('on').addClass('off');
      _m.pause();
    } else {
      _this.addClass('on').removeClass('off');
      _m.play();
    }
  });
}

// var _debug = true;
// if (_debug) {
//   $('body').append('<div id="debug"><p>x:<span id="debug_x"></span><p>y:<span id="debug_y"></span><p>z:<span id="debug_z"></span><p>w:<span id="debug_w"></span></p></div>');
// }
