import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Award, Brain, Gamepad, Leaf, Puzzle, Users } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = AuthService.isAuthenticated();
  const isMobile = useIsMobile();
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSignInClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  // Features data for carousel
  const features = [
    {
      icon: <Leaf className="text-[#5EF38C]" size={28} />,
      title: "Farming",
      content: [
        "Plant, water, grow, and harvest crops",
        "Pick up and manage seeds, tools, and crops",
        "Chop trees to craft various items",
      ],
      progress: "w-3/4",
    },
    {
      icon: <Users className="text-[#5EF38C]" size={28} />,
      title: "NPCs & Quests",
      content: [
        "NPCs act as guides and helpers",
        "Receive farming, collecting, and problem-solving tasks",
        "Complete tasks to earn valuable rewards",
      ],
      progress: "w-2/3",
    },
    {
      icon: <Gamepad className="text-[#5EF38C]" size={28} />,
      title: "Mini-Games",
      content: [
        "Memory card matching with adaptive difficulty",
        "Memory sequence game with piano tiles",
        "Petal patterns game with plant arrangements",
      ],
      progress: "w-4/5",
    },
    {
      icon: <Puzzle className="text-[#5EF38C]" size={28} />,
      title: "Adaptive Difficulty",
      content: [
        "All mini-games automatically adjust their difficulty based on player performance, ensuring the perfect balance of challenge and engagement for children with attention difficulties.",
      ],
      progress: "w-4/5",
    },
    {
      icon: <Brain className="text-[#5EF38C]" size={28} />,
      title: "Progress Tracking",
      content: [
        "Detailed reports track time spent on tasks, ability to complete levels, and attention-sustaining periods to help parents and professionals monitor cognitive development.",
      ],
      progress: "w-3/4",
    },
    {
      icon: <Award className="text-[#5EF38C]" size={28} />,
      title: "Reward System",
      content: [
        "Players earn currencies, items, and farming boosts for completing mini-games and tasks, reinforcing positive behaviors and maintaining engagement.",
      ],
      progress: "w-1/2",
    },
  ];

  // Function to render feature card
  const renderFeatureCard = (feature: any, index: number) => {
    return (
      <div className="bg-gradient-to-br from-[#5EF38C]/20 to-[#0A2342] p-1 rounded-lg pixel-border h-full">
        <div className="bg-black p-6 rounded-lg h-full flex flex-col">
          <div className="h-12 w-12 bg-[#5EF38C]/20 rounded-lg flex items-center justify-center mb-4">
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
          {Array.isArray(feature.content) ? (
            <ul className="text-gray-400 flex-grow list-disc pl-5 space-y-2">
              {feature.content.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 flex-grow">{feature.content}</p>
          )}
          <div className="mt-4 h-2 bg-[#222] rounded-full overflow-hidden">
            <div className={`h-full bg-[#5EF38C] ${feature.progress} pixel-progress`}></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A2342] to-[#121212]">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="/lovable-uploads/41067270-5c65-44fb-8d3b-89fc90445214.png"
            alt="NURA Logo"
            className="h-12 w-auto"
          />
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Button
              className="bg-[#5EF38C] text-[#0A2342] hover:bg-[#4DD77C]"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-[#5EF38C] text-[#5EF38C] hover:bg-[#5EF38C]/20"
                onClick={handleSignInClick}
              >
                Sign In
              </Button>
              <Link to="/register">
                <Button className="bg-[#5EF38C] text-[#0A2342] hover:bg-[#4DD77C]">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
            <span className="inline-block text-[#5EF38C] pixel-font">NURA</span>
            <br />
            <span className="inline-block">
              <span className="bg-gradient-to-r from-[#48bb78] to-[#38a169] text-transparent bg-clip-text font-medium py-0.5 rounded animate-pulse">
                For Children with Attention Difficulties
              </span>
            </span>
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            A 2D pixel art farming RPG designed to support children with
            attention challenges through engaging gameplay and cognitive
            training.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {isAuthenticated ? (
              <Button
                size="lg"
                className="bg-[#5EF38C] text-[#0A2342] hover:bg-[#4DD77C] px-8 py-6"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-[#5EF38C] text-[#0A2342] hover:bg-[#4DD77C] px-8 py-6"
                >
                  Get Started
                </Button>
              </Link>
            )}
            <a href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-[#5EF38C] text-[#5EF38C] hover:bg-[#5EF38C]/20 px-8 py-6"
              >
                Explore Features
              </Button>
            </a>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <motion.img
            src="/lovable-uploads/41067270-5c65-44fb-8d3b-89fc90445214.png"
            alt="NURA Hero"
            className="w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 2,
            }}
          />
        </div>
      </section>

      {/* About Us */}
      <section className="py-20 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <h2
            className="text-4xl font-bold mb-12 text-center text-[#5EF38C] pixel-font"
            id="about"
          >
            About Nura
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-300 mb-6">
                Nura is a farming RPG designed to assist children with attention
                difficulties, including those with ADHD. Players explore the
                environment and engage in different farming activities, interact
                with NPCs, and play focus and memory-specific mini-games.
              </p>
              <p className="text-lg text-gray-300 mb-6">
                The mini-games automatically adjust difficulty based on the
                player's performance, creating an adaptive experience that grows
                with the child's cognitive development.
              </p>
              <p className="text-lg text-gray-300">
                The game generates detailed reports to provide insights into the
                child's attention span, helping parents and professionals track
                development over time.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#5EF38C]/20 to-[#0A2342] p-1 rounded-lg pixel-border">
              <div className="bg-black p-6 rounded-lg h-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4">
                    <h3 className="text-3xl font-bold text-[#5EF38C]">3</h3>
                    <p className="text-gray-400">Mini-Games</p>
                  </div>
                  <div className="text-center p-4">
                    <h3 className="text-3xl font-bold text-[#5EF38C]">
                      Adaptive
                    </h3>
                    <p className="text-gray-400">Difficulty</p>
                  </div>
                  <div className="text-center p-4">
                    <h3 className="text-3xl font-bold text-[#5EF38C]">
                      Progress
                    </h3>
                    <p className="text-gray-400">Tracking</p>
                  </div>
                  <div className="text-center p-4">
                    <h3 className="text-3xl font-bold text-[#5EF38C]">
                      Detailed
                    </h3>
                    <p className="text-gray-400">Reports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24" id="features">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center text-[#5EF38C] pixel-font">
            Core Features
          </h2>
          
          {/* Carousel view for both mobile and desktop */}
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              autoScroll={true}
              autoScrollInterval={5000}
              className="w-full"
              onScrollEnd={(api) => {
                const currentSlide = api?.selectedScrollSnap();
                setActiveSlide(currentSlide || 0);
              }}
            >
              <CarouselContent className="-ml-8">
                {features.map((feature, index) => (
                  <CarouselItem key={index} className={`pl-8 py-6 ${isMobile ? 'basis-full' : 'md:basis-1/3'}`}>
                    {renderFeatureCard(feature, index)}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-center gap-2 mt-10">
                <CarouselPrevious className="static transform-none mx-2" />
                <div className="flex gap-2">
                  {features.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full ${
                        activeSlide === index ? "bg-[#5EF38C]" : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <CarouselNext className="static transform-none mx-2" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section className="py-24 bg-black/30 backdrop-blur-sm" id="contact">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center text-[#5EF38C] pixel-font">
            Contact Us
          </h2>
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#5EF38C]/20 to-[#0A2342] p-1 rounded-lg pixel-border">
            <div className="bg-black p-8 rounded-lg">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Get in Touch
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Have questions about how Nura can help with attention
                    difficulties? We'd love to hear from you! Fill out the form
                    or contact our team directly.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="h-10 w-10 bg-[#5EF38C]/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                        <span className="text-[#5EF38C]">👤</span>
                      </div>
                      <div>
                        <p className="text-gray-300">Ayah Al Tamimi</p>
                        <p className="text-gray-500 text-sm">
                          +972 59-578-5550
                        </p>
                        <p className="text-gray-500 text-sm">
                          atamimiayah@gmail.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-10 w-10 bg-[#5EF38C]/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                        <span className="text-[#5EF38C]">👤</span>
                      </div>
                      <div>
                        <p className="text-gray-300">Bakeza Diazada</p>
                        <p className="text-gray-500 text-sm">
                          +972 59-263-9672
                        </p>
                        <p className="text-gray-500 text-sm">
                          dbakeza2002@gmail.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-10 w-10 bg-[#5EF38C]/20 rounded-lg flex items-center justify-center mr-4 mt-1">
                        <span className="text-[#5EF38C]">👤</span>
                      </div>
                      <div>
                        <p className="text-gray-300">Daniella Anastas</p>
                        <p className="text-gray-500 text-sm">
                          +972 59-285-0246
                        </p>
                        <p className="text-gray-500 text-sm">
                          daniellaanastas91@gmail.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-gray-400 mb-2"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full bg-[#222] border border-[#444] text-white px-4 py-2 rounded focus:outline-none focus:border-[#5EF38C]"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-gray-400 mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full bg-[#222] border border-[#444] text-white px-4 py-2 rounded focus:outline-none focus:border-[#5EF38C]"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-gray-400 mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        className="w-full bg-[#222] border border-[#444] text-white px-4 py-2 rounded focus:outline-none focus:border-[#5EF38C] h-32"
                        placeholder="Your message here..."
                      ></textarea>
                    </div>
                    <Button className="w-full bg-[#5EF38C] text-[#0A2342] hover:bg-[#4DD77C] py-6">
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <img
                src="/lovable-uploads/41067270-5c65-44fb-8d3b-89fc90445214.png"
                alt="NURA Logo"
                className="h-10 w-auto"
              />
              <p className="text-gray-500 mt-2">
                © 2025 NURA Games. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#about" className="text-gray-400 hover:text-[#5EF38C]">
                About Us
              </a>
              <a
                href="#features"
                className="text-gray-400 hover:text-[#5EF38C]"
              >
                Features
              </a>
              <a href="#contact" className="text-gray-400 hover:text-[#5EF38C]">
                Contact
              </a>
              {isAuthenticated ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-gray-400 hover:text-[#5EF38C]"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSignInClick}
                    className="text-gray-400 hover:text-[#5EF38C]"
                  >
                    Sign In
                  </button>
                  <Link
                    to="/register"
                    className="text-gray-400 hover:text-[#5EF38C]"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
