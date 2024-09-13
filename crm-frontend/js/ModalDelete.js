import { Modal } from "./Modal.js";

/**
 * Класс ModalDelete, расширяющий Modal, для отображения модального окна удаления клиента.
 */
export class ModalDelete extends Modal {
  constructor(modalId, options, actionClient) {
    super(modalId, options);
    this.actionClient = actionClient;
    this.typeBtnNameMain = "button";
  }

  /**
   * Переопределяет метод создания модального окна.
   * Добавляет заголовок, текст вопроса и кнопки для подтверждения или отмены удаления клиента.
   */
  createModal(clientData) {
    super.createModal();

    this.modal.append(this.createBlockBtn(clientData));

    const titleSecond = document.createElement("h2");
    titleSecond.classList.add("modal__title", "modal__title-delete");
    titleSecond.textContent = this.title;
    const text = document.createElement("p");
    text.classList.add("text-question");
    text.textContent = "Вы действительно хотите удалить данного клиента?";

    const btnContent = this.modal.querySelector(".btn-content");
    btnContent.before(titleSecond, text);

     // Обрабатываем нажатие на кнопку подтверждения
    btnContent.addEventListener("click", () => this.handlerAction(clientData));

    return this.modal;
  }

  /**
   * Обрабатывает действие при нажатии на подчеркнутую кнопку со скрытием модального окна без удаления клиента.
   */
  handlerUnderlined() {
    this.hideModal();
  }

  /**
   * Показывает сообщения об ошибках, если они возникли при удалении клиента.
   * Создает или обновляет блок ошибок под текстом вопроса.
   */
  showErrorMessage(errors) {
    let errorBlock = document.getElementById("error");
    if (!errorBlock) {
      errorBlock = document.createElement("div");
      errorBlock.classList.add("block-error");
      errorBlock.id = "error";

      const textQuestion = document.querySelector(".text-question");
      textQuestion.after(errorBlock);
      textQuestion.classList.add("text-question-margin");
    } else errorBlock.innerHTML = "";

    errors.forEach((error) => {
      const errorText = document.createElement("p");
      errorText.classList.add("block-error__descr");
      errorText.textContent = error.message;
      errorBlock.append(errorText);
    });
  }
}
