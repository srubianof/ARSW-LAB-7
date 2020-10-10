var app = (function () {
    var api = apiclient;
    var nombreCine = "";
    var fechaFuncion = "";
    var listaFunciones = [];
    var listaSillas = [];
    var numberSeats = 0;
    var funcionSeleccionada;
    var stompClient = null;

    var mapObjetos = (funciones) => {
        listaFunciones = funciones.map(({movie: {name, genre}, date}) => ({
                name: name,
                genre: genre,
                time: date.split(" ")[1],
                date: date
            })
        )
        $("#tablaMovies > tbody").empty();

        listaFunciones.forEach(({name, genre, time, date}) => {
            $("#tablaMovies > tbody").append(
                `<tr>
                    <td> ${name} </td>
                    <td> ${genre} </td>
                    <td> ${time} </td>
                    <td> <button type="button" class="btn btn-success btn-lg btn-block" onclick="app.dibujarObjetos($('#cinemaName').val(),'${date}','${name}')">Ver Sillas</button> </td>
                    </tr>`
            );
        });
    }
    var dibujarObjetos = function (sillitas) {
        var canvas = document.getElementById("myCanvas");
        var lapiz = canvas.getContext("2d");
        numberSeats = 0;
        lapiz.strokeStyle = 'lightgrey';
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 12; j++) {

                if (sillitas[i][j] === true) {
                    lapiz.fillStyle = "#34BF49";
                    numberSeats++;

                } else {
                    lapiz.fillStyle = "#FF4C4C";
                }
                lapiz.fillRect(j * 65, i * 65, 60, 60);
                positions[i][j] = new Seat(j * 65, i * 65);
            }
        }
    }
    var getMovie = function () {
        return funcionSeleccionada.movie.name;
    }
    var getGenre = function () {
        return funcionSeleccionada.movie.genre;
    }
    var getDate = function () {
        return funcionSeleccionada.date;
    }
    var seats = [[false, true, true, true, true, false, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true]];
    var positions = [[null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null]];
    var c, ctx;
    var enpoint;

    class Seat {
        constructor(row, col) {
            this.row = row;
            this.col = col;
        }
    }

    var stompClient = null;
    //get the x, y positions of the mouse click relative to the canvas
    var getMousePosition = function (evt) {
        $('#myCanvas').click(e => {
            var rect = myCanvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            console.log("Mouse x:" + x + "Mouse y: " + y);
            checkIfSeat(x, y);
        });
    };

    var checkIfSeat = function (x, y) {
        var xSilla, wSilla, ySilla, hSilla;
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 12; j++) {
                xSilla = j * 65;
                ySilla = i * 65;
                wSilla = xSilla + 60;
                hSilla = ySilla + 60;
                if (x >= xSilla && x <= wSilla) {
                    if (y >= ySilla && y <= hSilla) {
                        console.info("SILLITA!")
                        app.buyTicket(i, j);
                    }
                }
            }
        }
    }

// var drawSeats = function (cinemaFunction) {
//     c = document.getElementById("canvita");
//     ctx = c.getContext("2d");
//     ctx.fillStyle = "#001933";
//     ctx.fillRect(100, 20, 300, 80);
//     ctx.fillStyle = "#FFFFFF";
//     ctx.font = "40px Arial";
//     ctx.fillText("Screen", 180, 70);
//     var row = 5;
//     var col = 0;
//     for (var i = 0; i < seats.length; i++) {
//         row++;
//         col = 0;
//         for (j = 0; j < seats[i].length; j++) {
//             if (seats[i][j]) {
//                 ctx.fillStyle = "#009900";
//             } else {
//                 ctx.fillStyle = "#FF0000";
//             }
//             col++;
//             ctx.fillRect(20 * col, 20 * row, 20, 20);
//             positions[i][j] = new Seat(20 * col, 20 * row);
//             col++;
//         }
//         row++;
//     }
// };

    var connectAndSubscribe = function (sillitas) {

        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        app.disconnect();
        stompClient = Stomp.over(socket);

        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/buyticket.' + enpoint, message => {
                var theObject = JSON.parse(message.body);
                console.log('RECIBI POR TOPIC: ' + theObject)
                // seats[theObject.row][theObject.col] = false;
                // drawSeats();
                console.log(sillitas)
                dibujarObjetos(theObject)
            });
        });
    };

    var eventListener = function () {
        console.log("EVENT LISTENER!" +
            "")
        getMousePosition();
    };

    var verifyAvailability = function (row, col) {
        let seat = new Seat(row, col);
        if (seats[row][col] === true) {
            console.log("Available");
            seats[row][col] = false;
            console.info("purchased ticket" + seat);
            stompClient.send('/app/buyticket.' + enpoint, {}, JSON.stringify(seat));
        } else {
            console.info("Ticket not available");
        }
    };
    var setEndpoint = function (url) {
        enpoint = url;
    }


    return {
        dibujarObjetos(nombre, fecha, nombrePelicula) {
            let endPoint = nombre + "." + fecha + "." + nombrePelicula;
            setEndpoint(endPoint)
            $("#availability").text("Availability of: " + nombrePelicula);
            api.getFunctionsByCinemaAndDate(nombre, fecha, (funciones) => {
                for (const funcion of funciones) {
                    if (funcion.movie.name === nombrePelicula) {
                        dibujarObjetos(funcion.seats);
                        console.log(funcion.seats)
                        connectAndSubscribe(funcion.seats);
                        funcionSeleccionada = funcion;
                        fechaFuncion = funcion.date;
                        break;
                        //:3
                    }
                }
                $("#numSeats").text("Number of available chairs: " + numberSeats);
            })
        },
        actualizarListadodeFunciones(nombre, fecha) {
            this.cambiarFecha(fecha);
            this.cambiarNombreCine(nombre);
            api.getFunctionsByCinemaAndDate(nombre, fecha, mapObjetos);
        },
        consultarAsientosDisponibles(nombreCine, fecha, nombrePelicula) {
            api.getFunctionsByCinemaAndDate(nombreCine, fecha, dibujarObjetos);
        },
        cambiarNombreCine(nombre) {
            nombreCine = nombre;
        },
        cambiarFecha(fecha) {
            fechaFuncion = fecha;
        },
        actualizarSilla(cinema, fila, columna) {
            api.updateChairbyRowAndColumn(cinema, fechaFuncion, getMovie(), fila, columna);
            this.dibujarObjetos(cinema, fechaFuncion, getMovie());
        },
        createIfUdefiniedOrUpdate(cinema, hora) {
            if (($("#newName").val() === undefined && $("#newName").val() === undefined) || ($("#newName").val() === "" || $("#newName").val() === null)) {
                api.updateOrCreateFunction(getMovie(), getDate().split(" ")[0], hora, getGenre(), cinema, (funcion) => {
                    app.actualizarListadodeFunciones(cinema, getDate().split(" ")[0]);
                })
                console.log("HOLIWIS")
            } else {
                api.updateOrCreateFunction($("#newName").val(), getDate().split(" ")[0], hora, $("#newGenre").val(), cinema, (funcion) => {
                    app.actualizarListadodeFunciones(cinema, getDate().split(" ")[0]);
                })
            }
        },
        createOrUpdate() {
            var myCanvas = document.getElementById("myCanvas");
            var ctx = myCanvas.getContext("2d");
            ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

            $("#inputTexts").append(
                `<input id="newName" type="text" class="form-control mb-2"
                           placeholder="New name">
                    <br>
                    <input id="newGenre" type="text" class="form-control mb-2"
                           placeholder="New genre">`
            )
        },
        deleteFunction(cinema) {
            console.log(getDate());
            api.deleteFunction(getMovie(), getDate(), cinema, (funcion) => {
                app.actualizarListadodeFunciones(cinema, getDate().split(" ")[0]);
                var myCanvas = document.getElementById("myCanvas");
                var ctx = myCanvas.getContext("2d");
                ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

            })
        },
        subcribeAndPublish(row, col) {
            console.info('Connecting to WS...');
            var socket = new SockJS('/stompendpoint');
            stompClient = Stomp.over(socket);


        },
        init: function () {
            var can = document.getElementById("canvas");
            // drawSeats();
        },
        buyTicket: function (row, col) {
            console.info("buying ticket at row: " + row + "col: " + col);
            verifyAvailability(row, col);
            // drawSeats();
            //buy ticket
        },
        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            console.log("Disconnected");
        },
        getMousePosition: function () {
            console.log("Click yes :D");
            getMousePosition();
        },
        escucharEvento: function () {
            console.log("PRE EVENT LISTENER!")
            eventListener();
        },
        initAndConnect: function (nombreCinema, fechaFuncion, nombrePelicula) {
            app.init();
            let endPoint = nombreCinema + "." + fechaFuncion + "." + nombrePelicula;
            setEndpoint(endPoint)
            connectAndSubscribe();
        }
    }
})
();
