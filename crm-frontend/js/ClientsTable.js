import { Client } from "./Client.js";
import { ModalChange } from "./ModalChange.js";
import { ModalDelete } from "./ModalDelete.js";
import { ModalAdd } from "./ModalAdd.js";
import { ModalError } from "./ModalError.js";
import { selectorToggle, imgChange, imgDelete, hideElement } from "./utils.js";
import { ModalClientCard } from "./ModalClientCard.js";
import { Autocomplete } from "./Autocomlete.js";

import {
  serverGetClients,
  serverAddClient,
  serverChangeClient,
  serverDeleteClient,
} from "./api.js";

/**
 * Основной класс для управления таблицей клиентов
 */
export class ClientsTable {
  constructor(tableId) {
    this.table = document.getElementById(tableId);
    this.clients = [];
    this.searchTimeout = null;
    this.currentFocus = -1;

    this.addSortEventListeners();
    // this.initHashChangeListener();
  }

  /**
   * Создает строку таблицы для конкретного клиента.
   */
  createTableRow(clientData) {
    const row = document.createElement("tr");
    row.classList.add("table__tr-client");

    const client = new Client(clientData);
    const fullName = `${client.surname} ${client.name} ${client.lastName}`;

    const cellActions = document.createElement("div");
    cellActions.classList.add("td-actions", "table__td");

    // Кнопки для изменения и удаления клиента
    const btnChange = client.createActionsBtns("Изменить", "change", imgChange);
    const btnDelete = client.createActionsBtns("Удалить", "delete", imgDelete);

    cellActions.append(btnChange, btnDelete);
    row.setAttribute("data-id", client.id);

    row.append(
      client.createTextCell(client.id.substring(7), "id"),
      client.createClientNameCell(client.id, fullName, "fullname"),
      client.createDateCell(client.createdAt, "create"),
      client.createDateCell(client.updatedAt, "update"),
      client.createContactsCell(),
      cellActions
    );

    btnChange.addEventListener("click", this.handleChangeClick);
    btnDelete.addEventListener("click", this.handleDeleteClick);

    return row;
  }

  /**
   * Заполняет таблицу данными клиентов.
   */
  fillTable(clientsArr, sort = true) {
    const tbody = this.table.querySelector("tbody");
    if (sort) {
      // Сортируем данные клиентов
      clientsArr = clientsArr.sort((a, b) => {
        return a.id.substring(7) - b.id.substring(7);
      });
    }

    // Анимация удаления старых строк
    const trs = Array.from(this.table.querySelectorAll(".table__tr-client"));
    trs.forEach((tr) => {
      tr.classList.add("opacity-pale");
    });

    // Задержка для плавного заполнения таблицы
    setTimeout(() => {
      tbody.innerHTML = "";
      // this.clients = [...clientsArr];
      this.clients = clientsArr;
      this.clients.forEach((clientData) => {
        const newRow = this.createTableRow(clientData);
        tbody.append(newRow);
      });
    }, 300);
    return tbody;
  }

  /**
   * Получает список клиентов с сервера и заполняет таблицу. Также запускает слушатель изменения хэша URL и проверку текущего хэш в URL.
   */
  async fetchClients(sort = true) {
    try {
      const serverData = await serverGetClients();
      this.clients = serverData.map((clientData) => new Client(clientData));
      this.fillTable(this.clients, sort);
    } catch (error) {
      console.error("Ошибка при получении данных с сервера:", error);
    }

    this.checkInitialHash();
    this.initHashChangeListener();
  }

  /**
   * Инициализирует слушатель изменения хэша URL.
   * При изменении хэша вызывается метод checkInitialHash для проверки и обработки новых данных в хэше.
   */
  initHashChangeListener() {
    window.addEventListener("hashchange", () => {
      this.checkInitialHash();
    });
  }

  /**
   * Проверяет текущий хэш в URL и отображает модальное окно с данными клиента,
   * если хэш соответствует формату "client-<id>".
   */
  checkInitialHash() {
    // Получение хэша из URL и удаление начального символа #
    const hash = window.location.hash.substring(1);

    // Проверка, начинается ли хэш с "client-" для извлечения идентификатора клиента из хэша
    if (hash.startsWith("client-")) {
      const clientId = hash.replace("client-", "");
      const clientData = this.clients.find((client) => client.id === clientId);

      // Если клиент найден, отображается модальное окно с информацией о клиенте
      if (clientData) {
        const fullName = `${clientData.surname} ${clientData.name} ${clientData.lastName}`;

        const modalClientCard = new ModalClientCard("modal", {
          title: fullName,
          btnNameMain: null,
          btnNameUnder: null,
        });

        modalClientCard.showModal(clientData);
      }
    }
  }

  /**
   * Добавляет обработчики событий для сортировки столбцов таблицы.
   */
  addSortEventListeners() {
    const headers = this.table.querySelectorAll("th[data-column]");

    headers.forEach((header) => {
      header.addEventListener("click", () => {
        const column = header.dataset.column;
        const arrow = header.querySelector(".arrow");
        const span = header.querySelector(".span-color");

        // Сброс всех стрелок и спанов к неактивному состоянию
        this.table.querySelectorAll(".arrow").forEach((arrow) => {
          // arrow.classList.toggle("arrow-inactive");
          // arrow.classList.toggle("arrow-active");
          selectorToggle(arrow, arrow, "arrow-inactive", "arrow-active");
        });
        this.table.querySelectorAll(".span-color").forEach((span) => {
          span.classList.add("span-inactive");
        });

        // Активируем текущую стрелку и спан
        // arrow.classList.toggle("arrow-inactive");
        // arrow.classList.toggle("arrow-active");
        selectorToggle(arrow, arrow, "arrow-inactive", "arrow-active");
        if (span) span.classList.remove("span-inactive");

        const isAscending = arrow.classList.contains("arrow-up");

        // Переключаем направление сортировки
        arrow.classList.toggle("arrow-up", !isAscending);

        // Сортируем клиентов по выбранному столбцу
        this.clients.sort((a, b) => {
          let aValue = a[column];
          let bValue = b[column];

          if (column === "createdAt" || column === "updatedAt") {
            aValue = aValue.getTime();
            bValue = bValue.getTime();
          } else if (column === "id") {
            aValue = aValue.substring(7);
            bValue = bValue.substring(7);
          }
          return (isAscending ? aValue < bValue : aValue > bValue) ? 1 : -1;
        });
        this.fillTable(this.clients, false);
      });
    });
  }

  /**
   * Обрабатывает ввод пользователя в поле поиска и отображает результаты автозаполнения.
   */
  async handlerFindClient(inputSearch) {
    // Создание экземпляра автозаполнения
    const autocompleteList = new Autocomplete("autocomplete-list");
    const spinner = document.querySelector(".search-spinner");

    // Добавление обработчика события ввода текста
    inputSearch.addEventListener("input", (event) => {
      if (event.currentTarget.value !== "") {
        spinner.classList.add("opacity-visible");
      }

      const value = event.currentTarget.value.trim().toLowerCase();
      if (!value) {
        // autocompleteList.hide();
        autocompleteList.actionAutocompleteList(false);
        return;
      }

      // Очистка старого таймера и установка нового для отложенного выполнения поиска
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(async () => {
        try {
          spinner.classList.remove("opacity-visible");

          const serverData = await serverGetClients();
          const filteredClients = serverData.filter((client) =>
            `${client.surname} ${client.name} ${client.lastName}`
              .toLowerCase()
              .includes(value)
          );

          // Отображение результатов автозаполнения, если найдены подходящие клиенты
          if (filteredClients.length > 0) {
            autocompleteList.show(
              filteredClients,
              value,
              this.selectClient.bind(this)
            );
          } else {
            // autocompleteList.hide();
            autocompleteList.actionAutocompleteList(false);
          }
        } catch (error) {
          console.error("Ошибка при фильтрации данных с сервера:", error);
        }
      }, 300);
    });

    // Добавление обработчика для навигации по списку автозаполнения с помощью клавиш
    inputSearch.addEventListener("keydown", (event) => {
      autocompleteList.selectItem(event);
    });

    // Показ спиннера при фокусировке на поле ввода
    inputSearch.addEventListener("focus", () => {
      spinner.classList.remove("hidden");
    });

    // Скрытие спиннера и автозаполнения при потере фокуса с задержкой
    inputSearch.addEventListener("blur", () => {
      hideElement(spinner, "-visible");
      // spinner.classList.add("hidden");
      // spinner.classList.remove("opacity-visible");
      setTimeout(() => {
        // autocompleteList.hide();
        autocompleteList.actionAutocompleteList(false);
      }, 300);
    });
  }

  /**
   * Выбирает клиента из списка автозаполнения, прокручивает к нему таблицу,
   * подсвечивает строку и очищает поле поиска.
   */
  selectClient(clientId) {
    const clientRow = document.querySelector(`[data-id="${clientId}"]`);
    clientRow.scrollIntoView({ behavior: "smooth" });

    const autocompleteList = new Autocomplete("autocomplete-list");
    // autocompleteList.hide();
    autocompleteList.actionAutocompleteList(false);

    const inputSearch = document.getElementById("inp-req");
    inputSearch.value = "";

    // Подсвечивает выбранную строку клиента на 3 секунды
    clientRow.classList.toggle("highlight");
    setTimeout(() => {
      clientRow.classList.toggle("highlight");
    }, 3000);
  }

  // плавное появление или скрытие спиннера на кнопке "Изменить"
  // spinnerBtnChangeToggle(svgChange, svgSpinner) {
  //   svgChange.classList.toggle("opacity");
  //   // event.currentTarget.children[1].classList.toggle("hidden");
  //   svgSpinner.classList.toggle("opacity");
  // }

  /**
   * Обрабатывает нажатие на кнопку изменения клиента с отображением модального окна для изменения данных клиента.
   */
  handleChangeClick = async (event) => {
    const clientId = event.currentTarget.getAttribute("data-id");
    const svgChange = event.currentTarget.firstChild;
    const svgSpinner = event.currentTarget.children[1];
    // this.spinnerBtnChangeToggle(svgChange, svgSpinner);
    selectorToggle(svgChange, svgSpinner, "opacity", "opacity");

    try {
      setTimeout(async () => {
        const serverData = await serverGetClients();
        const clientData = serverData.find((client) => client.id === clientId);

        // Обработка случая, когда клиент не найден c локальным обновлением данных и отображением модального окна с уведомлением об отсуствии клиента
        if (!clientData) {
          this.clients = this.clients.filter(
            (client) => client.id !== clientId
          );
          this.fillTable(this.clients, false);

          const modalAdd = new ModalError("modal", {
            title: "Ошибка клиента",
            btnNameMain: "Закрыть окно",
            btnNameUnder: "",
          });
          modalAdd.showModal();
          return;
        }

        const modalChange = new ModalChange(
          "modal",
          {
            title: "Изменить данные",
            btnNameMain: "Сохранить",
            btnNameUnder: "Удалить клиента",
          },
          this.changeClient.bind(this),
          this.deleteClient.bind(this)
        );
        modalChange.showModal(clientData);
      }, 300);
    } catch (error) {
      console.error("Ошибка при обновлении данных клиента:", error);
    } finally {
      setTimeout(async () => {
        // this.spinnerBtnChangeToggle(svgChange, svgSpinner);
        selectorToggle(svgChange, svgSpinner, "opacity", "opacity");
      }, 1000);
    }
  };

  /**
   * Обрабатывает нажатие на кнопку удаления клиента с отображением модального окна для подтверждения удаления.
   */
  handleDeleteClick = (event) => {
    const clientId = event.currentTarget.getAttribute("data-id");
    const modalDelete = new ModalDelete(
      "modal",
      {
        title: "Удалить клиента",
        btnNameMain: "Удалить",
        btnNameUnder: "Отмена",
      },
      this.deleteClient.bind(this)
    );
    modalDelete.showModal(clientId);
  };

  /**
   * Обрабатывает нажатие на кнопку добавления нового клиента с отображением модального окна для ввода данных нового клиента.
   */
  handleAddClick = () => {
    const modalAdd = new ModalAdd(
      "modal",
      {
        title: "Новый клиент",
        btnNameMain: "Сохранить",
        btnNameUnder: "Отмена",
      },
      this.addClient.bind(this)
    );
    modalAdd.showModal();
  };

  /**
   * Удаляет клиента с сервера и обновляет локальные данные.
   */
  async deleteClient(clientId) {
    try {
      await serverDeleteClient(clientId);
      this.clients = this.clients.filter((client) => client.id !== clientId);
      this.fillTable(this.clients, false);
    } catch (error) {
      console.error("Ошибка при удалении клиента:", error);
      throw error;
    }
  }

  /**
   * Обновляет данные клиента на сервере и локально обновляет таблицу клиентов.
   */
  async changeClient(clientData) {
    try {
      const updatedClientData = await serverChangeClient(
        clientData.id,
        clientData
      );
      const updatedClient = new Client(updatedClientData);
      const index = this.clients.findIndex(
        (client) => client.id === updatedClient.id
      );
      if (index !== -1) {
        this.clients[index] = updatedClient;
        this.fillTable(this.clients, false);
      }
    } catch (error) {
      console.error("Ошибка при обновлении данных клиента на сервере:", error);
      throw error;
    }
  }

  /**
   * Добавляет нового клиента на сервер и локально обновляет данные.
   */
  async addClient(clientData) {
    try {
      const newClientData = await serverAddClient(clientData);
      const newClient = new Client(newClientData);
      this.clients.push(newClient);
      this.fillTable(this.clients, false);
      return true;
    } catch (error) {
      if (error.surname === "TypeError") {
        console.log("Ошибка при добавлении клиента на сервер:", error.message);
      } else {
        throw error;
      }
    }
  }
}
