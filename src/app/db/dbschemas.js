const heroSchema = {
  title: "hero schema",
  description: "describes a simple hero",
  version: 0,
  primaryKey: "name",
  type: "object",
  properties: {
    name: {
      type: "string",
      primary: true,
      maxLength: 100,
    },
    color: {
      type: "string",
    },
  },
  required: ["color"],
};

const animalSchema = {
  title: "Animal schema",
  description: "describes a simple Animal",
  version: 0,
  primaryKey: "name",
  type: "object",
  properties: {
    name: {
      type: "string",
      primary: true,
      maxLength: 100,
    },
    owner: {
      type: "string",
    },
  },
  required: ["color"],
};

module.exports = { heroSchema, animalSchema };
