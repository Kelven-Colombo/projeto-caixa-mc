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
      <nav className="hidden items-center justify-between bg-gray-800 p-4 text-white sm:flex">
        <Link to="/Fechamentos">
                <img
          src={logo}
          alt="Logo MC"
          className="h-10 w-auto object-contain sm:h-12 hover: cursor-pointer hover: scale-105"
        />
      
        </Link>

        <div>
          <ul className="flex gap-2 font-semibold">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  className="block rounded-lg p-2 transition-all hover:scale-105 hover:bg-gray-700 hover:text-gray-200"
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
      <nav className="flex items-center justify-between bg-gray-800 p-4 text-white sm:hidden">
        <div>
          <img
            src={logo}
            alt="Logo MC"
            className="h-10 w-auto object-contain sm:h-12"
          />
        </div>

        <button
          className="cursor-pointer text-xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </nav>
      {/* MENU DRAWER*/}
      {open && (
        // FUNDO ESCURO
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 transform bg-gray-800 text-white transition-transform duration-300 sm:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Botão fechar */}
        <button
          className="cursor-pointer p-4 text-xl"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
        {/* Itens menu */}
        <ul className="flex flex-col gap-2 p-4 font-semibold">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                onClick={() => setOpen(false)}
                className="block rounded-lg p-2 transition-all hover:bg-gray-700"
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
