import Swal from 'sweetalert2';

export default function raiseDeleteModal(callback: any) {
    Swal.fire({
        text: "Deseja deletar permanentemente?",
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#e04444',
        reverseButtons: true, // Inverte a posição dos botões
        background: '#f8f9fa', 
        width: '300px',
        padding: '1em',
        showClass: {popup: ''}, // Sem animação de entrada},
        hideClass: {popup: ''} // Sem animação de saída
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}
