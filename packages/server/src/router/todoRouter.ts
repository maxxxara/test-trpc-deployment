import { trpc } from "../lib/trpc";
import data from "../data.json";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

export const todoRouter = trpc.router({
  getTodos: trpc.procedure.query(async () => {
    return data;
  }),
  createTodo: trpc.procedure.input(z.object({
    title: z.string(),
  })).mutation(async ({ input }) => {
    const newTodo = {
      id: Math.random().toString(),
      title: input.title,
      completed: false,
    };
    data.push(newTodo);
    const filePath = path.resolve(__dirname, "../data.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return newTodo;
  }),
});

