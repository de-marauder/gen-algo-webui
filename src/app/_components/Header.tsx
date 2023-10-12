import { TypeUser } from "@/Types/User";
import { Navbar } from "./Nav/Navbar";

export const Header: React.FC<{ user?: TypeUser }> = ({ user }) => {
  return (
    <header className="relative z-10 container bg-blue-500/10 rounded-xl mx-auto">
      <Navbar />
    </header>
  )
};
