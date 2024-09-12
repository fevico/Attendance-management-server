import { compare, hash } from "bcrypt";
import { model, Model, Schema } from "mongoose";

interface AuthDocument extends Document{
    name: string;
    email: string;
    password: string;
    role: string;
    regNumber: string;
}


interface UserMethods {
    comparePassword(password: string): Promise<boolean>;
  }

const authSchema = new Schema<AuthDocument, Model<AuthDocument>, UserMethods>({
    name:{type: String, required: true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    role:{type: String, enum:["student", "admin", "lecturer"], default: "student"},
    regNumber:{type: String, unique: true}// matricNumber is set to default to 0000000000 because it is required but not used for students
}, {timestamps: true});

authSchema.pre('save', async function (next) {
    // Hash the password
    if (this.isModified("password")) {
      this.password = await hash(this.password, 10);
    }
    next();
  });
  
  authSchema.methods.comparePassword = async function (password) {
    const result = await compare(password, this.password);
    return result;
  };

  const authModel = model("Auth", authSchema);

  export default authModel;