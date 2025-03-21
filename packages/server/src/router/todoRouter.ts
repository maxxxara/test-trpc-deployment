import { trpc } from "../lib/trpc";
import data from "../data.json";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { prisma } from "../lib/prisma";
export const todoRouter = trpc.router({
  getTodos: trpc.procedure.query(async () => {
    return await prisma.todo.findMany();
  }),
  createTodo: trpc.procedure.input(z.object({
    title: z.string(),
  })).mutation(async ({ input }) => {
    await prisma.todo.create({
      data: {
        title: input.title,
        isCompleted: false,
      }
    });
  }),
});

