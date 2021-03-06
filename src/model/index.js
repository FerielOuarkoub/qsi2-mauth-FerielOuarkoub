const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const db = {};
const basename = path.basename(module.filename);
const sequelize = new Sequelize({ host: 'localhost', dialect: 'sqlite', storage: path.join(__dirname, 'database.sqlite') });
fs.readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('triggers') === -1
  )
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
