
(function () {
    'use strict';

    const favStorage = localStorage;
    let favTracks = [];

    $('#submit').on('click', onSubmit);


    if (favStorage.getItem('favoris')) {

        ///////////////////////////////////////////
        ///////////// PAGE FAVORIS ////////////////
        ///////////////////////////////////////////

        if (JSON.parse(favStorage.favoris).length > 0) {

            favTracks = JSON.parse(favStorage.getItem('favoris'));
            console.log(favTracks);
            $.each(favTracks, function (index, fav) {
                $('#favTracks').append(
                    `<div class='track'>
                            <div>
                                <img src='${fav.album.cover}' alt="">
                                <div class='track-data'>
                                <h3>${fav.title_short}</h3>
                                <p>${fav.artist.name}</p>
                                <button id='${fav.id}' class='checked'>Supprimer des favoris</button>
                                </div>
                            </div>
                            <audio controls src="${fav.preview}"></audio>
                    </div>`
                )

                $(`#${fav.id}`).on('click', function (e) {
                    e.preventDefault();
                    favTracks.splice(index, 1);
                    favStorage.setItem('favoris', JSON.stringify(favTracks));
                    reload();
                })

            })
        } else {
            $('#favTracks').append(
                `<h3>Vous n'avez pas encore de favoris ...</h3>`
            )
        }

        ///////////////////////////////////////
        //////////// PAGE ACCUEIL /////////////
        ///////////////////////////////////////

        if (favTracks.length > 0) {
            let rdmTrack = favTracks[getRandomNum(favTracks.length)]
            $('#randomFav').append(
                `<div class='randomTrack'>
                                <div>
                                    <img src='${rdmTrack.album.cover}' alt="">
                                    <div class='track-data'>
                                    <h3>${rdmTrack.title_short}</h3>
                                    <p>${rdmTrack.artist.name} / ${rdmTrack.album.title}</p>
                                    </div>
                                    </div>
                                    <audio controls src="${rdmTrack.preview}"></audio>
                                </div>
                                <button id='${rdmTrack.id}' class='unchecked'>Changer aléatoirement de musique</button>`
            )

            $(`#${rdmTrack.id}`).on('click', function (e) {
                reload();
            })
        } else {
            $('#randomFav').append(
                `<h3>Vous n'avez pas encore de favoris ...</h3>`
            )
        }

    } else {
        $('#favTracks').html(`<h3>Vous n'avez pas encore de favoris ...</h3>`)
    }

    function getRandomNum(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    ///////////////////////////////////
    ///////// PAGE RECHERCHE //////////
    ///////////////////////////////////

    function onSubmit(event) {
        event.preventDefault();
        $('#tracks').empty();

        let titre = $('#title').val();
        let sort = $('#sortBy').val();
        $.ajax({
            url: `https://api.deezer.com/search?q=${titre}&output=jsonp&order=${sort}`,
            dataType: "jsonp",
        }).then((result) => {

            const results = result.data;

            $.each(results, function (index, result) {

                $('#tracks').append(
                    `<div class='track'>
                    <div>
                    <img src='${result.album.cover}' alt="">
                    <div class='track-data'>
                    <h3>${result.title_short}</h3>
                    <p>${result.artist.name} / ${result.album.title}</p>
                    <button id='${result.id}' class='unchecked'>Ajouter aux favoris</button>
                    </div>
                    </div>
                    <audio controls src="${result.preview}"></audio>
                    </div>`
                );

                for (let i = 0; i < favTracks.length; i++) {
                    if (result.id === favTracks[i].id) {
                        setChecked(result);
                    }
                }

                $(`#${result.id}`).on('click', function (e) {
                    e.preventDefault();

                    if ($(`#${result.id}`).attr('class') === 'unchecked') {
                        addFav(result);
                        setChecked(result);
                        console.log($(`#${result.id}`).attr('class'))
                        console.log(favTracks)
                    } else if ($(`#${result.id}`).attr('class') === 'checked') {
                        setUnchecked(result);
                        delFav(favTracks, result);
                        console.log(favTracks);
                    }
                });

            })

        })
            .catch((err) => {
                if (err) throw err;
            })
    }

    function addFav(result) {
        if ($(`#${result.id}`).attr('class') === 'unchecked') {
            favTracks.push(result);
            favStorage.setItem('favoris', JSON.stringify(favTracks));
        }
    }

    function delFav(favTracks, result) {

        let index;

        for (let i = 0; i < favTracks; i++) {
            if (favTracks[i].id === result.id) {
                index = i
            }
        }
        favTracks.splice(index, 1);
        favStorage.setItem('favoris', JSON.stringify(favTracks));
    }

    function reload() {
        document.location.reload(true);
    }

    function setChecked(result) {
        $(`#${result.id}`).empty();
        $(`#${result.id}`).append('Supprimer des favoris');
        $(`#${result.id}`).removeClass('unchecked').addClass('checked');
    }

    function setUnchecked(result) {
        $(`#${result.id}`).empty();
        $(`#${result.id}`).append('Ajouter aux favoris');
        $(`#${result.id}`).removeClass('checked').addClass('unchecked');
    }

})();