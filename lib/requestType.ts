import { z } from "zod";

export const requestBodySchema = z.object({
    sender: z.string(),
    receiver: z.string(),
  });