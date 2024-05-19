function get_data() {
    fetch("/dados/geral", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'dados.xlsx';
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);
        });
}