import { showElement, hideElement } from "./utils.js";

export class Autocomplete {
  constructor(listId) {
    this.autocompleteList = document.getElementById(listId);
    this.currentFocus = -1; // Инициализация текущего фокуса
  }

  /**
   * Отображает список автокомплита
   */
  show(clients, value, callbackSelect) {
    this.autocompleteList.innerHTML = "";
    // showElement(this.autocompleteList, "-visible");
    this.actionAutocompleteList(true);
    clients.forEach((client) => {
      const listItem = document.createElement("li");
      listItem.classList.add("autocomplete-item");
      listItem.textContent = `${client.surname} ${client.name} ${client.lastName}`;

      //Обработчик клика для выбора клиента
      listItem.addEventListener("click", () => {
        callbackSelect(client.id);
      });

      this.autocompleteList.appendChild(listItem);
    });
  }

  /**
   * Скрывает и очищает список автокомплита
   */
  actionAutocompleteList(action = false) {
    this.autocompleteList.innerHTML = "";
    action
      ? showElement(this.autocompleteList, "-visible")
      : hideElement(this.autocompleteList, "-visible");
  }

  /**
   * Удаляет активные классы с элементов
   */
  removeActive(items) {
    items.forEach((item) => {
      item.classList.remove("active");
    });
  }

  /**
   * Добавляет активный класс к текущему выбранному элементу
   */
  addActive(items) {
    if (!items) return;
    this.removeActive(items);

    if (this.currentFocus >= items.length) this.currentFocus = 0;
    if (this.currentFocus < 0) this.currentFocus = items.length - 1;

    items[this.currentFocus].classList.add("active");
  }

  /**
   * Осуществляет выбор клиента из списка с помощью клавиш "ArrowDown", "ArrowUp" и "Enter"
   */
  selectItem(event) {
    const items = document.querySelectorAll("li");
    if (event.key === "ArrowDown") {
      this.currentFocus++;
      this.addActive(items);
    } else if (event.key === "ArrowUp") {
      this.currentFocus--;
      this.addActive(items);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (this.currentFocus > -1) {
        items[this.currentFocus].click();
      }
    }
  }
}
