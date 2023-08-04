export function createWebSocket(url){


    return new Promise((resolve, reject) => {
        try {
            const socket = new WebSocket(url);

            socket.onopen = () => resolve(createWebSocketWithObject(socket)); // Resolve promise when connection is open
            socket.onerror = error => reject(error); // Reject promise if an error occurs
        } catch (error) {
            reject(error);
        }
    });
}


function createWebSocketWithObject(socket){

    return {
        sendPartial: function (partial) {
            // send partial to server
            console.log("sending partial to server" +partial)
            socket.send(partial);

        },
        sendFinal: function (final) {
            // send final to server
            console.log("sending final to server" +final)
            socket.send(final);
        },
        sendError: function (error) {
            // send error to server
            console.log("sending error to server" +error)
            socket.send(error);
        },
        getSocket: function () {
            return socket;
        }
    }
}