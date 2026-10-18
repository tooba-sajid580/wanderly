#Wanderly

Wanderly is a full-stack platform for organizing and joining group trips. Organizers post trips and manage who joins. Travelers browse trips, join them, or join a waitlist when a trip is full. This is version one.

The idea came from an Instagram reel of a woman organizing group trips that strangers could join. Everything ran through comments and DMs, with no structure, no clear capacity, no record of who was coming, and no security for organizers or travelers. Wanderly gives that kind of travel a proper foundation.

##Screenshots
- Home page
  <img width="1346" height="595" alt="image" src="https://github.com/user-attachments/assets/90906fcf-38a0-4ee8-99c3-021c691760c1" />
- Browse trips
  <img width="1340" height="615" alt="image" src="https://github.com/user-attachments/assets/85e5b7be-e5b9-4216-b647-7c9a032bd56a" />
- Trip detail with weather and packing list
  <img width="1329" height="593" alt="image" src="https://github.com/user-attachments/assets/84d897e4-3294-42a0-8e71-4d78dc818d08" />
- Organizer dashboard
  <img width="1351" height="621" alt="image" src="https://github.com/user-attachments/assets/229655c0-e126-437e-963f-a052fede71f2" />
- Trip requests
  <img width="1340" height="593" alt="image" src="https://github.com/user-attachments/assets/9aa0e7ae-2eb7-4562-b94a-06e68f98bbd6" />

##Features

For travelers
- Browse open trips and search by destination or title
- Join a trip, or join the waitlist when it is full
- Leave a trip, and the next person on the waitlist is promoted automatically
- See the weather forecast and a packing list for trips you have joined
- Submit trip requests suggesting destinations
For organizers
- Create, edit, cancel and delete their own trips
- See who has joined each of their trips, including waitlisted travelers
- Respond to trip requests. The first organizer to respond claims the request, and no one else can change it
Security and rules
- JWT authentication with hashed passwords
- Role-based access (traveler and organizer)
- Ownership checks, so organizers can only manage their own trips
- Only joined travelers and the organizer can see a trip's member list
- Only the organizer can see travelers' emails and the total price
- A unique database index stops a user joining the same trip twice

##Tech stack

Frontend: React, Vite, React Router, Axios
Backend: Node.js, Express, MongoDB with Mongoose, JSON Web Tokens, bcrypt
External APIs: OpenWeatherMap (forecasts) and the Google Gemini API (travel tips)

##Project structure

```
wanderly/
  client/            React app
    src/
      components/    Navbar, TripCard, WeatherCard, Footer and more
      context/       AuthContext (login state)
      pages/         Home, Browse, Trip detail, My Trips, Admin pages
      styles/        CSS files
  server/            Express API
    config/          Database connection
    controllers/     Route logic
    middleware/      Auth, admin and optional auth
    models/          Mongoose models
    routes/          API routes
    services/        Weather and recommendation services
```

##Getting started

Requirements
- Node.js 18 or newer
- A MongoDB database (a free MongoDB Atlas cluster works)
- An OpenWeatherMap API key
- A Google Gemini API key (optional, the packing list works without it)

1. Clone the repository

```
git clone https://github.com/tooba-sajid580/wanderly.git
cd wanderly
```

2. Set up the server

```
cd server
npm install
```

Create a file named `.env` in the `server` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
WEATHER_API_KEY=your_openweathermap_key
AI_API_KEY=your_gemini_key
AI_MODEL=gemini-3.8-flash
CLIENT_URL=http://localhost:5173
```

To generate a strong `JWT_SECRET`:

```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Start the server:

```
npm run dev
```

The API runs on `http://localhost:5000`.

3. Set up the client

In a second terminal:

```
cd client
npm install
npm run dev
```

The app runs on `http://localhost:5173`. By default it talks to `http://localhost:5000`. To point it somewhere else, create `client/.env`:

```
VITE_API_URL=https://your-api-address
```

##API overview

| Method | Route | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create an account |
| POST | `/api/auth/login` | Public | Log in |
| GET | `/api/trips` | Public | List open and full trips |
| GET | `/api/trips/:tripId` | Public (more detail for members) | Trip details |
| POST | `/api/trips/:tripId/join` | Logged in | Join a trip or the waitlist |
| DELETE | `/api/trips/:tripId/leave` | Logged in | Leave a trip |
| GET | `/api/trips/my-trips` | Logged in | Trips you have joined |
| GET | `/api/trips/:tripId/members` | Member or organizer | Who is going |
| POST | `/api/admin/trips` | Organizer | Create a trip |
| PUT | `/api/admin/trips/:tripId` | Trip owner | Edit a trip |
| DELETE | `/api/admin/trips/:tripId` | Trip owner | Cancel a trip |
| DELETE | `/api/admin/trips/:tripId/permanent` | Trip owner | Delete a trip |
| GET | `/api/admin/trips/my-posted` | Organizer | Your posted trips |
| GET | `/api/admin/trips/:tripId/members` | Trip owner | Members with emails |
| POST | `/api/requests` | Logged in | Submit a trip request |
| GET | `/api/requests/my-requests` | Logged in | Your requests |
| GET | `/api/requests` | Organizer | All requests |
| PUT | `/api/requests/:requestId` | Organizer (first to respond) | Approve or reject |

##Design decisions

- First organizer to respond owns a trip request. The claim is a single atomic database update, so two organizers clicking at the same moment cannot both win.
- Total price is calculated on the server (price per person times capacity), so it cannot be tampered with from the client.
- Weather is cached. A good forecast is reused for 6 hours, and a failed lookup is retried after 30 minutes.
- The packing list is rule-based.It is built from temperature, conditions and trip type, so it works even when the AI service is unavailable.
- The AI model name is configurable through `AI_MODEL`, because providers retire models without warning.

##Known limitations (version one)

- No payments, so a spot is not secured by anything yet
- Anyone can register as an organizer, and organizers are not verified
- No reviews or ratings
- No notifications when a waitlist spot opens or a request is answered
- Weather forecasts only appear within five days of a trip

##Possible next steps

Online payments, organizer verification, reviews and ratings, and notifications. These are ideas rather than commitments.

##Demo Video
Watch the full project walkthrough on [LinkedIn](https://lnkd.in/p/dMEHhMf6).

##License

Copyright (c) 2026 Tooba Sajid. All rights reserved.

This repository and its source code are provided for demonstration and code review purposes only. No permission is granted to copy, modify, or redistribute this software, in whole or in part, without written permission from the author.

##Author

Built by Tooba Sajid. Feedback is welcome, especially from people who organize or join group trips, and from developers on the architecture.
