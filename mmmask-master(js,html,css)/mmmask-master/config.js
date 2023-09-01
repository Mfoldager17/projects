/**
 * Get the URI to the databse,
 * depending on the environment variables:
 *
 * 1) prod = production db
 * 2) test = seperated but remote
 * 3) local = local hosted
 * 4) localTest = seperated but local
 * 5) no = remote
 */
function getMongoDbUri() {
    let uri
    switch (process.env.NODE_ENV) {
        case 'prod':
            uri = 'mongodb+srv://EAAA:Datamatiker19U@mmmask.zek8b.mongodb.net/mmmask'
            break
        case 'test':
            uri = 'mongodb+srv://EAAA:Datamatiker19U@mmmask.zek8b.mongodb.net/mmmaskTEST'
            break
        case 'local':
            uri = 'mongodb://localhost:27017/mmmask'
            break
        case 'localTest':
            uri = 'mongodb://localhost:27017/mmmaskTEST'
            break
        default:
            uri = 'mongodb+srv://EAAA:Datamatiker19U@mmmask.zek8b.mongodb.net/mmmask'
    }
    return uri
}

// exposes, port and the mongo connection uri
const config = {
    databaseURI: getMongoDbUri(),
    localPort: 8080,
    ACCESS_TOKEN_SECRET:
        '19ccdd1f694b041794fec29d0c356d9e9c788b8966df2bdd0c20eb0a87978b2525da47daaf74e722697d9464909ad9086ff39c33c70c1cd64fa8520e28b28257'
}

module.exports = config
