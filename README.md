To run the application: 

`nodemon app.js`

for list of doctors: /doctors/
for appointments for a particular doctor on a particular day: /doctors/{doctorId}/{date}
to delete an appointment: /doctors/{doctorId}/{appointmentId}
to post an appointment: /doctors/{doctorId} with request body containing an appointment object (needs, id, doctorId, patientFirstName, patientLastName, date, time, kind).