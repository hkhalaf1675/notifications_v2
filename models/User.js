module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userId : {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        // optional if there is token or not
        firebaseToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
    });

    User.associate = models => {
        User.hasMany(models.NotificationLog, {
            foreignKey: "userId",
            as: "notificationLogs"
        });
    }

    return User;
}

