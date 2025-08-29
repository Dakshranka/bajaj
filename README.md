# BFHL REST API

This is a Node.js Express REST API for the VIT Full Stack Question Paper.

## Features
- POST `/bfhl` route for processing array data as per requirements
- GET `/` and `/bfhl` routes for browser testing
- CORS enabled for browser-based requests

## How to Run Locally

1. Install dependencies:
   ```
   npm install
   ```
2. Start the server:
   ```
   npm start
   ```
3. The API will be available at `http://localhost:3000/bfhl` (POST method).

## How to Test

### Using Postman
1. Set method to POST
2. URL: `http://localhost:3000/bfhl`
3. Headers: `Content-Type: application/json`
4. Body (raw, JSON):
   ```json
   {
     "data": ["a", "1", "334", "4", "R", "$"]
   }
   ```
5. Click Send and view the response

### Using Browser
1. Open `test.html` in your browser
2. Enter JSON data and click Send
3. View the response below

## Example Response
```json
{
  "is_success": true,
  "user_id": "daksh_ranka_14112004",
  "email": "daksh.ranka2022@vitstudent.ac.in",
  "roll_number": "22BRS1302",
  "odd_numbers": ["1"],
  "even_numbers": ["334", "4"],
  "alphabets": ["A", "R"],
  "special_characters": ["$"],
  "sum": "339",
  "concat_string": "Ra"
}
```

## Author
Daksh Ranka
