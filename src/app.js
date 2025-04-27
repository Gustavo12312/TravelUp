const express = require('express');
const app = express();
const agencyRoutes = require('./Routes/agencyRoutes')
const airportRoutes = require('./Routes/airportRoutes')
const cityRoutes = require('./Routes/cityRoutes')
const hotelRoutes = require('./Routes/hotelRoutes')
const personaldetailRoutes = require('./Routes/personaldetailRoutes')
const projectRoutes = require('./Routes/projectRoutes')
const protocolRoutes = require('./Routes/protocolRoutes')
const quoteflightRoutes = require('./Routes/quoteflightRoutes')
const quotehotelRoutes = require('./Routes/quotehotelRoutes')
const quoteRoutes = require('./Routes/quoteRoutes')
const requestcommentRoutes = require('./Routes/requestcommentRoutes')
const requestRoutes = require('./Routes/requestRoutes')
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');
var cors = require('cors');
const path = require("path");

//Configurações
app.set('port', process.env.PORT||3000);

//Midlewares
app.use(express.json());

//Configurar CORS
app.use(cors());

//Rotas
app.use('/agency', agencyRoutes)
app.use('/airport', airportRoutes)
app.use('/city', cityRoutes)
app.use('/hotel', hotelRoutes)
app.use('/detail', personaldetailRoutes)
app.use('/project', projectRoutes)
app.use('/protocol', protocolRoutes)
app.use('/flight', quoteflightRoutes)
app.use('/quotehotel', quotehotelRoutes)
app.use('/quote', quoteRoutes)
app.use('/comment', requestcommentRoutes)
app.use('/request', requestRoutes)
app.use('/role', roleRoutes)
app.use('/user', userRoutes)
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.listen(app.get('port'),()=>{
    console.log("Start server on port "+app.get('port'))
})

