"use client";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signinSchema } from "@/schemas/signinSchema";
import axios, { AxiosError } from "axios";
import { apiResponse } from "@/types/apiResponse";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SigninPage = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceValue(username, 300);
  const { toast } = useToast();
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const response = await axios.get(
            `/api/check-unique-user?username=${debouncedUsername}`,
          );
          console.log(response);
          setUsernameMessage(response.data.message);
        } catch (err) {
          if (err instanceof Error) {
            const axiosError = err as AxiosError<apiResponse>;
            setUsernameMessage(
              axiosError.response?.data.message ??
                "Error while checking unique username.",
            );
          }
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<apiResponse>("/api/signin", data);
      console.log(response);
      toast({
        title: "Signin successful",
        description: response.data.message,
      });
      router.replace(`/veriy/${username}`);
    } catch (err) {
      if (err instanceof Error) {
        const axiosError = err as AxiosError<apiResponse>;
        toast({
          title: "Signin failed",
          description: axiosError.response?.data.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg-text-5xl mb-6">
            Join Mystry Message
          </h1>
          <p>Sign up to get started </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="Username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      onchange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SigninPage;
