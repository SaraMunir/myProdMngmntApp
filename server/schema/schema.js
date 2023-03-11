// const { projects, clients }= require('../sampleData.js')
// mongoose models
const Project = require('../models/Project')
const Client = require('../models/Client')
const User = require('../models/User')
const { 
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType
} = require('graphql');
// client type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: ()=>({
        id: { type: GraphQLID }, 
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }, 
        role: { type: GraphQLString },
    })
})
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: ()=>({
        id: { type: GraphQLID }, 
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
})
// project type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: ()=>({
        id: {type: GraphQLID }, 
        name: { type: GraphQLString },
        description: { type: GraphQLString }, 
        status: { type: GraphQLString }, 
        client: {
            type: ClientType,
            resolve(parent, args){
                // return clients.find(client => client.id === parent.clientId)
                return Client.findById(parent.clientId)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllUsers:{
            type: new GraphQLList( UserType),
            resolve(parent, args){
                // return clients;
                return User.find();
            }
        },
        clients:{
            type: new GraphQLList( ClientType),
            resolve(parent, args){
                // return clients;
                return Client.find();
            }
        },
        projects:{
            type: new GraphQLList( ProjectType),
            resolve(parent, args){
                return Project.find();
            },
        },
        project: {
            type: ProjectType, 
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                // return projects.find((project) => project.id === args.id)
                return Project.findById(args.id);
            }
        },
        client: {
            type: ClientType, 
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                // return clients.find(client => client.id === args.id)
                return Client.findById(args.id);

            }
        }
    }
})

// Mutation
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType, 
            args: {
                name: { type : GraphQLNonNull(GraphQLString)}, 
                email: { type : GraphQLNonNull(GraphQLString)}, 
                phone: { type : GraphQLNonNull(GraphQLString)}, 
            },
            resolve(parent, args){
                const user = new User({
                    name: args.name, 
                    email: args.email,
                    phone: args.phone
                });
                return user.save();
            }
        },
        addClients: {
            type: ClientType, 
            args: {
                name: { type : GraphQLNonNull(GraphQLString)}, 
                email: { type : GraphQLNonNull(GraphQLString)}, 
                phone: { type : GraphQLNonNull(GraphQLString)}, 
            },
            resolve(parent, args){
                const client = new Client({
                    name: args.name, 
                    email: args.email,
                    phone: args.phone
                });
                return client.save();
            }
        },
        // delete a client
        deleteClient:{
            type: ClientType,
            args: {
                id: { type : GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args){
                return Client.findByIdAndRemove(args.id)
            }
        },
        addProjects: {
            type: ProjectType, 
            args: {
                name: { type : GraphQLNonNull(GraphQLString)}, 
                description: { type : GraphQLNonNull(GraphQLString)}, 
                status: {  
                    type:  new GraphQLEnumType({
                        name: 'ProjectStatus', 
                        values: {
                            'new': { value: 'Not Started'}, 
                            'progress': { value: 'In Progress'},
                            'completed': { value: 'Completed'},
                        }
                    }), 
                    defaultValue: 'Not Started'
                },
                clientId: { type : GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                const project = new Project({
                    name: args.name, 
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                });
                return project.save();
            }
        },
        deleteProject: {
            type: ProjectType,
            args: {
                id: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Project.findByIdAndRemove(args.id)
            }
        }, 
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: {type: GraphQLString},
                description: { type: GraphQLString },
                status: {  
                    type:  new GraphQLEnumType({
                        name: 'ProjectStatusUpdate', 
                        values: {
                            'new': { value: 'Not Started'}, 
                            'progress': { value: 'In Progress'},
                            'completed': { value: 'Completed'},
                        }
                    }), 
                },
            },
            resolve(parent, args){
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            description: args.description,
                            status: args.status
                        }
                    }, 
                    {new: true}
                )
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery, 
    mutation
})