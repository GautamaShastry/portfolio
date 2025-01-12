import logo from "../assets/projects/gautam-logo.png"
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom"
import { NAV_LINK } from "../constants";
import { useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if(section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
        setIsMenuOpen(false); // close the menu after navigation
    };
    return (
        <nav className='mb-20 flex items-center justify-between py-4 px-6 bg-transparent z-10 relative'>
            <div className="flex flex-shrink-0 items-center">
                <img src={logo} alt="logo" className="rounded-full w-10 mx-2 h-10 cursor-pointer" onClick={() => scrollToSection("about")}/>
            </div>

            {/* DESKTOP SCREENS */}
            <div className="hidden md:flex gap-10 text-xl text-gray-100">
                <button onClick={() => scrollToSection("about")} className="hover:text-purple-400">
                    About Me
                </button>
                <button onClick={() => scrollToSection("projects")} className="hover:text-purple-400">
                    My Projects
                </button>
                <button onClick={() => scrollToSection("work")} className="hover:text-purple-400">
                    My Work
                </button>
                <button onClick={() => scrollToSection("contact")} className="hover:text-purple-400">
                    Contact Me
                </button>
            </div>

            {/* SOCIAL MEDIA LINKS */}
            <div className="m-8 flex items-center justify-center gap-10 text-2xl">
                <Link to={NAV_LINK.linkedin}>
                    <FaLinkedin className="text-gray-100 hover:text-purple-400"/>
                </Link>
                <Link to={NAV_LINK.github}>
                    <FaGithub className="text-gray-100 hover:text-purple-400"/>
                </Link>
                <Link to={NAV_LINK.instagram}>
                    <FaInstagram className="text-gray-100 hover:text-purple-400" />
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden text-3xl text-gray-100 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-black bg-opacity-90 flex flex-col items-center gap-6 py-4 text-xl text-gray-100 md:hidden">
                    <button onClick={() => scrollToSection("about")} className="hover:text-purple-400">
                        About Me
                    </button>
                    <button onClick={() => scrollToSection("projects")} className="hover:text-purple-400">
                        My Projects
                    </button>
                    <button onClick={() => scrollToSection("work")} className="hover:text-purple-400">
                        My Work
                    </button>
                    <button onClick={() => scrollToSection("contact")} className="hover:text-purple-400">
                        Contact Me
                    </button>
                </div>
            )}
        </nav>
    )
}

export default Navbar