import { Server, Model, Factory, belongsTo, hasMany, Response } from "miragejs";
import { login, signup } from "./Routes//user";
import { create, getDiaries, updateDiary } from "./Routes/diary";
import { addEntry, getEntries, updateEntries } from "./Routes/entry";

export const handleErrors = (error: any, message = "An error ocurred") => {
  console.error("Error: ", error);
  return new Response(400, undefined, {
    data: {
      message,
      isError: true,
    },
  });
};

export const setupServer = (env?: string): Server => {
  return new Server({
    environment: env ?? "development",

    models: {
      user: Model.extend({
        diary: hasMany(),
      }),
      diary: Model.extend({
        user: belongsTo(),
        entry: hasMany(),
      }),
      entry: Model.extend({
        diary: belongsTo(),
      }),
    },

    factories: {
      user: Factory.extend({
        username: "text",
        password: "password",
        email: "test@email.com",
      }),
    },

    seeds: (server): any => {
      server.create("user");
    },

    routes(): void {
      this.urlPrefix = "https://diaries.app";

      this.get("/diaries/entries/:id", getEntries);
      this.get("/diaries/:id", getDiaries);

      this.post("/auth/login", login);
      this.post("/auth/signup", signup);

      this.post("/diaries/", create);
      this.post("/diaries/entries/:id", addEntry);

      this.put("/diaries/:id", updateDiary);
      this.put("/diaries/entries/:id", updateEntries);
    },
  });
};
