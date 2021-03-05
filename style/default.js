$(document).ready(() => {
    paused = true
    $('body').hide()

    if (navigator.userAgent.match(/ipad|android|phone|ios|iphone/gi)) {
        $('#css').after(`
        <!-- CSS style for mobile -->
        <link rel="stylesheet" type="text/css" href="./style/smartphone.css" />
        `)
        $('body').show()
    }

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

    if (!localStorage.getItem('userlist')) {
        var userlist = []
        localStorage.setItem('userlist', JSON.stringify(userlist))
    } else {
        var userlist = JSON.parse(localStorage.getItem('userlist'))
    }

    $('#btnInscription').click(register)

    $('#btnConnexion').click(login)

    $('.muteBtn').click(() => {
        alert('click')
    })

    $('.play').click(() => {
        play(paused)
    })

    $('.forwards').click(changetrack)
    $('.backwards').click(changetrack)

    $('.upchevron').click(() => {
        ($('footer > *').hasClass('delaytransition') ? $('footer > *').toggleClass('delaytransition') : "")
        $('.musicfull').toggleClass('delaytransition')
        $('.upchevron').fadeOut()
        $('.downchevron').fadeIn()
        $('footer > *').toggleClass('footerhide')
        $('.musicfull').toggleClass('musicfullhide')
    })

    $('.downchevron').click(() => {
        ($('.musicfull').hasClass('delaytransition') ? $('.musicfull').toggleClass('delaytransition') : "")
        $('footer > *').toggleClass('delaytransition')
        $('.downchevron').fadeOut()
        $('.upchevron').fadeIn()
        $('footer > *').toggleClass('footerhide')
        $('.musicfull').toggleClass('musicfullhide')
    })

    function play(pause) {
        if (pause == true) {
            $('.play').removeClass('fa-play')
            $('.play').addClass('fa-pause')
            $('#music')[0].play()
            paused = false
        } else {
            $('.play').removeClass('fa-pause')
            $('.play').addClass('fa-play')
            $('#music')[0].pause()
            paused = true
        }
    }
    
    function setmusic() {
        var songID = $(this).attr('id')
        $.ajax({
            url: "https://raw.githubusercontent.com/NemesisMKII/CCP-1/master/data/jsonMusique.json",
            method: "GET",
            dataType: "json",
    
            error: function() {
                alert('le chargement de la liste des musiques a échoué')
            },
    
            success: function(data) {
                for (item in data.songs) {
                    var currentsong = data.songs[item]
                    if (currentsong.id == songID) {
                        $('.musictitle').html(currentsong.name)
                        $('.artistname span').html(currentsong.artist)
                        $('#music').attr('src', currentsong.song)
                        $('#music').attr('data-id', currentsong.id)
                        $('#songimg').attr('src', currentsong.image)
                        paused = true
                        play(paused)
                    }
                }
            }
        })
    }

    function changetrack() {
        var songID = $('#music').data('id')
        var btnValue  = $(this).data('value')
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
                    if (currentsong.id == (songID + btnValue)) {
                        $('.musictitle').html(currentsong.name)
                        $('.artistname span').html(currentsong.artist)
                        $('#music').attr('src', currentsong.song)
                        $('#music').data('id', currentsong.id)
                        $('#songimg').attr('src', currentsong.image)
                        paused = true
                        play(paused)
                    }
                }
            }


        })
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
                        user_ID: 0
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
                user = userlist[users]
                if ($('#login').val() == user.pseudo || $('#login').val() == user.mail) {
                    if ($('#password').val() == user.MDP) {
                        alert('Connecté !')
                        if ($('#staytune').is(':checked')) {
                            alert('check !')
                        }
                    } else {
                        alert('Identifiants/mot de passe incorrects')}
                } else {
                    alert('Identifiants/mot de passe incorrects')
                }
            }
        }
    }
})