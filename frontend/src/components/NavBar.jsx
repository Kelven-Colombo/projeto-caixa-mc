import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const navLinks = [
    { name: "Fechamentos", path: "/Fechamentos" },
    { name: "Lançamento", path: "/Lancamento" },
    { name: "Configurações", path: "/Configuracoes" },
  ];

  return (
    <div>
      {/* DESKTOP NAVBAR */}
      <nav className="hidden sm:flex justify-between items-center  bg-gray-800 p-4 text-white">
        <img
          src={logo}
          alt="Logo MC"
          className="w-auto h-10 sm:h-12 object-contain"
        />

        <div>
          <ul className="flex gap-2 font-semibold ">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  className="block hover:text-gray-200 hover:scale-105 hover:bg-gray-700 transition-all rounded-lg p-2"
                  to={link.path}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {/* MOBILE NAVBAR */}
      <nav className="sm:hidden flex justify-between items-center  bg-gray-800 p-4 text-white ">
        <div>
          <img
            src={logo}
            alt="Logo MC"
            className="w-auto h-10 sm:h-12 object-contain"
          />
        </div>

        <button
          className="text-xl cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </nav>
      
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* MOBILE MENU SLIDE*/}
      <div
        className={`sm:hidden fixed top-0 right-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Botão fechar */}
        <button
          className="p-4 text-xl cursor-pointer"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>

        <ul className="flex flex-col gap-2 p-4 font-semibold">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                onClick={() => setOpen(false)}
                className="block hover:bg-gray-700 rounded-lg p-2 transition-all"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>{" "}
    </div>
  );
};

export default NavBar;
