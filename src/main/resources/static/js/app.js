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
        var buySeats = function (row, column) {

        }



        return {
            dibujarObjetos(nombre, fecha, nombrePelicula) {
                $("#availability").text("Availability of: " + nombrePelicula);
                api.getFunctionsByCinemaAndDate(nombre, fecha, (funciones) => {
                    for (const funcion of funciones) {
                        if (funcion.movie.name === nombrePelicula) {
                            dibujarObjetos(funcion.seats);
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
            deleteFunction(cinema){
                console.log(getDate());
                api.deleteFunction(getMovie(),getDate(),cinema,(funcion) => {
                    app.actualizarListadodeFunciones(cinema, getDate().split(" ")[0]);
                    var myCanvas = document.getElementById("myCanvas");
                    var ctx = myCanvas.getContext("2d");
                    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

                })
            }



            var subcribeAndPublish = function (row, col) {
                console.info('Connecting to WS...');
                var socket = new SockJS('/stompendpoint');
                stompClient = Stomp.over(socket);


                }

        }
    }
)();
