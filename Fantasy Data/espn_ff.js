/* // ES6
import { ... } from 'espn-fantasy-football-api'; // web
import { ... } from 'espn-fantasy-football-api/node'; // node
import { ... } from 'espn-fantasy-football-api/web-dev'; // web development build
import { ... } from 'espn-fantasy-football-api/node-dev'; // node development build

// ES5
const { ... } = require('espn-fantasy-football-api'); // web
const { ... } = require('espn-fantasy-football-api/node'); // node
const { ... } = require('espn-fantasy-football-api/web-dev'); // web development build
const { ... } = require('espn-fantasy-football-api/node-dev'); // node development build */

import { Client } from 'espn-fantasy-football-api';
//const myClient = new Client({ leagueId: 24421 });

const client = new Client({
  leagueId: 24421,
  espnS2: 'AEBcdNoWOgKJT84vHL%2FIwkS4a88bGpHcHobLUIpM%2FByEkLr7FbM8YxN4c8z8W4i1%2Bjoa7uFqwrppNkePdSBJ1y55hvTDVspDtyT2L',
  SWID: 'BD899B8F-FCA4-4012-8552-531861FBB353'
});