/**
 * Helper to extract a token from Motoko optional return values.
 * Handles both direct null/string returns and Option<string> wrapper objects.
 */
export function extractToken(result: any): string | null {
  // Direct null
  if (result === null || result === undefined) {
    return null;
  }

  // Direct string
  if (typeof result === 'string') {
    const trimmed = result.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  // Option wrapper with Some variant
  if (typeof result === 'object' && result.__kind__ === 'Some' && result.value) {
    if (typeof result.value === 'string') {
      const trimmed = result.value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }
  }

  // Option wrapper with None variant or any other invalid structure
  return null;
}
