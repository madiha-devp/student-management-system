import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  int,
} from "drizzle-orm/mysql-core";

export const students = mysqlTable("students", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  rollNumber: varchar("roll_number", { length: 50 }).notNull(),
  department: varchar("department", { length: 100 }).notNull(),
  year: int("year").notNull(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
