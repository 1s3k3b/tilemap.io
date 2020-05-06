<div align="center"><img src="https://cdn.discordapp.com/attachments/222197033908436994/679402534267387924/restapi.png" alt="Showcase"></img></div>

# About
tilemap.io is a server-side, multiplayer tilemap generator, as my first server-side canvas app.<br>
It also supports GET, POST, and DELETE HTTP requests. (see [endpoints](#endpoints))

# Self hosting
- Install [Node.js](https://nodejs.org/)
- Download or clone the repository
- `cd tilemap.io`
- `npm i`
- Make changes to code if you wish, like change ports, add an endpoint, customize the tilemap
- `npm start`
- Open `localhost:2000`
- Play

# Endpoints
- GET `/tilemap`<br>
  The tilemap as a 2-dimensional array.<br>
  `0`-s represent grass (green square)<br>
  `1`-s represent routes (grey square)<br>
  `3`-s represent water (blue square) (only avaliable by POST `/tilemap/:x/:y/:t`)

- GET `/users/:id`<br>
  An user's x, y coordinates, and name.
  - `id`<br>
    The desired user's id.

- POST `/tilemap/:x/:y/:t`<br>
  Add a square to the tilemap.<br>
  - `x`<br>
    The x coordinate of the desired square to modify.
  - `y`<br>
    The y coordinate of the desired square to modify.
  - `t`<br>
    The type of the desired square to modify.<br>
    `0`-s represent grass (green square)<br>
    `1`-s represent routes (grey square)<br>
    `3`-s represent water (blue square) (only avaliable by POST `/tilemap/:x/:y/:t`)
- DELETE `/users/:id`<br>
  End a user's connection.<br>
  - `id`<br>
    The desired user's id.
