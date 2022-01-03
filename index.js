const express = require('express'); // express js
const blogRoute = require('./routes/index.js')
const flash = require('express-flash');
const session = require('express-session');

const app = express();
const PORT = 5002; // port

app.set('view engine', 'hbs'); // set template engine

app.use('/public', express.static(__dirname+'/public')); // static folder
app.use('/uploads', express.static(__dirname+'/uploads')); // static folder
app.use(express.urlencoded({ extended: false}));

app.use(
	session({
		cookie: {
			maxAge: 2 * 60 * 60 * 1000,
			secure: false,
			httpOnly: true
		},
		store: new session.MemoryStore(),
		saveUninitialized: true,
		resave: false,
		secret: 'secretValue'
	})
)
app.use(flash())

app.use('/', blogRoute)

// app.get('/', (req, res) => {
// 	res.send('ini halaman utama');
// });

app.listen(process.env.PORT || 5000, function(){
	console.log(`Server starting on PORT: ${PORT}`);
});