const Reservation=require('../models/hours.js')
const { DateTime } = require('luxon');
const nodemailer = require('nodemailer');

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  port:465,
  secure:true,
  host: "smtp.gmail.com",
  auth: {
    user: 'staduim26@gmail.com', // Replace with your Gmail email address
    pass: 'ihpsqhetzxaztxnx', // Replace with your Gmail email password
  },
  tls:{rejectUnauthorized:false}
});
const getAllHours= async (req, res,next) => {
  try {
    const { stadiumId } = req.params;

    // Log current server date
    console.log('Server Current Date:', DateTime.local().toString());

    const currentDate = DateTime.now().setZone('Africa/Cairo');
    const startOfWeek = currentDate.startOf('week');
    const endOfWeek = currentDate.endOf('week').set({ hour: 23, minute: 59, second: 59, millisecond: 999 });

    const reservedHours = await Reservation.find({
      stadiumId,
      hour: { $gte: startOfWeek.toJSDate(), $lt: endOfWeek.toJSDate() },
    }).select('hour');

    const reservedHourSet = new Set(reservedHours.map((reservation) => reservation.hour.toISOString()));

    const allHoursInWeek = [];
    let currentDateInWeek = startOfWeek;

    while (currentDateInWeek <= endOfWeek) {
      const availableHoursInDay = Array.from({ length: 24 }, (_, index) => {
        const hour = currentDateInWeek.set({ hour: index }).toJSDate();
        return { hour };
      }).filter((hour) => !reservedHourSet.has(hour.hour.toISOString()));

      if (availableHoursInDay.length > 0) {
        allHoursInWeek.push({
          date: currentDateInWeek.toJSDate(),
          hours: availableHoursInDay,
        });
      }

      currentDateInWeek = currentDateInWeek.plus({ days: 1 });
    }

    const availableHours = allHoursInWeek.map((day) => ({
      date: day.date.toISOString(),
      hours: day.hours.map((hourInDay) => hourInDay.hour.toISOString()),
    }));

    // Log the available hours
    console.log('Available Hours:', availableHours);

    res.json({ availableHours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  };
const reserve =async (req, res) => {
  try {
    const { userId, selectedHour, stadiumId ,email} = req.body;
    const existingReservation = await Reservation.findOne({ hour: selectedHour, stadiumId });

    if (existingReservation) {
      return res.status(409).json({ error: 'Selected hour is already reserved' });
    }

    // Create a new reservation
    const newReservation = new Reservation({ userId, hour: selectedHour, stadiumId });
    await newReservation.save();

    await sendEmailNotification(
      email, 
    'Reservation Confirmation',
     `You have successfully reserved the hour at ${selectedHour}.`);

    res.json({ message: 'Reservation successful', reservation: newReservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
// Function to send email notification
const sendEmailNotification = async (toEmail, subject, text) => {
  try {
    await transporter.sendMail({
      from: 'staduim26@gmail.com', // Replace with your Gmail email address
      to: toEmail,
      subject: subject,
      text: text,
    });
    console.log('Email notification sent successfully.');
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};
  module.exports={
    getAllHours,
    reserve
}
