export interface Diary {
  id?: string;
  title: string;
  type: "public" | "private";
  createdAt: string;
  updatedAt: string;
  userId: string;
  entryIDs: string;
}
