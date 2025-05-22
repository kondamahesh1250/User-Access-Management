import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Software } from "../entities/Software";
import { authenticate } from "../middleware/auth";

const router = Router();
const softwareRepo = AppDataSource.getRepository(Software);

// Admin-only route to create software
router.post("/", authenticate(["Admin"]), async (req: Request, res: Response): Promise<void> => {
  const { name, description, accessLevels } = req.body;

  try {
    const software = softwareRepo.create({ name, description, accessLevels });
    await softwareRepo.save(software);
    res.status(201).json(software);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// Get all software (open or restricted access, your choice)
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const software = await softwareRepo.find();
    res.json(software);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

export default router;
