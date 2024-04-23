import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { authenticateUser } from '../../auth_util/auth';

const authRoutes = Router();

const loginSchema = z.object({
    id: z.number(),
  password: z.string(),
});

authRoutes.post('/login', async (req: Request, res: Response) => {
  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { id: id, password } = parseResult.data;
  const result = await authenticateUser(id, password);

  if (result.error) {
    return res.status(401).json({ error: result.error });
  }

  return res.status(200).json({ session: result.session });
});

export default authRoutes;
