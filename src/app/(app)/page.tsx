"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

function Home() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      <main className="flex flex-grow flex-col items-center justify-center px-4 md:px-24 py-4 min-h-screen ">
        {/* hero section */}
        <section className="container mx-auto px-4 pt-20 pb-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <MessageSquare className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
              your space for Anonymous Expression &nbsp;
            </h1>
            <p className="mt-3 md:mt-4 text-2xl font-bold md:text-3xl ">
              feel free. Be heard. Stay anonymous.
            </p>
            <p className="text-lg md:text-xl ">
              we believe in the freedom to share without judgment. Whether
              you&apos;re seeking advice, venting, or just need to be heard, our
              platform guarantees complete anonymity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signin">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  create Message
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2">
                learn More
              </Button>
            </div>
          </div>
        </section>
        {isClient && (
          <section className="w-full max-w-sm">
            <Carousel
              plugins={[Autoplay({ delay: 2000 })]}
              className="shadow-xl"
            >
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
        )}
      </main>

      <footer className="container mx-auto p-4 md:p-6">
        <p className="text-center text-sm">
          &copy; 2025 My-msg. All rights reserved.
        </p>
      </footer>
    </>
  );
}

export default Home;
