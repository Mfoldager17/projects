const express = require('express')
const app = express()
const config = require('./config')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const controllerToken = require('./controllers/token-controller')

const mongoose = require('mongoose')
mongoose.connect(config.databaseURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
})

////////////
// Middleware
app.use(express.json())
// Must be above app.use(requireAuthentication) to avoid locking static behind authentication
app.use(express.static(__dirname + '/public'))

// Sets up the session, which is stored in the DB
app.use(
    session({
        secret: 'flying high',
        resave: false,
        saveUninitialized: true,
        cookie: {},
        // cookie: { secure: true }
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            secret: 'voldemort'
        })
    })
)

/**
 * Auth is enabled
 *
 * In short: tells whether the authentication is enabled
 *
 * Reasoning: when running tests, and as you develop it's inconvenient to reauthenticate
 * - if environment is started with "npm start" security must be enabled, since production is assumed
 *
 * @returns {Boolean} true if security is enabled else false
 */
function authIsEnabled() {
    const env = process.env.NODE_ENV
    if (env === 'prod') return true
    if (app.enabled('testEnableAuthentication')) return true
    if (env.match(/test/u)) return false
    return false
}

/**
 * Require Authentication (Middleware function)
 * if valid authenticated given: proceeds to next()
 * else: throws an error 'Unauthenticated' error
 */
function requireAuthentication(req, res, next) {
    res.locals.authenticated = req.session.authenticated // Each endpoint (thus hbs) can access this

    if (req.path === '/' || req.path === '/login') next()
    else if (req.session.authenticated || !authIsEnabled()) next()
    else if (req.query.token) {
        const tokenAuth = controllerToken.verifyTokenUrlWithErrorCode(req.path, req.query.token)
        if (tokenAuth === true) {
            res.locals.authenticatedtoken = true
            next()
        } else throw new Error(tokenAuth)
    } else throw new Error('Unauthenticated')
}

/**
 * Auth Error Handler
 *
 * Redirects user to reapply authentication, if user is unauthenticated
 */
function authErrorHandler(error, req, res, next) {
    if (error.message === 'Unauthenticated')
        res.status(401).render('./login.hbs', { title: 'Login', error: error.message })
    else if (error.message === 401) res.render('./error.hbs', { layout: false, error })
    else next()
}

// Enables authentication handler along with it's errorHandler
app.use(requireAuthentication)
app.use(authErrorHandler)

/**
 * Handlebars, used for templating
 * partials located inside partials dir
 * helper file 'handlebar-helpers' exports functions to hbs files
 * runtimeOptions (allow ones), are for nested parsing of parameters
 */
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    partialsDir: __dirname + '/views/partials/',
    helpers: require('./handlebar-helpers'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})
app.engine('.hbs', hbs.engine)
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

////////////
// Endpoints
app.get('/', (req, res) => {
    res.render('./index.hbs', {})
})
    .use('/bands', require('./routes/http/bands-router'))
    .use('/promoters', require('./routes/http/promoters-router'))
    .use('/contracts', require('./routes/http/contracts-router'))
    .use('/concerts', require('./routes/http/concerts-router'))
    .use('/login', require('./routes/http/users-router'))
    .use('/tours', require('./routes/http/tours-router'))
    .use('/invoices', require('./routes/http/invoices-router'))
    .use('/standards', require('./routes/http/standards-router'))
    .use('/venues', require('./routes/http/venues-router'))
    .use('/api', require('./routes/api/bands-api'))
    .use('/api', require('./routes/api/promoter-api'))
    .use('/api', require('./routes/api/contract-api'))
    .use('/api', require('./routes/api/concert-api'))
    .use('/api', require('./routes/api/tours-api'))
    .use('/api', require('./routes/api/invoice-api'))
    .use('/api', require('./routes/api/standard-api'))
    .use('/api', require('./routes/api/token-api'))
    .use('/api', require('./routes/api/venue-api'))

////////////
// Run
const PORT = process.env.PORT || config.localPort // if process sets port (heroku) else default from config
app.listen(PORT, () => console.log(`Running on port http://localhost:${PORT}`))

////////////
// Exports, required for test
module.exports = app
