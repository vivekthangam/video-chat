const meetingServices = require("../serives/meeting.service");
const {
    MeetingPayloadEnum
} = require("./meeting-payload.enum");

async function joinMeeting(meetingId, socket, payload, meetingServer) {
    const {
        userId,
        name
    } = payload;
    meetingServices.isMeetingPresent(meetingId, async (error, results) => {
        if (error && !results) {
            sendMessage(socket, {
                type: MeetingPayloadEnum.NOT_FOUND
            });
        }
        if (results) {
            addUser(socket, {
                meetingId,
                userId,
                name
            }).then((result) => {
                if (result)
                    sendMessage(socket, {
                        type: MeetingPayloadEnum.JOINED_MEETING,
                        data: {
                            userId
                        }
                    });
                broadcastUsers(meetingId, socket, meetingServer, {
                    type: MeetingPayloadEnum.userId,
                    data: {
                        userId,
                        name,
                        ...payload.data
                    }
                })
            })
        }
    });
}
4


function addUser(socket, {
    meetingId,
    userId,
    name
}) {
    let promise = new Promise(function(resolve, reject) {
        meetingServices.getMeetingUser({
            meetingId,
            userId
        }, (error, result) => {
            if (result) {

                var model = {
                    socketId: socket.id,
                    meetingId: meetingId,
                    userId: userId,
                    joined: true,
                    name: name,
                    isAlive: true
                };
                meetingServices.joinMeeting(model, (error, result) => {
                    if (result)
                        resolve(true)
                    if (error)
                        reject(error)
                });

            } else {
                meetingServices.updateMeetingUser({
                    userId: userId,
                    socketId: socket.id
                }, (error, result) => {
                    if (result)
                        resolve(true)
                    if (error)
                        reject(error)
                });
            }
        })
    });

}

function sendMessage(socket, payload) {
    socket.send(JSON.stringify(payload));


}

function broadcastUsers(meetingId, socket, meetingServer, payload) {
    socket.broadcast.emit("message", JSON.stringify(payload));
}

function forwardConnectionsRequest(meetingId, socket, meetingServer, payload) {
    const {
        userId,
        otherUserId,
        name
    } = payload.data;
    var model = {
        meetingId: meetingId,
        userId: otherUserId
    }
    meetingServices.getMeetingUser(model, (error, result) => {
        if (result) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.CONNECTION_REQUEST,
                data: {
                    userId,
                    name,
                    ...payload.data
                }
            });
            meetingServer.to(results.socketId).emit("message", sendPayload);
        }
    });



}



function forwardIceCandidate(meetingId, socket, meetingServer, payload) {
    const {
        userId,
        otherUserId,
        candidate
    } = payload.data;
    var model = {
        meetingId: meetingId,
        userId: otherUserId
    }
    meetingServices.getMeetingUser(model, (error, result) => {
        if (result) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.ICECANDIDATE,
                data: {
                    userId,
                    candidate
                }
            });
            meetingServer.to(results.socketId).emit("message", sendPayload);
        }
    });

}


function forwardAnswerSDP(meetingId, socket, meetingServer, payload) {
    const {
        userId,
        otherUserId,
        sdp
    } = payload.data;
    var model = {
        meetingId: meetingId,
        userId: otherUserId
    }
    meetingServices.getMeetingUser(model, (error, result) => {
        if (result) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.ANSWER_SDP,
                data: {
                    userId,
                    sdp
                }
            });
            meetingServer.to(results.socketId).emit("message", sendPayload);
        }
    });

}




function forwardOfferSDP(meetingId, socket, meetingServer, payload) {
    const {
        userId,
        otherUserId,
        sdp
    } = payload.data;
    var model = {
        meetingId: meetingId,
        userId: userId
    }
    meetingServices.getMeetingUser(model, (error, result) => {
        if (result) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.OFFER_SDP,
                data: {
                    userId,
                    sdp
                }
            });
            meetingServer.to(results.socketId).emit("message", sendPayload);
        }
    });

}

function userLeft(meetingId, socket, meetingServer, payload) {
    const {
        userId
    } = payload.data;
    broadcastUsers(meetingId, socket, meetingServer, {
        type: MeetingPayloadEnum.USER_LEFT,
        data: {
            userId: userId
        }

    })

}


function endMeeting(meetingId, socket, meetingServer, payload) {
    const {
        userId
    } = payload.data;
    broadcastUsers(meetingId, socket, meetingServer, {
        type: MeetingPayloadEnum.MEETING_ENDED,
        data: {
            userId: userId
        }

    })
    meetingServices.getAllMeetingUsers(meetingId, (error, results) => {
        for (let i = 0; i < results.length; i++) {
            const meetingUser = resultsp[i];
            meetingServer.sockets.connected(meetingUser.socketId).disconnect();
        }
    })

}




function forwardEvent(meetingId, socket, meetingServer, payload) {
    const {
        userId
    } = payload.data;
    broadcastUsers(meetingId, socket, meetingServer, {
        type: payload.type,
        data: {
            userId: userId,
            ...payload.data
        }

    })
    meetingServices.getAllMeetingUsers(meetingId, (error, results) => {
        for (let i = 0; i < results.length; i++) {
            const meetingUser = resultsp[i];
            meetingServer.sockets.connected(meetingUser.socketId).disconnect();
        }
    })

}


module.exports = {
    joinMeeting,
    forwardConnectionsRequest,
    forwardIceCandidate,
    forwardOfferSDP,
    forwardAnswerSDP,
    userLeft,
    endMeeting,
    forwardEvent
}