export default function DownloadButton({
  fileName,
  handleUrl,
  handleDone,
}: {
  fileName: string;
  handleUrl: Function;
  handleDone: Function;
}) {
  const handleClick = async () => {
    handleUrl();
    handleDone(false);
    const fileUrl = `http://localhost:8080/${fileName}.mp3`; // La URL del archivo en la carpeta pública

    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileName); // Atributo para forzar la descarga
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(link.href);
  };

  return (
    <button
      className="bg-transparent text-center dark:text-white rounded-lg border border-red-300 hover:border-red-500 px-3 py-2 outline-none transition-colors"
      onClick={handleClick}
    >
      Descargar
    </button>
  );
}
