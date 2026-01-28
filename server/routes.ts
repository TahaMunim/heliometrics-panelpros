import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.slides.list.path, async (_req, res) => {
    const slides = await storage.getSlides();
    res.json(slides);
  });

  return httpServer;
}
