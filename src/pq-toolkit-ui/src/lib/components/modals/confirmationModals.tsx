import Swal from 'sweetalert2';

const SwalBase = Swal.mixin({
  customClass: {
    popup: 'rounded-md',
    icon: '!border-none scale-[300%]',
    title: 'h3 text-center text-black',
    htmlContainer: 'h4 text-center text-black mt-sm mb-md',
    actions: 'flex gap-md justify-center items-center my-sm',
    confirmButton:
      'flex items-center justify-center rounded-md px-sm py-2 text-white hover:text-white bg-green-500 hover:bg-green-600 outline outline-1 outline-green-600 -outline-offset-1',
    cancelButton:
      'flex items-center justify-center rounded-md px-sm py-2 bg-red-500 hover:bg-red-600 text-white outline outline-1 outline-red-600 -outline-offset-1'
  },
  buttonsStyling: false,
  allowOutsideClick: false,
  allowEscapeKey: true,
  allowEnterKey: true,
  showCancelButton: true
});

export const fireConfirmationModal = async ({
  title,
  onConfirm,
  onDeny
}: {
  title: string
  onConfirm?: () => void
  onDeny?: () => void
}): Promise<void> => {
  await SwalBase.fire({
    title
  }).then(async (result) => {
    if (result.isConfirmed) {
      onConfirm?.();
    } else if (result.isDenied) {
      onDeny?.();
    }
  });
};
