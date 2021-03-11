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
                content: []
            }

            playlists.push(playlist)
            localStorage.setItem('playlists', JSON.stringify(playlists))
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
    if (!localStorage.getItem('user')) {
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
                            <li id="${data.songs[item].id}">${data.songs[item].name}</li>
                            `)
                        }
                        $('#songlist li').click(setmusic)
                    }
                })
                break
            case 'connect':
                $('main').append(logregTEMPLATE)
                $('#inscription').toggle()
                $('.switch').click(logregswitch)
                $('#btnInscription').click(register)
                $('#btnConnexion').click(login)
            case 'playlists':
                $('main').append(playlistsTEMPLATE)
                if (playlists.length > 0) {
                    for (items in playlists) {
                        currentplaylist = playlists[items]
                        $('.playlistscontainer').append(`
                            <div class="playlistObject ms-3" data-id="${currentplaylist.playlist_ID}">
                                <div></div>
                                <p class="text-center">${currentplaylist.playlist_name}</p>
                            </div>
                        `)
                    }
                }
                $('#addplaylistBtn').click(() => {
                    $('#addplaylistModal').modal('show')
                })
                $('.playlistObject').click(showplaylist)
            default:
                break
        }
    })

    function showplaylist() {
        console.log($(this).data('id'));
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
        $('i.fa').removeClass('fa-volume')
    })

    /* switch($('.soundprogress').val()) {
        case ($('.soundprogress').val() <= 25): 
            $('i.fa').removeClass('fa-volume')
            $('i.fa').addClass('fa-volume-down')
    } */

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
        play(paused)
    })

    $('.forwards').click(() => {
        changetrack(1)
    })

    $('.backwards').click(() => {
        changetrack(-1)
    })

    $('.musicfull i.fa-heart').click(function() {
        if ($(this).hasClass('far')) {
            user.favorites.push($('#music').data('id'))
            localStorage.setItem('user', JSON.stringify(user))
            $(this).removeClass('far')
            $(this).addClass('fas')
            $('.textbox h4').html('Chanson ajoutée aux favoris !')
            $('.textbox').toggleClass('textboxshow')
            setTimeout(() => {
                $('.textbox').toggleClass('textboxshow')
            }, 2500)
        } else {
            $(this).removeClass('fas')
            $(this).addClass('far')
        }
    })

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
    
    function setmusic() {
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
                alert("mail ok")
                let passwordregex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\&\#\-\_\+\=\@\{\}\[\]\(\)])[A-Za-z\d\&\#\-\_\+\=\@\{\}\[\]\(\)]{6,}$/gm)
                if ($('#usermdp').val().match(passwordregex)) {
                    alert('mdp ok')
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