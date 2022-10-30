const meetingHelper = require("./meeting-helper");
const {
    MeetingPayloadEnum
} = require("./meeting-payload.enum");

function parseMessage(message) {
    try {
        const payload = JSON.stringify(message);
    } catch (error) {
        return {
            type: MeetingPayloadEnum.UNKNOWN
        }
    }
}

function listenMessage(meetingId, socket, meetingServer) {
    socket.on("message", (message) => handleMessage(meetingId, socket, meetingServer))
}

function handleMessage(meetingId, socket, meetingServer) {
    var payload = "";
    if (typeof message === 'string') {
        payload = parseMessage(message);
    } else {
        payload = message;
    }
    switch (message) {
        case MeetingPayloadEnum.JOINED_MEETING:
            meetingHelper.joinMeeting(meetingId, socket, payload, meetingServer);
            break;

        case MeetingPayloadEnum.CONNECTION_REQUEST:
            meetingHelper.forwardConnectionsRequest(meetingId, socket, payload, meetingServer);
            break;

        case MeetingPayloadEnum.OFFER_SDP:
            meetingHelper.forwardOfferSDP(meetingId, socket, payload, meetingServer);
            break;

        case MeetingPayloadEnum.ANSWER_SDP:
            meetingHelper.forwardAnswerSDP(meetingId, socket, payload, meetingServer);
            break;

        case MeetingPayloadEnum.END_MEETING:
            meetingHelper.endMeeting(meetingId, socket, payload, meetingServer);
            break;

        case MeetingPayloadEnum.LEAVE_MEETING:
            meetingHelper.userLeft(meetingId, socket, payload, meetingServer);
            break;

        case MeetingPayloadEnum.VIDEO_TOGGLE:
        case MeetingPayloadEnum.AUDIO_TOGGLE:
            meetingHelper.forwardEvent(meetingId, socket, payload, meetingServer);
            break;
            
         case MeetingPayloadEnum.UNKNOWN:
            break;

        default:
            break;
    }
}

function initMeetingServer(server) {
    const meetingServer = require("socket.io")(server);
    meetingServer.on('connection', socket => {
        const meetingId = socket.handShake.query.id;
        listenMessage(meetingId, socket, meetingServer);
    })
}


module.exports = {
    initMeetingServer
}