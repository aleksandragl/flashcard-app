export type Category = {
  id: number;
  name: string;
};

export type Card = {
  id: number;
  category_id: number;
  question: string;
  answer: string;
};

export type Stat = {
  id: number;
  card_id: number;
  is_correct: boolean;
  created_at: string;
};
