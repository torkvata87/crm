import { imgClose, imgBtnAction } from "./utils.js";

/**
 * Класс для управления модальными окнами.
 */
export class Modal {
  constructor(modalId, { title, btnNameMain, btnNameUnder } = null) {
    this.title = title;
    this.btnNameMain = btnNameMain;
    this.btnNameUnder = btnNameUnder;
    this.typeBtnNameMain = "button";
    this.overlay = document.getElementById("overlay");
    this.modal = document.getElementById(modalId);

    //  Обработчик закрытия модального окна при клике по фону.
    this.overlay.addEventListener("click", (event) => {
      if (event.target === this.overlay) {
        this.hideModal();
      }
    });
  }

  /**
   * Создает структуру модального окна и добавляет обработчики для закрытия.
   */
  createModal() {
    this.modal.innerHTML = "";
    const closeModal = document.createElement("button");
    closeModal.classList.add("modal__btn-close", "btn-reset");
    closeModal.setAttribute("aria-label", "Закрыть модаьное окно");
    closeModal.innerHTML = imgClose;

    this.modal.append(closeModal);

    //  Обработчик закрытия модального окна.
    closeModal.addEventListener("click", () => this.hideModal());

    return this.modal;
  }

  createBlockTitleModal() {}

  /**
   * Создает блок с кнопками модального окна.
   */
  createBlockBtn(clientData) {
    const blockBtns = document.createElement("div");
    blockBtns.classList.add("block-btn");

    const btnAction = document.createElement("button");
    btnAction.classList.add("btn-content", "btn-reset");
    btnAction.type = this.typeBtnNameMain;
    btnAction.innerHTML = `${imgBtnAction}${this.btnNameMain}`;

    const btnUnderlined = document.createElement("button");
    btnUnderlined.classList.add("btn-underlined", "btn-reset");
    btnUnderlined.type = "button";
    btnUnderlined.textContent = this.btnNameUnder;

    blockBtns.append(btnAction, btnUnderlined);

    btnUnderlined.addEventListener("click", () =>
      this.handlerUnderlined(clientData)
    );
    return blockBtns;
  }

  /**
   * Отображает модальное окно и накладывает анимацию появления.
   */
  showModal(clientData) {
    this.createModal(clientData);
    this.overlay.classList.remove("hidden");
    this.modal.classList.remove("hidden");

    setTimeout(() => {
      this.modal.classList.add("opacity-transform");
      this.overlay.classList.add("opacity");
    }, 300);

    this.trapFocus();
  }

  /**
   * Скрывает модальное окно и запускает анимацию скрытия.
   */
  hideModal() {
    this.modal.classList.remove("opacity-transform");
    this.overlay.classList.remove("opacity");

    setTimeout(() => {
      this.modal.classList.add("hidden");
      this.overlay.classList.add("hidden");
      this.modal.innerHTML = "";
    }, 300);
  }

  /**
   * Устанавливает ловушку для фокуса внутри модального окна.
   */
  trapFocus() {
    const focusableElements = this.modal.querySelectorAll(
      '.modal__btn-close, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0];
    // Фокусируем на первом фокусируемом элементе
    firstFocusableElement.focus();
  }

  /**
   * Обрабатывает действие основной кнопки, с запуском спиннера и закрытием модального окна после отпраки данных клиента на сервер.
   * В случае ошиби взаимодействия с сервером создание блока с сообщением пользователю об ошибке
   */
  async handlerAction(clientId) {
    const inputs = this.modal.querySelectorAll("input");
    try {
      this.formLoading();

      inputs.forEach((input) => (input.disabled = true));
      await this.actionClient(clientId);

      this.hideModal();
    } catch (error) {
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        error.message = "Ошибка сети: не удалось связаться с сервером.";
        setTimeout(() => {
          this.formLoading();
        }, 1000);
      }
      this.showErrorMessage([{ message: error.message }]);
    } finally {
      setTimeout(() => {
        inputs.forEach((input) => (input.disabled = false));
      }, 600);
    }
  }

  /**
   * Обработчик действия кнопки с подчеркиванием.
   */
  handlerUnderlined(clientData) {}

  /**
   * Переключает состояние загрузки формы, показывая или скрывая индикатор загрузки.
   */
  formLoading() {
    const btnContent = this.modal.querySelector(".btn-content");
    const spinner = btnContent.querySelector(".svg-btn-action");

    btnContent.classList.toggle("btn-content-spinner");
    spinner.classList.toggle("hidden");
    spinner.classList.toggle("opacity");
  }
}
