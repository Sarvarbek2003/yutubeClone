const GET = (req, res) => {
	const users = req.select('users')
	res.json(users.map(user => {
		delete user.password
		return user
	}))
}

module.exports = {
	GET
}