"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createPin(formData: {
    title: string;
    description?: string;
    imageUrl: string;
}) {
    const user = await currentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const userId = user.id;
    const email = user.emailAddresses[0].emailAddress;
    const username = user.username || user.firstName?.toLowerCase()?.replace(/\s+/g, '_') || "me";
    const avatarUrl = user.imageUrl;

    // 1. Upsert User in our DB to ensure relationship works
    await prisma.user.upsert({
        where: { id: userId },
        update: {
            username,
            avatarUrl,
            email,
        },
        create: {
            id: userId,
            username,
            avatarUrl,
            email,
        },
    });

    // 2. Create the Pin
    const pin = await prisma.pin.create({
        data: {
            title: formData.title,
            description: formData.description,
            imageUrl: formData.imageUrl,
            userId: userId,
        },
    });

    // 3. Revalidate paths
    revalidatePath("/");
    revalidatePath(`/profile/${username}`);

    return pin;
}

export async function getSearchPins(query: string, types?: string[]) {
    const where: any = {};

    if (query) {
        where.OR = [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
        ];
    }

    if (types && types.length > 0) {
        const dbTypes = types.map(t => t === 'photo' ? 'image' : t);
        where.type = { in: dbTypes };
    }

    const pins = await prisma.pin.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
            user: true,
        },
    });

    return pins.map((pin) => ({
        id: pin.id,
        type: pin.type as "image" | "video",
        url: pin.imageUrl,
        title: pin.title,
        height: 600, // Default height for layout
        user: {
            username: pin.user.username,
            avatarUrl: pin.user.avatarUrl,
        }
    }));
}

export async function getPins({ take = 40, types }: { take?: number, types?: string[] } = {}) {
    const where: any = {};

    if (types && types.length > 0) {
        const dbTypes = types.map(t => t === 'photo' ? 'image' : t);
        where.type = { in: dbTypes };
    }

    const pins = await prisma.pin.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        include: {
            user: true,
        },
    });

    return pins.map((pin) => ({
        id: pin.id,
        type: pin.type as "image" | "video",
        url: pin.imageUrl,
        title: pin.title,
        height: 600,
        user: {
            username: pin.user.username,
            avatarUrl: pin.user.avatarUrl,
        }
    }));
}
