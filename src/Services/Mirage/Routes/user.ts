import { Response, Request } from "miragejs";
import { handleErrors } from "../server";
import { User } from "../../../Interfaces/user.interface";
import { randomBytes } from "crypto";

const generateToken = () => randomBytes(8).toString("hex");

export interface AuthResponse {
  token: string;
  user: User;
}

export const login = (schema: any, req: Request): AuthResponse | Response => {
  const { username, password } = JSON.parse(req.requestBody);
  const user = schema.users.findBy({ username });
  if (!user) {
    console.log("Not Found");
    return handleErrors(null, "No user with that username exists");
  }
  if (password !== user.password) {
    return handleErrors(null, "Password is incorrect");
  }
  const token = generateToken();
  return {
    user: user.attrs as User,
    token,
  };
};

export const signup = (schema: any, req: Request): AuthResponse | Response => {
  const data = JSON.parse(req.requestBody);
  const exUser = schema.users.findBy({ username: data.username });

  if (exUser) {
    return handleErrors(null, "A user with this username already exists");
  }

  const user = schema.users.create(data);
  const token = generateToken();
  return {
    user: user.attrs as User,
    token,
  };
};
