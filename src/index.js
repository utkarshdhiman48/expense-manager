"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
require("dotenv/config");
var app = (0, express_1.default)();
var PORT = process.env.PORT;
app.listen(PORT, function () { return console.log("listening on: ", PORT); });
exports.default = app;
