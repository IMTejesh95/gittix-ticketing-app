import mongo from 'mongoose';
import { Password } from '../services/password';


interface UserAttrs {
    email: string;
    password: string;
}

interface UserDoc extends mongo.Document {
    email: string;
    password: string;
}

interface UserModel extends mongo.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}


const userSchema = new mongo.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
      versionKey: false,
    },
  }
);

userSchema.pre("save", async function(done){
    console.log("In pre-save");
    if(this.isModified('password')){
        const hashedPassword = await Password.toHash(this.get('password'));
        this.set('password', hashedPassword);
    }
    done();
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongo.model<UserDoc, UserModel>('User', userSchema);


export { User };
