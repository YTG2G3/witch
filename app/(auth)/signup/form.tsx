"use client";

import { toastError } from "@/lib/forms";
import { signupSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Link,
} from "@nextui-org/react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export default function SignupForm({
  handleSignup,
}: {
  handleSignup: (data: z.infer<typeof signupSchema>) => Promise<string | null>;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleFormSubmit() {
    if (!formRef?.current) return;
    formRef?.current.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true }),
    );
  }

  const { handleSubmit, register } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  function onSubmit(
    values: z.infer<typeof signupSchema>,
    e: React.BaseSyntheticEvent | undefined,
  ) {
    e?.preventDefault();
    toast.promise(
      new Promise(async (resolve, reject) => {
        let err = await handleSignup(values);
        if (err) reject(err);
        resolve(null);
      }),
      {
        loading: "Signing up...",
        success: "Signed up successfully! Please check your email to verify.",
        error: (err: string) => `Error: ${err}`,
      },
    );
  }

  return (
    <Card>
      <CardHeader className="space-x-1 flex items-end">
        <h1 className="text-2xl tracking-wide font-bold">witch</h1>
        <h2 className="text-md">auth</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <form
          onSubmit={handleSubmit(onSubmit, toastError)}
          ref={formRef}
          className="space-y-3"
        >
          <Input label="Email" {...register("email")} />
          <Input label="Password" type="password" {...register("password")} />
          <Input
            label="Confirm Password"
            type="password"
            {...register("retype")}
          />
        </form>
      </CardBody>
      <Divider />
      <CardFooter className="justify-end space-x-3">
        <Button as={Link} href="/login" variant="light">
          Already have an account
        </Button>
        <Button onClick={handleFormSubmit} color="primary">
          Sign Up
        </Button>
      </CardFooter>
    </Card>
  );
}
