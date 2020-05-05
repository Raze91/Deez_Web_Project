
(function () {
    'use strict';

    const favStorage = localStorage;
    let favTracks = [];

    $('#submit').on('click', onSubmit);

    if (favStorage.getItem('favoris')) {
        favTracks = JSON.parse(favStorage.getItem('favoris'));
        $.each(favTracks, function (index, fav) {
            $('#favTracks').append(
                `<div class='track'>
                            <div>
                                <img src='${fav.album.cover}' alt="">
                                <div class='track-data'>
                                <h1>${fav.title_short}</h1>
                                <p>${fav.artist.name}</p>
                                <button id='${fav.id}'>Ajouter aux favoris</button>
                                </div>
                            </div>
                            <audio controls src="${fav.preview}"></audio>
                        </div>`
            )
        })
        
        $('#randomFav').append(
            `<div class='randomTrack'>
                            <div>
                                <img src='${favTracks[getRandomInt(favTracks.length)].album.cover}' alt="">
                                <div class='track-data'>
                                <h1>${favTracks[getRandomInt(favTracks.length)].title_short}</h1>
                                <p>${favTracks[getRandomInt(favTracks.length)].artist.name}</p>
                                </div>
                            </div>
                            <audio controls src="${favTracks[getRandomInt(favTracks.length)].preview}"></audio>
                        </div>`
        )

    } else {
        $('#favTracks').html('<h3>Aucun favoris ...</h3>')
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }

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
            console.log(favTracks)

            $.each(results, function (index, result) {
                $('#tracks').append(
                    `<div class='track'>
                        <div>
                            <img src='${result.album.cover}' alt="">
                            <div class='track-data'>
                            <h1>${result.title_short}</h1>
                            <p>${result.artist.name}</p>
                            <button id='${result.id}'>Ajouter aux favoris</button>
                            </div>
                        </div>
                        <audio controls src="${result.preview}"></audio>
                    </div>`
                );

                $(`#${result.id}`).on('click', function (e) {
                    e.preventDefault();
                    addFav(result);
                });

            })


            function addFav(result) {
                // console.log(result);
                favTracks.push(result);
                favStorage.setItem('favoris', JSON.stringify(favTracks));


            }
        })
            .catch((err) => {
                if (err) throw err;
            })

    }

})();