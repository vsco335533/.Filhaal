export default function DebatePdf() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4">Debate Document</h1>

      <iframe
        src="/pdfs/Filhaal_April-May_Kitab.pdf"
        title="Debate PDF"
        className="w-full h-[85vh] border rounded"
      />
    </div>
  );
}
