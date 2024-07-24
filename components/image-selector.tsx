"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";

export default function ImageSelector({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  const supabase = createClient();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleUpload = async () => {
    if (selectedImage) {
      setUploading(true);
      try {
        const { data, error } = await supabase.storage
          .from("images")
          .upload(`images/${selectedImage.name}`, selectedImage);

        if (error) {
          throw error;
        }

        const imageUrl = data?.Key;
        if (imageUrl) {
          onChange(imageUrl);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
      <Button onClick={handleUpload} disabled={!selectedImage || uploading}>
        Upload Image
      </Button>
      {value && <Image src={value} alt="Sample avatar image" />}
    </div>
  );
}
