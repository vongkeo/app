const TEN = 10;
const ONE_HUNDRED = 100;
const ONE_THOUSAND = 1000;
const ONE_MILLION = 1000000;
const ONE_BILLION = 1000000000;
const ONE_TRILLION = 1000000000000;
const ONE_QUADRILLION = 1000000000000000;
const MAX = 9007199254740992;

const LESS_THAN_TWENTY = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

const TENTHS_LESS_THAN_HUNDRED = [
  "zero",
  "ten",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

// numberInput event listener
document.getElementById("numberInput").addEventListener("input", function () {
  const input = this.value.replace(/[^0-9-]/g, "");
  const num = parseInt(input);
  const clean = this.value.replace(/[^0-9]/g, "");
  if (clean) {
    this.value = parseInt(clean, 10).toLocaleString("en-US");
  } else {
    this.value = "";
  }
  // check limit and valid number
  if (isNaN(num) || Math.abs(num) > MAX) {
    document.getElementById("englishResult").textContent =
      "Please enter a valid number (Max: ±9,007,199,254,740,992)";
    document.getElementById("laoResult").textContent =
      "ກະລຸນາໃສ່ຕົວເລກທີ່ຖືກຕ້ອງ (ສູງສຸດ: ±9,007,199,254,740,992)";
  } else {
    try {
      document.getElementById("englishResult").textContent =
        numberToWordsEN(num);
      document.getElementById("laoResult").textContent = numberToWordsLA(
        Math.abs(num)
      );
      if (num < 0) {
        document.getElementById("laoResult").textContent =
          "ລົບ " + document.getElementById("laoResult").textContent;
      }
    } catch (error) {
      document.getElementById("englishResult").textContent =
        "Error converting number";
      document.getElementById("laoResult").textContent =
        "ເກີດຂໍ້ຜິດພາດໃນການແປງຕົວເລກ";
    }
  }
});

function numberToWordsEN(number) {
  var num = parseInt(number, 10);
  if (!isFinite(num)) throw new TypeError("Not a finite number");
  return generateWords(num);
}

function generateWords(number, words) {
  var remainder, word;

  if (number === 0) {
    return !words ? "zero" : words.join(" ").replace(/,$/, "");
  }
  if (!words) {
    words = [];
  }
  if (number < 0) {
    words.push("minus");
    number = Math.abs(number);
  }
  if (number < 20) {
    remainder = 0;
    word = LESS_THAN_TWENTY[number];
  } else if (number < ONE_HUNDRED) {
    remainder = number % TEN;
    word = TENTHS_LESS_THAN_HUNDRED[Math.floor(number / TEN)];
    if (remainder) {
      word += "-" + LESS_THAN_TWENTY[remainder];
      remainder = 0;
    }
  } else if (number < ONE_THOUSAND) {
    remainder = number % ONE_HUNDRED;
    word = generateWords(Math.floor(number / ONE_HUNDRED)) + " hundred";
  } else if (number < ONE_MILLION) {
    remainder = number % ONE_THOUSAND;
    word = generateWords(Math.floor(number / ONE_THOUSAND)) + " thousand,";
  } else if (number < ONE_BILLION) {
    remainder = number % ONE_MILLION;
    word = generateWords(Math.floor(number / ONE_MILLION)) + " million,";
  } else if (number < ONE_TRILLION) {
    remainder = number % ONE_BILLION;
    word = generateWords(Math.floor(number / ONE_BILLION)) + " billion,";
  } else if (number < ONE_QUADRILLION) {
    remainder = number % ONE_TRILLION;
    word = generateWords(Math.floor(number / ONE_TRILLION)) + " trillion,";
  } else if (number <= MAX) {
    remainder = number % ONE_QUADRILLION;
    word =
      generateWords(Math.floor(number / ONE_QUADRILLION)) + " quadrillion,";
  }
  words.push(word);
  return generateWords(remainder, words);
}

function numberToWordsLA(num) {
  if (num === 0) return "ສູນ";

  const leveltext = ["", "ສິບ", "ຮ້ອຍ", "ພັນ", "ໝື່ນ", "ແສນ"];
  const numtext = [
    "",
    "ໜຶ່ງ",
    "ສອງ",
    "ສາມ",
    "ສີ່",
    "ຫ້າ",
    "ຫົກ",
    "ເຈັດ",
    "ແປດ",
    "ເກົ້າ",
  ];
  let res = "";
  let number = num.toString();
  let et = false;

  for (let i = 0; i < number.length; i++) {
    const val = parseInt(number[i], 10);
    const pos = number.length - i - 1;

    if (val > 0) {
      if (val === 1 && pos % leveltext.length === 1) {
        res += "ສິບ";
      } else if (val === 2 && pos % leveltext.length === 1) {
        res += "ຊາວ";
      } else if (val === 1 && pos % leveltext.length === 0 && et) {
        res += "ເອັດ";
      } else {
        res += numtext[val] + leveltext[pos % leveltext.length];
        et = false;
      }
    }

    if (pos % leveltext.length === 0 && pos > 0) {
      res += "ລ້ານ";
    }

    if (val !== 0 && pos % leveltext.length === 1) {
      et = true;
    }
  }
  return res || "ສູນ";
}

$(document).ready(function () {
  $("#numberInput").on("input", function () {
    const input = $(this)
      .val()
      .replace(/[^0-9-]/g, "");
    const num = parseInt(input);

    if (input === "") {
      $("#englishResult").text("");
      $("#laoResult").text("");
    } else if (isNaN(num) || Math.abs(num) > MAX) {
      $("#englishResult").text(
        "Please enter a valid number (Max: ±9,007,199,254,740,992)"
      );
      $("#laoResult").text(
        "ກະລຸນາໃສ່ຕົວເລກທີ່ຖືກຕ້ອງ (ສູງສຸດ: ±9,007,199,254,740,992)"
      );
    } else {
      try {
        $("#englishResult").text(numberToWordsEN(num));
        $("#laoResult").text(numberToWordsLA(Math.abs(num)));
        if (num < 0) {
          $("#laoResult").prepend("ລົບ ");
        }
      } catch (error) {
        $("#englishResult").text("Error converting number");
        $("#laoResult").text("ເກີດຂໍ້ຜິດພາດໃນການແປງຕົວເລກ");
      }
    }
  });
});
