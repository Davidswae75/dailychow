type Options = "name" | "age" | "hobbies";

//using only certain variables as keys
type Type = {
  [key in Options]: Options;
};

const obj: Type = {
  age: "age",
  hobbies: "hobbies",
  name: "name",
};

const arr = [
  {
    player: "Messi",
    number: 10,
    profession: "Footballer",
  },
  {
    player: "Messi",
    number: 10,
    profession: "Footballer",
    //the position property becomes optional
    position: "forward",
  },
];

//using the array object to form a type
type Player = (typeof arr)[number];

const obj2: Player = {
  player: "",
  number: 0,
  profession: "",
};
