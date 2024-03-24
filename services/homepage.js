//dummy route
function getAllUsers(req, res) {
    users = ['user1', "user2", "user3"]
    res.json({ users })
}

module.exports = { getAllUsers }