import { validateEnvironment } from "@/lib/env/environment";

import "server-only";

export const env = validateEnvironment(process.env);
