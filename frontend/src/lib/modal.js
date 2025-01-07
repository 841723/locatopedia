export class Modal
{
    constructor(content)
    {
        this.question = content.question;
        this.text = content.text;
        this.buttons = content.buttons;
        this.options = content.options;

        this.isOpen = false;
        this.background = `
            <div class="modal-background z-[999999] fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"></div>
        `;

        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.style.display = 'none';
        this.modal.innerHTML = `
            ${this.background}
            <div class="modal-content z-[10000000] p-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-lg">
                ${this.question ? `<h1 class="text-2xl font-bold">${this.question}</h1>` : ""}
                ${this.text ? `<p class="my-2 ">${this.text}</p>` : ""}
                <div class="mt-8 buttons w-full flex flex-row justify-end gap-x-2 md:gap-x-10 flex-end">
                    ${this.options.closeButton ? `<button class="close mr-auto w-fit px-8 py-2 rounded-md bg-slate-300 hover:bg-slate-400 text-black">Close</button>` : ""}
                    ${this.buttons
                        .map(
                            (option, index) => `
                        <button 
                            class="modal-option px-8 py-2 rounded-md ${option.className ?? ""}" 
                            data-index="${index}"
                        >
                            ${option.text}
                        </button>
                    `
                        )
                        .join("")}
                </div>
            </div>
        `;

        this.modal.querySelectorAll('.modal-option').forEach((option) => {
            option.addEventListener('click', () => {
                this.buttons[option.dataset.index].action();
                if (this.options.closeOnButton)
                    this.close();
            });
        });

        document.body.appendChild(this.modal);
        this.prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }

    open()
    {
        this.modal.style.display = 'block';
        this.isOpen = true;
    }

    close()
    {
        this.modal.style.display = 'none';
        this.isOpen = false;

        this.options.onClose?.();

        document.body.style.overflow = this.prevOverflow;
        this.modal.remove();
    }

    destroy()
    {
        document.body.style.overflow = this.prevOverflow;
 
    }

    static createAndOpenModal(content)
    {
        const modal = new Modal(content);
        
        modal.open();

        if (content.options.closeOnBackgroundClick) {
            modal.modal.querySelector('.modal-background').addEventListener('click', () => {
                modal.close();
            });
        }
        modal.modal.querySelector('.close')?.addEventListener('click', () => {
            modal.close();
        });

        if (content.options.closeOnEscape) {
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    modal.close();
                }
            });
        }
        return modal;
    }
}