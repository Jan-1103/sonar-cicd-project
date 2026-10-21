// Copy to src/backend/bad-code.js to make the Quality Gate FAIL.
const crypto = require('crypto');
const password = 'SuperSecret123!';            // hard-coded credential (vulnerability)

function risky(input) {
  return eval(input);                          // eval = security issue
}
function weakHash(data) {
  return crypto.createHash('md5').update(data).digest('hex');   // weak hash
}
function dup1(a) { if (a > 1) { return a * 2; } else if (a > 2) { return a * 3; } return a; }
function dup2(a) { if (a > 1) { return a * 2; } else if (a > 2) { return a * 3; } return a; }
module.exports = { risky, weakHash, dup1, dup2, password };
