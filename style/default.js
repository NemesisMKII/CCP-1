var logregTEMPLATE = `
<h1 class="text-center">Connexion / Inscription</h1>
<form class="text-center w-50 mx-auto mt-5" id="connexion">
    <header class="w-100 h-50 d-flex flex-column">
        <input type="text" placeholder="mail/pseudo" class="w-100 mt-3" id="login">
        <input type="text" placeholder="password" class="w-100 mt-3" id="password">
        <span class="d-inline-flex mt-3 mx-auto align-items-center "><input type="checkbox" class="mx-2" id="staytune"><p class="m-0">Rester connecté </p></span>
        <button class="btn btn-success d-block mx-auto mt-3" id="btnConnexion">Connexion</button>
        <p class="mt-3">Pas encore inscrit ? <a href="#" class="switch">Cliquez-ici</a></p>
    </header>
</form>
<form class="text-center w-50 mx-auto mt-5" id="inscription">
    <header class="w-100 h-50 d-flex flex-column">
        <input type="text" placeholder="mail" class="w-100 mt-3" id="usermail">
        <input type="text" placeholder="pseudo" class="w-100 mt-3" id="userpseudo">
        <input type="text" placeholder="mdp" class="w-100 mt-3" id="usermdp">
        <button class="btn btn-success d-block mx-auto mt-3" id="btnInscription">inscription</button>
        <p class="mt-3">Déjà inscrit ? <a href="#" class="switch">Cliquez-ici</a></p>
    </header>
</form>
`
var playlistsTEMPLATE = `
<div class="d-flex justify-content-between">
    <h1 class="m-2">Playlists</h1>
    <p class="float-end" id="addplaylistBtn">Ajouter une playlist ...</p>
</div>
<div class="playlistscontainer mt-3">
</div>
`

var showplaylistTEMPLATE = `
<i class="fas fa-arrow-left"></i>
<div id="playlistinfocontainer">
    <h1 class="text-center"></h1>
    <img src="" alt="" class="d-block mx-auto mt-4" id="playlistimg">
</div>
<ul id="songlist">
</ul>
`

var searchTEMPLATE = `
<div class="searchbar heighttoggle">
    <input type="text" placeholder="Rechercher..." id="searchinput">
    <i class="far fa-search "></i>
</div>
<div class="searchwrapper heighttoggle">
    <div id="searchdiv">
        <ul id="searchresult">
        </ul>
    </div>
</div>
`
var pcsearchTEMPLATE = `
<div class="searchbar">
    <i class="far fa-search"></i>
    <input type="text" placeholder="Rechercher..." id="searchinput">
</div>
<div class="searchwrapper">
    <div id="searchdiv">
        <ul id="searchresult">
        </ul>
    </div>
</div>
`

$(document).ready(() => {
    let viewheight = $(window).height();
    let viewwidth = $(window).width();
    let viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute("content", "height=" + viewheight + "px, width=" + viewwidth + "px, initial-scale=1.0");
    
    $('body').hide()

    $('.confirm').click(() => {
        if ($('#playlistname').val() == "") {
            alert('Vide !')
        } else {
            playlist = {
                playlist_name: $('#playlistname').val(),
                user_ID: user.user_ID,
                playlist_ID: uuidv4(),
                songs: []
            }

            playlists.push(playlist)
            localStorage.setItem('playlists', JSON.stringify(playlists))
            $('#addplaylistModal').modal('hide')
        }

    })

    //Detects if user is on a device  other than pc, and if so, applies mobile css on it
    if (navigator.userAgent.match(/ipad|android|phone|ios|iphone/gi)) {
        $('#css').after(`
        <!-- CSS style for mobile -->
        <link rel="stylesheet" type="text/css" href="./style/smartphone.css" />
        `)
        $('body').show()
    } else {
        $('body').show()
        $('.headerwrapper').append(pcsearchTEMPLATE)
        $('#searchinput').focus(inputfocus)
        $('.headerwrapper').css({
            'max-width': $('body').width() - $('aside').width()
        })
        $('main').css({
            'width': $('body').width() - $('aside').width(),
            'margin-left': $('aside').width()
        })
        $('.soundprogress').css({
            'height': $('footer').height() - 20
        })

        window.onresize = function() {
            $('.headerwrapper').css({
                'max-width': $('body').width() - $('aside').width()
            })
            $('main').css({
                'width': $('body').width() - $('aside').width(),
                'margin-left': $('aside').width()
            })
            $('.soundprogress').css({
                'height': $('footer').height() - 20
            })
        }
    }

    

    // Get the user list if there is any, or create it and store it in localstorage
    if (!localStorage.getItem('userlist')) {
        var userlist = []
        localStorage.setItem('userlist', JSON.stringify(userlist))
    } else {
        var userlist = JSON.parse(localStorage.getItem('userlist'))
    }

    //Get user from sessionStorage if someone is already connected, or create it and store it in sessionStorage
    //This is in case the user doesn't check "stay connected"
    if (!sessionStorage.getItem('user')) {
        var user = {}
        sessionStorage.setItem('user', JSON.stringify(user))
    } else {
        var user = JSON.parse(sessionStorage.getItem('user'))
    }

    //Same as above, but is in case the user check "stay connected"
    if (!localStorage.getItem('user') || JSON.parse(localStorage.getItem('user') == 'undefined')) {
        var user = {}
        localStorage.setItem('user', JSON.stringify(user))
    } else {
        var user = JSON.parse(localStorage.getItem('user'))
    }

    if (!localStorage.getItem('playlists')) {
        var playlists = []
        localStorage.setItem('playlists', JSON.stringify(playlists))
    } else {
        var playlists = JSON.parse(localStorage.getItem('playlists'))
    }

    $('footer > *').toggleClass('delaytransition')
    var musiccurrentlength = 0
    var ischronoon = false
    paused = true

    $('.searchshow').click(() => {
        $('#searchinput').val('')
        if ($('.searchbar').length > 0 && $('.searchwrapper').length > 0) {
            $('.searchbar').toggleClass('heighttoggle')
            $('.searchwrapper').toggleClass('heighttoggle')
            $('#searchinput').focus(inputfocus)
        } else {
            $('main').prepend(searchTEMPLATE)
            $('.searchbar').toggleClass('heighttoggle')
            $('.searchwrapper').toggleClass('heighttoggle')
            $('#searchinput').focus(inputfocus)
        }
        $('.searchwrapper').click(function(e) {
            $('.searchwrapper').unbind('click')
            if (e.target !== this) {
                return
            } else {
                $('.searchbar').toggleClass('heighttoggle')
                $('.searchwrapper').toggleClass('heighttoggle')
            }
        })
    })
    
    function inputfocus() {
        $.ajax({
            url: "https://raw.githubusercontent.com/NemesisMKII/CCP-1/master/data/jsonMusique.json",
            method: "GET",
            dataType: "json",

            error: () => {
                alert('Le chargement de la liste des musiques a échoué.')
            },

            success: function(data) {
                var songlist = data.songs
                $('#searchinput').keyup(() => {
                    searchresults($('#searchinput').val().toLowerCase(), songlist)
                    $('#searchresult li').unbind('click')
                    $('#searchresult li').click(setmusic)
                })
                
            },
        })
    }

    $('.drawcontainer ul li').click(function() {
        $('main').empty()
        $('aside').toggleClass('hide')
        if ($(this).attr('id') != 'connect') {
            if (jQuery.isEmptyObject(user)) {
                alert('Connectez-vous pour utiliser cette fonctionnalité')
            } else {
                switch($(this).attr('id')) {
                    case 'home':
                        $('main').append(`
                        <ul id="songlist"></ul>
                        `)
                        $.ajax({
                            url: "https://raw.githubusercontent.com/NemesisMKII/CCP-1/master/data/jsonMusique.json",
                            method: "GET",
                            dataType: "json",
                    
                            error: function() {
                                alert('le chargement de la liste des musiques a échoué')
                            },
                    
                            success: function(data) {
                                for (item in data.songs) {
                                    $('#songlist').append(`
                                    <li id="${data.songs[item].id}">
                                        <div class="d-flex align-items-center">
                                            <img src="${data.songs[item].image}" class="musicimg" alt="" />
                                            <div class="music-info">
                                                <p>${data.songs[item].name}</p>
                                                <p>|</p>
                                                <p>${data.songs[item].artist}</p>
                                            </div>
                                            <i class="far fa-headphones ms-auto"></i>
                                            <i class="far fa-heart"></i>
                                        </div>
                                    </li>
                                    `)
                                }
                                checkheartfavorite()
                                $('#songlist li').click(setmusic)
                                $('#songlist i.fa-heart').click(heartfavorite)
                                $('#songlist i.fa-headphones').click(addtoplaylist)
                            }
                        })
                        break
                    case 'connect':
                        $('main').append(logregTEMPLATE)
                        $('#inscription').toggle()
                        $('.switch').click(logregswitch)
                        $('#btnInscription').click(register)
                        $('#btnConnexion').click(login)
                        break
                    case 'disconnect':
                        localStorage.removeItem('user')
                        location.reload()
                        break
                    case 'playlists':
                        playlistpage()
                        break
                    case 'favorites':
                        $('main').append(`
                        <ul id="songlist"></ul>
                        `)
                        $.get('https://raw.githubusercontent.com/NemesisMKII/CCP-1/master/data/jsonMusique.json', function(data) {
                            var datasongs = JSON.parse(data).songs
                            for (songs in user.favorites) {
                                for (item in datasongs) {
                                    if (user.favorites[songs] == datasongs[item].id) {
                                        $('#songlist').append(`
                                        <li id="${datasongs[item].id}">
                                            <div class="d-flex align-items-center">
                                                <img src="${datasongs[item].image}" class="musicimg" alt="" />
                                                <div class="music-info">
                                                    <p>${datasongs[item].name}</p>
                                                    <p>|</p>
                                                    <p>${datasongs[item].artist}</p>
                                                </div>
                                                <i class="far fa-headphones ms-auto"></i>
                                                <i class="far fa-heart"></i>
                                            </div>
                                        </li>
                                        `)
                                    }
                                }
                            }
                            $('#songlist i.fa-heart').click(heartfavorite)
                            checkheartfavorite()
                            $('#songlist i.fa-headphones').click(addtoplaylist)
                        })
                        break
                    default:
                        break
                }
            }
        } else {
            $('main').append(logregTEMPLATE)
            $('#inscription').toggle()
            $('.switch').click(logregswitch)
            $('#btnInscription').click(register)
            $('#btnConnexion').click(login)
        }
        
        
    })


    function playlistpage() {
        $.ajax({
            url: "https://raw.githubusercontent.com/NemesisMKII/CCP-1/master/data/jsonMusique.json",
            method: "GET",
            dataType: "json",

            error: () => {
                alert('Erreur lors du chargement des musiques.')
            },

            success: function(data) {
                $('main').append(playlistsTEMPLATE)
                if (playlists.length > 0) {
                    for (items in playlists) {
                        currentplaylist = playlists[items]
                        playlist_img = 'https://millennialdiyer.com/wp1/wp-content/uploads/2018/11/Tips-Tricks-for-Assigning-Album-Cover-Art-to-your-Music-Library-Default-Image.jpg'
                        for (songs in data.songs) {
                            if (data.songs[songs].id == currentplaylist.songs [0]) {
                                playlist_img = data.songs[songs].image
                            }
                        }
                        $('.playlistscontainer').append(`
                            <div class="playlistObject ms-3" data-id="${currentplaylist.playlist_ID}">
                                <img src='${playlist_img}' alt=""/>
                                <p class="text-center">${currentplaylist.playlist_name}</p>
                            </div>
                        `)
                    }
                }
                $('#addplaylistBtn').click(() => {
                    $('#addplaylistModal').modal('show')
                })
                $('.playlistObject').click(showplaylist)
            }
        })
        
    }

    function showplaylist() {
        var currentplaylistID = $(this).data('id')
        for (playlist in playlists) {
            if (currentplaylistID == playlists[playlist].playlist_ID) {
                var currentplaylist = playlists[playlist]
            }
        }
        $('main').fadeOut()
        $.ajax({
            url: "https://raw.githubusercontent.com/NemesisMKII/CCP-1/master/data/jsonMusique.json",
            method: "GET",
            dataType: "json",

            error: () => {
                alert('Erreur lors du chargement des musiques.')
            },

            success: function(data) {
                var songlist = data.songs
                setTimeout(() => {
                    $('main').empty()
                    $('main').append(showplaylistTEMPLATE)
                    $('#playlistinfocontainer h1').html(currentplaylist.playlist_name)
                    if (currentplaylist.songs.length == 0) {
                        $('#playlistimg').attr('src', 'https://millennialdiyer.com/wp1/wp-content/uploads/2018/11/Tips-Tricks-for-Assigning-Album-Cover-Art-to-your-Music-Library-Default-Image.jpg')
                    } else {
                        for (songs in songlist) {
                            if (currentplaylist.songs[0] == songlist[songs].id) {
                                $('#playlistimg').attr('src', songlist[songs].image)
                            }
                        }
                    }
                    if (currentplaylist.songs.length == 0) {
                        $('#playlistinfocontainer').after(`
                        <h1 class="mt-5 text-center">Cette playlist est vide.</h1>
                        `)
                    } else {
                        for (songID in currentplaylist.songs) {
                            var currentsongID = currentplaylist.songs[songID]
                            for(item in songlist) {
                                var datasong = songlist[item]
                                if (currentsongID == datasong.id) {
                                    $('#songlist').append(`
                                    <li id="${data.songs[item].id}">
                                        <div class="d-flex align-items-center">
                                            <img src="${data.songs[item].image}" class="musicimg" alt="" />
                                            <div class="music-info">
                                                <p>${data.songs[item].name}</p>
                                                <p>|</p>
                                                <p>${data.songs[item].artist}</p>
                                            </div>
                                            <i class="far fa-headphones ms-auto"></i>
                                            <i class="far fa-heart"></i>
                                        </div>
                                    </li>
                                    `)
                                }
                            }
                        }
                        $('#songlist li').click(setmusic)
                        $('i.fa-arrow-left').click(() => {
                            $('main').empty()
                            playlistpage()
                        })
                        checkheartfavorite()
                        $('#songlist i.fa-heart').click(heartfavorite)
                    }
                }, 400)
                setTimeout($('main').fadeIn(), 1000)
                }
        })
        
    }

    $('.menudrawer').click(() => {
        $('aside').toggleClass('hide')
    })

    $('aside').click(function(e) {
        if (e.target !== this) {
            return
        } else {
            $('aside').toggleClass('hide')
        } 
    })

    $('.soundprogress').on('input',function() {
        $('#music')[0].volume = $(this).val() / 100
        var volume = $(this).val()
        if (volume >= 75) {
            $('i.fa').attr('class', 'text-white fa fa-volume-up')
        } else if(volume <= 74 && volume >= 26) {
            $('i.fa').attr('class', 'text-white fa fa-volume')
        } else if (volume <= 25 && volume > 1) {
            $('i.fa').attr('class', 'text-white fa fa-volume-down')
        } else {
            $('i.fa').attr('class', 'text-white fa fa-volume-mute')
        }
    })

    $('.progress').click(function(event) {
        var posX = event.pageX - $(this).offset().left
        $(this).children(1).css({
            width: ((posX / $(this).css('width').split('px')[0])*100) + "%"
        })
        $('#music')[0].currentTime = $('#music')[0].duration * (posX / $(this).css('width').split('px')[0])
    })

    $('.muteBtn').click(() => {
        alert('click')
    })

    $('.play').click(() => {
        if (jQuery.isEmptyObject(user)) {
            alert('Connectez-vous pour utiliser cette fonctionnalité')
        } else {
            play(paused)
        }
    })

    $('.forwards').click(() => {
        if (jQuery.isEmptyObject(user)) {
            alert('Connectez-vous pour utiliser cette fonctionnalité')
        } else {
            changetrack(1)
        }
    })

    $('.backwards').click(() => {
        if (jQuery.isEmptyObject(user)) {
            alert('Connectez-vous pour utiliser cette fonctionnalité')
        } else {
            changetrack(-1)
        }
    })

    $('.musicfull i.fa-headphones').click(addtoplaylist)

    function addtoplaylist() {
        if (navigator.userAgent.match(/ipad|android|phone|ios|iphone/gi)) {
            var music = $('#music').data('id')
        } else {
            var music = $($(this).parent().parent()[0]).attr('id')
        }
        if (jQuery.isEmptyObject(user)) {
            alert('Connectez-vous pour utiliser cette fonctionnalité')
        } else {
            $('#addtoplaylistModal').modal('show')
            $('#addtoplaylistModal .modal-body').empty()
            for (item in playlists) {
                var playlist = playlists[item]
                $('#addtoplaylistModal .modal-body').append(`
                <div class="d-flex justify-content-between" data-id="${playlist.playlist_ID}">
                    <p>${playlists[item].playlist_name}</p>
                    <button class="btn btn-success">Ajouter</button>
                </div>
                `)
                for (songs in playlist.songs) {
                    console.log(playlist.songs[songs]);
                    if (music == playlist.songs[songs]) {
                        $(`#addtoplaylistModal div[data-id="${playlist.playlist_ID}"] button`).html('Ajoutée !')
                    }
                }
            }
            $('#addtoplaylistModal .modal-body button').click(function() {
                var alreadyadded = false
                var id = $(this).parent().data('id')
                
                
                for (item in playlists) {
                    if (id == playlists[item].playlist_ID) {
                        var playlist = playlists[item]
                        if (playlist.songs.length > 0) {
                            for (song in playlist.songs) {
                                if (music == playlist.songs[song]) {
                                    alreadyadded = true
                                    playlist.songs.splice(song, 1)
                                    localStorage.setItem('playlists',JSON.stringify(playlists))
                                    $(`#addtoplaylistModal div[data-id="${playlist.playlist_ID}"] button`).html('Ajouter')
                                }
                            }
                            if (alreadyadded == false) {
                                playlist.songs.push(music)
                                localStorage.setItem('playlists',JSON.stringify(playlists))
                                $(`#addtoplaylistModal div[data-id="${playlist.playlist_ID}"] button`).html('Ajoutée !')
                            }
                        } else {
                            playlist.songs.push(music)
                            localStorage.setItem('playlists',JSON.stringify(playlists))
                            $(`#addtoplaylistModal div[data-id="${playlist.playlist_ID}"] button`).html('Ajoutée !')
                        }
                    }
                }
            })
            $('.quit').click(() => {
                $('#addtoplaylistModal').modal('hide')
            })
        }
    }

    function checkheartfavorite() {
        for (var song = 0; song < $($('#songlist').children()).length; song++) {
            var currentsong = $($('#songlist').children()[song])
            var heartitem = $(currentsong.children().children('i.fa-heart')[0])
            for (item in user.favorites) {
                if (user.favorites[item] == currentsong.attr('id')) {
                    heartitem.removeClass('far')
                    heartitem.addClass('fas')
                }
            }
        }
    }

    function heartfavorite() {
        var isliked = false
        var songID = $($(this).parent().parent()[0]).attr('id')
        ($(this).hasClass('far') ? $(this).toggleClass('far') && $(this).toggleClass('fas') : $(this).toggleClass('far') && $(this).toggleClass('fas'))
        if ($(this).hasClass('far')) {
            $(this).toggleClass('far')
            $(this).toggleClass('fas')
        } else {
            $(this).toggleClass('far')
            $(this).toggleClass('fas')
        }
        if (user.favorites.length == 0) {
            user.favorites.push(songID)
        } else {
            for (songs in user.favorites) {
                if (songID == user.favorites[songs]) {
                    isliked = true
                    user.favorites.splice(songs, 1)
                }
            }
            if (!isliked) {
                user.favorites.push(songID)
            }
        }
        console.log(user.favorites)
        localStorage.setItem('user', JSON.stringify(user))
    }

    $('.footerwrapper footer').click(function(e) {
        if (e.target !== this) {
            return
        } else {
            $('footer > *').toggleClass('delaytransition')
            $('.musicfull').toggleClass('delaytransition')
            $('footer > *').toggleClass('footerhide')
            $('.musicfull').toggleClass('musicfullhide')
        }
    })

    function searchresults(searchitem, datasongs) {
        //Function used in Ajax Request
        $('#searchresult').empty()
        var searchresponselist = []
        var searchregex = "(?:"
        for (letters in searchitem) {
            switch(searchitem[letters]) {
                case '(':
                    searchregex += '\\('
                    break
                case ')':
                    searchregex += '\\)'
                    break
                default:
                    searchregex += searchitem[letters]
            }
        }
        searchregex += "\)"
        searchmusic = new RegExp(searchregex)
        for (item in datasongs) {
            if (searchitem != "") {
                if (datasongs[item].name.toLowerCase().match(searchmusic) || datasongs[item].artist.toLowerCase().match(searchmusic)) {
                    searchresponselist.push(datasongs[item])
                }
            }
        }
        for (item in searchresponselist) {
            currentsongitem = searchresponselist[item]
            $('#searchresult').append(`
            <li id="${currentsongitem.id}">
            <img src='${currentsongitem.image}' alt=''/>
            <div>
                <p>${currentsongitem.name}</p>
                <p>${currentsongitem.artist}</p>
            </div>
            </li>
            `)
        }
        
    }

    function play(pause) {
        if (ischronoon) {
            clearInterval(chrono)
        }
        if (pause == true) {
            chrono = setInterval(() => {
                musiccurrentlength = $('#music')[0].currentTime
                $('.currentlength').empty()
                $('.currentlength').append(getmusiclength(musiccurrentlength))
                $('.progress div').css({
                    width: (musiccurrentlength / Math.round($('#music')[0].duration)*100) + "%"
                })
                if (musiccurrentlength == $('#music')[0].duration) {
                    setTimeout(() => {changetrack(1)}, 500)
                }
            }, 1000)
            ischronoon = true
            $('.play').removeClass('fa-play')
            $('.play').addClass('fa-pause')
            $('#music')[0].play()
            paused = false
        } else {
            clearInterval(chrono)
            ischronoon = false
            $('.play').removeClass('fa-pause')
            $('.play').addClass('fa-play')
            $('#music')[0].pause()
            paused = true
        }
    }
    
    function setmusic(e) {
        var music = $(this).attr('id')
        if (e.target == $('.fa-heart')[music -1] || e.target == $('.fa-headphones')[music -1]) {
        } else {
            if ($(this).attr('id') != $('#music').attr('data-id')) {
                musiccurrentlength = 0
                var songID = $(this).attr('id')
                $.ajax({
                    url: "https://raw.githubusercontent.com/NemesisMKII/CCP-1/master/data/jsonMusique.json",
                    method: "GET",
                    dataType: "json",
            
                    error: function() {
                        alert('le chargement de la liste des musiques a échoué')
                    },
            
                    success: function(data) {
                        musiccurrentlength = 0
                        for (item in data.songs) {
                            var currentsong = data.songs[item]
                            if (currentsong.id == songID) {
                                $('.musictitle').html(currentsong.name)
                                $('.artistname span').html(currentsong.artist)
                                $('#music').attr('src', currentsong.song)
                                $('#music').attr('data-id', currentsong.id)
                                $('.songimg').attr('src', currentsong.image)
                                $('#music')[0].onloadedmetadata = () => {
                                    var musictotallength = getmusiclength($('#music')[0].duration)
                                    $('.currentlength').empty()
                                    $('.currentlength').append(getmusiclength(musiccurrentlength))
                                    $('.totalength').empty()
                                    $('.totalength').append(musictotallength)
                                    $('.progress div').css({
                                        width: 0
                                    })
                                }
                                paused = true
                                play(paused)
                            }
                        }
                    }
                })
            }
        }
    }

    function changetrack(counter) {
        musiccurrentlength = 0
        var songID = $('#music').data('id')
        $.ajax({
            url: "https://raw.githubusercontent.com/NemesisMKII/CCP-1/master/data/jsonMusique.json",
            method: "GET",
            dataType: "json",

            error: function() {
                alert('Le chargement de la liste des musiques a échoué')
            },

            success: function(data) {
                for (item in data.songs) {
                    var currentsong = data.songs[item]
                    if (currentsong.id == (songID + counter)) {
                        $('#music').attr('src', currentsong.song)
                        $('.musictitle').html(currentsong.name)
                        $('.artistname span').html(currentsong.artist)
                        $('#music').data('id', currentsong.id)
                        $('.songimg').attr('src', currentsong.image)
                        $('#music')[0].onloadedmetadata = () => {
                            var musictotallength = getmusiclength($('#music')[0].duration)
                            $('.totalength').empty()
                            $('.totalength').append(musictotallength)
                            $('.currentlength').empty()
                            $('.currentlength').append(getmusiclength(musiccurrentlength))
                            $('.progress div').css({
                                width: 0
                            })
                        }
                        paused = true
                        play(paused)
                    }
                }
            }


        })
    }

    function getmusiclength(duration, counter = null) {
        var secs = Math.round(duration)
        var mins = parseInt(secs / 60)
        secs = secs % 60
        return mins + ':' + (secs < 10 ? "0" + secs : secs)
    }
    
    function logregswitch() {
        $('#connexion').toggle()
        $('#inscription').toggle()
    }

    function register(e) {
        e.preventDefault()
        if (!$('#usermail').val() || !$('#userpseudo').val() || !$('#usermdp').val()) {
            alert('remplissez les champs')
        } else {
            let mailregex = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g)
            if ($('#usermail').val().match(mailregex)) {
                let passwordregex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\&\#\-\_\+\=\@\{\}\[\]\(\)])[A-Za-z\d\&\#\-\_\+\=\@\{\}\[\]\(\)]{6,}$/gm)
                if ($('#usermdp').val().match(passwordregex)) {
                    user = {
                        pseudo: $('#userpseudo').val(),
                        mail: $('#usermail').val(),
                        first_name: 0,
                        last_name: 0,
                        MDP: $('#usermdp').val(),
                        favorites: [],
                        user_ID: uuidv4()
                    }

                    userlist.push(user)
                    localStorage.setItem('userlist',JSON.stringify(userlist))
                    alert('Bienvenue sur Spotinein !')
                    location.reload(
                    )
                } else {
                    alert('mdp pas ok')
                }
            } else {
                alert("mail pas ok")
            }
        }
    }

    function login(e) {
        e.preventDefault()
        if (!$('#login').val() || !$('#password').val()) {
            alert('Identifiants/mot de passe incorrects.')
        } else {
            for (users in userlist) {
                currentuser = userlist[users]
                if ($('#login').val() == currentuser.pseudo || $('#login').val() == currentuser.mail) {
                    if ($('#password').val() == currentuser.MDP) {
                        alert('Connecté !')
                        user = currentuser
                        localStorage.setItem('user', JSON.stringify(currentuser))
                        if ($('#staytune').is(':checked')) {
                            alert('check !')
                        }
                    } else {
                        alert('Identifiants/mot de passe incorrects')
                    }
                } else {
                    alert('Identifiants/mot de passe incorrects')
                }
            }
        }
    }

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }
})