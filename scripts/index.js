
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
            console.log("Résultat :", result.data);
        })

    }
})();