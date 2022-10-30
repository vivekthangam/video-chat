const moongoose = require("mongoose");
const {
    Schema
} = moongoose;

const meetingUser = moongoose.model("MeetingUser", moongoose.Schema({
    socketId: {
        type: String,
        required: true
    },
    meetingId: {
        type: moongoose.Schema.Types.ObjectId,
        required: "meeting"
    },
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    joined: {
        type: Boolean,
        required: true
    },
    isAlive: {
        type: Boolean,
        required: true
    },
}, {
    timestamps: true
}));

module.exports = {
    meetingUser
}