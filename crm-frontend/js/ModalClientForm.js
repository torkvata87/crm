import { Modal } from "./Modal.js";
import { Contact } from "./Contact.js";
import { imgAdd } from "./utils.js";

/**
 * Класс для управления формой модального окна клиента.
 * Наследуется от класса Modal.
 */
export class ModalClientForm extends Modal {
  constructor(modalId, options, actionClient) {
    super(modalId, options);
    this.typeBtnNameMain = "submit";
    this.actionClient = actionClient;
  }

  /**
   * Создает модальное окно с заголовком и формой.
   */
  createModal(clientData = null) {
    super.createModal();
    this.modal.append(
      this.createBlockTitleModal(clientData),
      this.createForm(clientData)
    );
    return this.modal;
  }

  /**
   * Создает блок заголовка модального окна.
   */
  createBlockTitleModal(clientData = null) {
    const blockTitleModal = document.createElement("div");
    blockTitleModal.classList.add("modal__block");

    const titleSecond = document.createElement("h2");
    titleSecond.classList.add("modal__title");
    titleSecond.textContent = this.title;

    blockTitleModal.append(titleSecond);
    return blockTitleModal;
  }

  /**
   * Создает форму внутри модального окна.
   */
  createForm(clientData = null) {
    const form = document.createElement("form");
    form.id = "form";
    form.append(
      this.createFormBlock(this.dataInput(clientData)),
      this.createAddContact(clientData ? clientData.contacts : ""),
      this.createBlockBtn(clientData)
    );

    form.addEventListener("submit", (event) => {
      this.handlerForm(event, clientData);
    });
    return form;
  }

  /**
   * Создает поле ввода для формы.
   */
  createInput(name, placeholder, value = "") {
    const blockInput = document.createElement("div");
    blockInput.classList.add("form__group");

    const inputName = document.createElement("input");
    inputName.classList.add(`form__input-${name}`, "form__input");
    inputName.dataset.input = name;
    inputName.type = "text";
    inputName.name = name;

    this.handlerIputClient(inputName);

    const spanStar = `<span class="span-star">*</span>`;
    `11`;
    const textLabel = `${placeholder}${
      placeholder !== "Отчество" ? spanStar : ""
    }`;
    const label = document.createElement("label");
    label.classList.add("form__label");
    label.htmlFor = name;

    label.innerHTML = textLabel;

    if (value) {
      inputName.placeholder = placeholder;
      inputName.value = value;
      inputName.placeholder = value;
      blockInput.append(label, inputName);
      return blockInput;
    }

    blockInput.classList.add("form__group-custom-placeholder");
    label.classList.add("form__label-custom-placeholder");
    blockInput.append(label, inputName);

    inputName.addEventListener("input", () => {
      if (inputName.value) {
        label.innerHTML = "";
      } else {
        label.innerHTML = textLabel;
      }
    });
    return blockInput;
  }

  /**
   * Создает блок с несколькими полями ввода.
   */
  createFormBlock(inputs) {
    const formBlock = document.createElement("div");
    formBlock.classList.add("form__block");

    inputs.forEach(({ name, placeholder, value }) => {
      formBlock.append(this.createInput(name, placeholder, value));
    });

    //  Добавляет обработчик события "keyup" на модальное окно для проверки формы на наличие ошибок при каждом нажатии клавиши.
    this.modal.addEventListener("keyup", () => {
      const errors = this.arrErrorMessage();
      this.showErrorMessage(errors);
    });

    return formBlock;
  }

  /**
   * Создает блок для добавления контактов.
   */
  createAddContact(contacts = null) {
    const blockAddContacts = document.createElement("div");
    blockAddContacts.classList.add("form__block-add-contact");

    const btnAddNewContact = document.createElement("button");
    btnAddNewContact.classList.add("form__btn-add-contact", "btn-reset");
    btnAddNewContact.type = "button";
    btnAddNewContact.innerHTML = `${imgAdd}Добавить контакт`;

    blockAddContacts.append(btnAddNewContact);

    btnAddNewContact.addEventListener("click", (event) =>
      this.handlerContacts(event, contacts)
    );

    return blockAddContacts;
  }

  /**
   * Обработчик события добавления контактов.
   */
  handlerContacts(event, contacts) {
    const blockAddContacts = this.modal.querySelector(
      ".form__block-add-contact"
    );
    blockAddContacts.classList.add(
      "form__block-add-contact-padding",
      "add-padding-bottom"
    );

    let formBlockAddContacts = document.getElementById("block-contact");
    // В случае отсуствия блока с контактами создается новый
    if (!formBlockAddContacts) {
      formBlockAddContacts = document.createElement("div");
      formBlockAddContacts.classList.add(
        "form__block-contacts",
        "form__block-contacts-margin"
      );
      formBlockAddContacts.id = "block-contact";
      event.currentTarget.before(formBlockAddContacts);
    }

    const inputContainer = this.modal.querySelectorAll(
      ".form__input-container"
    );
    // При достижении числа контактов в модальном окне более 3 появляется вертикальный скролл
    if (inputContainer.length > 2 || contacts.length > 3) {
      formBlockAddContacts.classList.add("form_block-contacts-scroll");
      formBlockAddContacts.scrollTop = formBlockAddContacts.scrollHeight;
    }

    // При достижении 10 контактов в модальном окне кнопка "Добавить контакт" скрывается
    if (contacts.length > 9 || inputContainer.length === 9) {
      event.currentTarget.classList.add("hidden");
      blockAddContacts.classList.remove("add-padding-bottom");
    }

    // Для модального окна "Изменить данные" при первом клике на кнопку "Добавить контакт" создается необходимое число инпутов, заполненных данными контактов. Для модального окна "Новыый клиент" создается один пустой инпут
    if (inputContainer.length === 0 && contacts.length > 0) {
      contacts.forEach((elem) => {
        const contact = new Contact(elem.type, elem.value);
        contact.createContactInput(contacts);
      });
    } else {
      const contact = new Contact(null, null);
      contact.createContactInput(contacts);
    }
    // setTimeout(() => {
    //   formBlockAddContacts.classList.add("show");
    // }, 10);
  }

  /**
   * Обработчик ввода данных в поле клиента с удалением лишних символов и заменой подряд идущих дефисов или пробелов на один.
   */
  handlerIputClient(input) {
    input.addEventListener("input", (event) => {
      let value = event.target.value.trim().toLowerCase();
      value = value.replace(/[^а-яё -]/g, ""); // Удаляем все символы, кроме допустимых
      // value = value.replace(/[^\d]/g, ""); // Удаляем все символы, кроме допустимых
      value = value.replace(/^[-\s]+|[-\s]+$/g, ""); // Удаляем лишние пробелы и дефисы в начале и конце
      value = value.replace(/[-\s]+/g, "-"); // Заменяем несколько идущих подряд пробелов или дефисов на один
      value = value.charAt(0).toUpperCase() + value.slice(1); // Приводим первую букву к верхнему регистру
      event.target.value = value;
      if (value === "") {
        event.target.classList.add("input-error");
      } else {
        event.target.classList.remove("input-error");
      }
    });
  }

  /**
   *Создает массив уникальных ошибок при неправильном заполнении инпутов клиентов или контактов
   */
  arrErrorMessage() {
    const arrNameInputs = {
      name: "Имя",
      surname: "Фамилия",
    };

    const inputsError = Array.from(this.modal.querySelectorAll("input"));

    const errors = inputsError
      .map((input) => {
        if (input.dataset.val) {
          const dropDownBtn = input.previousElementSibling.firstChild;
          if (input.value === "") {
            return {
              name: input.dataset.val,
              message: `Поле "${dropDownBtn.textContent}" не должно оставаться пустым.`,
            };
          } else if (input.classList.contains("input-error")) {
            return {
              name: input.dataset.val,
              message: `Поле "${dropDownBtn.textContent}" имеет неверный формат.`,
            };
          }
        }
        if (input.dataset.input) {
          if (input.value === "" && input.dataset.input !== "lastname") {
            return {
              name: input.name,
              message: `Поле "${
                arrNameInputs[input.name]
              }" не должно оставаться пустым.`,
            };
          }
        }
        return null;
      })
      .filter((error) => error !== null);

    // Удаление дубликатов ошибок в массиве ошибок
    const uniqueErrors = errors.filter(
      (error, index, self) =>
        index === self.findIndex((e) => e.message === error.message)
    );

    return uniqueErrors; // Возвращаем массив уникальных ошибок
  }
  /**
   * Создает блок уникальных ошибок при неправильном заполнении инпутов клиентов или контактов
   */
  showErrorMessage(errors) {
    let errorBlock = document.getElementById("error");
    const formBlockAddContacts = document.querySelector(
      ".form__block-add-contact"
    );
    if (!errorBlock) {
      errorBlock = document.createElement("div");
      errorBlock.classList.add("block-error");
      errorBlock.id = "error";

      formBlockAddContacts.after(errorBlock);
      formBlockAddContacts.classList.add("form__block-add-contact-margin");
    } else errorBlock.innerHTML = "";

    errors.forEach((error) => {
      const errorText = document.createElement("p");
      errorText.classList.add("block-error__descr");
      errorText.textContent = error.message;
      errorBlock.append(errorText);
    });
  }

  /**
   * Очищает блок ошибок при правильном заполнении данных клиента
   */
  clearError() {
    let errorBlock = document.getElementById("error");
    const formBlockAddContacts = document.querySelector(
      ".form__block-add-contact"
    );
    if (errorBlock) {
      errorBlock.remove();
      formBlockAddContacts.classList.remove("form__block-add-contact-margin");
    }
  }

  /**
   * Отправляет данные клиента на сервер только при их изменении.
   */
  async handlerForm(event, clientData) {
    event.preventDefault();
    try {
      // если есть ошибки при заполнении данных показывается блок с ошибками. В противном случае блок с ошибками очищается
      const errors = this.arrErrorMessage();

      if (errors.length > 0) {
        this.showErrorMessage(errors);
        return;
      }
      this.clearError();

      const form = event.target;
      const newClient = this.getClientData(form, clientData);
      const newContacts = this.getContacts(form);

      if (newContacts.length > 0) {
        newClient.contacts = newContacts.sort((a, b) =>
          a.type.localeCompare(b.type)
        );
      }

      // Если данные клиента не были обновлены, модальное окно закрывается
      if (clientData && this.isClientDataUnchanged(newClient, clientData)) {
        this.hideModal();
        return;
      }

      // Если данные клиента изменились, обновляется дата изменения и выполняется их отправка на сервер
      newClient.updatedAt = new Date();
      await this.handlerAction(newClient);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Получает данные клиента из формы.
   */
  getClientData(form, clientData) {
    return {
      id: clientData ? clientData.id : null,
      createdAt: clientData ? clientData.createdAt : new Date(),
      name: form.querySelector('input[name="name"]').value,
      surname: form.querySelector('input[name="surname"]').value,
      lastName: form.querySelector('input[name="lastname"]').value,
      contacts: clientData ? clientData.contacts : [],
    };
  }

  /**
   * Получает контакты из формы.
   */
  getContacts(form) {
    const inputContainers = form.querySelectorAll(".form__input-container");
    return Array.from(inputContainers).map((container) => {
      const btnDropDown = container.querySelector(".dropdown__button");
      const inputText = container.querySelector(".form__input-contact");
      return {
        type: btnDropDown ? btnDropDown.textContent : "",
        value: inputText ? inputText.value.trim() : "",
      };
    });
  }

  /**
   * Сравнивает все данные клиента до и после изменений.
   * Возвращает true, если данные не изменились.
   */
  isClientDataUnchanged(newClient, clientData) {
    return (
      this.isDataUnchanged(newClient, clientData) &&
      this.isContactsUnchanged(newClient.contacts, clientData.contacts)
    );
  }

  /**
   * Сравнивает основные данные клиента (имя, фамилия, отчество).
   * Возвращает true, если данные не изменились.
   */
  isDataUnchanged(newClient, clientData) {
    return (
      newClient.name === clientData.name &&
      newClient.surname === clientData.surname &&
      newClient.lastName === clientData.lastName
    );
  }

  /**
   * Сравнивает контакты до и после изменений.
   * Возвращает true, если контакты не изменились.
   */
  isContactsUnchanged(newContacts, oldContacts) {
    if (!oldContacts || oldContacts.length !== newContacts.length) return false;

    return newContacts.every((newContact, index) => {
      const oldContact = oldContacts[index];
      return (
        newContact.type === oldContact.type &&
        newContact.value === oldContact.value
      );
    });
  }
}
