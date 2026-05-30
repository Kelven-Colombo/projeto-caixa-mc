const Fechamentos = () => {
  return (
    <div className="grid grid-cols-4 w-full gap-4 p-2">
      {/* lista */}
      <div className="col-span-3 bg-gray-800 rounded-xl p-4">
        {/* Barra de ferramentas */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <span className="font-bold">De:</span>
            <input
              type="date"
              className="bg-gray-300 p-2 rounded-lg text-slate-900 outline-none"
            />
            <span className="font-bold">Até:</span>
            <input
              type="date"
              className="bg-gray-300 p-2 rounded-lg text-slate-900 outline-none"
            />
          </div>
          <button className="bg-blue-800 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors hover:cursor-pointer">Novo Lançamento</button>
        </div>

        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="text-gray-200">
            <tr>
              <th className="bg-gray-700 p-3 rounded-tl-lg">
                <input type="checkbox" />
              </th>
              <th className="bg-gray-700 p-3">Data</th>
              <th className="bg-gray-700 p-3">Entradas</th>
              <th className="bg-gray-700 p-3">Saídas</th>
              <th className="bg-gray-700 p-3 rounded-tr-lg">Saldo</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-700 hover:cursor-pointer">
              <td className="p-3">
                {" "}
                <input type="checkbox" />
              </td>
              <td className="p-3">xx/xx/xxxx</td>
              <td className="p-3">R$ xx,xx</td>
              <td className="p-3">R$ xx,xx</td>
              <td className="p-3">R$ xx,xx</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* resumo */}
      <div className="flex flex-col col-span-1 bg-gray-800 rounded-xl p-4 gap-3">
        <div className="font-bold mb-3 text-lg">Resumo</div>
        <div className="flex justify-between">
          <span className="font-semibold">Entradas</span>
          <span>R$ xx,xx</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Saídas</span>
          <span>R$ xx,xx</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Saldo</span>
          <span>R$ xx,xx</span>
        </div>
      </div>
    </div>
  );
};

export default Fechamentos;
