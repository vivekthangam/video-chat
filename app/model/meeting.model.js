const moongoose = require("mongoose");
const {
    Schema
} = moongoose;

const meeting = moongoose.model("Meeting", moongoose.Schema({
    hostId: {
        type: String,
        required: true
    },
    hostName: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    meetingUsers: [{
        type: moongoose.Schema.Types.ObjectId,
        ref: "MeetingUser"
    }]
}, {
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id.toString(),
                delete ret._id;
            delete ret._v;
        }
    }
}, {
    timestamps: true
}));

module.exports = {
    meeting
}