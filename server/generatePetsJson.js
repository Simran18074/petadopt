import { writeFileSync } from "node:fs";
import { faker } from "@faker-js/faker";

const dogBreeds = [
  "Labrador",
  "German Shepherd",
  "Bulldog",
  "Beagle",
  "Poodle",
];
const catBreeds = ["Persian", "Siamese", "Maine Coon", "Bengal", "Sphynx"];
const rabbitBreeds = [
  "Mini Lop",
  "Netherland Dwarf",
  "Lionhead",
  "Flemish Giant",
];

const types = ["Dog", "Cat", "Rabbit"];
const totalPets = 500; // ya jitne pets chahiye

const pets = Array.from({ length: totalPets }, (_, i) => {
  const type = faker.helpers.arrayElement(types);
  let breed, image;

  if (type === "Dog") {
    breed = faker.helpers.arrayElement(dogBreeds);
    image = `https://placedog.net/500/500?id=${i}`;
  } else if (type === "Cat") {
    breed = faker.helpers.arrayElement(catBreeds);
    image = `https://cataas.com/cat?width=500&height=500&sig=${i}`;
  } else {
    breed = faker.helpers.arrayElement(rabbitBreeds);
    image = `https://pixabay.com/api/?key=YOUR_API_KEY&q=rabbit&image_type=photo
`;
  }

  return {
    name: faker.person.firstName(),
    type,
    breed,
    age: faker.number.int({ min: 1, max: 15 }),
    description: faker.lorem.sentence(),
    image,
  };
});

// Write JSON file
writeFileSync("pets.json", JSON.stringify(pets, null, 2));
console.log("✅ pets.json generated with 500+ pets!");
