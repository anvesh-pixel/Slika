import React, { Suspense } from "react";
import { getSearchPins } from "@/app/actions/pin";
import Feed from "@/components/feed";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; types?: string }>;
}) {
    const { q: query, types: typesStr } = await searchParams;
    const types = typesStr?.split(",").filter(Boolean);

    if (!query && (!types || types.length === 0)) {
        return (
            <main className="min-h-screen bg-background pt-24 transition-colors duration-[2000ms]">
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Search Slika</h1>
                    <p className="text-muted-foreground text-lg">Enter a search term or select a type to find pins.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background pt-24 transition-colors duration-[2000ms]">
            <div className="max-w-7xl mx-auto px-4 mb-8">
                <h1 className="text-3xl font-bold text-foreground">
                    {query ? (
                        <>Results for "<span className="text-neon-pink">{query}</span>"</>
                    ) : (
                        "Filtered Results"
                    )}
                </h1>
            </div>

            <Suspense key={`${query}-${typesStr}`} fallback={<div className="min-h-[50vh] opacity-0" />}>
                <FeedResults query={query || ""} types={types} />
            </Suspense>
        </main>
    );
}

async function FeedResults({ query, types }: { query: string; types?: string[] }) {
    const items = await getSearchPins(query, types);

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 mb-4">
                <p className="text-muted-foreground">
                    {items.length} {items.length === 1 ? "pin" : "pins"} found
                </p>
            </div>

            <Feed variant="discover" items={items} />

            {items.length === 0 && (
                <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-in fade-in duration-700">
                    <div className="text-muted-foreground mb-6">
                        <svg className="mx-auto h-24 w-24 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">No results found</h2>
                    <p className="text-muted-foreground">We couldn't find any pins matching your search. Try different keywords or browse the home feed.</p>
                </div>
            )}
        </>
    );
}
