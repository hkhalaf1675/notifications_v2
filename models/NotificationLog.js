module.exports = (sequelize, DataTypes) => {
    const NotificationLog = sequelize.define('NotificationLog', {
        type : {
            type: DataTypes.ENUM('email', 'firebase'),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    NotificationLog.associate = models => {
        NotificationLog.belongsTo(models.User, {
            foreignKey: "userId",
            as: "notificationLogs"
        });
    }

    return NotificationLog;
}

