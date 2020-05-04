
(function () {
    'use strict';

    $('#submit').on('click', onSubmit);

    function onSubmit(event) {
        event.preventDefault();

        let titre = $('#title').val();

        $.ajax({
            url: `https://api.deezer.com/search?q=${titre}&output=jsonp`,
            dataType: "jsonp",
        }).then((result) => {
            console.log("Résultat :", result.data);
        })

    }
})();