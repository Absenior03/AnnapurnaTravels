"use client";

import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiSearch } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';

// Dynamically import components to prevent SSR issues
const AppleTextField = dynamic(() => import('../../components/ui/AppleTextField'), { ssr: false });
const AppleCard = dynamic(() => import('../../components/ui/AppleCard'), { ssr: false });
const ImageGallery = dynamic(() => import('../../components/ui/ImageGallery'), { ssr: false });
const SectionHeading = dynamic(() => import('../../components/ui/SectionHeading'), { ssr: false });

const UIShowcaseContent = () => {
  // State for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  // Demo gallery images
  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1604537466158-719b1972feb8',
      alt: 'Mountain landscape',
      title: 'Majestic Mountains',
      description: 'Stunning view of the Himalayan range at sunrise'
    },
    {
      src: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc',
      alt: 'Mountain valley',
      title: 'Valley Views',
      description: 'Lush green valley surrounded by snow-capped peaks'
    },
    {
      src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
      alt: 'Alpine lake',
      title: 'Alpine Serenity',
      description: 'Crystal clear waters reflecting the mountains above'
    },
    {
      src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
      alt: 'Starry mountain night',
      title: 'Night in the Mountains',
      description: 'Stars illuminating the peaks on a clear night'
    },
    {
      src: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5',
      alt: 'Mountain trails',
      title: 'The Journey',
      description: 'Winding trails leading through rugged terrain'
    },
    {
      src: 'https://images.unsplash.com/photo-1606859191214-50195561c1ab',
      alt: 'Mountain sunset',
      title: 'Sunset Heights',
      description: 'Colorful sunset painting the mountain tops'
    }
  ];

  // Section container style
  const sectionStyle = 'py-12 px-4 md:px-8 border-b border-gray-100';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="UI Component Showcase"
            subtitle="Explore our premium UI components with fluid animations and modern design"
            tag="Premium"
            tagColor="blue"
            align="center"
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* AppleTextField Components */}
        <section className={sectionStyle}>
          <SectionHeading
            title="AppleTextField"
            subtitle="Smooth input animations inspired by Apple's design"
            align="left"
            titleSize="lg"
            divider
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <AppleTextField
              label="Name"
              value={name}
              onChange={setName}
              placeholder="John Doe"
              icon={<FiUser />}
              iconPosition="left"
            />
            
            <AppleTextField
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="john@example.com"
              type="email"
              icon={<FiMail />}
              iconPosition="left"
              error={email && !email.includes('@') ? 'Please enter a valid email' : ''}
            />
            
            <AppleTextField
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              type="password"
              icon={<FiLock />}
              iconPosition="left"
              helperText="Password must be at least 8 characters"
            />
            
            <AppleTextField
              label="Search"
              value={search}
              onChange={setSearch}
              placeholder="Search for destinations..."
              icon={<FiSearch />}
              clearable
              variant="filled"
            />
            
            <div className="md:col-span-2">
              <AppleTextField
                label="Message"
                value={message}
                onChange={setMessage}
                placeholder="Enter your message..."
                multiline
                rows={4}
              />
            </div>
          </div>
        </section>

        {/* Button Components */}
        <section className={sectionStyle}>
          <SectionHeading
            title="Button Variants"
            subtitle="Interactive buttons with micro-animations and feedback"
            align="left"
            titleSize="lg"
            divider
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Primary Buttons</h3>
              <Button variant="primary" size="lg">Large Button</Button>
              <Button variant="primary">Default Button</Button>
              <Button variant="primary" size="sm">Small Button</Button>
              <Button variant="primary" disabled>Disabled Button</Button>
              <Button variant="primary" loading>Loading Button</Button>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Secondary Buttons</h3>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="white">White</Button>
              <Button variant="danger">Danger</Button>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Button Features</h3>
              <Button variant="primary" icon={<FiUser />}>With Icon</Button>
              <Button variant="outline" icon={<FiUser />} iconPosition="right">Icon Right</Button>
              <Button variant="primary" fullWidth>Full Width</Button>
              <Button variant="secondary" rounded>Rounded</Button>
              <Button href="#" variant="primary">Link Button</Button>
            </div>
          </div>
        </section>

        {/* Card Components */}
        <section className={sectionStyle}>
          <SectionHeading
            title="AppleCard"
            subtitle="Interactive cards with tilt and hover effects"
            align="left"
            titleSize="lg"
            divider
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <AppleCard 
              title="Default Card" 
              description="Standard card with hover and tilt effects"
              image="https://images.unsplash.com/photo-1513061379709-ef0cd7931505"
            />
            
            <AppleCard 
              title="Elevated Card" 
              description="More prominent with deeper shadow"
              image="https://images.unsplash.com/photo-1549221884-a54be21a523e"
              variant="elevated"
            />
            
            <AppleCard 
              title="Glass Card" 
              description="Semi-transparent backdrop blur effect"
              image="https://images.unsplash.com/photo-1517692447201-91994e242561"
              variant="glass"
            />
            
            <AppleCard 
              title="Overlay Content" 
              description="Text overlaid on the image with gradient"
              image="https://images.unsplash.com/photo-1544726672-b33eb6c63253"
              contentPlacement="overlay"
              gradient
            />
          </div>
        </section>

        {/* Image Gallery Components */}
        <section className={`${sectionStyle} border-b-0`}>
          <SectionHeading
            title="Image Gallery"
            subtitle="Interactive galleries with different layout options"
            align="left"
            titleSize="lg"
            divider
          />
          
          <div className="space-y-16 mt-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Grid Layout</h3>
              <ImageGallery 
                images={galleryImages.slice(0, 4)} 
                columns={2}
                aspectRatio="video"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Carousel Layout</h3>
              <ImageGallery 
                images={galleryImages} 
                variant="carousel"
                columns={2}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Masonry Layout</h3>
              <ImageGallery 
                images={galleryImages} 
                variant="masonry"
                columns={3}
                cardVariant="minimal"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Call to action */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white">Ready to enhance your travel experience?</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Use these premium UI components to create beautiful and engaging travel adventures.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="white" size="lg">Learn More</Button>
              <Button variant="outline" className="text-white border-white hover:bg-white/10" size="lg">Contact Us</Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UIShowcaseContent; 