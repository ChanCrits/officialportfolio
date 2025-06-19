import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeartReaction from './HeartReaction';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link: string;
  category: 'graphics' | 'web';
}

// Modal component for project details
const ProjectModal: React.FC<{
  project: Project | null;
  onClose: () => void;
}> = ({ project, onClose }) => {
  if (!project) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full p-6 relative border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-64 object-contain rounded-lg mb-4 bg-black"
        />
        <h2 className="text-2xl font-bold text-blue-400 mb-2">{project.title}</h2>
        <p className="text-gray-300 mb-4 whitespace-pre-line">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            View Project
          </a>
          <HeartReaction projectId={project.id} projectTitle={project.title} />
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'graphics' | 'web'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const navigate = useNavigate();

  const projects: Project[] = [
    {
      id: 1,
      title: "Portfolio Website",
      description: [
        "A modern and responsive portfolio website.",
        "Built using React and Tailwind CSS.",
        "Showcases personal projects and skills.",
        "Features smooth animations and transitions.",
        "Optimized for both desktop and mobile devices."
      ].join(' '),
      image: "/portfolio.png",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      link: "https://github.com/yourusername/portfolio",
      category: "web"
    },
    {
      id: 2,
      title: "Idealist Guild Logo Design",
      description: [
        "Creative logo design for a tech startup.",
        "Represents innovation and collaboration.",
        "Designed with Adobe Illustrator and Photoshop.",
        "Versatile for digital and print media.",
        "Reflects the brand's modern identity."
      ].join(' '),
      image: "/Sunshade Logo.jpg",
      technologies: ["Adobe Illustrator", "Photoshop"],
      link: "https://behance.net/project",
      category: "graphics"
    },
    {
      id: 3,
      title: "PHP Laravel Qr Code Generator",
      description: [
        "A simple QR code generator web app.",
        "Built with PHP Laravel framework.",
        "Developed by Alfonz Perez and Christian Earl Siong.",
        "Allows users to generate custom QR codes.",
        "User-friendly interface and fast generation."
      ].join(' '),
      image: "/QrCodeGen.png",
      technologies: ["php", "Node.js", "Mysql", "laravel"],
      link: "https://github.com/yourusername/ecommerce",
      category: "web"
    },
    {
      id: 4,
      title: "Country Information API",
      description: [
        "A RESTful API and web app for country data.",
        "Provides detailed information about every country.",
        "Includes capital, region, population, and area.",
        "Shows coordinates, timezones, currencies, and languages.",
        "Displays bordering countries",
        
      ].join(' '),
      image: "/countryinformationAPI.png",
      technologies: ["Node.js", "React JS", "Cheerio", "REST API"],
      link: "https://github.com/yourusername/newsscraper-api",
      category: "web"
    },
    {
      id: 5,
      title: "IT Polo T-Shirt Design",
      description: [
        "A modern polo t-shirt design for Information Technology students.",
        "Features a tech-inspired circuit pattern and bold color blocking.",
        "Designed for both comfort and style in academic settings."
      ].join(' '),
      image: "/IT POLO.jpg",
      technologies: ["Adobe Illustrator", "Photoshop", "Graphic Design"],
      link: "#",
      category: "graphics"
    },
    {
      id: 6,
      title: "We Are Looking For A Social Media Team",
      description: [
        "Announcement poster for the Information Technology Society.",
        "We are seeking enthusiastic members to join our Social Media Team!",
        "Help manage, create, and promote content for our organization.",
        "Great opportunity for students interested in digital marketing and content creation."
      ].join(' '),
      image: "/1.jpg",
      technologies: ["Photoshop", "Graphic Design", "Social Media"],
      link: "#",
      category: "graphics"
    },
    {
      id: 7,
      title: "Information Technology Social Media Team",
      description: [
        "Promotional poster for the Information Technology Social Media Team.",
        "Encourages students to join and participate in managing the department's social media presence.",
        "Designed with a modern and engaging style to attract attention.",
        "Created using Photoshop and graphic design tools."
      ].join(' '),
      image: "/1 Christian Earl T. Siong.jpg",
      technologies: ["Photoshop", "Graphic Design", "Social Media"],
      link: "#",
      category: "graphics"
    },
    {
      id: 8,
      title: "Tekken 8 Champion Certificate",
      description: [
        "Certificate of Achievement awarded to the Champion of the Tekken 8 Tournament 'Battle of Champions'",
        "as part of the Founders Week Celebration.",
        "Held on December 4, 2024, at 1:00 pm at NORSU Open Court, I.T.S Booth.",
        "Organized by the Information Technology Society."
      ].join(' '),
      image: "/tekkencert.jpg",
      technologies: ["Photoshop", "Graphic Design", "Event"],
      link: "#",
      category: "graphics"
    },
    {
      id: 9,
      title: "Savage Seeker Mobile Legends Squad Logo",
      description: [
        "Logo design for the Savage Seeker Mobile Legends squad.",
        "Features a bold green dragon and modern typography, representing strength and unity in the team.",
        "Created using vector graphic tools for high-quality scalability."
      ].join(' '),
      image: "/savageseeker.png",
      technologies: ["Adobe Illustrator", "Photoshop", "Logo Design"],
      link: "#",
      category: "graphics"
    },
    {
      id: 10,
      title: "ITS Organization T-Shirt Design",
      description: [
        "Modern t-shirt design for the Information Technology Society (ITS) Organization.",
        "Features a tech-inspired circuit pattern, bold color blocking, and the official ITS logo.",
        "Designed for both comfort and style for IT students."
      ].join(' '),
      image: "/its_tshirt.jpg",
      technologies: ["Adobe Illustrator", "Photoshop", "T-Shirt Design"],
      link: "#",
      category: "graphics"
    },
    {
      id: 11,
      title: "ITS Organization Type C T-Shirt",
      description: [
        "Type C t-shirt design for the Information Technology Society (ITS) Organization.",
        "Features a coding-inspired back print, modern layout, and the official ITS logo.",
        "Designed for IT students who love code and style."
      ].join(' '),
      image: "/itstypeC.jpg",
      technologies: ["Adobe Illustrator", "Photoshop", "T-Shirt Design"],
      link: "#",
      category: "graphics"
    },
    {
      id: 12,
      title: "Techy Sample Cover Photo Banner",
      description: [
        "A modern cover photo/banner designed for the Information Technology Society.",
        "Features a coding-themed background, digital effects, and a professional portrait overlay, perfect for use as a social media or website cover."
      ].join(' '),
      image: "/Banner Design.jpg",
      technologies: ["Photoshop", "Digital Art", "Banner Design"],
      link: "#",
      category: "graphics"
    },
    {
      id: 13,
      title: "News Scraper Cheerio API",
      description: [
        "A web application that scrapes news articles from various sources using a custom Cheerio-based API.",
        "Features keyword filtering, sorting, and a modern dashboard UI.",
        "Built for real-time news aggregation and analysis."
      ].join(' '),
      image: "/News Scraper.png",
      technologies: ["Node.js", "React", "Cheerio", "REST API"],
      link: "#",
      category: "web"
    },
    // Add more projects here
  ];  

  const filteredProjects = projects.filter(project => {
    // First filter by category
    const categoryMatch = activeCategory === 'all' || project.category === activeCategory;
    
    // Then filter by search term
    const searchMatch = searchTerm === '' || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'graphics':
        return 'Graphics Design Projects';
      case 'web':
        return 'Web Development Projects';
      default:
        return 'All Projects';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col md:flex-row overflow-hidden">
      {/* Side Container */}
      <div className="w-full md:w-64 bg-gray-800/50 backdrop-blur-sm border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-6 overflow-y-auto flex-shrink-0">
        {/* Back Arrow */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-4 md:mb-6 group"
        >
          <svg 
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h2 className="text-lg md:text-xl font-bold text-blue-400 mb-4 md:mb-6">Categories</h2>
        
        <div className="space-y-2 md:space-y-3">
          <button
            onClick={() => setActiveCategory('all')}
            className={`w-full text-left px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 md:mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </div>
          </button>

          <button
            onClick={() => setActiveCategory('graphics')}
            className={`w-full text-left px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-300 ${
              activeCategory === 'graphics'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 md:mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
              </svg>
              Graphics Design
            </div>
          </button>

          <button
            onClick={() => setActiveCategory('web')}
            className={`w-full text-left px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-300 ${
              activeCategory === 'web'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 md:mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Web Development
            </div>
          </button>
        </div>

        {/* Project Count */}
        <div className="mt-6 md:mt-8 p-3 md:p-4 bg-gray-700/30 rounded-lg">
          <p className="text-xs md:text-sm text-gray-400">Showing</p>
          <p className="text-base md:text-lg font-semibold text-blue-400">{filteredProjects.length} projects</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-400 mb-6 md:mb-8">
              {getCategoryTitle()}
            </h1>
            
            {/* Search Bar */}
            <div className="mb-6 md:mb-8">
              <div className="relative max-w-full sm:max-w-md">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 md:py-3 pl-10 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm md:text-base"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Scrollable Projects Grid */}
            <div className="max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="bg-gray-800/50 rounded-lg overflow-hidden backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-all duration-300 flex flex-col">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-40 sm:h-32 object-cover cursor-pointer transition-transform duration-200 hover:scale-105"
                      onClick={() => setModalProject(project)}
                    />
                    <div className="p-3 md:p-4 flex flex-col flex-1">
                      <h3 className="text-base md:text-lg font-semibold text-blue-400 mb-1 md:mb-2">{project.title}</h3>
                      <p className="text-gray-300 mb-2 md:mb-3 text-xs md:text-sm line-clamp-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2 md:mb-3">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-[10px] md:text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 mt-auto">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-2 md:px-3 py-1 md:py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs md:text-sm"
                        >
                          View Project
                        </a>
                        <HeartReaction projectId={project.id} projectTitle={project.title} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Project Modal */}
      <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
    </div>
  );
};

export default Projects;