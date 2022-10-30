const meetingServices = require('../serives/meeting.service');
exports.startMeeting = (req, res, next) => {
    const {
        hostId,
        hostName
    } = req.body;
    var model = {
        hostId: hostId,
        hostName: "hostName",
        startTime: Date.now()
    };
    meetingServices.startMeeting(model, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: result.id
        })
    });
}

exports.checkMeetingExisits = (req, res, next) => {
    var {
        meetingId
    } = req.body;
    if (meetingId ===undefined && req.query.meetingId != null) {
        meetingId = req.query.meetingId
    }

    meetingServices.checkMeetingExisits(meetingId, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results
        })
    });
}



exports.getAllMeetingUsers = (req, res, next) => {
    const {
        meetingId
    } = req.body;

    meetingServices.getAllMeetingUsers(meetingId, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results
        })
    });
}