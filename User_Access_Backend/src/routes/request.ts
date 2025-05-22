import { Router, Response } from "express";
import { AppDataSource } from "../data-source";
import { Request as TypeORMRequest } from "../entities/Request";
import { User } from "../entities/User";
import { Software } from "../entities/Software";
import { authenticate } from "../middleware/auth";
import { AuthRequest } from "../middleware/auth"; // or from types/AuthRequest if extracted

const router = Router();

const requestRepo = AppDataSource.getRepository(TypeORMRequest);
const userRepo = AppDataSource.getRepository(User);
const softwareRepo = AppDataSource.getRepository(Software);

router.post("/", authenticate(["Employee"]), async (req: AuthRequest, res: Response): Promise<void> => {
  const { softwareId, accessType, reason } = req.body;

  try {
    const user = await userRepo.findOneBy({ id: req.user!.id });
    const software = await softwareRepo.findOneBy({ id: softwareId });

    if (!user || !software) {
      res.status(404).json({ message: "Invalid data" });
      return;
    }

    const newRequest = requestRepo.create({
      user,
      software,
      accessType,
      reason,
      status: "Pending",
    });

    await requestRepo.save(newRequest);
    res.status(201).json(newRequest);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.get("/myreqs", authenticate(["Employee"]), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requests = await requestRepo.find({
      where: { user: { id: req.user!.id } },
      relations: ["software"]
    });
    res.json(requests);
   } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.get("/", authenticate(["Manager"]), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requests = await requestRepo.find({
      relations: ["user", "software"],
    });
    res.json(requests);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.patch("/:id", authenticate(["Manager"]), async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body;

  try {
    const request = await requestRepo.findOneBy({ id: parseInt(req.params.id) });

    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    request.status = status;
    await requestRepo.save(request);
    res.json(request);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

export default router;
