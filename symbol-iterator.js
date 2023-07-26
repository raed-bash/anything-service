const myObject = {
  name: "raed",
  age: 22,
  dob: 2002,
  [Symbol.iterator]() {
    let step = 0;
    let properties = Object.keys(this);
    return {
      next() {
        return {
          value: [properties[step], myObject[properties[step]]],
          done: step++ === properties.length,
        };
      },
    };
  },
};

for (const [key, value] of myObject) {
  console.log(key, value);
}

// Expected output: "a"
// Expected output: "b"
// Expected output: "c"
