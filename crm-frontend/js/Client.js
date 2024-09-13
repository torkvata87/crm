import { Contact } from "./Contact.js";
import { imgCircle, showElement, hideElement } from "./utils.js";

/**
 * Класс клиента.
 */
export class Client {
  constructor(clientData) {
    this.client = clientData;
    this.id = clientData.id;
    this.name = clientData.name;
    this.surname = clientData.surname;
    this.lastName = clientData.lastName;
    this.contacts = clientData.contacts;
    this.updatedAt = new Date(clientData.updatedAt);
    this.createdAt = new Date(clientData.createdAt);
  }

  /**
   * Создает ячейку таблицы с текстом.
   */
  createTextCell(content, className) {
    const cell = document.createElement("td");
    cell.classList.add(`td-${className}`, "table__td");
    cell.textContent = content;
    return cell;
  }

  /**
   * Создает ячейку таблицы с ссылкой с именем клиента.
   */
  createClientNameCell(id, content, className) {
    const cell = document.createElement("td");
    cell.classList.add(`td-${className}`, "table__td");

    const link = document.createElement("a");
    link.href = `#client-${id}`;
    link.classList.add("table__link");
    link.textContent = content;

    cell.append(link);
    return cell;
  }

  /**
   * Создает ячейку таблицы с датой и временем в заданном формате
   */
  createDateCell(date, datetime) {
    const formattedDate = Intl.DateTimeFormat("ru").format(date);
    const options = { hour: "numeric", minute: "numeric" };
    const time = Intl.DateTimeFormat("ru", options).format(date);

    const cell = document.createElement("td");
    cell.classList.add("td-datetime", "table__td", `td-datetime-${datetime}`);
    cell.textContent = `${formattedDate} `;

    const span = document.createElement("span");
    span.classList.add("span-time");
    span.textContent = ` ${time}`;

    cell.append(span);
    return cell;
  }

  /**
   * Создает ячейку таблицы с контактами клиента.
   */
  createContactsCell() {
    const cell = document.createElement("td");
    cell.classList.add("table__td");

    const contactsContainer = document.createElement("div");
    contactsContainer.classList.add("contacts-container");

    // создание массива контактов со всплывающими подсказками
    const contactElements = this.contacts.map((contactData, index) => {
      const contact = new Contact(contactData.type, contactData.value);
      const contactElement = contact.createContactIcon();

      // Скрытие контактов, если их больше 4
      if (index >= 4) hideElement(contactElement);
      return contactElement;
    });

    contactElements.forEach((contactElement) =>
      contactsContainer.append(contactElement)
    );

    const hiddenContacts = contactElements.filter((contact) =>
      contact.classList.contains("hidden")
    );
    // Если есть скрытые контакты, показывается иконка для просмотра скрытых контактов
    if (hiddenContacts.length > 0) {
      const btnIconShow = this.createShowMoreButton(hiddenContacts);
      contactsContainer.append(btnIconShow);

      // const tdContacts =
      // скрытие контактов при покидании курсора контейнера с контактами
      contactsContainer.addEventListener("mouseleave", () => {
        this.handleContactVisibility(hiddenContacts, btnIconShow, false);
      });
    }

    cell.append(contactsContainer);
    return cell;
  }

  /**
   * Создает кнопку для отображения скрытых контактов.
   */
  createShowMoreButton(hiddenContacts) {
    const btnIconShow = document.createElement("div");
    btnIconShow.classList.add("btn", "btn-reset", "btn-show-icons", "opacity");
    btnIconShow.tabIndex = "0";
    btnIconShow.ariaLabel = `Показать еще ${hiddenContacts.length} контактов`;
    btnIconShow.innerHTML = `+${hiddenContacts.length}${imgCircle}`;

    // Показ скрытых контактов при наведении мыши
    btnIconShow.addEventListener("mouseenter", () =>
      this.handleContactVisibility(hiddenContacts, btnIconShow)
    );

    // Показ скоытых контактов при фокусировке с помощью клавиши "Tab"
    btnIconShow.addEventListener("keyup", (event) => {
      if (event.key === "Tab") {
        this.handleContactVisibility(hiddenContacts, btnIconShow);
      }
    });

    return btnIconShow;
  }

  /**
   * Управляет видимостью скрытых контактов и кнопки "Показать больше".
   */
  handleContactVisibility(hiddenContacts, showMoreButton, show = true) {
    setTimeout(() => {
      const actionOne = show ? showElement : hideElement;
      const actionTwo = show ? hideElement : showElement;
      hiddenContacts.forEach((contact) => actionOne(contact));
      actionTwo(showMoreButton);
    }, 300);
  }

  /**
   * Создает кнопку "Изменить" или "Удалить" в ячейке таблицы клиентов "Действия" в зависимости от введенных параметров.
   */
  createActionsBtns(btnName, className, img) {
    const btn = document.createElement("button");
    btn.classList.add(
      "btn",
      "btn-reset",
      "btn-action",
      `btn-action-${className}`
    );
    btn.dataset.id = this.client.id;
    btn.innerHTML = `${img}${btnName}`;

    return btn;
  }
}
