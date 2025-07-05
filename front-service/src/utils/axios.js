import axios from 'axios';

const defaultOptions = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

const userBaseURL = process.env.VUE_APP_MY_APP_USER_URL || 'http://localhost:3004';
const roomsBaseURL = process.env.VUE_APP_MY_APP_ROOMS_URL || 'http://localhost:3002';
const reservationBaseURL = process.env.VUE_APP_MY_APP_RESERVATION_URL || 'http://localhost:3003';

console.log('User API Base URL:', userBaseURL);
console.log('Rooms API Base URL:', roomsBaseURL);
console.log('Reservation API Base URL:', reservationBaseURL);

export const userApi = axios.create({
  baseURL: userBaseURL,
  ...defaultOptions,
});

export const roomsApi = axios.create({
  baseURL: roomsBaseURL,
  ...defaultOptions,
});

export const reservationApi = axios.create({
  baseURL: reservationBaseURL,
  ...defaultOptions,
});