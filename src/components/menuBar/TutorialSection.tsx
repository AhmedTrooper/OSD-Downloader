import { FaGithub, FaYoutube } from "react-icons/fa";

export default function TutorialSection() {
  return (
    <div className="grid grid-cols-2 items-center justify-items-center">
      <a
        target="_blank"
        href="https://github.com/AhmedTrooper/OSGUI"
      >
        <FaGithub className="text-white cursor-pointer" />
      </a>
      <a
        target="_blank"
        href="https://www.youtube.com/@AhmedTrooper"
      >
        <FaYoutube className="text-white cursor-pointer" />
      </a>
    </div>
  );
}
