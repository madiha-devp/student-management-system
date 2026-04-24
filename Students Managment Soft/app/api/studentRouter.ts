import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { students } from "@db/schema";
import { eq } from "drizzle-orm";

export const studentRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(students).orderBy(students.createdAt);
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(students)
        .where(eq(students.id, input.id));
      return result[0] ?? null;
    }),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        rollNumber: z.string().min(1),
        department: z.string().min(1),
        year: z.number().min(1).max(5),
        phone: z.string().optional(),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(students).values({
        name: input.name,
        email: input.email,
        rollNumber: input.rollNumber,
        department: input.department,
        year: input.year,
        phone: input.phone ?? null,
        address: input.address ?? null,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        email: z.string().email(),
        rollNumber: z.string().min(1),
        department: z.string().min(1),
        year: z.number().min(1).max(5),
        phone: z.string().optional(),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db
        .update(students)
        .set({
          ...data,
          phone: data.phone ?? null,
          address: data.address ?? null,
        })
        .where(eq(students.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(students).where(eq(students.id, input.id));
      return { success: true };
    }),
});
