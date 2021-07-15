require('dotenv').config(); // Referente as variáveis de Ambiente
const express = require('express');
const app = express();
const mongoose = require('mongoose'); // Modela a base de dados
mongoose.connect(process.env.CONNECTIONSTRING, { 
    useNewUrlParser: true,
     useUnifiedTopology: true,
     useFindAndModify: false,
     }).then(() => {
    app.emit('Ready.');
}).catch(error => console.log(error));
const session = require('express-session'); // Checa cookie do usuário
const MongoStore = require('connect-mongo'); // Para que as sessões sejam salvas dentro da base de dados
const flash = require('connect-flash'); // Mensagens autodestrutivas
const routes = require('./routes'); // Rotas da aplicação
const path = require('path'); // Trabalha com caminhos
const helmet = require('helmet'); // Parte de segurança
const csrf = require('csurf'); // Parte de segurança
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware'); // Middlewares
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public'))); // Arquivos estáticos, que podem ser acessados diretamente
const sessionOptions = session({
    secret: 'hfduoigdsljflsdjflkjsdlkfjl',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});
app.use(sessionOptions);
app.use(flash());
app.set('views', path.resolve(__dirname, 'src', 'views')); // Arquivos que se renderizam na tela
app.set('view engine', 'ejs'); // Qual engine a ser utilizada
app.use(csrf());
app.use(middlewareGlobal); // Middleware
app.use(checkCsrfError); // Middleware
app.use(csrfMiddleware); // MIddleware
app.use(routes); // Rotas
app.on('Ready.', () => {
    app.listen(3000, () => {
        console.log('Acess http://localhost:3000');
        console.log('Server running on port 3000.');
    });
});
