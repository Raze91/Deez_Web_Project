
(function () {
    'use strict';

    const favStorage = localStorage;
    let favTracks = [];

    $('#submit').on('click', onSubmit);

        ///////////////////////////////////////////
        ///////////// PAGE FAVORIS ////////////////
        ///////////////////////////////////////////

    if (favStorage.getItem('favoris')) {
        if(favStorage.favoris.length > 1) {

        
        favTracks = JSON.parse(favStorage.getItem('favoris'));
        console.log(favTracks);
        $.each(favTracks, function (index, fav) {
            $('#favTracks').append(
                `<div class='track'>
                            <div>
                                <img src='${fav.album.cover}' alt="">
                                <div class='track-data'>
                                <h1>${fav.title_short}</h1>
                                <p>${fav.artist.name}</p>
                                <button id='${fav.id}' class='checked'>Supprimer des favoris</button>
                                </div>
                            </div>
                            <audio controls src="${fav.preview}"></audio>
                        </div>`
            )

            $(`#${fav.id}`).on('click', function (e) {
                e.preventDefault();
                delFav(favTracks, index);
                reload();
            })

        })
    } else {
        $('#favTracks').append(
            `<h2>Vous n'avez pas encore de favoris ...</h2>`
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
                                    <h1>${rdmTrack.title_short}</h1>
                                    <p>${rdmTrack.artist.name} / ${rdmTrack.album.title}</p>
                                    <button id='${rdmTrack.id}' class='unchecked'>Changer aléatoirement de musique</button>
                                    </div>
                                </div>
                                <audio controls src="${rdmTrack.preview}"></audio>
                            </div>`
            )

            $(`#${rdmTrack.id}`).on('click',function (e) {
                reload();
            })
        } else {
            $('#randomFav').append(
                `<h2>Vous n'avez pas encore de favoris ...</h2>`
            )
        }

    } else {
        $('#favTracks').html('<h3>Aucun favoris ...</h3>')
    }

    function getRandomNum(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

            ///////////////////////////////////
            ////////// PAGE RECHERCHE /////////
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
                if (changeBtn(result, favTracks) === true) {
                    console.log(true)
                    // $('button').remove();
                }
                $('#tracks').append(
                    `<div class='track'>
                    <div>
                    <img src='${result.album.cover}' alt="">
                    <div class='track-data'>
                    <h1>${result.title_short}</h1>
                    <p>${result.artist.name} / ${result.album.title}</p>
                    <button id='${result.id}' class='unchecked'>Ajouter aux favoris</button>
                    </div>
                    </div>
                    <audio controls src="${result.preview}"></audio>
                    </div>`
                );

                $(`#${result.id}`).on('click', function (e) {
                    e.preventDefault();
                    addFav(result);
                    changeBtn(result, favTracks);
                });

            })

        })
            .catch((err) => {
                if (err) throw err;
            })
    }

    function addFav(result) {
        // console.log(result);
        if ($(`#${result.id}`).attr('class') === 'unchecked') {
            favTracks.push(result);
            favStorage.setItem('favoris', JSON.stringify(favTracks));
        } else {
            console.log('déja dans les favoris');
        }
    }

    function delFav(favTracks, index) {
        console.log(favTracks);
        favTracks.splice(index, 1);
        console.log(index)
        favStorage.setItem('favoris', JSON.stringify(favTracks));
    }

    function reload() {
        document.location.reload(true);
    }

    function changeBtn(result, favTracks) {
        if (favStorage.getItem('favoris')) {

            for (let i = 0; i < favTracks.length; i++) {

                if (favTracks[i].id === result.id) {
                    if ($(`#${result.id}`).attr('class') === 'unchecked') {
                        $(`#${result.id}`).empty();
                        $(`#${result.id}`).append('Supprimer des favoris');
                        $(`#${result.id}`).removeClass('unchecked').addClass('checked');
                    } else if ($(`#${result.id}`).attr('class') === 'checked') {
                        $(`#${result.id}`).empty();
                        $(`#${result.id}`).append('Ajouter aux favoris');
                        $(`#${result.id}`).removeClass('checked').addClass('unchecked');
                    }
                }
            }
        }
    }

})();