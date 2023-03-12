
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

const db = {};
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// define the sequelize ORM instance and connect it to the db
const sequelize = new Sequelize(
    process.env.DB_DATABASE, 
    process.env.DB_USERNAME, 
    process.env.DB_PASSWORD, 
    {
        db: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        schema: process.env.DB_SCHEMA
    });
console.log(`🚀 sequelize ORM connected to ${process.env.DB_DIALECT} @ ${process.env.DB_HOST}:${process.env.DB_PORT}`);

// loading all sequelize models from the 'models' folder
fs.readdirSync(path.join(__dirname, './models'))
    .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, './models', file));
        db[model.name] = model;
    });


Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/**
 * constructResponse - constructs the API response payload 
 * 
 * containing the actual data, a count of records the data contains and an error object
 * 
 * @param {INT} count 
 * @param {ARRAY} data 
 * @param {JSON} error 
 */
let constructResponse = function (data, error) {
    return {
        count: data ? data.length : 0,
        data: data,
        error: error ? (error.name ? error.name : error) : null
    }
}


/**
 * listTodos - queries for todos based on a given query
 * 
 * @param  {JSON} query JSON structure holding the query arguments
 * @return {JSON}       output object containing the actual results (data), the result count and error
 */
db.listTodos = async (request) => {
    console.log("here"); 
    return db.todo.findAll()
        .then(res => constructResponse(res))
}

/**
 * listTodos - queries for todos based on a given mutation
 * 
 * @param  {JSON} mutation JSON structure holding the mutation arguments
 * @return {JSON}       output object containing the actual results (data), the result count and error
 */
db.createTodo = async (request) => {
    console.log("here createTodo",request); 
    await db.todo.create({
        title: request.Mutation.title,
        completed: request.Mutation.completed
    }).then(res => constructResponse(res))

    return db.todo.findAll()
    .then(res => constructResponse(res))
}
/**
 * markTodoCompleted - mutation for todos based on a given mutation
 * 
 * @param  {JSON} mutation JSON structure holding the mutation arguments
 * @return {JSON}       output object containing the actual results (data), the result count and error
 */
db.markTodoCompleted = async (request) => { 
    const todo= await db.todo.findOne({where:request.Mutation})
    if(todo) {
        todo.completed= true
        await todo.save()
    }

    return todo
}

/**
 * markTodoCompleted - mutation for todos based on a given mutation
 * 
 * @param  {JSON} mutation JSON structure holding the mutation arguments
 * @return {JSON}       output object containing the actual results (data), the result count and error
 */
db.markTodoUncompleted = async (request) => { 
    const todo= await db.todo.findOne({where:request.Mutation})
    if(todo) {
        todo.set({completed:false})
        await todo.save()
    }

    return todo
}

/**
 * markTodoCompleted - mutation for todos based on a given mutation
 * 
 * @param  {JSON} mutation JSON structure holding the mutation arguments
 * @return {JSON}       output object containing the actual results (data), the result count and error
 */
db.deleteTodo = async (request) => { 
    return await db.todo.destroy({where: request.Mutation}).then(() => true).catch(() => false)
}

export default db;