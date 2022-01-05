const registerValidator = (req, res, next) => {
	try {
		if (!req.files) throw new Error("images is required!")
		let users = req.select('users')
		const { username, password } = req.body
		const { images } = req.files
		
		if(!images) throw new Error("images is required!")
		if(!username) throw new Error("username is required!")
		if(!password) throw new Error("password is required!")
		
		users.forEach(user => {
			if(user.username.toLowerCase() === username.toLowerCase()) throw new Error("Such a user is available in the database")
		});

		if(images.size > 5000000) throw new Error("Max file size 5Mb!")
		if(!(images.mimetype == 'image/png' || images.mimetype == 'image/jpg')) throw new Error("invalid file type. Example(png, jpg)")

		if(typeof(username) !== 'string' || username.length < 2 || username.length > 20) {
			throw new Error("Invalid username!")
		}
		
		if (
			password.length < 4 || 
			password.length > 16 ||
			!(/[A-Za-z]/).test(password) ||
			!(/[0-9]/).test(password)
			) {
				throw new Error("Invalid password!")
			}
			
		return next()
		
	} catch(error) {
		res.status(400).json({ message: error.message })
	}
}

const loginValidator = (req, res, next) => {
	try {
		const { username, password } = req.body
		
		if(!username) throw new Error("username is required!")
		if(!password) throw new Error("password is required!")

		return next()
	} catch(error) {
		res.status(400).json({ message: error.message })
	}
}


const vidioValidation = (req, res, next) => {
	try{
        const { title } = req.body
        const { vid } = req.files
		
		if (!title) throw new Error("Title is required!")
		if (!vid) throw new Error("File is required")

		if (title.length > 50) throw new Error("Title invalid value!")
		if (vid.size > 200000000) throw new Error("File max size 200Mb") 
		if (vid.mimetype != 'video/mp4') throw new Error("Invalid vidio format! Example (mp4)") 

		return next()
    } catch (error){
        res.status(401).json({message: error.message})
    }
}

module.exports = {
	registerValidator,
	loginValidator,
	vidioValidation
}