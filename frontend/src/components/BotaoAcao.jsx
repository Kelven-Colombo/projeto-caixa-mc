const BotaoAcao = ({ children, ...props }) => {
  return (
    <button
      className="rounded-lg bg-blue-800 px-4 py-2 font-bold text-white transition-colors hover:cursor-pointer hover:bg-blue-500"
      {...props}
    >
      {children}
    </button>
  );
};

export default BotaoAcao;
