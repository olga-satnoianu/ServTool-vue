import Swal from "sweetalert2";

export function showError(title:string, message:string)
{
    Swal.fire({
        title: title,
        html: message,
        icon: 'warning',
        showCancelButton: false,
    })
}

export function showSuccess(title:string, message:string)
{
    Swal.fire({
        title: title,
        html: message,
        icon: 'success',
        showCancelButton: false,
    })
}

export function showInfo(title:string, message:string)
{
    Swal.fire({
        title: title,
        html: message,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes',
    })
}
