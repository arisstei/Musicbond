import { getAllSongs } from "@/lib/songs";
import { SITE_URL } from "@/lib/site";

// Δημόσιο, read-only feed των ιστοριών — το διαβάζει το Musicbond για να
// δείχνει ένα νήμα συζήτησης ανά τραγούδι. Χτίζεται στατικά σε κάθε deploy,
// οπότε ένα νέο .json στο content/songs/ εμφανίζεται αυτόματα.
export const dynamic = "force-static";

export function GET() {
  const songs = getAllSongs().map((s) => ({
    slug: s.slug,
    title: s.title,
    composer: s.composer || null,
    lyricist: s.lyricist || null,
    year: s.year || null,
    teaser: s.teaser || null,
    status: s.status,
    isProfile: Boolean(s.isProfile),
    url: `${SITE_URL}/song/${s.slug}`,
  }));

  return Response.json({ songs });
}
