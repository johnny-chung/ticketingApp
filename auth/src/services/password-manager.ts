import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class PasswordManager {
  // static method -> method that we can access without create an instance of the class
  // Password.toHash will work right away, dont need cons pw = new Password, pw.toHash
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buff = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buff.toString("hex")}.${salt}`;
  }

  // stored = hasedPW.salt
  static async compare(stored: string, supplied: string) {
    const [hashedPw, salt] = stored.split(".");
    const buff = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return buff.toString("hex") === hashedPw;
  }
}
