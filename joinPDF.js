// Função para juntar múltiplos PDFs
async function juntarPdfs(files) {
    const pdfDoc = await PDFLib.PDFDocument.create();

    for (let file of files) {
        const pdfBytes = await file.arrayBuffer();
        const pdfDocTemp = await PDFLib.PDFDocument.load(pdfBytes);
        const copiedPages = await pdfDoc.copyPages(pdfDocTemp, pdfDocTemp.getPageIndices());
        copiedPages.forEach((page) => pdfDoc.addPage(page));
    }

    // Serializar o documento PDF combinado
    return await pdfDoc.save();
}

// Selecionar o campo de upload e o elemento para exibir a contagem
const fileInput = document.getElementById('custom-upload-button');
const fileCount = document.getElementById('file-count');

// Atualizar a mensagem de contagem de arquivos
fileInput.addEventListener('change', () => {
    const numFiles = fileInput.files.length;

    if (numFiles === 0) {
        fileCount.textContent = 'Nenhum arquivo selecionado.';
    } else if (numFiles === 1) {
        fileCount.textContent = '1 arquivo selecionado.';
    } else {
        fileCount.textContent = `${numFiles} arquivos selecionados.`;
    }
});

// Manipular o formulário de upload
document.getElementById('upload-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const filesInput = fileInput.files;

    if (filesInput.length < 2 || filesInput.length > 20) {
        alert("Por favor, selecione entre 2 e 10 arquivos PDF.");
        return;
    }

    try {
        // Juntar os PDFs
        const pdfBytes = await juntarPdfs(filesInput);

        // Criar um Blob para o arquivo combinado
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        // Criar um link temporário para download
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'pdf_combinado.pdf';

        // Simular o clique no link para iniciar o download automaticamente
        downloadLink.click();

        // Liberar o objeto URL para evitar vazamento de memória
        URL.revokeObjectURL(downloadLink.href);
    } catch (error) {
        console.error("Erro ao juntar os PDFs:", error);
        alert("Ocorreu um erro ao processar os arquivos.");
    }
});
