export function rejectWriteSql(): never {
  throw new Error("La consola SQL de escritura esta deshabilitada en la version 1.0.");
}
