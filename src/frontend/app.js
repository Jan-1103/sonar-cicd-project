function formatResult(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A';
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function buildUrl(op, a, b) {
  return `/calc/${encodeURIComponent(op)}?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`;
}

if (typeof module !== 'undefined') module.exports = { formatResult, buildUrl };
