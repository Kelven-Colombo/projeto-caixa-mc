//conversores
const formataReal = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const formataData = (data) => {
  const arrayData = data.split("-");
  arrayData.reverse();
  return arrayData.join("/");
};

export { formataReal, formataData };