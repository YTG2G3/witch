"use client";

import { toastError } from "@/lib/forms";
import { loginSchema } from "@/lib/schema";
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
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export default function LoginForm({
  handleLogin,
}: {
  handleLogin: (data: z.infer<typeof loginSchema>) => Promise<string | null>;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  function handleFormSubmit() {
    if (!formRef?.current) return;
    formRef?.current.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true }),
    );
  }

  const { handleSubmit, register } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(
    values: z.infer<typeof loginSchema>,
    e: React.BaseSyntheticEvent | undefined,
  ) {
    e?.preventDefault();
    toast.promise(
      new Promise(async (resolve, reject) => {
        let err = await handleLogin(values);
        if (err) reject(err);
        setTimeout(() => router.push("/"), 3000);
        resolve(null);
      }),
      {
        loading: "Logging in...",
        success: "Logged successfully! You will be redirected shortly.",
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
        </form>
      </CardBody>
      <Divider />
      <CardFooter className="justify-end space-x-3">
        <Button as={Link} href="/signup" variant="light">
          Create a new account
        </Button>
        <Button onClick={handleFormSubmit} color="primary">
          Log In
        </Button>
      </CardFooter>
    </Card>
  );
}
