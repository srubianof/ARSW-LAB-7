apiclient = (function () {
    let url = "http://localhost:8080/cinemas/"
    return {
        getFunctionsByCinema: function (name, callback) {
            $.getJSON(url + name, (data) => {
                callback(data);
            }, null)
        },
        getFunctionsByCinemaAndDate: function (name, date, callback) {
            $.getJSON(url + name + "/" + date, (data) => {
                callback(data);
            }, null)
        },
        updateChairbyRowAndColumn: function (cinema, date, movie, row, col) {
            $.post(url + cinema + "/" + date + "/" + movie + "/" + row + "/" + col, {}
                ,
                null)
        },
        updateOrCreateFunction: function (movieName, date, time, genre, cinemaName, callback) {
            var putPromise = $.ajax({
                url: "/cinemas/" + cinemaName,
                type: 'PUT',
                data: JSON.stringify([movieName, date + " " + time, genre]),
                contentType: "application/json"
            });

            putPromise.then(
                (res) => {
                    callback(res);
                }
                // this.dibujarObjetos(cinema, fechaFuncion, getMovie(getDate().split(" ")[0]));


            );
        },

        deleteFunction: function (movieName, date,cinemaName, callback) {
            console.log("/cinemas/" + cinemaName+"/"+date + " " + time+"/"+movieName);
            var deletePromise = $.ajax({
                url: "/cinemas/" + cinemaName+"/"+date +"/"+movieName,
                type: 'DELETE'
            });
            deletePromise.then(
                (res) => {
                    callback(res);
                });

            
        }

    }
})();
