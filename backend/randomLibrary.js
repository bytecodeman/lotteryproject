const gamesSupported = [];
gamesSupported.UNIQUE = 0;
gamesSupported.RANDOM = 1;
gamesSupported.push(
  {
    shortname: "powerball",
    longname: "Powerball",
    padding: true,
    description: "Pick 5 unique numbers from 1–69 and the Powerball from 1–26",
    type: gamesSupported.UNIQUE,
    count: 5,
    minnumber: 1,
    maxnumber: 69,
    pball: {
      minnumber: 1,
      maxnumber: 26,
    },
  },
  {
    shortname: "megamillions",
    longname: "Mega Millions",
    padding: true,
    description:
      "Pick 5 unique numbers from a set of 1-70 and one Mega Ball number from a set of 1-25.",
    type: gamesSupported.UNIQUE,
    count: 5,
    minnumber: 1,
    maxnumber: 70,
    pball: {
      minnumber: 1,
      maxnumber: 25,
    },
  },
  {
    shortname: "megabucks",
    longname: "Megabucks",
    padding: true,
    description: "Pick 6 unique numbers out of 49",
    type: gamesSupported.UNIQUE,
    count: 6,
    minnumber: 1,
    maxnumber: 49,
    pball: null,
  },
  {
    shortname: "luckyforlife",
    longname: "Lucky for Life",
    padding: true,
    description:
      "Pick 5 unique numbers out of 48 and 1 Lucky Ball number out of 18.",
    type: gamesSupported.UNIQUE,
    count: 5,
    minnumber: 1,
    maxnumber: 48,
    pball: {
      minnumber: 1,
      maxnumber: 18,
    },
  },
  {
    shortname: "numbers",
    longname: "Mass. Numbers Game",
    padding: false,
    description: "Pick 4 numbers from 0 to 9 - duplicates ok.",
    type: gamesSupported.RANDOM,
    count: 4,
    minnumber: 0,
    maxnumber: 9,
    pball: null,
  }
);

const compareObjects = (a, b) => {
  if (a === b) return true;

  if (typeof a != "object" || typeof b != "object" || a == null || b == null)
    return false;

  let keysA = Object.keys(a),
    keysB = Object.keys(b);

  if (keysA.length != keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key)) return false;

    if (typeof a[key] === "function" || typeof b[key] === "function") {
      if (a[key].toString() != b[key].toString()) return false;
    } else {
      if (!compareObjects(a[key], b[key])) return false;
    }
  }

  return true;
};

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateUniques(start, max, count, mustInclude) {
  const arr = [...Array(max - start + 1).keys()].map((e) => e + start);
  mustInclude.forEach((e) => {
    const tempIndex = arr.indexOf(e);
    if (tempIndex !== -1) {
      arr.splice(tempIndex, 1);
    }
  });
  shuffle(arr);
  arr.splice(count - mustInclude.length);
  mustInclude.forEach((e) => arr.push(e));
  return arr.sort((x, y) => x - y);
}

function randomNumber(start, max) {
  return Math.floor(max * Math.random()) + start;
}

function generateNumbers(start, max, count) {
  return Array(count)
    .fill()
    .map((e) => randomNumber(start, max));
}

function generateQuickPicks(
  gameIndex,
  noOfQP,
  mustInclude = [],
  desiredPowerBall = 0
) {
  if (gameIndex < 0 || gameIndex >= gamesSupported.length) {
    return null;
  }

  const theGame = gamesSupported[gameIndex];

  let count = 0;
  let maxCount = 0;
  if (theGame.type === gamesSupported.UNIQUE) {
    const perm = (n, r) => {
      let fact = 1;
      for (let i = 0; i < r; i++) {
        fact *= n - i;
      }
      return fact;
    };
    maxCount = perm(
      theGame.maxnumber - theGame.minnumber + 1 - mustInclude.length,
      theGame.count - mustInclude.length
    );
    if (theGame.pball && desiredPowerBall === 0) {
      maxCount *= theGame.pball.maxnumber - theGame.pball.minnumber + 1;
    }
  } else if (theGame.type === gamesSupported.RANDOM) {
    maxCount = theGame.count * (theGame.maxnumber - theGame.minnumber + 1);
    if (theGame.pball) {
      maxCount *= theGame.pball.maxnumber - theGame.pball.minnumber + 1;
    }
  }

  let picks = [];
  while (count < maxCount && picks.length < noOfQP) {
    let numbers;
    let pball;
    if (theGame.type === gamesSupported.UNIQUE) {
      numbers = generateUniques(
        theGame.minnumber,
        theGame.maxnumber,
        theGame.count,
        mustInclude
      );
      if (!theGame.pball) {
        pball = null;
      } else {
        pball =
          desiredPowerBall === 0
            ? randomNumber(theGame.pball.minnumber, theGame.pball.maxnumber)
            : desiredPowerBall;
      }
    } else if (theGame.type === gamesSupported.RANDOM) {
      numbers = generateNumbers(
        theGame.minnumber,
        theGame.maxnumber,
        theGame.count
      );
      pball = null;
    }

    const pick = {
      numbers,
    };
    if (pball !== null) {
      pick.pball = pball;
    }

    if (picks.every((e) => !compareObjects(e, pick))) {
      picks.push(pick);
    }
    count++;
  }

  return picks;
}

module.exports = {
  gamesSupported,
  generateQuickPicks,
};
