var appStomp = (function () {

    var seats = [[false, true, true, true, true, false, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true]];
    var positions = [[null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null]];
    var c, ctx;

    class Seat {
        constructor(row, col) {
            this.row = row;
            this.col = col;
        }
    }

    var stompClient = null;
    //get the x, y positions of the mouse click relative to the canvas
    var getMousePosition = function (evt) {
        $('#canvita').click(e => {
            var rect = canvita.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            checkIfSeat(x, y);
        });
    };

    var checkIfSeat = function (x, y) {
        for (let i = 0; i < positions.length; i++) {
            for (let j = 0; j < positions[i].length; j++) {
                if (x >= positions[i][j].row && x <= positions[i][j].row + 20) {
                    if (y >= positions[i][j].col && y <= positions[i][j].col + 20) {
                        console.log("SILLA!!!!");
                    }
                }
            }
        }
    }

    var drawSeats = function (cinemaFunction) {
        c = document.getElementById("canvita");
        ctx = c.getContext("2d");
        ctx.fillStyle = "#001933";
        ctx.fillRect(100, 20, 300, 80);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "40px Arial";
        ctx.fillText("Screen", 180, 70);
        var row = 5;
        var col = 0;
        for (var i = 0; i < seats.length; i++) {
            row++;
            col = 0;
            for (j = 0; j < seats[i].length; j++) {
                if (seats[i][j]) {
                    ctx.fillStyle = "#009900";
                } else {
                    ctx.fillStyle = "#FF0000";
                }
                col++;
                ctx.fillRect(20 * col, 20 * row, 20, 20);
                positions[i][j] = new Seat(20 * col, 20 * row);
                col++;
            }
            row++;
        }
        console.log(positions)
    };

    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/buyticket', message => {
                drawSeats();
                var theObject = JSON.parse(message.body);
                console.log(theObject.row);
                console.log(theObject.col);
            });
        });
    };

    var verifyAvailability = function (row, col) {
        let seat = new Seat(row, col);
        if (seats[row][col] === true) {
            console.log("Available");
            seats[row][col] = false;
            console.info("purchased ticket");
            console.log(seats)
            stompClient.send("/topic/buyticket", {}, JSON.stringify(seat));
        } else {
            console.info("Ticket not available");
        }
    };

    return {
        init: function () {
            var can = document.getElementById("canvas");
            drawSeats();
            //websocket connection
            connectAndSubscribe();
        },
        buyTicket: function (row, col) {
            console.info("buying ticket at row: " + row + "col: " + col);
            verifyAvailability(row, col);
            //buy ticket
        },
        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        },
        getMousePosition: function () {
            console.log("Click yes :D");
            getMousePosition();
        }
    };
})();
