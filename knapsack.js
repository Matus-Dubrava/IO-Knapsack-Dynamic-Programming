const sum = (x, y) => x + y;
const sumArray = arr => arr.reduce(sum, 0);

// memoize only with respect to the first two arguments - toPay, bills
// the other two are not necessary in this case
const memoizeFirstTwoArgs = fn => {
  const cache = new Map();
  return (...args) => {
    const jsonArgs = JSON.stringify(args.slice(0, 2));
    if (cache.has(jsonArgs)) { return cache.get(jsonArgs); }
    const res = fn(...args);
    cache.set(jsonArgs, res);
    return res;
  };
};

// helper function that generates all the possible solutions
// meaning, all the possible ways in which we can stuff the knapsack
// and caches those solutions;
// returns the number of possible solutions but that is not neccessary
// in this case
const _knapsack = (space, items, pick, cache) => {
  let value;
  if (space === 0) {
    value = 1;
    cache.add(pick);
  } else if (items.length === 0) {
    value = 1;
    cache.add(pick);
  } else if (space < items[0][0]) {
    value = _knapsack(space, items.slice(1), pick, cache);
  } else {
    value = _knapsack(space - items[0][0], items.slice(1), pick.concat([items[0]]), cache)
      + _knapsack(space, items.slice(1), pick, cache);
  }

  return value;
};

// uses memoized version of knapsack and provides cache to that function;
// after cache has been populated by executing memoized version of knapsack,
// find the option with biggest value
const knapsack = (space, items) => {
  const options = new Set();

  const memoizedKnapsack = memoizeFirstTwoArgs(_knapsack);
  memoizedKnapsack(space, items, [], options);

  let minLeftSpace = Infinity;
  let bestPick;

  for (const items of options) {
    let itemsSum = sumArray(items.map(v => v[1]));
    if (space - itemsSum < minLeftSpace) {
      minLeftSpace = space - itemsSum;
      bestPick = items;
    }
  }

  return {
    options,
    bestPick,
    bestValue: sumArray(bestPick.map(v => v[1]))
  };
};

const items = [[36, 1000], [20, 10], [20, 2], [15, 15]];
const space = 50;

console.log(knapsack(space, items));
