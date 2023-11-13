import * as React from 'react';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Appointment from './Appointment';
import BookAppointment from './BookAppointment';

export const mainListItems = [
  {
    title: "Appointments",
    icon: <CalendarMonthIcon />,
    component: < Appointment />,
  },
  {
    title: "Book an appointment",
    icon: <BookOnlineIcon />,
    component: < BookAppointment />,
  },
];