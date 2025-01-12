import logo from "../assets/projects/gautam-logo.png"
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom"
import { NAV_LINK } from "../constants";

const Navbar = () => {
    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if(section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <nav className='mb-20 flex items-center justify-between py-4 px-6 bg-transparent z-10 relative'>
            <div className="flex flex-shrink-0 items-center">
                <img src={logo} alt="logo" className="rounded-full w-10 mx-2 h-10 cursor-pointer" onClick={() => scrollToSection("about")}/>
            </div>
            <div className="m-8 flex items-center justify-center gap-10 text-xl text-gray-100">
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
            <div className="m-8 flex items-center justify-center gap-10 text-2xl">
                <Link to={NAV_LINK.linkedin}>
                    <FaLinkedin className="text-gray-100"/>
                </Link>
                <Link to={NAV_LINK.github}>
                    <FaGithub className="text-gray-100"/>
                </Link>
                <Link to={NAV_LINK.instagram}>
                    <FaInstagram className="text-gray-100" />
                </Link>
            </div>
        </nav>
    )
}

export default Navbar