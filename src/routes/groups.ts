import Group, { validate as validateGroup } from "@/models/group";
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateGroup(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const group = await Group.create(req.body);

  res.status(201).json({ id: group._id, name: group.name });
});

export default router;
