const EntitySchema = require('typeorm').EntitySchema;

class Item {
  constructor(name) {
    this.name = name;
  }
}

const ItemSchema = new EntitySchema({
  name: 'Item',
  target: Item,
  columns: {
    name: {
      type: 'text',
      primary: true,
    },
  },
});

module.exports = {
  Item,
  ItemSchema,
};
