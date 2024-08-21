export interface Desapego {
  id: string;
  cep: string;
  description: string;
  imageUrl: string;
  itensToExchange: string;
  price: number;
  title: string;
  type: 'Venda' | 'Troca' | 'Doação';
  whatsappNumber: string;
  userName: string,
  userPhoto: string,
  gender?: string;
  age?: string;
  size?: string;
}


const CATEGORIES = ['Todos', 'Fraldas', 'Roupas', 'Móveis', 'Brinquedos']

type DesapegoProps = Desapego

export { CATEGORIES, DesapegoProps}