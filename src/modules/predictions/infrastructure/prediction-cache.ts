import { revalidateTag, unstable_noStore } from "next/cache";

const CACHE_PROFILE = "max";

export function disablePrivatePredictionCache() {
  unstable_noStore();
}

export function revalidatePredictionCaches(matchId: string) {
  revalidateTag(`prediction:${matchId}`, CACHE_PROFILE);
  revalidateTag("dashboard", CACHE_PROFILE);
  revalidateTag("pendingPredictions", CACHE_PROFILE);
}
