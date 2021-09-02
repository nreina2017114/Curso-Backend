const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const methodOverride = require('method-override');
const session = require('express-session');
const socketio = require('socket.io');

const app = express();
const tasksRoute = require('./routes/tasks_routes');
const RegistrationsRoutes = require('./routes/registrations_routes');
const SessionsRoutes = require('./routes/sessions_routes');
const categoriesRoutes = require('./routes/categories_routes');

const findUserMiddleware = require('./middlewares/find_user');
const authUser = require('./middlewares/auth_user');

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.set('view engine','pug');

app.use(session({
    secret: ['5r3324234234','23423423423dsd'],
    saveUninitialized:false,
    resave: false
}));

app.use(findUserMiddleware);
app.use(authUser);

app.use(tasksRoute);
app.use(RegistrationsRoutes);
app.use(SessionsRoutes);
app.use(categoriesRoutes);

app.get('/', function(req, res) {
    res.render('home', {user: req.user});
})

let server = app.listen(3000);
let io = socketio(server);
let sockets = {};


let usersCount = 0;


io.on('connection',function(socket) {

    let userId = socket.request._query.loggeduser;
    if(userId) sockets[userId] = socket;
    console.log(sockets);


    usersCount++;
    io.emit('count_updated',{count: usersCount});

    socket.on('new_task', function(data) {
        if(data.userId){
            let userSocket = sockets[data.userId];
            if(!userSocket) return;

            userSocket.emit('new_task',data);
        }
    })

    socket.on('disconnect',function() {

        Object.keys(sockets).forEach(userId=>{
            let s = sockets[userId];
            if(s.id == socket.id) sockets[userId] = null;
        });

        console.log(sockets); 

        usersCount--;
        io.emit('count_updated',{count: usersCount});
    })
})
const client = require('./realtime/client');
