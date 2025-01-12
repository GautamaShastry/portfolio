import logo from "../assets/projects/gautam-logo.png"
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";

const Navbar = () => {
    return (
        <nav className='mb-20 flex items-center justify-between py-4 px-6 bg-transparent z-10 relative'>
            <div className="flex flex-shrink-0 items-center">
                <img src={logo} alt="logo" className="rounded-full w-10 mx-2 h-10"/>
            </div>
            <div className="m-8 flex items-center justify-center gap-10 text-2xl">
                <FaLinkedin className="text-gray-100"/>
                <FaGithub className="text-gray-100"/>
                <FaInstagram className="text-gray-100"/>
            </div>
        </nav>
    )
}

export default Navbar