import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { authenticateUser } from "../../auth_util/auth";

const authRoutes = Router();

const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});

authRoutes.post("/login", async (req: Request, res: Response) => {
  console.log(1);
  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { email, password } = parseResult.data;
  const result = await authenticateUser(email, password);

  if (result.error) {
    return res.status(401).json({ error: result.error });
  }

  return res.status(200).json({ session: result.session });
});

export default authRoutes;
