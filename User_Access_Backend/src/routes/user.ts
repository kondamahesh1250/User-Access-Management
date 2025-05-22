import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { authenticate,AuthRequest } from "../middleware/auth";

const router = Router();
const userRepo = AppDataSource.getRepository(User);

router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existing = await userRepo.findOne({ where: { email } });
    if (existing) {
      res.status(400).json({ message: "User already exists!" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = userRepo.create({ name, email, password: hashed, role: "Employee" });
    await userRepo.save(user);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, role: user.role });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.get("/currentuser", authenticate(["Admin", "Manager", "Employee"]), async (req: AuthRequest, res: Response): Promise<void> => {

  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await userRepo.findOne({
      where: { id: req.user!.id },
      select: ["name"], // only return required fields
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
   } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
}
);

export default router;
