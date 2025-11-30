import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type ClientDocument = HydratedDocument<Client> & {
  comparePassword(candidatePassword: string): Promise<boolean>;
};

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret: any) => {
      delete ret.password;
      return ret;
    },
  },
})
export class Client {
  @Prop({
    required: true,
    trim: true,
  })
  firstName: string;

  @Prop({
    required: true,
    trim: true,
  })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  })
  email: string;

  @Prop({
    required: true,
    match: [
      /^(\+91|0)?[6-9]\d{9}$/,
      'Please provide a valid Indian phone number',
    ],
  })
  phoneNumber: string;

  @Prop({
    required: true,
    trim: true,
  })
  address: string;

  @Prop({
    required: false,
    select: false, // Exclude password by default in queries
  })
  password?: string;

  @Prop({
    required: false,
    unique: true,
    sparse: true, // Allow null values while maintaining uniqueness
  })
  googleId?: string;

  @Prop({
    required: false,
  })
  logoUrl?: string;

  @Prop({
    required: false,
  })
  stampUrl?: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);

// Hash password before saving
ClientSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Add method to compare passwords
ClientSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};
