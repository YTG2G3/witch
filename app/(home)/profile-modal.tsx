"use client";

import { AuthContext } from "@/components/auth-provider";
import ImageSelector from "@/components/image-selector";
import { toastError } from "@/lib/forms";
import { profileSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useContext, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export default function ProfileModal({
  handleComplete,
}: {
  handleComplete: (
    values: z.infer<typeof profileSchema>,
  ) => Promise<string | null>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useContext(AuthContext);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  function handleFormSubmit() {
    if (!formRef?.current) return;
    formRef?.current.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true }),
    );
  }

  const { handleSubmit, register, control } = useForm<
    z.infer<typeof profileSchema>
  >({
    resolver: zodResolver(profileSchema),
  });

  function onSubmit(
    values: z.infer<typeof profileSchema>,
    e: React.BaseSyntheticEvent | undefined,
  ) {
    e?.preventDefault();
    toast.promise(
      new Promise(async (resolve, reject) => {
        let err = await handleComplete(values);
        if (err) reject(err);
        resolve(null);
      }),
      {
        loading: "Updating profile...",
        success: "Update successfully!",
        error: (err: string) => `Error: ${err}`,
      },
    );
  }

  if (!user || user?.profile) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Complete your profile</ModalHeader>
            <ModalBody>
              <form
                onSubmit={handleSubmit(onSubmit, toastError)}
                ref={formRef}
                className="space-y-3"
              >
                <Input label="Tag" {...register("tag_name")} />
                <Input label="Display name" {...register("display_name")} />
                <Controller
                  control={control}
                  name="avatar_url"
                  render={({ field: { onChange, value } }) => (
                    <ImageSelector value={value} onChange={onChange} />
                  )}
                />
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
