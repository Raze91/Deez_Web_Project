
(function () {
    'use strict';

    $('#submit').on('click', onSubmit);

    function onSubmit(event) {
        event.preventDefault();

        let titre = $('#title').val();
        let sort = $('#sortBy').val();
        $.ajax({
            url: `https://api.deezer.com/search?q=${titre}&output=jsonp&order=${sort}`,
            dataType: "jsonp",
        }).then((result) => {

            const results = result.data;
            console.log(results)
            let content = '';

            $.each(results, function (index, result) {
                content +=
                    `<div class='track'>
                    <div>
                        <img src='${result.album.cover}' alt="">
                        <div class='track-data'>
                        <h1>${result.title_short}</h1>
                        <p>${result.artist.name}</p>
                        </div>
                    </div>
                <audio controls src="${result.preview}"></audio>
                <button id='${result.id}' class='fav' onclick='${addFav(this)}'>Ajouter aux favoris</button>
            </div>`

            });
            $('#tracks').html(content);

            // $('.fav').on('click', function(e) {
            //     e.preventDefault();
            //     addFav($(this).attr(this.id));
            // });

            function addFav(id) {
                console.log(id);
            }
        });

    };
})();