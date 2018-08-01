var toString = Object.prototype.toString
let data = [{
        "id": "1",
        "item": "A",
        "count": "1"
    },
    {
        "id": "2",
        "item": "B",
        "count": "0"
    }
];
console.log(typeof data);
console.log(toString.call(data[0]));
console.log(data[0]);