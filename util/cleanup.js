
import db from '../src/db'

// synchronize the sequelize mode with postgres (and alters the database if needed)
console.log('Attention : db schema recreate started...');
db.sequelize.sync({ force: true, logging: console.log })
    .then(() => {
        console.log('performing basic ETL');
        runBasicETL();
        console.log('done');
    })
    .catch(err => {
        console.log("err: ", err)
    })
console.log("done")


// run some basic ETL
const runBasicETL = async () => {

    await db.todo.destroy({
        where: {},
        truncate: true,
        cascade: true
    })

    // create two example todo
    await db.todo.create({
        title: 'Learn postgresql',
    });
}

