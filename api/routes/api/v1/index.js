// jshint esversion: 6
// jshint node: true
"use strict";

/**
 *   routes/api/v1/index.js
 *   @description: index file for the v1 sub-application. All routes with '/v1' come through here.
 *   @see https://medium.com/@sesitamakloe/how-we-structure-our-express-js-routes-58933d02e491
 */

const express = require('express');
const V1Router = express.Router();

// Put route handels here;
V1Router.use('/weather', require('./weather'));
V1Router.use('/social', require('./social'));
V1Router.use('/demo', require('./demo'));

module.exports = V1Router;
