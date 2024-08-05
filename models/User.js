const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
     firstname:{
        type:String,
        required:true,
        min:3,
        max:20,
        unique:true
     },
     lastname:{
        type:String,
        required:true,
        min:3,
        max:20,
        unique:true
     },
     email:{
        type: String,
        required:true,
        max:50,
        unique:true,
     },
     password:{
        type:String,
        required:true,
        min:6,
        max:20
     },
     profilePicture:{
        type:String,
        default:""
     },
     coverPicture:{
        type:String,
        default:""
     },
     followers:{
        type:Array,
        default:[]
     },
     followings:{
        type:Array,
        default:[]
     },
     isAdmin:{
        type:Boolean,
        default:false,

     },
     desc:{
      type:String,
      max:50
     },
     city:{
      type:String,
      max:50
     },
     relathionship:{
      type:Number,
      enum:[1,2,3]
     }
},{timeStamps:true});


userSchema.statics.signup = async function (firstname, lastname, email, password) {
   if (!firstname || !lastname || !email || !password) {
       throw Error('All fields must be filled')
   }
   if (!validator.isEmail(email)) {
       throw Error('Email is not valid')
   }
   if (!validator.isStrongPassword(password, { minlength: 8, minUppercase: 1, minNumbers: 2, minSymbols: 1 })) {
       throw Error('Password not strong enough')
   }

   const exists = await this.findOne({ email })
   if (exists) {
       throw Error('Email already in use')
   }

   const salt = await bcrypt.genSaltSync(10)
   const hash = await bcrypt.hash(password, salt)
   const user = await this.create({ firstname, lastname, email, password: hash })

   return user
}

userSchema.statics.login = async function (email, password) {
   if (!email || !password) {
       throw Error('All fields must be filled')
   }
   const user = await this.findOne({ email })
   if (!user) {
       throw Error('Incorrect email')
   }
   const match = await bcrypt.compare(password, user.password)
   if (!match) {
       throw Error('Incorrect password')
   };
   return user
}

module.exports = mongoose.model("User1", userSchema)