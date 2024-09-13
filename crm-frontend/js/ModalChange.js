import { ModalClientForm } from "./ModalClientForm.js";

/**
 * Класс ModalChange, расширяющий ModalClientForm, для изменения данных клиента через модальное окно.
 */
export class ModalChange extends ModalClientForm {
  constructor(modalId, options, actionClient, underlinedClient) {
    super(modalId, options, actionClient);
    this.typeBtnNameMain = "submit";
    this.actionClient = actionClient;
    this.underlinedClient = underlinedClient;
  }

  /**
   * Переопределяет метод создания модального окна.
   * Добавляет ID клиента в заголовок модального окна.
   */
  createModal(clientData) {
    super.createModal(clientData);
    const blockTitleModal = this.modal.querySelector(".modal__block");

    const spanId = document.createElement("span");
    spanId.classList.add("modal__span-id");
    spanId.textContent = `ID: ${clientData.id.substring(7)}`;

    blockTitleModal.append(spanId);
    return this.modal;
  }

   /**
   * Возвращает данные для инпутов формы клиента с заполненными полями.
   */
  dataInput(clientData) {
    return [
      { name: "surname", placeholder: "Фамилия", value: clientData.surname },
      { name: "name", placeholder: "Имя", value: clientData.name },
      { name: "lastname", placeholder: "Отчество", value: clientData.lastName },
    ];
  }

  /**
   * Асинхронный обработчик для нажатия на подчеркнутую кнопку.
   * Выполняет действие, связанное с удалением клиента с покасом сообщения пользователю в случае ошибки взаимодействия с сервером
   */
  async handlerUnderlined(clientData) {
    try {
      // this.showLoading();

      // Попытка добавления клиента
      await this.underlinedClient(clientData.id);

      // this.hideModal();
    } catch (error) {
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        error.message = "Ошибка сети: не удалось связаться с сервером.";
      }
      console.log([{ message: error.message }]);
      this.showErrorMessage([{ message: error.message }]);
    } 
    // finally {
    //   this.hideLoading();
    // }
  }
}
