import { ModalClientForm } from "./ModalClientForm.js";

/**
 * Класс ModalAdd, расширяющий функциональность ModalClientForm,
 * для добавления новых клиентов через модальное окно.
 */
export class ModalAdd extends ModalClientForm {
  createModal(clientData) {
    super.createModal();
    const blockTitleModal = this.modal.querySelector(".modal__block");
    blockTitleModal.classList.add("modal__block-margin");
    const formBlock = document.querySelector(".form__block");
    formBlock.classList.add("form__block-add-client");
    return this.modal;
  }

  /**
   * Возвращает данные для заполнения инпутов формы клиента.
   */
  dataInput() {
    return [
      { name: "surname", placeholder: "Фамилия", value: "" },
      { name: "name", placeholder: "Имя", value: "" },
      { name: "lastname", placeholder: "Отчество", value: "" },
    ];
  }

  /**
   * Обработчик для нажатия на подчеркиваемую кнопку со скрытием модального окно.
   */
  handlerUnderlined() {
    this.hideModal();
  }
}
