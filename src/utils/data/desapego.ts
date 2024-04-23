const DESAPEGO = [{
  id: "1",
  type: 'venda',
  price: 500,
  title: 'Berço americano',
  description: 'Berço americano branco, com colchão + 3 lençóis de elástico. Com marcas de uso',
  gender: 'unisex',
  cep: '70670429',
  age: '0 meses +',
  thumbnail: require("../../assets/desapegos/thumbnail/1.png"),
},
{
  id: "2",
  type: 'troca',
  price: 0,
  itensToChange: 'Fraldas',
  title: 'Camiseta Adidas',
  description: 'Berço americano branco, com colchão + 3 lençóis de elástico. Com marcas de uso',
  gender: 'male',
  cep: '70670429',
  age: '1 ano',
  thumbnail: require("../../assets/desapegos/thumbnail/2.png"),
},
{
  id: "3",
  type: 'troca',
  price: 0,
  itensToChange: 'Fraldas',
  title: 'Camiseta Adidas',
  description: 'Berço americano branco, com colchão + 3 lençóis de elástico. Com marcas de uso',
  gender: 'male',
  cep: '70670429',
  age: '1 ano',
  thumbnail: require("../../assets/desapegos/thumbnail/2.png"),
},
{
  id: "4",
  type: 'troca',
  price: 0,
  itensToChange: 'Fraldas',
  title: 'Camiseta Adidas',
  description: 'Berço americano branco, com colchão + 3 lençóis de elástico. Com marcas de uso',
  gender: 'male',
  cep: '70670429',
  age: '1 ano',
  thumbnail: require("../../assets/desapegos/thumbnail/2.png"),
}


]


const CATEGORIES = ['Todos', 'Fraldas', 'Roupas', 'Móveis', 'Brinquedos']

type DesapegoProps = (typeof DESAPEGO)[0]

export { DESAPEGO, CATEGORIES, DesapegoProps}