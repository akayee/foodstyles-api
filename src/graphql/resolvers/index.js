
import { PubSub } from 'apollo-server';

const pubsub = new PubSub();

/**
 * extractInput - extracts the actual input payload from the graphql input
 * in case no input was provided, the function returns an empty JSON object
 * 
 * @param {*} args 
 */
let getQuery = function (args) {
  return args.query ? args.query : {}
}

let getInput = function (args) {
  return args.input ? args.input : {}
}

export default {
  Query: {
    listTodos:(parent, args, { db }, info) => db.listTodos()
  },
  Mutation: {
    createTodo: (parent, args, { db }, info) => db.createTodo( args, info),
    markTodoCompleted: (parent, args, { db }, info) => db.markTodoCompleted( args, info),
    markTodoUncompleted: (parent, args, { db }, info) => db.markTodoUncompleted( args, info),
    deleteTodo: (parent, args, { db }, info) => db.deleteTodo( args, info),
  }
};
