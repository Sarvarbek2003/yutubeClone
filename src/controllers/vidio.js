const path = require('path')
const jwt = require('jsonwebtoken')
const d = new Date()
const fs = require('fs')

let y = '' + d.getFullYear()
let m = '' + d.getMonth()+1
let dat = '' + d.getDate()
let h = '' + d.getHours()
let min = '' + d.getMinutes()

let date = `${y.padStart(4,'0')}-${m.padStart(2,'0')}-${dat.padStart(2, '0')} | ${h.padStart(2, '0')}:${min.padStart(2, '0')}`

const GET = (req, res) => {
	const files = req.select('files')
	res.json(
        files.map(file => {
            return file
        })
    )
}




const POST = (req, res) => {
	try{
        const { title } = req.body
        const { vid } = req.files

        const userId = jwt.verify(req.headers.token, 'SECRET_KEY')
        const vidioName = vid.name.replace(/\s/g, '')

        vid.mv( path.join(process.cwd(), 'src', 'files', vidioName) )
        const files = req.select('files')

        let newFile = {
            userId: userId.userId,
            fileSize: parseInt(+vid.size / 1024 / 1024) + "MB",
            fileId: files.length ? files[files.length - 1].fileId + 1 : 1,
            vidioTitle: title,
            data: date,
            videoName: vidioName,
            vidioUrl: '/data/files/' + vidioName,
        }


        files.push(newFile)
        req.insert('files', files)

        res.status(200).json(
            files.filter(file => file.userId == userId)
        )

    } catch (error){
        res.status(401).json({message: error.message})
    }
}

const PUT = (req, res) => {
	try{
        console.log(req.body)
        const { fileId, vidioTitle} = req.body 
        const users = req.select('users')
        const files = req.select('files')

        if(!fileId) throw new Error("invalid File Id")

        const userId = req.userId
        
        let klyuch = users.find( user => {
            if(user.userId == userId) return true
            else return false
        })

        if(!klyuch) throw new Error("Invalid token")

        let resp = files.map( file => {
            if(file.fileId == fileId){
                file.vidioTitle = vidioTitle
            }
        })
        console.log(resp)
        if(!resp) throw new Error("invalid data") 

        req.insert('files', files)

        res.status(200).json(
            {message: "Update!!" }
        )
        
    } catch (error){
        res.status(401).json({message: error.message})
    }
}

const DELETE = async(req, res) => {
	try{
        const { fileId } = req.body 
        const users = req.select('users')
        const files = req.select('files')

        if(!fileId) throw new Error("invalid File Id")

        const userId = jwt.verify(req.headers.token, 'SECRET_KEY')
     
        let klyuch = users.find( user => {
            if(user.userId == userId.userId) return true
            else return false
        })

        if(!klyuch) throw new Error("Invalid token")

        let res = files.findIndex( file => file.fileId == fileId && file.userId == userId.userId)
        let ress = files.find(file => file.fileId == fileId)

        await fs.unlinkSync(path.join(process.cwd(),'src','files', ress.videoName))

        files.splice(res,1)
        req.insert('files', files)

        res.status(200).json(
            {message: 'Deleted!!'}
        )
        
    } catch (error){
        res.status(401).json({message: error.message})
    }
}

module.exports = {
	POST,
    PUT,
    GET,
    DELETE

}