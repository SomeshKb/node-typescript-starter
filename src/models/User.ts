import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import mongoose from "mongoose";

export enum Role {
    ADMIN = 0,
    MODERATOR = 1,
    MEMBER = 2
}

export enum UserStatus {
    ACTIVE = 1,
    DISABLED = 0,
}



export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: Date;
    isVerified: boolean;
    verificationToken: number,
    verificationExpires: Date,

    profile: {
        name: string;
        gender: string;
        location: string;
        picture: string;
    };
    role: number,
    active: number,


    comparePassword: comparePasswordFunction;
    gravatar: (size: number) => string;
};

type comparePasswordFunction = (candidatePassword: string) => any;

const userSchema = new mongoose.Schema<UserDocument>(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        isVerified: { type: Boolean, default: false },
        verificationToken: Number,
        verificationExpires: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,

        profile: {
            name: String,
            gender: String,
            location: String,
            picture: String
        },
        role: {
            type: Number, enum: Role, default: Role.MEMBER
        },
        active: {
            type: Number , default: UserStatus.ACTIVE
        },

    },
    { timestamps: true },
);

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

const comparePassword: comparePasswordFunction = function (candidatePassword) {

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
            if (err) {
                reject(err);
            }
            console.log(isMatch);
            resolve(isMatch);
        });
    });
};


userSchema.methods.comparePassword = comparePassword;

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size: number = 200) {
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash("md5").update(this.email).digest("hex");
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export const User = mongoose.model<UserDocument>("User", userSchema);
