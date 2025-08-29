const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// GET / route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to BFHL API. Use POST /bfhl with { data: }'
  });
});

// GET /bfhl route
app.get('/bfhl', (req, res) => {
  res.json({
    message: 'This is the BFHL API. Please use POST method with input data.'
  });
});

const FULL_NAME = "daksh ranka";
const DOB = "14112004";
const EMAIL = "daksh.ranka2022@vitstudent.ac.in";
const ROLL_NUMBER = "22BRS1302";

function isNumber(str) {
  return /^\d+$/.test(str);
}

function isAlphabet(str) {
  return /^[a-zA-Z]+$/.test(str);
}

function isSpecialChar(str) {
  return !isNumber(str) && !isAlphabet(str);
}

function alternateCaps(str) {
  let result = '';
  let upper = true;
  for (let ch of str) {
    result += upper ? ch.toUpperCase() : ch.toLowerCase();
    upper = !upper;
  }
  return result;
}

app.post('/bfhl', (req, res) => {
  try {
    const data = req.body.data;
    if (!Array.isArray(data)) throw new Error("Invalid input");

    let even_numbers = [];
    let odd_numbers = [];
    let alphabets = [];
    let special_characters = [];
    let sum = 0;
    let alpha_concat = '';

    for (let item of data) {
      if (isNumber(item)) {
        let num = parseInt(item, 10);
        if (num % 2 === 0) even_numbers.push(item);
        else odd_numbers.push(item);
        sum += num;
      } else if (isAlphabet(item)) {
        alphabets.push(item.toUpperCase());
        alpha_concat += item;
      } else {
        special_characters.push(item);
      }
    }

    let concat_string = alternateCaps(alpha_concat.split('').reverse().join(''));

    res.status(200).json({
      is_success: true,
      user_id: `${FULL_NAME.replace(/\s+/g, '_')}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sum.toString(),
      concat_string
    });
  } catch (err) {
    res.status(400).json({
      is_success: false,
      user_id: `${FULL_NAME.toLowerCase()}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
