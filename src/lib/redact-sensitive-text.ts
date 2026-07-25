export function redactSensitiveText(value: string): string {
  return value
    .replace(
      /(password|token|secret|authorization)\s*[=:]\s*(?:Bearer\s+)?[^\s,;]+/gi,
      "$1=[REDACTED]",
    )
    .replace(
      /\b(postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s/:@]+:[^\s/@]+@/gi,
      "$1://[REDACTED]@",
    );
}
