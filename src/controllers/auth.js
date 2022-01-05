const sha256 = require('sha256')
const jwt = require('jsonwebtoken')
const path = require('path')


const LOGIN = (req, res) => {
	const { username, password } = req.body
	const users = req.select('users')

	let user = users.find( user => user.username.toLowerCase() === username.toLowerCase() && user.password === sha256(password) )

	if(!user) {
		res.status(400).json({ message: "Wrong username or password!" })
	}

	res.status(200).json({
		userId: user.userId,
		message: "The user successfully logged in!",
		token: jwt.sign({ userId: user.userId, agent: req['headers']['user-agent'] }, 'SECRET_KEY')
	})
}

const REGISTER = (req, res) => {
	try {
		const { images } = req.files
		const { username, password } = req.body

		const users = req.select('users')
		const profilePhoto = req.select('profilePhoto')

		const imageName = images.name.replace(/\s/g, '')
		images.mv( path.join(process.cwd(), 'src', 'files','profilePhoto', imageName) )

		let newUser = {
			userId: users.length ? users[users.length - 1].userId + 1 : 1,
			password: sha256(password),
			username,
		}
		
		let newPhoto = {
			userId: newUser.userId,
			imageUrl: '/data/proFiles/' + imageName,
		}

		profilePhoto.push(newPhoto)
		users.push(newUser)

		req.insert('users', users)
		req.insert('profilePhoto', profilePhoto)

		res.status(201).json({
			userId: newUser.userId,
			message: "The user successfully registered!",
			token: jwt.sign({ userId: newUser.userId, agent: req['headers']['user-agent'] }, 'SECRET_KEY', { expiresIn: '10h' })
		})

	} catch(error) {
		res.status(404).json({ message: error.message })
	}
}


module.exports = {
	REGISTER,
	LOGIN
}