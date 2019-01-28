const bcrypt = require('bcrypt'); // https://github.com/kelektiv/node.bcrypt.js

module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define(
        'Group',
        {
            id: {
                // Avoid usage of auto-increment numbers, UUID is a better choice
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                comment: 'Group ID',
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                comment: 'Groups title',
                // setter to standardize
                set(val) {
                    this.setDataValue(
                        'title',
                        val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
                    );
                }
            },
            description: {
                type: DataTypes.STRING,
                comment: 'group s description',
                // setter to standardize
                set(val) {
                    this.setDataValue(
                        'description',
                        val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
                    );
                }
            },
            metadata: {
                type: DataTypes.JSON,
                // Not null management
                allowNull: true,
                comment: 'Metadata'

            },
        },
    );
    paranoid: true;

    Group.associate = models => {
        Group.belongsToMany(models.Users, { through: 'Member' });
    };
    return Group;
};
