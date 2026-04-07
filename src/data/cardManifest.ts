// Sequential card numbers 01–71, matching public/CardSet/{lang}/ filenames
export const cardManifest: string[] = Array.from({ length: 71 }, (_, i) =>
  String(i + 1).padStart(2, '0')
)
