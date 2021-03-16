/* ///////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////TEMPLATES///////////////
//////////////////////////////////////
//////////////////////////////////////
////////////////////////////////////// */

var homeTEMPLATE = `
<div class="pageIntro">
    <h1 class="text-center">Bienvenue sur Spotinein, Mein petit Frolhein !</h1>
    <div id="textdiv">
        <p>Izi tu peux t'adonner à tous tes petits plaisirs ... musicaux !</p>
        <p>Commence donc par t'inscrire mein petit ... et n'oublie pas</p>
        <p>ça restera notre petit secret !</p>
    </div>
</div>
<h1 class="m-3 lastheardtitles">Derniers titres écoutés</h1>
<div class="lastheardcontainer">
    <div class='scrollable'></div>
</div>
`

var logregTEMPLATE = `
<h1 class="text-center">Connexion / Inscription</h1>
<form class="text-center w-50 mx-auto mt-5" id="connexion">
    <header class="w-100 h-50 d-flex flex-column">
        <input type="text" placeholder="mail/pseudo" class="w-100 mt-3" id="login">
        <input type="password" placeholder="password" class="w-100 mt-3" id="password">
        <span class="d-inline-flex mt-3 mx-auto align-items-center"><input type="checkbox" class="mx-2" id="staytune"><p class="m-0">Rester connecté </p></span>
        <button class="btn btn-success d-block mx-auto mt-3" id="btnConnexion">Connexion</button>
        <p class="mt-3">Pas encore inscrit ? <a href="#" class="switch">Cliquez-ici</a></p>
    </header>
</form>
<form class="text-center w-50 mx-auto mt-5" id="inscription">
    <header class="w-100 h-50 d-flex flex-column">
        <input type="text" placeholder="mail" class="w-100 mt-3" id="usermail">
        <input type="text" placeholder="pseudo" class="w-100 mt-3" id="userpseudo">
        <input type="password" placeholder="mdp" class="w-100 mt-3" id="usermdp">
        <p>Le mot de passe doit contenir 6 caractères min ainsi qu'un de ces caractères suivants:  &#{([-_@)]=+} </p>
        <input type="text" placeholder="Entrez l'URL de l'image..." class="w-100 mt-3" id="userimg">
        <p>...Ou choisissez parmi les images ci-dessous: </p>
        <div class="imgcontainer">
            <div class='imglist'>
                <img src="./data/profil images/spotinein.png" />
                <img src="./data/profil images/1.png" />
                <img src="./data/profil images/2.png" />
                <img src="./data/profil images/3.png" />
                <img src="./data/profil images/4.png" />
                <img src="./data/profil images/5.png" />
                <img src="./data/profil images/6.png" />
                <img src="./data/profil images/7.png" />
                <img src="./data/profil images/8.png" />
                <img src="./data/profil images/9.png" />
                <img src="./data/profil images/10.png" />
                <img src="./data/profil images/11.png" />
            </div>
        </div>
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
<div id="songinfobar">
    <p class="listsongname">Nom</p>
    <p>Artiste</p>
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
    <img src="" alt='error' id="userimage" />
    <p id="username"></p>
</div>
<div class="searchwrapper">
    <div id="searchdiv">
        <ul id="searchresult">
        </ul>
    </div>
</div>
`

$(document).ready(() => {
    //Click on logo makes your way back to home.
    $('#spotinein').click(() => {
        location.reload()
    })
    
    //This was used to fix viewport shrinking on android whenever the keyboard shows up
    //Also kind of break viewport when the url bar hides unfortunately, haven't found any fix
    let viewheight = $(window).height();
    let viewwidth = $(window).width();
    let viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute("content", "height=" + viewheight + "px, width=" + viewwidth + "px, initial-scale=1.0");
    
    $('body').hide()

    $('.confirm').click(() => {
        if ($('#playlistname').val() == "") {
            alert('Vide !')
        } else {
            var existing = false
            for (item in playlists) {
                if ($('#playlistname').val() == playlists[item].playlist_name) {
                    existing = true
                }
            }
            if (existing == false) {
                playlist = {
                    playlist_name: $('#playlistname').val(),
                    user_ID: user.user_ID,
                    playlist_ID: uuidv4(),
                    songs: []
                }
    
                playlists.push(playlist)
                localStorage.setItem('playlists', JSON.stringify(playlists))
                $('#addplaylistModal').modal('hide')
            } else {
                alert('Une playlist portant ce nom existe déjà !')
            }
            
        }

    })

    $('.pageIntro').after(playlistpage())
    setTimeout(() => {
        $('#addplaylistBtn').hide()
        appendlastheards()
    },100);

    // Get the user list if there is any, or create it and store it in localstorage
    if (!localStorage.getItem('userlist')) {
        var userlist = []
        localStorage.setItem('userlist', JSON.stringify(userlist))
    } else {
        var userlist = JSON.parse(localStorage.getItem('userlist'))
    }

    //Get user from sessionStorage if someone is already connected, or create it and store it in sessionStorage
    //This is in case the user doesn't check "stay connected"
    //OBSOLETE
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

    if (!localStorage.getItem('lastheards')) {
        var lastheards = []
        localStorage.setItem('lastheards', JSON.stringify(lastheards))
    } else {
        var lastheards = JSON.parse(localStorage.getItem('lastheards'))
    }
    
    /*
    Checks the localStorage for 'user':
        If empty: 
            That means there is no user connected
        else:
            That means there is an user connected
    */  
    if (jQuery.isEmptyObject(user)) {
        $('#disconnect').hide()
    } else {
        $('#connect').hide()
    }

    //Detects if user is on a device  other than pc, and if so, applies mobile css on it
    if (navigator.userAgent.match(/ipad|android|phone|ios|iphone/gi)) { //MOBILE ONLY
        $('#css').after(`
        <!-- CSS style for mobile -->
        <link rel="stylesheet" type="text/css" href="./style/smartphone.css" />
        `)
        //Add user's username and profile picture
        $('#menupdppicture').attr('src', user.user_image)
        $('.username').html(user.pseudo)
        $('body').show()
    } else { // PC ONLY
        $('body').show()
        //Adds searchbar to pc and add connected user's username and profile picture
        $('.headerwrapper').append(pcsearchTEMPLATE)
        $('#username').html(user.pseudo)
        $('#userimage').attr('src', user.user_image)
        $('#searchinput').focus(inputfocus)

        /* 
        Look below the window.resize function for explanation.
        Needed here to make things responsive 'out of the ebox'
        */
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
            /* 
            Resizes main width, header width to make them responsive with <aside> width
            resizes sound progressbar height to make it responsive with footer height

            Applies whenever the user resizes the window
            */
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

    $('footer > *').toggleClass('delaytransition') // To add some smoothiness to footer to full transition in MOBILE
    var musiccurrentlength = 0
    var ischronoon = false
    paused = true

    $('.searchshow').click(() => {
        /* 
        FOR MOBILE

        Initiates search function.
        Show/Hide ther searchbar
        */
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
    
    

    $('.drawcontainer ul li').click(function() {
        /* 
        CORE OF THE NAV

        Manipulates DOM to show what is need according to navbar items ID (home, musics, etc)
        Calls whatever function is needed here
        Uses Ajax to make the musics section great again
        */
        $('main').empty()
        $('aside').toggleClass('hide')
        if ($(this).attr('id') != 'connect') {
            if (jQuery.isEmptyObject(user)) {
                alert('Connectez-vous pour utiliser cette fonctionnalité')
            } else {
                switch($(this).attr('id')) {
                    case 'home':
                        $('main').append(homeTEMPLATE)
                        $('.pageIntro').after(playlistpage())
                        setTimeout(() => {
                            $('#addplaylistBtn').hide()
                            appendlastheards()
                        },100);
                        break
                    case 'musics':
                        $('main').append(`
                        <div class="pageIntro"></div>
                        <div id="songinfobar">
                            <p class="listsongname">Nom</p>
                            <p>Artiste</p>
                        </div>
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
                                                <p class="listsongname">${data.songs[item].name}</p>
                                                ${navigator.userAgent.match(/ipad|android|phone|ios|iphone/gi) ? '' : '<p>|</p>'}
                                                <p>${data.songs[item].artist}</p>
                                            </div>
                                            <i class="far fa-headphones ms-auto" data-id="${data.songs[item].id}"></i>
                                            <i class="far fa-heart" data-id="${data.songs[item].id}"></i>
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
                        for (users in userlist) {
                            if (user.user_ID == userlist[users].user_ID) {
                                userlist[users] = user
                                localStorage.setItem('userlist', JSON.stringify(userlist))
                            }
                        }
                        localStorage.removeItem('user')
                        location.reload()
                        break
                    case 'playlists':
                        playlistpage()
                        break
                    case 'favorites':
                        $('main').append(`
                        <div class="pageIntro"></div>
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
                                                    <p class="listsongname">${datasongs[item].name}</p>
                                                    ${navigator.userAgent.match(/ipad|android|phone|ios|iphone/gi) ? '' : '<p>|</p>'}
                                                    <p>${datasongs[item].artist}</p>
                                                </div>
                                                <i class="far fa-headphones ms-auto" data-id="${datasongs[item].id}"></i>
                                                <i class="far fa-heart" data-id="${datasongs[item].id}"></i>
                                            </div>
                                        </li>
                                        `)
                                    }
                                }
                            }
                            $('#songlist i.fa-heart').click(heartfavorite)
                            checkheartfavorite()
                            $('#songlist i.fa-headphones').click(addtoplaylist)
                            $('#songlist li').click(setmusic)
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
            $('.imglist img').click(function() {
                $('#userimg').val($(this).attr('src'))
            })
        }
    })


    $('.menudrawer').click(() => {
        /* 
        FOR MOBILE

        Shows aside navbar
        */
        $('aside').toggleClass('hide')
    })

    $('aside').click(function(e) {
        /* 
        FOR MOBILE

        Used to hide the aside navbar when clicked outside.
        */
        if (e.target !== this) {
            return
        } else {
            $('aside').toggleClass('hide')
        } 
    })

    $('.soundprogress').on('input',function() {
        /* 
        Progressbar for sound
        little sound icon changes when sound value >= 75, <= 74 & >=26, <= 25 & > 1, and finally when value is 0
        */
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
        /* 
        Gets the pos of the mouse inside the music length bar div,
        Magic maths to set music time AND progressbar value to jump at certains points of the music.
        */
        var posX = event.pageX - $(this).offset().left
        $(this).children(1).css({
            width: ((posX / $(this).css('width').split('px')[0])*100) + "%"
        })
        $('#music')[0].currentTime = $('#music')[0].duration * (posX / $(this).css('width').split('px')[0])
    })

    $('.play').click(() => {
        // call play(pause)
        if (jQuery.isEmptyObject(user)) {
            alert('Connectez-vous pour utiliser cette fonctionnalité')
        } else {
            play(paused)
        }
    })

    $('.forwards').click(() => {
        // call changetrack(counter)
        if (jQuery.isEmptyObject(user)) {
            alert('Connectez-vous pour utiliser cette fonctionnalité')
        } else {
            changetrack(1)
        }
    })

    $('.backwards').click(() => {
        // call changetrack(counter)
        if (jQuery.isEmptyObject(user)) {
            alert('Connectez-vous pour utiliser cette fonctionnalité')
        } else {
            changetrack(-1)
        }
    })

    $('.musicfull i.fa-headphones').click(addtoplaylist)

    $('.footerwrapper footer').click(function(e) {
        /* 
        Shows the fullscreen audio player (only in mobile)
        */
        if (e.target !== this && !$(e.target).hasClass('fa-chevron-up')) {
            return
        } else {
            $('footer > *').toggleClass('delaytransition')
            $('.musicfull').toggleClass('delaytransition')
            $('footer > *').toggleClass('footerhide')
            $('.musicfull').toggleClass('musicfullhide')
        }
    })

    /* ////////////////////////////////////////
    ///////////////////////////////////////////
    ///////////////////////////////////////////
    ////////////// FUNCTIONS //////////////////
    ///////////////////////////////////////////
    ///////////////////////////////////////////
    /////////////////////////////////////////// */

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

    function setlastheards(musicID) {
        //Whenever a music is played, add this music to an array saved in localstorage
        //This function is used to show the user the last songs he played.
        //The array is limited to 4 due to actual placement and css used,
        //But it can be changed to whatever number, the array will work, but my css is obsolete and cannot run these well
        var same = false
        for (item in lastheards) {
            if (lastheards[item] == musicID) {
                same = true
            }
        }
        if (same == false) {
            if (lastheards.length >= 4) {
                lastheards.splice(0, 1)
                lastheards.push(musicID)
            } else {
                lastheards.push(musicID)
            }
        }
        localStorage.setItem('lastheards', JSON.stringify(lastheards))
    }

    function appendlastheards() {
        //This function is used to append main thanks to Ajax request and a for iteration.
        //For each id stored in lastheards array in localstorage, it scans the JSON and append main with corresponding songs
        $.ajax({
            url: "https://raw.githubusercontent.com/NemesisMKII/CCP-1/master/data/jsonMusique.json",
            method: "GET",
            dataType: "json",

            error: () => {
                alert('Erreur lors du chargement des musiques.')
            },

            success: function(data) {
                var songs = data.songs
                for(song in lastheards) {
                    for (songitem in songs) {
                        if (songs[songitem].id == lastheards[song]) {
                            $('.scrollable').prepend(`
                            <div class="lastheardObject ms-3" id="${songs[songitem].id}">
                                <img src="${songs[songitem].image}" />
                                <p>${songs[songitem].name}</p>
                            </div>
                            `)
                        }
                    }
                }
                $('.lastheardObject').click(setmusic)
            }
        })
    }

    function playlistpage() {
        /*
        This function is used to show playlist page,
        for each playlist in the locastorage it appends it in the main
        If there's no song in the playlist (no songs by default on creation)
        Then a default album cover is used.
        If there's songs in the playlist, then the playlist cover will be the photo of the first song. 
        */
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
        /*
        function used to show the songs inside of a playlist,
        Uses Ajax request to scan and get the corresponding songs using their ID
        If a song ID matches the ID in a playlist, the song is added along other songs
        in the list. 
        */
        if (jQuery.isEmptyObject(user)) {
            alert('Connectez-vous pour utiliser cette fonctionnalité')
        } else {
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
                                                    <p class="listsongname">${data.songs[item].name}</p>
                                                    ${navigator.userAgent.match(/ipad|android|phone|ios|iphone/gi) ? '' : '<p>|</p>'}
                                                    <p>${data.songs[item].artist}</p>
                                                </div>
                                                <i class="far fa-headphones ms-auto" data-id="${data.songs[item].id}"></i>
                                                <i class="far fa-heart" data-id="${data.songs[item].id}"></i>
                                            </div>
                                        </li>
                                        `)
                                    }
                                }
                            }
                            $('#songlist li').click(setmusic)
                            
                            checkheartfavorite()
                            $('#songlist i.fa-heart').click(heartfavorite)
                        }
                        $('i.fa-arrow-left').click(() => {
                            $('main').empty()
                            playlistpage()
                        })
                    }, 400)
                    setTimeout($('main').fadeIn(), 1000)
                    }
            })
        }
    }

    
    function addtoplaylist() {
        /*  
        Opens a modal to add a song to a playlist.
        Scans the playlists to see if the chosen song is already in there or not.
        If it is, the text "ajouter" will be changed to "ajoutée !" and on click, it removes the
        song from the playlist selected.
        */
        var music = $($(this).parent().parent()[0]).attr('id')
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
        /*
        Scans the song list to see if there is any song already liked.
        If a song has already been liked before, then it changes the class 
        of the 'fa-heart' element 
        */
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
        /* 
        on click on a heart, check if weither or not the song has been liked by the user.
        If not, pushes the song ID into the user.favorites
        If yes, removes the song ID from the user.favorites
        */
        var isliked = false
        var songID = $($(this).parent().parent()[0]).attr('id')
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
        localStorage.setItem('user', JSON.stringify(user))
    }

    function searchresults(searchitem, datasongs) {
        /*
        Function used in Ajax Request
        Function used in search bar focus:
            Each time the value changes, it calls this function to dynamically
            show results.

        Uses Mother Fuckin' Regex:
            For each letter typed, a new regex is created, containing:
                (?: $('#searchinput).val() )
                targets group of letters, wherever they are in a string.

        Would have been easy if I hadn't searched a day long for a damn regex that finally is only 4 characters long.
        */
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
        /* 
        Well, it is what it is.

        Play, pause the music,
        When played, an interval is set each second:
            gets the currenttime of the music
            uses MATHS to calculate the width of the progressbar corresponding to music
            modifies progressbar CSS
            not the smoothest, but that's ok
        */
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
        /*
        Guess what it is used for

        Uses Ajax to get the music supposed to play thanks to the music ID injected in $('#songlist)
        Simple.

        */
        var music = $(this).attr('id')
        if (jQuery.isEmptyObject(user)) {
            alert('Connectez-vous pour utiliser cette fonctionnalité')
        } else {
            if ($(e.target).data('id') == $(this).attr('id')) {
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
                                        setlastheards(music)
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
    }

    function changetrack(counter) {
        /* 
        Changes tracks.

        Well, what to you expect me to say ?

        Uses a counter set up in the $('#backwards') (-1) and $('#forwards') (+1)
        Besides that, works the same as setmusic()
        (was supposed to look for a solution needing less lines, but, hey, at least it works)
        */
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
                            setlastheards(currentsong.id)
                        }
                        paused = true
                        play(paused)
                    }
                }
            }


        })
    }

    function getmusiclength(duration, counter = null) {
        /* 
        Uses duration parameter that can be current length as well as total length.
        Uses magic to return it as 00:00 (min : sec)
        */
        var secs = Math.round(duration)
        var mins = parseInt(secs / 60)
        secs = secs % 60
        return mins + ':' + (secs < 10 ? "0" + secs : secs)
    }
    
    function logregswitch() {
        // Nintendo 
        $('#connexion').toggle()
        $('#inscription').toggle()
    }

    function register(e) {
        /* 
        Function uses to add an user to the "database"
        checks val()'s, if any's empty return an error
        else, use regex to ensure that password and mail is writed correctly 
        */
        e.preventDefault()
        if (!$('#usermail').val() || !$('#userpseudo').val() || !$('#usermdp').val() || !$('#userimg').val()) {
            alert('remplissez les champs')
        } else {
            let mailregex = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g)
            if ($('#usermail').val().match(mailregex)) {
                let passwordregex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\&\#\-\_\+\=\@\{\}\[\]\(\)])[A-Za-z\d\&\#\-\_\+\=\@\{\}\[\]\(\)]{6,}$/gm)
                if ($('#usermdp').val().match(passwordregex)) {
                    user = {
                        pseudo: $('#userpseudo').val(),
                        mail: $('#usermail').val(),
                        MDP: $('#usermdp').val(),
                        favorites: [],
                        user_ID: uuidv4(),
                        user_image: $('#userimg').val()
                    }
                    userlist.push(user)
                    localStorage.setItem('userlist',JSON.stringify(userlist))
                    alert('Bienvenue sur Spotinein !')
                    location.reload(
                    )
                } else {
                    alert('Le mot de passe ne respecte pas les conditions demandées !')
                }
            } else {
                alert("L'adresse mail ne respecte pas les onditions demandées !")
            }
        }
    }

    function login(e) {
        /* 
        Function that pushes an user to the localstorage
        Was supposed to work with sessionstorage, explains the presence of that useless checkbox
        Lack of time, and more important things to work on this project.
        */
        connected = false
        e.preventDefault()
        if (!$('#login').val() || !$('#password').val()) {
            alert('Identifiants/mot de passe incorrects.')
        } else {
            for (users in userlist) {
                currentuser = userlist[users]
                if ($('#login').val() == currentuser.pseudo || $('#login').val() == currentuser.mail) {
                    if ($('#password').val() == currentuser.MDP) {
                        connected = true
                        break
                    }
                }
            }
        }
        if (connected == true) {
            localStorage.setItem('user', JSON.stringify(currentuser))
            if ($('#staytune').is(':checked')) {
            }
            location.reload()
        } else {
            alert('Identifiants/mot de passe incorrects.')
        }
    }

    function uuidv4() {
        /* 
        Returns an ID
        */
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }
})