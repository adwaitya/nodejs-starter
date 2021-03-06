import mongoose, { Document, Schema, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { string } from 'joi';

/**
 * @export
 * @interface IUserModel
 * @extends {Document}
 */
 export interface IUserModel extends Document {
    _id: Types.ObjectId;
    createdAt ? : Date;
    updatedAt ? : Date;
    name?: string;
    email: string;
    password:string;
    status: string;
    confirmationCode: string;
  }

  const userSchema: Schema = new Schema({
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false 
    },
    createdAt : {
      type: Date,
      default: new Date(),
    },
    name: {
      type: String,
      required: false,
      default:null
    },
    dob: {
      type: Date
    },
    updateAt : {
      type: Date,
      default: new Date(),
    },
    status: {
      type: String,
      enum: ['Pending', 'Active'],
      default: 'Pending'
    },
    confirmationCode: {
      type: String, 
      unique: true
    }
  },                                    {
    collection: 'usermodel',
    versionKey: false,
  });

  userSchema.pre<IUserModel>('save', function (next) {
    if (!this.isModified('password')) return next();
    console.log(`Using this: ${ this.password }`);
    // tslint:disable-next-line:no-this-assignment
    const user = this;
    user.updatedAt = new Date();
    // tslint:disable-next-line:ter-prefer-arrow-callback
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  
    return this;
  });

  async function hashPassword(user:IUserModel) {

    const password = user.password;
    const saltRounds = 10;
  
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds,  ((err, hash:any) => {
        if (err) {
          reject(err);
        }
        console.log(hash);
        resolve(hash);
      }));
    });
  
    return hashedPassword;
  }
  
  export default mongoose.model < IUserModel >('UserModel', userSchema);