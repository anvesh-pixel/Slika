import Feed from "@/components/feed";
import prisma from "@/lib/prisma";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <FeedItems />
    </main>
  );
}

async function FeedItems() {
  const pins = await prisma.pin.findMany({
    orderBy: { createdAt: "desc" },
    take: 40,
  });

  const items = pins.map((pin) => ({
    id: pin.id,
    type: pin.type as "image" | "video",
    url: pin.imageUrl,
    title: pin.title,
    height: 600, // Default height for layout
  }));

  return <Feed variant="discover" items={items} />;
}
