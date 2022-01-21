const express = require('express');
const router = express.Router();
const Joi = require('joi').extend((require('@joi/date')));

let doctorData = require('../data/doctors');
let appointmentData = require('../data/appointments');
const doctors = require('../data/doctors');

router.get('/', (req, res) => {
    // Will return a list of all the doctors, along with their doctor id 
    // so a frontend can make future calls for specific doctors
    res.send(doctorData); // returns a list of all doctors in JSON
});

router.get('/:doctorId/appointments/:date', (req, res) => {
    // Will return a list of all appointments for a particular doctor on a particular day.
    // If no date is specified, todays date will be used. Appointments can be uniqely identified by doctor ID and a timestamp
    const doctorId = req.params.doctorId;
    const date = req.params.date;
    const apptList = appointmentData.filter((appointment) => {
        if (appointment.doctorId.toString() === doctorId &&
            appointment.time.startsWith(date)) {
            return appointment;
        }
    })
    res.send(apptList);
});

router.delete('/:doctorId/appointments/:apptId', (req, res) => {
    const doctorId = req.params.doctorId;
    const apptId = req.params.apptId;
    var deletedAppt = {};
    appointmentData = appointmentData.filter((appointment) => {
            if (appointment.id === apptId) {
                deletedAppt = appointment;
            }
            return appointment.id != apptId;
        })
        // respond with delete appt if it was found
    res.status(200);
    res.send(deletedAppt);
});

router.post('/:doctorId/appointments/', (req, res) => {
    // Adds a new appointent to a doctors calendar
    // new appointments can only start on 15 minute intervals
    // doctors can have up to three appointments at the same time.
    const doctorId = req.params.doctorId;
    const apptSchema = Joi.object({
        id: Joi.string().required(),
        doctorId: Joi.number().required(),
        patientLastName: Joi.string().min(2).required(),
        patientFirstName: Joi.string().min(2).required(),
        date: Joi.date().format('YYYYMMDD').required(),
        time: Joi.date().format('HHmm').required(),
        kind: Joi.string().required(),
    })
    const doctor = doctorData.filter((doctor) => {
        return doctor.id === doctorId;
    });
    if (!doctor) {
        return res.status(404).send('Doctor does not exist');
    }
    const { error, value } = apptSchema.validate(req.body)


    if (error) {
        return res.status(400).send(error);
    }
    appointment = {
        id: req.body.id,
        doctorId: req.body.doctorId,
        patientLastName: req.body.patientLastName,
        patientFirstName: req.body.patientFirstName,
        date: req.body.date,
        time: req.body.time,
        kind: req.body.kind,
    }
    if (parseInt(appointment.time.slice(-2)) % 15 === 0) {
        const conflicts = appointmentData.filter((appointment) => {
            return appointment.doctorId === req.body.doctorId && appointment.date === req.body.date && appointment.time === req.body.time;
        })
        if (conflicts.length < 3) {
            appointmentData.push(appointment);
            return res.status(200).send(appointment);
        } else {
            return res.status(400).send("This doctor can only have 3 appointments maximum at this time")
        }
    } else {
        return res.status(400).send("Appointments can only be scheduled in intervals of 15 minutes");
    }
})

module.exports = router;