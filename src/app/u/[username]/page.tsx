"use client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { messageSchema } from "@/schemas/messageSchema";
import axios, { AxiosError } from "axios";
import { apiResponse } from "@/types/apiResponse";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompletion } from "ai/react";
import Link from "next/link";

const UserPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const initialMsg =
    "What’s a book, movie, or song that has had a lasting impact on you?||If you could instantly learn any new skill, what would it be and why?||What’s something you’ve always wanted to try but haven’t yet, and what’s holding you back?";

  const parseMessage = (message: string): string[] => {
    return message.split("||");
  };

  const params = useParams<{ username: string }>();
  const username = params.username;

  // handling suggest messages
  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMsg,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleSuggestMessages = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<apiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete("");
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Handle error appropriately
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen ">
      <h1 className="text-4xl font-bold tracking-tight text-primary">
        Public Profile Link
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea placeholder="Type your message here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="mt-6 w-full flex flex-col justify-center items-center space-y-4">
        <div>
          <Button
            onClick={() => {
              fetchSuggestedMessages();
            }}
            disabled={isSuggestLoading}
            className="my-4"
          >
            Suggest Messages
          </Button>
        </div>
        <p className="text-sm font-medium ">
          Click on any message below to select it.
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseMessage(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleSuggestMessages(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/signup"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
};

export default UserPage;
