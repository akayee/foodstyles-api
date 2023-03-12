
export default (sequelize, DataTypes) => {
    const Todo = sequelize.define('todo',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            completed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            freezeTableName: true,
            tableName: 'todo',
            indexes: [
                {
                    unique: false,
                    fields: ['title']
                }
            ]
        }
    );
    return Todo;
};