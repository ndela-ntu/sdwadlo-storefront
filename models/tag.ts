export default interface ITag {
  id: number;
  name: string;
  media_url?: string;
  type: 'Tag';
  status: "Active" | "Inactive";
}
