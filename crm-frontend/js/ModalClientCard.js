import { Modal } from "./Modal.js";
import { Contact } from "./Contact.js";

/**
 * Класс ModalClientCard, расширяющий Modal, для отображения карточки клиента с его контактами в модальном окне.
 */
export class ModalClientCard extends Modal {
  createModal(clientData) {
    super.createModal();
    this.modal.append(this.createBlockTitleModal(clientData));
    return this.modal;
  }

  /**
   * Переопределяет метод создания модального окна.
   * Добавляет блок с заголовком и контактами клиента в модальное окно.
   */
  createBlockTitleModal(clientData) {
    const blockTitleModal = document.createElement("div");
    blockTitleModal.classList.add("modal__block", "modal__block-hash");

    const spanId = document.createElement("span");
    spanId.classList.add("modal__span-id", "modal__span-id-hash");
    spanId.textContent = `ID: ${clientData.id.substring(7)}`;

    const titleSecond = document.createElement("h2");
    titleSecond.classList.add("modal__title", "modal__title-hash");
    titleSecond.textContent = this.title;

    blockTitleModal.append(
      spanId,
      titleSecond,
      this.createListContacts(clientData)
    );
    return blockTitleModal;
  }

     /**
   * Создает список контактов клиента или выводит сообщение об их отсутствии.
   */
  createListContacts(clientData) {
    const contactsList = clientData.contacts;

    if (contactsList.length > 0) {
      const listContacts = document.createElement("ul");
      listContacts.classList.add("modal__list-contacts-hash", "list-reset");

      clientData.contacts.forEach((contact) => {
        const contactClient = new Contact(contact.type, contact.value);

        const listItemContact = document.createElement("li");
        listItemContact.classList.add("modal__list-item-contacts");

        listContacts.append(
          contactClient.contactFormat(
            "modal__list-item-contacts-block",
            "span-value-contact-hash"
          )
        );
      });
      return listContacts;
    }
    const text = document.createElement("p");
    text.classList.add("modal__list-item-contacts-block");
    text.textContent = "Данные клиента не указаны";
    return text;
  }

  /**
   * Скрывает модальное окно и обновляет URL страницы без перезагрузки.
   */
  hideModal() {
    super.hideModal();
    setTimeout(() => {
      history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    }, 300);
  }
}
