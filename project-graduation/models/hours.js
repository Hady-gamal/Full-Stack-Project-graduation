const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hour: { type: Date, required: true },
  stadiumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Erena', required: true },
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;