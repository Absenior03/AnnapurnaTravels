"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicBackground from "@/components/ui/DynamicBackground";
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiUsers,
  FiThumbsUp,
  FiHeart,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function About() {
  // Team member data
  const teamMembers = [
    {
      name: "Raj Sharma",
      role: "Founder & CEO",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "With over 20 years of mountaineering experience, Raj leads our vision for sustainable adventure tourism.",
    },
    {
      name: "Meera Patel",
      role: "Operations Manager",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "Meera ensures that every journey is meticulously planned and executed with attention to detail.",
    },
    {
      name: "Tenzin Norbu",
      role: "Head Guide",
      image: "https://randomuser.me/api/portraits/men/64.jpg",
      bio: "Born in the foothills of the Himalayas, Tenzin brings unparalleled knowledge of the mountain trails.",
    },
    {
      name: "Lakshmi Gurung",
      role: "Cultural Expert",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      bio: "Lakshmi specializes in creating immersive cultural experiences that connect travelers with local traditions.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section with Dynamic Background */}
        <DynamicBackground
          className="h-[50vh] flex items-center justify-center"
          colorFrom="#134e4a"
          colorTo="#065f46"
          overlayOpacity={0.7}
        >
          <div className="max-w-3xl mx-auto text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
            >
              About Annapurna Tours and Travels
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-emerald-100"
            >
              We specialize in creating unforgettable adventures in the
              Himalayas, with a focus on sustainable tourism and authentic
              experiences.
            </motion.p>
          </div>
        </DynamicBackground>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-gray-800 mb-8 text-center"
              >
                Our Story
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src="https://images.pexels.com/photos/2832039/pexels-photo-2832039.jpeg"
                      alt="Himalayan Mountain Range"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <p className="text-gray-600 mb-4">
                      Founded in 2010 by a group of passionate trekkers and
                      adventure enthusiasts, Annapurna Tours and Travels began
                      with a simple mission: to share the breathtaking beauty of
                      the Himalayas with the world while supporting local
                      communities.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Over the years, we've grown from a small operation to a
                      trusted name in Himalayan adventures, leading thousands of
                      travelers through the region's most spectacular
                      landscapes. Our team consists of experienced local guides
                      with intimate knowledge of the terrain, culture, and
                      history.
                    </p>
                    <p className="text-gray-600">
                      Today, we continue to be guided by our core values of
                      sustainability, safety, and creating meaningful
                      connections between our guests and the regions they
                      explore.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-800 mb-12 text-center"
            >
              Why Choose Us
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                  <FiUsers className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Expert Local Guides
                </h3>
                <p className="text-gray-600">
                  Our guides are locals with deep knowledge of the region,
                  certified in first aid, and fluent in multiple languages.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                  <FiThumbsUp className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Customized Experiences
                </h3>
                <p className="text-gray-600">
                  We tailor each journey to match your preferences, whether
                  you're seeking adventure, cultural immersion, or relaxation.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                  <FiHeart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Sustainable Tourism
                </h3>
                <p className="text-gray-600">
                  We're committed to environmental conservation and supporting
                  local communities through responsible tourism practices.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Team - Updated to use simpler animation without hooks inside hooks */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-800 mb-12 text-center"
            >
              Meet Our Team
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  whileHover={{
                    y: -10,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {member.name}
                    </h3>
                    <p className="text-emerald-600 mb-4">{member.role}</p>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <DynamicBackground
          className="py-16"
          colorFrom="#115e59"
          colorTo="#064e3b"
          overlayOpacity={0.8}
        >
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-white mb-12 text-center"
            >
              Visit Our Office
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-1/2 p-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Contact Information
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FiMapPin className="h-6 w-6 text-emerald-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-800">Address</h4>
                        <p className="text-gray-600">
                          123 Thamel Street, Kathmandu, Nepal
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FiPhone className="h-6 w-6 text-emerald-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-800">Phone</h4>
                        <p className="text-gray-600">+977 1234 567 890</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FiMail className="h-6 w-6 text-emerald-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-800">Email</h4>
                        <p className="text-gray-600">info@annapurnatours.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="font-medium text-gray-800 mb-2">
                      Office Hours
                    </h4>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>

                <div className="md:w-1/2">
                  {/* Google Maps Placeholder - In a real app, you would embed an actual Google Maps iframe */}
                  <div className="h-full min-h-[300px] bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500 text-center p-4">
                      Google Maps would be embedded here
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </DynamicBackground>
      </main>

      <Footer />
    </div>
  );
}
