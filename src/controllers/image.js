
const POST = (req, res) => {
	const { userId } = req.body
	const files = req.select('profilePhoto')
	if(userId) {
		res.status(200).json(
			files.filter(file => file.userId == userId)
		)
	} else {
		res.status(200).json(files)
	}
}

module.exports = {
	POST
}