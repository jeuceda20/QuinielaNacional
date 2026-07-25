export type TestDataBatch = Readonly<{
  batchId: string;
  users: readonly Readonly<{ nickname: string; isTestUser: true }>[];
  predictionsPerUser: number;
}>;
export function createTestDataBatch(
  batchId: string,
  userCount: number,
  predictionsPerUser: number,
): TestDataBatch {
  if (!/^[a-z0-9-]{1,40}$/i.test(batchId)) throw new Error("Identificador de lote invalido.");
  if (!Number.isInteger(userCount) || userCount < 1 || userCount > 100)
    throw new Error("Cantidad de usuarios invalida.");
  if (!Number.isInteger(predictionsPerUser) || predictionsPerUser < 0 || predictionsPerUser > 100)
    throw new Error("Cantidad de pronosticos invalida.");
  return {
    batchId,
    users: Array.from({ length: userCount }, (_, index) => ({
      nickname: `test-${batchId}-${index + 1}`,
      isTestUser: true as const,
    })),
    predictionsPerUser,
  };
}
