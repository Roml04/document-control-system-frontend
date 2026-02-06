type DataBlockProps = {
  title: string;
  value: string;
  styling?: string;
};

export default function DataBlock({ title, value, styling }: DataBlockProps) {
  return (
    <div className={`flex w-full flex-col px-4 ${styling}`}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
