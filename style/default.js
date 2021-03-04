$(document).ready(() => {
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
                console.log(data.songs[item]);
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

    $('#muteBtn').click(() => {
        alert('click')
    })

    $('#play').click(() => {
        if ($('#play').hasClass('fa-play')) {
            $('#play').removeClass('fa-play')
            $('#play').addClass('fa-pause')
            $('#music')[0].play()
        } else if ($('#play').hasClass('fa-pause')) {
            $('#play').removeClass('fa-pause')
            $('#play').addClass('fa-play')
            $('#music')[0].pause()
        }
    })
    
    function setmusic() {
        songID = $(this).attr('id')
        $.ajax({
            url: "https://raw.githubusercontent.com/NemesisMKII/CCP-1/master/data/jsonMusique.json",
            method: "GET",
            dataType: "json",
    
            error: function() {
                alert('le chargement de la liste des musiques a échoué')
            },
    
            success: function(data) {
                for (item in data.songs) {
                    if (data.songs[item].id == songID) {
                        $('#musictitle').html(data.songs[item].name)
                        $('#artistname span').html(data.songs[item].artist)
                        $('#music').attr('src', data.songs[item].song)
                        $('#songimg').attr('src', data.songs[item].image)
                        console.log(data.songs[item]);
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