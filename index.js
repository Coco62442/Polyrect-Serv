const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

const RouteEleve = require('./db/routes/eleves');
const RouteProf = require('./db/routes/profs');
const RouteNote = require('./db/routes/notes');
const RouteMat = require('./db/routes/matieres');
const RouteAbsence = require('./db/routes/absences');
const RouteAdmin = require('./db/routes/admins');

app.use(morgan('tiny'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb+srv://Corentin:6tEZKqfacMUIhSFd@polyrecte.ejigc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log("Connection sucess")
}).catch((error) => {
    console.log(error);
});

app.use('/eleve', RouteEleve);
app.use('/prof', RouteProf);
app.use('/note', RouteNote);
app.use('/matiere', RouteMat);
app.use('/absence', RouteAbsence);
app.use('/admin', RouteAdmin);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});