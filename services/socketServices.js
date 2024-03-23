const DbClient = require('../utils/db')

const dbClient = new DbClient()

async function getUser(socket) {
    // The expected return from handshake query for 
    //now is "null" because we have not started authenticating the user to get the cookies
    const email = socket.handshake.query.email
    console.log(socket.id)
    if (email === 'null') { //am using null as a str coz the frontend will return it as string
        console.log('no email found, probably because no cookie was found')
    }

    try {
        const user = await dbClient.getUserByEmail(email)
        if (!user) {
            console.log('cannot get user from db')
        }
        return user
    } catch(error) {
        console.log(error)
    }
}

module.exports = { getUser }