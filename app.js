const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2')
const cdThum = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRanDom: false,
    isRepeat: false,
    isClick: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setconfig: function(key, value) {
      app.config[key] = value;
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(app.config))
    },
    songs: [
        {
          name: "Phản Bội Chính Mình",
          singer: "Quân AP x Vương Anh Tú",
          path: "./asset/audio/phanboichinhminh.mp3",
          image: "https://i.pinimg.com/originals/72/69/52/7269525c63566297e234a9e0632b1868.jpg"
        },
        {
          name: "Nỗi Đau Mình Anh",
          singer: "Châu Khải Phong x ",
          path: "./asset/audio/NoiDauMinhAnh.mp3",
          image: "https://i.ytimg.com/vi/lY0cX2vmQxY/maxresdefault.jpg"
        },
        {
          name: "Bông Hoa Đẹp Nhất",
          singer: "QUÂN A.P",
          path:
            "./asset/audio/bonghoadepnhat.mp3",
          image: "https://i1.sndcdn.com/artworks-5yoyC3BGa5g44g8P-mgyA4Q-t500x500.jpg"
        },
        {
          name: "Sẽ chẳng yêu người khác đâu",
          singer: "NIZ",
          path: "./asset/audio/Sechangyeunguoikhacdau.mp3",
          image:
            "https://i.ytimg.com/vi/UnfmHEZLpBk/maxresdefault.jpg"
        },
        {
          name: "Short Skirt( Em là Bad girl trong bộ váy ngắn )",
          singer: "NIZ",
          path: "./asset/audio/shortskirt.mp3",
          image:
            "https://zmp3-photo-fbcrawler.zadn.vn/thumb_video/c/4/2/b/c42b1126aefbe8696c27f1ad45816cf4.jpg"
        },
        {
          name: "VÌ MẸ ANH BẮT CHIA TAY",
          singer: "MIU LÊ x KARIK x CHÂU ĐĂNG KHOA ",
          path:
            "./asset/audio/vimebatchiatay.mp3",
          image:
            "https://cdn1.tuoitre.vn/zoom/600_315/2022/6/13/vimeanhbatchiatay1-1655123665317594449768-crop-16551241473681951906504.jpg"
        },
        {
          name: "Một Bước Yêu Vạn Dặm Đau",
          singer: "Mr.Siro",
          path: "./asset/audio/motbuocyeuvandamdau.mp3",
          image:
            "https://t2.genius.com/unsafe/600x600/https://images.genius.com/a7e213a24fb51f416bb97d1463800196.600x600x1.png"
        },
        
      ],
    
    render: function () {
         const htmls = app.songs.map((song ,index) => {
            return  `
            <div class="song ${
              index === app.currentIndex ? "active" : ""
            }" data-index="${index}">

                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `;
        })

        playlist.innerHTML = htmls.join('\n');
    },

    defineProperties: () => {
       Object.defineProperty(app , 'currentSong' , {
            get: function () {
                return app.songs[app.currentIndex];
            }
       })  

    },

    handleEvents: () => {
      // Phóng to thu nhỏ
        const cdWidth = cd.offsetWidth;
        document.onscroll = () => {
            const srollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdwidth = cdWidth - srollTop;
            cd.style.width = newcdwidth > 0 ? newcdwidth + 'px' : 0;
            cd.style.opacity = newcdwidth / cdWidth;
        }

      // Xử lý CD quay / dừng

      const cdThumAnimate= cdThum.animate([
        {
          transform: 'rotate(360deg)'
        }
      ] , {
        duration: 10000, // 10s
        iterations: Infinity
      })

      cdThumAnimate.pause();

      // Xủ lí khi click play button
      playBtn.onclick = () => {
        if(app.isPlaying) {
          audio.pause();
        }else 
        {
          audio.play();
        }
      }
      
      // Khi mà song được chạy
      audio.onplay = () => {
        player.classList.add('playing');
        app.isPlaying = true;
        cdThumAnimate.play();
      }

      // Khi mà song bị dừng lại
      audio.onpause = () => {
        player.classList.remove('playing');
        app.isPlaying = false;
        cdThumAnimate.pause();
      }

      // Xử lý thanh progress chạy theo time
      audio.ontimeupdate = () => {
        progress.value = audio.currentTime / audio.duration * 100;
      }

      // Xử lý tua audio
      progress.onchange = (e) => {
        const seekTime = audio.duration / 100 * e.target.value
        audio.currentTime = seekTime
      }

      // Xử lí next / prev Song

      nextBtn.onclick = function () {
        if(app.isRanDom)
        {
          app.playRandomSong();
        }
        else {
          app.nextSong()
        }
        audio.play();
        app.render();
        app.scrollToActiveSong();
      }
      

      prevBtn.onclick = () => {
        if(app.isRanDom)
        {
          app.playRandomSong()
        }else {
        app.prevSong();
        }

        audio.play();
        app.render();
        app.scrollToActiveSong();

      }

      // Xử lý random bài hát
      randomBtn.onclick = () => {
        app.isRanDom = !app.isRanDom;
        app.setconfig('isRanDom', app.isRanDom)
        randomBtn.classList.toggle('active' , app.isRanDom);
      }

      // Xử lý chuyển song khi ended

      audio.onended = () => {
          if(app.isRepeat)
          {
            audio.play();
          }else {
            nextBtn.click();
          }
      }

      // Xử lý repeat lại song

      repeatBtn.onclick = () => {
        app.isRepeat = !app.isRepeat;
        app.setconfig('isRepeat', app.isRepeat);
        repeatBtn.classList.toggle('active' , app.isRepeat)

      }

      // Xử lý chọn bài hát khi click vào

      playlist.onclick = (e) => {
        const songNode = e.target.closest('.song:not(.active)');
        if(songNode || e.target.closest('.option'))
        {
            // Xử lý khi click vào song
            if(songNode && !e.target.closest('.option'))
            {          

              // Nếu như không đặt isClick mà dùng render() thì
              // Nhớ chuyển songNode.dataset.index về dạng number
              app.currentIndex = songNode.dataset.index; // này đang là string
              app.loadCurrentSong();
              audio.play();
              app.isClick = !app.isClick;
              $('.song.active').classList.remove('active')
              songNode.classList.toggle('active');
              
            }

            if(e.target.closest('.option')) {
              console.log(1223)
            } 
        }
      }

    },

    nextSong: () => {
      app.currentIndex++;
      if(app.currentIndex >= app.songs.length) {
        app.currentIndex = 0;
      }

      app.loadCurrentSong();
    },

    prevSong: function() {
      app.currentIndex--;
      if(app.currentIndex < 0) {
        app.currentIndex = app.songs.length - 1 ;
      }

      app.loadCurrentSong();
    },
    playRandomSong: function () {
      let newIndex = app.currentIndex;
        do{
          app.currentIndex = Math.floor(Math.random() * app.songs.length)
         } while (app.currentIndex == newIndex);

         app.loadCurrentSong();
    }
    ,

    loadCurrentSong: () => {

        heading.innerHTML = app.currentSong.name;
        cdThum.style.backgroundImage = `url(${app.currentSong.image})`
        audio.src = app.currentSong.path;
    },
    loadConFig: function () {
      app.isRanDom = app.config.isRanDom
      app.isRepeat = app.config.isRepeat
      repeatBtn.classList.toggle('active' , app.isRepeat)
      randomBtn.classList.toggle('active' , app.isRanDom);
    }

    ,

    scrollToActiveSong: function () {
      setTimeout(() => {
        $('.song.active').scrollIntoView( {
          behavior: 'smooth',
          block: app.currentIndex === 0 ? 'center' : 'nearest'
          
        })
      }, 300);
    }
    ,

    start: function () {
        // Gán cấu hình từ config vào ứng dụng 
        this.loadConFig();

        // Add thuộc tính 
        this.defineProperties();

        // xủ lí Event
        this.handleEvents();

        // Load bài hát hiên tại
        this.loadCurrentSong();

        // Load bài hát ra UI
        this.render();

        // Hiển thị trạng thái ban đầu của repeatBtn and ranDomBtn
        repeatBtn.classList.toggle('active' , app.isRepeat)
        randomBtn.classList.toggle('active' , app.isRanDom);
    }
}

app.start();
