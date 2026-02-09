"use server";

import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
    displayName: string;
    username: string;
    bio: string;
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const { displayName, username, bio } = data;

    // 1. Update our local database
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            displayName,
            username,
            bio,
        },
    });

    // 2. Sync with Clerk
    try {
        const client = await clerkClient();
        await client.users.updateUser(userId, {
            username: username,
            firstName: displayName,
        });
    } catch (error: any) {
        console.error("Failed to sync with Clerk:", error);
        // We don't necessarily want to fail the whole update if Clerk sync fails,
        // but the user should know if the username is taken in Clerk.
        if (error.errors?.[0]?.code === "form_identifier_exists") {
            throw new Error("Username is already taken.");
        }
    }

    revalidatePath(`/profile/${username}`);
    revalidatePath("/");

    return updatedUser;
}

export async function toggleFollow(targetUserId: string) {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) throw new Error("Unauthorized");
    if (currentUserId === targetUserId) throw new Error("Cannot follow yourself");

    const existingFollow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUserId,
                followingId: targetUserId,
            }
        }
    });

    if (existingFollow) {
        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                }
            }
        });
    } else {
        await prisma.follow.create({
            data: {
                followerId: currentUserId,
                followingId: targetUserId,
            }
        });
    }

    // Fetch user to revalidate by username
    const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { username: true }
    });

    if (targetUser?.username) {
        revalidatePath(`/profile/${targetUser.username}`);
    }
    revalidatePath("/");
}
