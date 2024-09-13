import { ModalDelete } from "./ModalDelete.js";

/**
 * Класс ModalError, расширяющий ModalDelete, для отображения модального окна ошибки,
 * если клиент не найден.
 */
export class ModalError extends ModalDelete {
  constructor(modalId, options) {
    super(modalId, options);
  }

  /**
   * Переопределяет метод создания модального окна.
   * Изменяет текст вопроса, чтобы отобразить сообщение об ошибке, что клиент не найден.
   */
  createModal() {
    super.createModal();
    const text = this.modal.querySelector(".text-question");
    text.textContent = "Клиент не найден. Возможно, он был удален.";
    return modal;
  }

  /**
   * Обрабатывает действие при нажатии на основную кнопку с закрытием модального окна.
   */
  handlerAction() {
    this.hideModal();
  }
}
