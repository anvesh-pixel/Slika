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
