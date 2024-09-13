import {hashSync, compareSync, genSaltSync} from "bcrypt";
import { model, Model, Schema } from "mongoose";

interface AuthDocument extends Document{
    name: string;
    email: string;
    password: string;
    role: string;
    regNumber: string;
}



interface Methods{
  compare(token: string): boolean
}

const authSchema = new Schema<AuthDocument,{}, Methods>({
    name:{type: String, required: true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    role:{type: String, enum:["student", "admin", "lecturer"], default: "student"},
    regNumber:{type: String, unique: true}// matricNumber is set to default to 0000000000 because it is required but not used for students
}, {timestamps: true});

authSchema.pre('save', function(next) {
  if(this.isModified('password')){
      const salt = genSaltSync(10)
      this.password = hashSync(this.password, salt)
  }
  next()
})

authSchema.methods.compare = function(password) {
 return compareSync(password, this.password)
}

  const authModel = model("Auth", authSchema);

  export default authModel as Model<AuthDocument, {}, Methods>;
