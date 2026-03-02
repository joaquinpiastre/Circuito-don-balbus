/* eslint-disable no-restricted-globals */
/* Worker: parsea Excel en segundo plano para no bloquear la UI */
importScripts("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js");

function normalizePhone(value) {
  if (value == null) return null;
  var s = String(value).replace(/\D/g, "");
  return s.length >= 8 ? s : null;
}

function extractPhonesFromSheet(sheet) {
  var rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  var numbers = [];
  var seen = {};
  if (rows.length === 0) return numbers;
  var firstRow = rows[0] || [];
  var phoneColIndex = firstRow.findIndex(function (cell) {
    return (
      typeof cell === "string" &&
      /tel[eé]fono|numero|n[uú]mero|phone|celular|cel/i.test(String(cell).trim())
    );
  });
  var startRow = phoneColIndex >= 0 ? 1 : 0;
  for (var i = startRow; i < rows.length; i++) {
    var row = rows[i] || [];
    var cell = phoneColIndex >= 0 ? row[phoneColIndex] : row[0];
    var normalized = normalizePhone(cell);
    if (normalized && !seen[normalized]) {
      seen[normalized] = true;
      numbers.push(normalized);
    }
  }
  return numbers;
}

self.addEventListener("message", function (e) {
  try {
    var workbook = XLSX.read(e.data, { type: "array" });
    var firstSheetName = workbook.SheetNames[0];
    var sheet = workbook.Sheets[firstSheetName];
    var numbers = extractPhonesFromSheet(sheet);
    self.postMessage({ ok: true, numbers: numbers });
  } catch (err) {
    self.postMessage({ ok: false, error: (err && err.message) || String(err) });
  }
});
