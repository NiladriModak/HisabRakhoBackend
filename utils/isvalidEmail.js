const express = require('express');
const router = express.Router();
const emailValidator = require('deep-email-validator');

async function isEmailValid(email) {
    try{
        return emailValidator.validate(email)
    }catch(error){

        return false
    }
}

module.exports =isEmailValid