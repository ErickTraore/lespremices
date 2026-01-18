// File : media-backend/models/index.js
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, '..', 'config', 'config.js');
const config = require(configPath)[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host || 'mariadb',
  port: config.port || 3306,
  dialect: config.dialect || 'mariadb',
  logging: false,
});

// Import des modèles
const Media = require('./media')(sequelize, DataTypes);
const MediaProfile = require('./mediaProfile')(sequelize, DataTypes);

// Définir les associations
if (Media.associate) Media.associate({ MediaProfile });
if (MediaProfile.associate) MediaProfile.associate({ Media });

module.exports = {
  sequelize,
  Media,
  MediaProfile,
};