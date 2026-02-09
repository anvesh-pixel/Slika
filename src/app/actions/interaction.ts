"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser as getClerkUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Ensures a user exists in the local database before performing interactions.
 */
async function ensureUserExists() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const clerkUser = await getClerkUser();
    if (!clerkUser) throw new Error("Clerk user not found");

    const username = clerkUser.username || clerkUser.firstName?.toLowerCase()?.replace(/\s+/g, '_') || `user_${userId.slice(-6)}`;
    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const avatarUrl = clerkUser.imageUrl;

    // 1. Identify the conflict
    const userWithUsername = await prisma.user.findUnique({
        where: { username }
    });

    // 2. If conflict is with a seed user, rename it to free up the username
    if (userWithUsername && userWithUsername.id !== userId && userWithUsername.id.startsWith('user_seed_')) {
        await prisma.user.update({
            where: { id: userWithUsername.id },
            data: { username: `${userWithUsername.username}_old_${Date.now()}` }
        });
    }

    // 3. Ensure the REAL user exists (the username is now free or belongs to us)
    await prisma.user.upsert({
        where: { id: userId },
        update: {
            username,
            email,
            avatarUrl,
        },
        create: {
            id: userId,
            username,
            email,
            avatarUrl,
        }
    });

    // 4. Reassign seed user's relations to the real user
    if (userWithUsername && userWithUsername.id !== userId && userWithUsername.id.startsWith('user_seed_')) {
        await prisma.$transaction(async (tx) => {
            // Reassign pins
            await tx.pin.updateMany({
                where: { userId: userWithUsername.id },
                data: { userId: userId }
            });

            // Reassign comments
            await tx.comment.updateMany({
                where: { userId: userWithUsername.id },
                data: { userId: userId }
            });

            // Reassign Likes (handle unique conflicts)
            const seedLikes = await tx.like.findMany({ where: { userId: userWithUsername.id } });
            for (const like of seedLikes) {
                await tx.like.upsert({
                    where: { userId_pinId: { userId, pinId: like.pinId } },
                    create: { userId, pinId: like.pinId },
                    update: {}
                });
            }
            await tx.like.deleteMany({ where: { userId: userWithUsername.id } });

            const seedSaves = await tx.save.findMany({ where: { userId: userWithUsername.id } });
            for (const save of seedSaves) {
                await tx.save.upsert({
                    where: { userId_pinId: { userId, pinId: save.pinId } },
                    create: { userId, pinId: save.pinId },
                    update: {}
                });
            }
            await tx.save.deleteMany({ where: { userId: userWithUsername.id } });

            // Finally delete the renamed seed user
            await tx.user.delete({ where: { id: userWithUsername.id } });
        });
    }

    return userId;
}

export async function toggleLike(pinId: number) {
    const userId = await ensureUserExists();

    const existingLike = await prisma.like.findUnique({
        where: {
            userId_pinId: {
                userId,
                pinId,
            }
        }
    });

    if (existingLike) {
        await prisma.like.delete({
            where: { id: existingLike.id }
        });
    } else {
        await prisma.like.create({
            data: { userId, pinId }
        });
    }

    revalidatePath(`/pin/${pinId}`);
    revalidatePath("/");
}

export async function toggleSave(pinId: number) {
    const userId = await ensureUserExists();

    const existingSave = await prisma.save.findUnique({
        where: {
            userId_pinId: {
                userId,
                pinId,
            }
        }
    });

    if (existingSave) {
        await prisma.save.delete({
            where: { id: existingSave.id }
        });
    } else {
        await prisma.save.create({
            data: { userId, pinId }
        });
    }

    revalidatePath(`/pin/${pinId}`);
    revalidatePath("/");
}

export async function addComment(pinId: number, content: string) {
    const userId = await ensureUserExists();

    const comment = await prisma.comment.create({
        data: {
            content,
            userId,
            pinId
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true
                }
            }
        }
    });

    revalidatePath(`/pin/${pinId}`);
    return {
        ...comment,
        createdAt: comment.createdAt.toISOString()
    };
}
