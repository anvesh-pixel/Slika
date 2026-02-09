"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        setError(null);

        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "slika-uploads";

            const { data, error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file);

            console.log("Supabase upload result:", { data, error: uploadError });

            if (uploadError) {
                console.error("Supabase storage error:", uploadError);
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from("slika-uploads")
                .getPublicUrl(filePath);

            return { publicUrl };
        } catch (err: any) {
            const errorMessage = err.message || "An error occurred during upload";
            setError(errorMessage);
            return { error: errorMessage };
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadFile, isUploading, error };
}
