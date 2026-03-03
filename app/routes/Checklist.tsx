export default function Checklist() {
  return (
    <div className="flex flex-col gap-4 w-full mt-8 mx-16">
      <div className="flex justify-between">
        <div>
          <h1>Checklist</h1>
          <p>Organize and track your checklists in one place.</p>
        </div>
      </div>
      <div className="w-full grid grid-cols-3 gap-2 auto-rows-[16rem]"></div>
    </div>
  );
}
