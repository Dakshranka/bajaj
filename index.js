const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for HTML form posts

// === Your details ===
const FULL_NAME = "daksh_ranka";   // lowercase
const DOB = "14112004";         // ddmmyyyy
const EMAIL = "daksh.ranka2022@vitstudent.ac.in";
const ROLL_NUMBER = "22BRS1302";

// ---------- helpers ----------
function parseDataField(dataField) {
  // Already an array (e.g., JSON body: { "data": ["a","1"] })
  if (Array.isArray(dataField)) return dataField.map(String);

  // From HTML form: could be comma-separated OR a JSON array string
  if (typeof dataField === "string") {
    const s = dataField.trim();

    // If it's a JSON array string
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const arr = JSON.parse(s);
        if (Array.isArray(arr)) return arr.map(x => String(x));
      } catch (_) { /* fall through to CSV */ }
    }

    // Otherwise treat as CSV
    return s
      .split(",")
      .map(t => t.trim())
      .filter(Boolean)
      // strip one pair of wrapping quotes if present
      .map(t => t.replace(/^['"]|['"]$/g, ""))
      .map(String);
  }
  return null;
}

const isIntegerString = (s) => /^-?\d+$/.test(s);
const isAlphabetic = (s) => /^[A-Za-z]+$/.test(s);

// Builds the HTML page for browser
function renderHtml(response) {
  const row = (k, v) => `<tr><th>${k}</th><td>${v}</td></tr>`;
  return `
  <html>
    <head>
      <title>BFHL API Response</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; background: #f4f4f9; }
        h2 { margin: 0 0 16px; }
        table { border-collapse: collapse; width: 800px; background: #fff; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #f0f0f0; width: 220px; }
        pre { background: #272822; color: #f8f8f2; padding: 12px; border-radius: 6px; overflow:auto; }
        .wrap { max-width: 900px; }
        .tip { margin: 12px 0 20px; color:#555; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <h2>BFHL API Response</h2>
        <div class="tip">Tip: On the home page you can submit either a JSON array like <code>["a","1","334","4","R","$"]</code> or a comma list like <code>a,1,334,4,R,$</code>.</div>
        <table>
          ${row("is_success", String(response.is_success))}
          ${row("user_id", response.user_id)}
          ${row("email", response.email)}
          ${row("roll_number", response.roll_number)}
          ${row("odd_numbers", response.odd_numbers.join(", "))}
          ${row("even_numbers", response.even_numbers.join(", "))}
          ${row("alphabets", response.alphabets.join(", "))}
          ${row("special_characters", response.special_characters.join(", "))}
          ${row("sum", response.sum)}
          ${row("concat_string", response.concat_string)}
        </table>
        <h3>Raw JSON</h3>
        <pre>${JSON.stringify(response, null, 2)}</pre>
      </div>
    </body>
  </html>`;
}

// ---------- routes ----------
app.get("/", (req, res) => {
  res.send(`
  <html>
    <head>
      <title>BFHL API</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; background: #f4f4f9; }
        input, textarea, button { padding: 10px; margin: 6px 0; width: 100%; max-width: 680px; }
        textarea { height: 80px; }
        button { width: auto; background: #4CAF50; color: white; border: none; cursor: pointer; }
        button:hover { background: #3f9a44; }
        .hint { color:#555; }
        code { background:#eee; padding:2px 4px; border-radius:4px; }
      </style>
    </head>
    <body>
      <h2>BFHL API Test Form</h2>
      <div class="hint">
        Enter either a JSON array like <code>["a","1","334","4","R","$"]</code>
        or a comma list like <code>a,1,334,4,R,$</code>.
      </div>
      <form method="POST" action="/bfhl">
        <textarea name="data" placeholder='["a","1","334","4","R","$"]'></textarea>
        <br/>
        <button type="submit">Submit</button>
      </form>
    </body>
  </html>`);
});

app.get("/bfhl", (req, res) => {
  res.json({ message: "This is the BFHL API. Please use POST method with input data." });
});

app.post("/bfhl", (req, res) => {
  try {
    let parsed = parseDataField(req.body?.data);

    if (!parsed) {
      return res.status(400).send("<h2>Invalid input. Provide an array or a comma-separated list.</h2>");
    }

    // --- classification & computations ---
    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;

    for (const tokenRaw of parsed) {
      const token = String(tokenRaw);

      if (isIntegerString(token)) {
        const n = parseInt(token, 10);
        sum += n;
        (n % 2 === 0 ? even_numbers : odd_numbers).push(token);
      } else if (isAlphabetic(token)) {
        alphabets.push(token.toUpperCase());
      } else {
        special_characters.push(token);
      }
    }

    // concat_string: all letters from input (character-wise), reversed, alternating caps
    const letters = parsed.join("").match(/[A-Za-z]/g) || [];
    const concat_string = letters
      .reverse()
      .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
      .join("");

    const response = {
      is_success: true,
      user_id: `${FULL_NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    };

    // Return JSON to API clients; pretty HTML to browsers/form posts
    const wantsJson =
      req.is("application/json") ||
      (req.get("accept") || "").includes("application/json");

    if (wantsJson) {
      res.json(response);
    } else {
      res.send(renderHtml(response));
    }
  } catch (err) {
    res.status(500).send(`<h2>Error: ${err.message}</h2>`);
  }
});

// ---------- server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
