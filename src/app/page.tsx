import Feed from "@/components/feed";
import { getPins } from "@/app/actions/pin";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ types?: string }>;
}) {
  const { types: typesStr } = await searchParams;
  const typesArr = typesStr?.split(",").filter(Boolean);

  return (
    <main className="min-h-screen bg-background transition-colors duration-[2000ms]">
      <Suspense key={typesStr || "all"} fallback={<div className="w-full h-[60vh] flex items-center justify-center opacity-0 animate-in fade-in duration-500" />}>
        <FeedItems types={typesArr} />
      </Suspense>
    </main>
  );
}

async function FeedItems({ types }: { types?: string[] }) {
  const items = await getPins({ types });

  return <Feed variant="discover" items={items} />;
}
