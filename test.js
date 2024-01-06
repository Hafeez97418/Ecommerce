
let val = ["one", "two", "three", "four"]
let value = val.toString();
value = value.replace(/\[|\]/g, '')
value = value.replace(/"/g, ''); // Remove double quotes
console.log(value);