import { describe, expect, it, vi } from "vitest";

const cache = vi.hoisted(() => ({
  revalidateTag: vi.fn(),
  unstableNoStore: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidateTag: cache.revalidateTag,
  unstable_noStore: cache.unstableNoStore,
}));

import {
  disablePrivatePredictionCache,
  revalidatePredictionCaches,
} from "@/modules/predictions/infrastructure/prediction-cache";

describe("prediction cache", () => {
  it("disables caching for private prediction data", () => {
    disablePrivatePredictionCache();

    expect(cache.unstableNoStore).toHaveBeenCalledOnce();
  });

  it("revalidates only the affected prediction cache tags", () => {
    revalidatePredictionCaches("match-1");

    expect(cache.revalidateTag).toHaveBeenCalledTimes(3);
    expect(cache.revalidateTag).toHaveBeenNthCalledWith(1, "prediction:match-1", "max");
    expect(cache.revalidateTag).toHaveBeenNthCalledWith(2, "dashboard", "max");
    expect(cache.revalidateTag).toHaveBeenNthCalledWith(3, "pendingPredictions", "max");
  });
});
