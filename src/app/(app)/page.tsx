"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Home() {
  return (
    <>
      <main className="flex flex-grow flex-col items-center justify-center px-4 md:px-24 py-4 min-h-screen ">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <MessageSquare className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
              Your Space for Anonymous Expression{" "}
            </h1>
            <p className="mt-3 md:mt-4 text-2xl font-bold md:text-3xl ">
              Feel free. Be heard. Stay anonymous.
            </p>
            <p className="text-lg md:text-xl ">
              We believe in the freedom to share without judgment. Whether
              you&apos;re seeking advice, venting, or just need to be heard, our
              platform guarantees complete anonymity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Create Message
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full max-w-sm">
          <Carousel plugins={[Autoplay({ delay: 2000 })]} className="shadow-xl">
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardHeader>
                        <CardTitle>{message.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-lg font-semibold">
                          {message.content}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}{" "}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      </main>

      <footer className="container mx-auto p-4 md:p-6">
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} My-msg. All rights reserved.
        </p>
      </footer>
    </>
  );
}

export default Home;
