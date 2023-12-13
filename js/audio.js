// 获取主题背景
var body = document.getElementById('body')
// 获取音频播放器对象
var audio = document.getElementById('audioTag')

// 歌曲名
var musicTitle = document.getElementById('music-title')
// 歌曲海报
var recordImg = document.getElementById('record-img')
// 歌曲作者
var author = document.getElementById('author-name')

// 进度条
var progress = document.getElementById('progress')
// 总进度条
var progressTotal = document.getElementById('progress-total')

// 已进行时长
var playedTime = document.getElementById('playedTime')
// 总时长
var audioTime = document.getElementById('audioTime')

// 播放模式按钮
var mode = document.getElementById('playMode')
// 上一首
var skipForward = document.getElementById('skipForward')
// 暂停按钮
var pause = document.getElementById('playPause')
// 下一首
var skipBackward = document.getElementById('skipBackward')
// 音量调节
var volume = document.getElementById('volume')
// 音量调节滑块
var volumeTogger = document.getElementById('volumn-togger')

// 列表
var list = document.getElementById('list')
// 倍速
var speed = document.getElementById('speed')

// 左侧关闭面板
var closeList = document.getElementById('close-list')
// 音乐列表面板
var musicList = document.getElementById('music-list')

// 暂停/播放功能实现
pause.onclick = function (e) {
  if (audio.paused) {
    audio.play()
    rotateRecord()
    pause.classList.remove('icon-play')
    pause.classList.add('icon-pause')
  } else {
    audio.pause()
    rotateRecordStop()
    pause.classList.remove('icon-pause')
    pause.classList.add('icon-play')
  }
}

// 更新进度条
audio.addEventListener('timeupdate', updateProgress) // 监听音频播放时间并更新进度条
function updateProgress() {
  var value = audio.currentTime / audio.duration
  progress.style.width = value * 100 + '%'
  playedTime.innerText = transTime(audio.currentTime)
}

//音频播放时间换算
function transTime(value) {
  var time = ''
  var h = parseInt(value / 3600)
  value %= 3600
  var m = parseInt(value / 60)
  var s = parseInt(value % 60)
  if (h > 0) {
    time = formatTime(h + ':' + m + ':' + s)
  } else {
    time = formatTime(m + ':' + s)
  }

  return time
}

// 格式化时间显示，补零对齐
function formatTime(value) {
  var time = ''
  var s = value.split(':')
  var i = 0
  for (; i < s.length - 1; i++) {
    time += s[i].length == 1 ? '0' + s[i] : s[i]
    time += ':'
  }
  time += s[i].length == 1 ? '0' + s[i] : s[i]

  return time
}

// 点击进度条跳到指定点播放
progressTotal.addEventListener('mousedown', function (event) {
  // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
  if (!audio.paused || audio.currentTime != 0) {
    var pgsWidth = parseFloat(
      window.getComputedStyle(progressTotal, null).width.replace('px', '')
    )
    var rate = event.offsetX / pgsWidth
    audio.currentTime = audio.duration * rate
    updateProgress(audio)
  }
})

// 点击列表展开音乐列表
list.addEventListener('click', function (event) {
  musicList.classList.remove('list-card-hide')
  musicList.classList.add('list-card-show')
  musicList.style.display = 'flex'
  closeList.style.display = 'flex'
  closeList.addEventListener('click', closeListBoard)
})

// 点击关闭面板关闭音乐列表
function closeListBoard() {
  musicList.classList.remove('list-card-show')
  musicList.classList.add('list-card-hide')
  closeList.style.display = 'none'
}

// 存储当前播放的音乐序号
var musicId = 0
// 存储已播放过的音乐序号
let playedMusicIndices = []
// 后台音乐列表
let musicData = [
  ['天后(盲目盲目Live版)', '李佳薇'],
  ['煎熬', '李佳薇'],
  ['大火', '李佳薇'],
  ['像天堂的悬崖', '李佳薇'],
  ['枫', '周杰伦'],
  ['泡沫', '邓紫棋'],
  ['我怀念的', '孙燕姿'],
  ['这世界那么多人', '莫文蔚'],
  ['亲爱的，那不是爱情', '张韶涵'],
  ['画', '邓紫棋'],
  ['下雨天', '与少年他 / 芝麻Mochi'],
  ['﹌﹌﹌﹌﹌﹌﹌﹌﹌', 'HOPERUI'],
  ['有一种悲伤', 'A-Lin'],
  ['陪我长大', '段奥娟'],
  ['Wondeful U', 'AGA'],
]

// 初始化音乐
function initMusic() {
  audio.src = 'mp3/music' + musicId.toString() + '.wav'
  audio.load()
  recordImg.classList.remove('rotate-play')
  audio.ondurationchange = function () {
    musicTitle.innerText = musicData[musicId][0]
    author.innerText = musicData[musicId][1]
    recordImg.style.backgroundImage =
      "url('img/record" + musicId.toString() + ".jpg')"
    body.style.backgroundImage = "url('img/bg" + musicId.toString() + ".png')"
    audioTime.innerText = transTime(audio.duration)
    // 重置进度条
    audio.currentTime = 0
    updateProgress()
    refreshRotate()
    // 加载歌词
    loadLyrics(musicId)
  }
}
initMusic()

// 初始化并播放
function initAndPlay() {
  initMusic()
  pause.classList.remove('icon-play')
  pause.classList.add('icon-pause')
  audio.play()
  rotateRecord()
  playedMusicIndices.push(musicId)
}
//55
function loadLyrics(musicId) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'lyrics/' + musicId + '.txt', true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var lyrics = xhr.responseText
      // 调用显示歌词的函数，稍后定义
      displayLyrics(lyrics)
    }
  }
  xhr.send()
}
var lyricsArray = []
var currentLyricsIndex = 0
var lyricsUpdateTimer

function displayLyrics(lyrics) {
  // 将歌词按行分割
  lyricsArray = lyrics.split('\n')

  // 清除之前的定时器
  if (lyricsUpdateTimer) {
    clearTimeout(lyricsUpdateTimer)
  }

  // 更新歌词显示
  function updateLyricsDisplay() {
    var currentLyrics = lyricsArray[currentLyricsIndex]
    var lyricsElement = document.getElementById('lyrics')
    lyricsElement.innerText = currentLyrics

    // 检查是否需要移动到下一行歌词
    if (audio.currentTime >= getLyricsTime(currentLyricsIndex)) {
      currentLyricsIndex++
      if (currentLyricsIndex >= lyricsArray.length) {
        currentLyricsIndex = 0
      }
      updateLyricsDisplay()
    }
  }

  // 根据歌词行内容获取对应的时间
  function getLyricsTime(index) {
    // 在这里添加逻辑以从歌词行内容中提取时间信息
    // 例如，如果歌词格式为 [00:12.34] 歌词内容，则可以这样做：
    var timeMatch = lyricsArray[index].match(/\[(.*?)\]/)
    if (timeMatch) {
      var timeString = timeMatch[1]
      var timeInSeconds =
        parseFloat(timeString.split(':')[0]) * 60 +
        parseFloat(timeString.split(':')[1])
      return timeInSeconds
    }
    return 0
  }

  // 启动定时器以实时更新歌词显示
  lyricsUpdateTimer = setInterval(updateLyricsDisplay, 100)
}
// 根据歌词行内容获取对应的时间（去掉时间标签）
function displayLyrics(lyrics) {
  // 将歌词按行分割
  lyricsArray = lyrics.split('\n')

  // 清除之前的定时器
  if (lyricsUpdateTimer) {
    clearTimeout(lyricsUpdateTimer)
  }

  // 更新歌词显示
  function updateLyricsDisplay() {
    var currentTime = audio.currentTime
    var currentLyricsIndex = 0

    // 遍历歌词数组，找到需要显示的歌词
    for (var i = 0; i < lyricsArray.length; i++) {
      var timeMatch = lyricsArray[i].match(/\[(.*?)\]/)
      if (timeMatch) {
        var timeString = timeMatch[1]
        var timeInSeconds =
          parseFloat(timeString.split(':')[0]) * 60 +
          parseFloat(timeString.split(':')[1])
        if (timeInSeconds <= currentTime) {
          currentLyricsIndex = i
        }
      }
    }

    var currentLyrics = lyricsArray[currentLyricsIndex].replace(/\[.*?\]/g, '') // 去掉时间标签
    var lyricsElement = document.getElementById('lyrics')
    lyricsElement.innerText = currentLyrics

    // 检查是否需要移动到下一行歌词
    if (audio.currentTime >= getLyricsTime(currentLyricsIndex)) {
      currentLyricsIndex++
      if (currentLyricsIndex >= lyricsArray.length) {
        currentLyricsIndex = 0
      }
      updateLyricsDisplay()
    }
  }

  // 启动定时器以实时更新歌词显示
  lyricsUpdateTimer = setInterval(updateLyricsDisplay, 100)
}
// 播放模式设置
var modeId = 1
mode.addEventListener('click', function (event) {
  modeId = modeId + 1
  if (modeId > 2) {
    modeId = 1
  }
  mode.style.backgroundImage = "url('img/mode" + modeId.toString() + ".png')"
})

audio.onended = function () {
  if (modeId == 2) {
    // 跳转至下一首歌
    musicId = (musicId + 1) % 15
  }
  initAndPlay()
}

// 上一首
skipForward.addEventListener('click', function (event) {
  // 非随机播放模式
  musicId = musicId - 1
  if (musicId < 0) {
    musicId = musicData.length - 1
  }

  initAndPlay()
})

// 下一首
skipBackward.addEventListener('click', function (event) {
  // 非随机播放模式
  let nextId = musicId + 1
  if (nextId >= musicData.length) {
    nextId = 0
  }
  musicId = nextId

  initAndPlay()
})
// 倍速功能
speed.addEventListener('click', function (event) {
  var speedText = speed.innerText
  if (speedText == '1.0X') {
    speed.innerText = '1.5X'
    audio.playbackRate = 1.5
  } else if (speedText == '1.5X') {
    speed.innerText = '2.0X'
    audio.playbackRate = 2.0
  } else if (speedText == '2.0X') {
    speed.innerText = '0.5X'
    audio.playbackRate = 0.5
  } else if (speedText == '0.5X') {
    speed.innerText = '1.0X'
    audio.playbackRate = 1.0
  }
})

// 暴力捆绑列表音乐
document.getElementById('music0').addEventListener('click', function (event) {
  musicId = 0
  initAndPlay()
})
document.getElementById('music1').addEventListener('click', function (event) {
  musicId = 1
  initAndPlay()
})
document.getElementById('music2').addEventListener('click', function (event) {
  musicId = 2
  initAndPlay()
})
document.getElementById('music3').addEventListener('click', function (event) {
  musicId = 3
  initAndPlay()
})
document.getElementById('music4').addEventListener('click', function (event) {
  musicId = 4
  initAndPlay()
})
document.getElementById('music5').addEventListener('click', function (event) {
  musicId = 5
  initAndPlay()
})
document.getElementById('music6').addEventListener('click', function (event) {
  musicId = 6
  initAndPlay()
})
document.getElementById('music7').addEventListener('click', function (event) {
  musicId = 7
  initAndPlay()
})
document.getElementById('music8').addEventListener('click', function (event) {
  musicId = 8
  initAndPlay()
})
document.getElementById('music9').addEventListener('click', function (event) {
  musicId = 9
  initAndPlay()
})
document.getElementById('music10').addEventListener('click', function (event) {
  musicId = 10
  initAndPlay()
})
document.getElementById('music11').addEventListener('click', function (event) {
  musicId = 11
  initAndPlay()
})
document.getElementById('music12').addEventListener('click', function (event) {
  musicId = 12
  initAndPlay()
})
document.getElementById('music13').addEventListener('click', function (event) {
  musicId = 13
  initAndPlay()
})
document.getElementById('music14').addEventListener('click', function (event) {
  musicId = 14
  initAndPlay()
})
// 刷新唱片旋转角度
function refreshRotate() {
  recordImg.classList.add('rotate-play')
}

// 使唱片旋转
function rotateRecord() {
  recordImg.style.animationPlayState = 'running'
}

// 停止唱片旋转
function rotateRecordStop() {
  recordImg.style.animationPlayState = 'paused'
}

// 存储上一次的音量
var lastVolumn = audio.volume * 70

// 滑块调节音量
volumeTogger.addEventListener('input', function () {
  audio.volume = volumeTogger.value / 70
})

// 点击音量调节设置静音
volume.addEventListener('click', setNoVolumn)

function setNoVolumn() {
  if (volumeTogger.value == 0) {
    lastVolumn = audio.volume * 70
    volumeTogger.value = lastVolumn
    volume.style.backgroundImage = "url('img/音量.png')"
    audio.volume = lastVolumn / 70
  } else {
    volumeTogger.value = 0
    volume.style.backgroundImage = "url('img/静音.png')"
    audio.volume = 0
  }
}
